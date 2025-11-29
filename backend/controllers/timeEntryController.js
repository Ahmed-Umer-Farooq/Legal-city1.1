const db = require('../db');

const getAllTimeEntries = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, case_id, is_billable } = req.query;
    const offset = (page - 1) * limit;

    let query = db('time_entries')
      .select('time_entries.*', 'cases.title as case_title')
      .leftJoin('cases', 'time_entries.case_id', 'cases.id')
      .where('time_entries.lawyer_id', lawyerId);

    if (case_id) query = query.where('time_entries.case_id', case_id);
    if (is_billable !== undefined) query = query.where('time_entries.is_billable', is_billable === 'true');

    const timeEntries = await query.orderBy('time_entries.date', 'desc').limit(limit).offset(offset);
    const total = await db('time_entries').where({ lawyer_id: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: timeEntries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createTimeEntry = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { case_id, description, hours, billable_rate, date, is_billable } = req.body;

    // Validate case_id exists
    if (!case_id) {
      return res.status(400).json({ success: false, error: 'Case ID is required for time tracking' });
    }

    const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
    if (!caseExists) {
      return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
    }

    const [timeEntryId] = await db('time_entries').insert({
      case_id,
      lawyer_id: lawyerId,
      description,
      hours,
      billable_rate,
      date,
      is_billable: is_billable !== false
    });

    const newTimeEntry = await db('time_entries').where({ id: timeEntryId }).first();
    res.status(201).json({ success: true, data: newTimeEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateTimeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('time_entries')
      .where({ id, lawyer_id: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Time entry not found' });
    }

    const updatedTimeEntry = await db('time_entries').where({ id }).first();
    res.json({ success: true, data: updatedTimeEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTimeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('time_entries').where({ id, lawyer_id: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Time entry not found' });
    }

    res.json({ success: true, data: { message: 'Time entry deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const startTimer = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { case_id, description, billable_rate } = req.body;

    // Validate case_id exists
    if (!case_id) {
      return res.status(400).json({ success: false, error: 'Case ID is required for time tracking' });
    }

    const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
    if (!caseExists) {
      return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
    }

    // Check if there's already an active timer
    const activeTimer = await db('time_entries')
      .where({ lawyer_id: lawyerId })
      .whereNull('hours')
      .first();

    if (activeTimer) {
      return res.status(400).json({ success: false, error: 'Timer already running' });
    }

    const [timerId] = await db('time_entries').insert({
      case_id,
      lawyer_id: lawyerId,
      description,
      billable_rate,
      date: new Date().toISOString().split('T')[0],
      is_billable: true,
      created_at: new Date()
    });

    const timer = await db('time_entries').where({ id: timerId }).first();
    res.status(201).json({ success: true, data: timer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const stopTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const timer = await db('time_entries')
      .where({ id, lawyer_id: lawyerId })
      .whereNull('hours')
      .first();

    if (!timer) {
      return res.status(404).json({ success: false, error: 'Active timer not found' });
    }

    const startTime = new Date(timer.created_at);
    const endTime = new Date();
    const hours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);

    await db('time_entries')
      .where({ id })
      .update({ hours, updated_at: new Date() });

    const updatedTimer = await db('time_entries').where({ id }).first();
    res.json({ success: true, data: updatedTimer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, startTimer, stopTimer };