const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../utils/middleware');
const { hasPermission } = require('../utils/rbac');
const { PERMISSIONS } = require('../utils/enums');

// Middleware to check admin permissions
const requireAdmin = (req, res, next) => {
  const userRole = req.user.role || 'USER';
  if (!hasPermission(userRole, PERMISSIONS.MANAGE_ASSIGNMENTS)) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/reports/dashboard - Main dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Case volume metrics
    const caseVolume = await db('cases')
      .select('practice_area')
      .count('id as count')
      .where('created_at', '>=', startDate)
      .groupBy('practice_area');

    // Case status distribution
    const statusDistribution = await db('cases')
      .select('status')
      .count('id as count')
      .groupBy('status');

    // SLA breach analysis
    const slaBreaches = await db('cases')
      .where('sla_deadline', '<', new Date())
      .whereIn('status', ['OPEN', 'IN_PROGRESS'])
      .count('id as count')
      .first();

    // Lawyer workload
    const lawyerWorkload = await db('cases')
      .select('assigned_lawyer_id', 'lawyers.name as lawyer_name')
      .count('cases.id as active_cases')
      .leftJoin('lawyers', 'cases.assigned_lawyer_id', 'lawyers.id')
      .whereIn('cases.status', ['OPEN', 'IN_PROGRESS'])
      .groupBy('assigned_lawyer_id', 'lawyers.name')
      .orderBy('active_cases', 'desc');

    // Recent activity
    const recentActivity = await db('audit_logs')
      .select('action', 'entity', 'timestamp', 'metadata')
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .limit(20);

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        caseVolume,
        statusDistribution,
        slaBreaches: slaBreaches.count || 0,
        lawyerWorkload,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/reports/cases - Detailed case analytics
router.get('/cases', async (req, res) => {
  try {
    const { 
      practice_area, 
      status, 
      lawyer_id, 
      start_date, 
      end_date,
      page = 1,
      limit = 50 
    } = req.query;

    let query = db('cases')
      .select(
        'cases.secure_case_id',
        'cases.title',
        'cases.practice_area',
        'cases.status',
        'cases.created_at',
        'cases.sla_deadline',
        'cases.last_activity_at',
        'lawyers.name as lawyer_name',
        'users.name as client_name'
      )
      .leftJoin('lawyers', 'cases.assigned_lawyer_id', 'lawyers.id')
      .leftJoin('users', 'cases.client_id', 'users.id');

    // Apply filters
    if (practice_area) query = query.where('cases.practice_area', practice_area);
    if (status) query = query.where('cases.status', status);
    if (lawyer_id) query = query.where('cases.assigned_lawyer_id', lawyer_id);
    if (start_date) query = query.where('cases.created_at', '>=', start_date);
    if (end_date) query = query.where('cases.created_at', '<=', end_date);

    const offset = (page - 1) * limit;
    const cases = await query
      .orderBy('cases.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('cases').count('id as count').first();

    res.json({
      success: true,
      data: cases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/reports/audit - Audit trail analysis
router.get('/audit', async (req, res) => {
  try {
    const { 
      actor_id, 
      action, 
      case_uuid, 
      start_date, 
      end_date,
      page = 1,
      limit = 100 
    } = req.query;

    let query = db('audit_logs')
      .select('*')
      .orderBy('timestamp', 'desc');

    // Apply filters
    if (actor_id) query = query.where('actor_id', actor_id);
    if (action) query = query.where('action', action);
    if (case_uuid) query = query.where('case_uuid', case_uuid);
    if (start_date) query = query.where('timestamp', '>=', start_date);
    if (end_date) query = query.where('timestamp', '<=', end_date);

    const offset = (page - 1) * limit;
    const auditLogs = await query.limit(limit).offset(offset);

    const total = await db('audit_logs').count('id as count').first();

    res.json({
      success: true,
      data: auditLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/reports/compliance - Compliance monitoring
router.get('/compliance', async (req, res) => {
  try {
    // Cases approaching SLA deadline
    const approachingSLA = await db('cases')
      .select('secure_case_id', 'title', 'sla_deadline', 'assigned_lawyer_id')
      .where('sla_deadline', '>', new Date())
      .where('sla_deadline', '<', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
      .whereIn('status', ['OPEN', 'IN_PROGRESS']);

    // Cases with no recent activity (stale cases)
    const staleCases = await db('cases')
      .select('secure_case_id', 'title', 'last_activity_at', 'assigned_lawyer_id')
      .where('last_activity_at', '<', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) // 14 days
      .whereIn('status', ['OPEN', 'IN_PROGRESS']);

    // Audit anomalies (multiple logins from different IPs)
    const auditAnomalies = await db('audit_logs')
      .select('actor_id', 'ip_address')
      .count('distinct ip_address as ip_count')
      .where('action', 'LOGIN')
      .where('timestamp', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000)) // 24 hours
      .groupBy('actor_id')
      .having('ip_count', '>', 3);

    // Missing audit entries (cases without recent audit logs)
    const casesWithoutAudit = await db('cases')
      .select('cases.secure_case_id', 'cases.title')
      .leftJoin('audit_logs', 'cases.case_uuid', 'audit_logs.case_uuid')
      .whereNull('audit_logs.case_uuid')
      .whereIn('cases.status', ['OPEN', 'IN_PROGRESS']);

    res.json({
      success: true,
      data: {
        approachingSLA,
        staleCases,
        auditAnomalies,
        casesWithoutAudit,
        summary: {
          sla_warnings: approachingSLA.length,
          stale_cases: staleCases.length,
          audit_anomalies: auditAnomalies.length,
          missing_audit: casesWithoutAudit.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;