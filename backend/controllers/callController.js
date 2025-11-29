const db = require('../db');

const getAllCalls = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, call_type, status, case_id } = req.query;
    const offset = (page - 1) * limit;

    let query = db('calls')
      .select('calls.*', 'contacts.name as contact_name', 'cases.title as case_title')
      .leftJoin('contacts', 'calls.contact_id', 'contacts.id')
      .leftJoin('cases', 'calls.case_id', 'cases.id')
      .where('calls.lawyer_id', lawyerId);

    if (call_type) query = query.where('calls.call_type', call_type);
    if (status) query = query.where('calls.status', status);
    if (case_id) query = query.where('calls.case_id', case_id);

    const calls = await query.orderBy('calls.call_date', 'desc').limit(limit).offset(offset);
    const total = await db('calls').where({ lawyer_id: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: calls,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCall = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { title, description, call_date, duration_minutes, call_type, contact_id, case_id, notes, is_billable, billable_rate } = req.body;

    // Validate contact_id exists if provided
    if (contact_id) {
      const contactExists = await db('contacts').where({ id: contact_id, created_by: lawyerId }).first();
      if (!contactExists) {
        return res.status(400).json({ success: false, error: 'Selected contact not found or access denied' });
      }
    }

    // Validate case_id exists if provided
    if (case_id) {
      const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
      if (!caseExists) {
        return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
      }
    }

    const [callId] = await db('calls').insert({
      title,
      description,
      call_date,
      duration_minutes,
      call_type,
      contact_id,
      case_id,
      lawyer_id: lawyerId,
      notes,
      is_billable: is_billable || false,
      billable_rate
    });

    const newCall = await db('calls').where({ id: callId }).first();
    res.status(201).json({ success: true, data: newCall });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('calls')
      .where({ id, lawyer_id: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Call not found' });
    }

    const updatedCall = await db('calls').where({ id }).first();
    res.json({ success: true, data: updatedCall });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('calls').where({ id, lawyer_id: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Call not found' });
    }

    res.json({ success: true, data: { message: 'Call deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllCalls, createCall, updateCall, deleteCall };