const db = require('../db');

const getAllCases = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    let query = db('cases')
      .select('cases.*', 'users.name as client_name', 'users.email as client_email')
      .leftJoin('users', 'cases.client_id', 'users.id')
      .where('cases.lawyer_id', lawyerId);

    if (status) query = query.where('cases.status', status);
    if (type) query = query.where('cases.type', type);

    const cases = await query.orderBy('cases.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('cases').where({ lawyer_id: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: cases,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const caseData = await db('cases')
      .select('cases.*', 'users.name as client_name', 'users.email as client_email')
      .leftJoin('users', 'cases.client_id', 'users.id')
      .where({ 'cases.id': id, 'cases.lawyer_id': lawyerId })
      .first();

    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCase = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { title, type, description, filing_date, client_id, estimated_value, next_hearing_date } = req.body;

    // Validate client_id exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    // Generate unique case number
    const caseNumber = 'CASE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const [caseId] = await db('cases').insert({
      title,
      case_number: caseNumber,
      type,
      description,
      filing_date,
      client_id,
      lawyer_id: lawyerId,
      estimated_value,
      next_hearing_date
    });

    const newCase = await db('cases').where({ id: caseId }).first();
    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('cases')
      .where({ id, lawyer_id: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const updatedCase = await db('cases').where({ id }).first();
    res.json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('cases').where({ id, lawyer_id: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.json({ success: true, data: { message: 'Case deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCaseTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    // Verify case belongs to lawyer
    const caseExists = await db('cases').where({ id, lawyer_id: lawyerId }).first();
    if (!caseExists) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const timeline = await db('events')
      .select('id', 'title', 'event_type', 'start_date_time', 'status')
      .where({ case_id: id })
      .orderBy('start_date_time', 'desc');

    res.json({ success: true, data: timeline });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCaseStats = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const stats = await db('cases')
      .select('type', 'status')
      .count('id as count')
      .where({ lawyer_id: lawyerId })
      .groupBy('type', 'status');

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllCases, getCaseById, createCase, updateCase, deleteCase, getCaseTimeline, getCaseStats };