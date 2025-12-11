const db = require('../db');
const { generateSecureCaseId, validateCaseId } = require('../utils/caseIdGenerator');
const { logAuditEvent } = require('../utils/auditLogger');
const { CASE_STATUS, PRACTICE_AREAS, AUDIT_EVENTS, PERMISSIONS } = require('../utils/enums');
const { hasPermission, getCaseAccess } = require('../utils/rbac');

const getAllCases = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';
    const { page = 1, limit = 10, status, practice_area } = req.query;
    const offset = (page - 1) * limit;

    // Check if user has permission to view cases
    if (!hasPermission(userRole, PERMISSIONS.VIEW_CASE)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    let query = db('cases')
      .select(
        'cases.id',
        'cases.case_uuid',
        'cases.secure_case_id',
        'cases.title',
        'cases.practice_area',
        'cases.status',
        'cases.created_at',
        'cases.last_activity_at',
        'cases.sla_deadline',
        'users.name as client_name',
        'users.email as client_email',
        'lawyers.name as assigned_lawyer_name'
      )
      .leftJoin('users', 'cases.client_id', 'users.id')
      .leftJoin('lawyers', 'cases.assigned_lawyer_id', 'lawyers.id');

    // Apply role-based filtering
    if (userRole === 'LAWYER' || userRole === 'SENIOR_LAWYER') {
      query = query.where('cases.assigned_lawyer_id', userId);
    } else if (userRole === 'USER') {
      query = query.where('cases.client_id', userId);
    }
    // ADMIN and CASE_MANAGER can see all cases

    if (status) query = query.where('cases.status', status);
    if (practice_area) query = query.where('cases.practice_area', practice_area);

    const cases = await query.orderBy('cases.last_activity_at', 'desc').limit(limit).offset(offset);
    const total = await db('cases').count('id as count').first();

    res.json({
      success: true,
      data: cases,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCase = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';
    const { title, practice_area, description, filing_date, client_id, estimated_value, sla_days = 30 } = req.body;

    // Validate permissions
    if (!hasPermission(userRole, PERMISSIONS.EDIT_CASE)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions to create cases' });
    }

    // Validate required fields
    if (!title || !practice_area) {
      return res.status(400).json({ success: false, error: 'Title and practice area are required' });
    }

    if (!PRACTICE_AREAS[practice_area]) {
      return res.status(400).json({ success: false, error: 'Invalid practice area' });
    }

    // Validate client exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    // Generate secure Case ID and UUID
    const { caseId: secureCaseId, uuid: caseUuid } = generateSecureCaseId(practice_area);
    
    // Calculate SLA deadline
    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + sla_days);

    const caseData = {
      case_uuid: caseUuid,
      secure_case_id: secureCaseId,
      title,
      practice_area,
      description,
      filing_date,
      client_id,
      assigned_lawyer_id: userId,
      estimated_value,
      status: CASE_STATUS.OPEN,
      sla_deadline: slaDeadline,
      created_by: userId,
      updated_by: userId,
      workflow_state: JSON.stringify({ current_stage: 'intake', stages_completed: [] })
    };

    const [newCaseId] = await db('cases').insert(caseData);
    const newCase = await db('cases').where({ id: newCaseId }).first();

    // Log audit event
    await logAuditEvent({
      actor_id: userId,
      actor_role: userRole,
      case_uuid: caseUuid,
      action: AUDIT_EVENTS.CASE_CREATED,
      entity: 'cases',
      metadata: { case_id: secureCaseId, practice_area, title },
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params; // Now expects secure_case_id
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';

    // Validate Case ID format
    if (!validateCaseId(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Case ID format' });
    }

    const caseData = await db('cases')
      .select(
        'cases.*',
        'users.name as client_name',
        'users.email as client_email',
        'lawyers.name as assigned_lawyer_name',
        'case_managers.name as case_manager_name'
      )
      .leftJoin('users', 'cases.client_id', 'users.id')
      .leftJoin('lawyers', 'cases.assigned_lawyer_id', 'lawyers.id')
      .leftJoin('users as case_managers', 'cases.case_manager_id', 'case_managers.id')
      .where('cases.secure_case_id', caseId)
      .first();

    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Check case access permissions
    const hasAccess = await getCaseAccess(userId, userRole, caseData.case_uuid);
    if (!hasAccess) {
      return res.status(403).json({ success: false, error: 'Access denied to this case' });
    }

    res.json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';

    if (!validateCaseId(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Case ID format' });
    }

    if (!CASE_STATUS[status]) {
      return res.status(400).json({ success: false, error: 'Invalid case status' });
    }

    const caseData = await db('cases').where('secure_case_id', caseId).first();
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Check permissions for status change
    const hasAccess = await getCaseAccess(userId, userRole, caseData.case_uuid);
    if (!hasAccess) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    if (status === CASE_STATUS.CLOSED && !hasPermission(userRole, PERMISSIONS.CLOSE_CASE)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions to close case' });
    }

    // Update case status
    await db('cases')
      .where('secure_case_id', caseId)
      .update({
        status,
        updated_by: userId,
        updated_at: new Date(),
        last_activity_at: new Date()
      });

    // Log audit event
    await logAuditEvent({
      actor_id: userId,
      actor_role: userRole,
      case_uuid: caseData.case_uuid,
      action: status === CASE_STATUS.CLOSED ? AUDIT_EVENTS.CASE_CLOSED : AUDIT_EVENTS.CASE_UPDATED,
      entity: 'cases',
      metadata: { case_id: caseId, old_status: caseData.status, new_status: status, reason },
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    const updatedCase = await db('cases').where('secure_case_id', caseId).first();
    res.json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCaseStatus
};