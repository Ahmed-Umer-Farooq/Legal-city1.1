const db = require('../db');

const getAllIntakes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const offset = (page - 1) * limit;

    let query = db('intakes')
      .select('intakes.*', 'lawyers.name as assigned_to_name', 'cases.title as converted_case_title')
      .leftJoin('lawyers', 'intakes.assigned_to', 'lawyers.id')
      .leftJoin('cases', 'intakes.converted_case_id', 'cases.id');

    if (status) query = query.where('intakes.status', status);
    if (priority) query = query.where('intakes.priority', priority);

    const intakes = await query.orderBy('intakes.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('intakes').count('id as count').first();

    res.json({
      success: true,
      data: intakes,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createIntake = async (req, res) => {
  try {
    const { client_name, client_email, client_phone, legal_issue, description, priority, assigned_to, estimated_value, notes } = req.body;

    const intakeNumber = 'INT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const [intakeId] = await db('intakes').insert({
      intake_number: intakeNumber,
      client_name,
      client_email,
      client_phone,
      legal_issue,
      description,
      priority: priority || 'medium',
      assigned_to,
      estimated_value,
      notes,
      intake_date: new Date()
    });

    const newIntake = await db('intakes').where({ id: intakeId }).first();
    res.status(201).json({ success: true, data: newIntake });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateIntake = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await db('intakes')
      .where({ id })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Intake not found' });
    }

    const updatedIntake = await db('intakes').where({ id }).first();
    res.json({ success: true, data: updatedIntake });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const convertToCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { case_data } = req.body;

    const intake = await db('intakes').where({ id }).first();
    if (!intake) {
      return res.status(404).json({ success: false, error: 'Intake not found' });
    }

    const caseNumber = 'CASE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const [caseId] = await db('cases').insert({
      title: case_data.title || intake.legal_issue,
      case_number: caseNumber,
      type: case_data.type || 'other',
      description: case_data.description || intake.description,
      lawyer_id: intake.assigned_to,
      estimated_value: intake.estimated_value,
      ...case_data
    });

    await db('intakes').where({ id }).update({
      status: 'converted',
      converted_case_id: caseId,
      updated_at: new Date()
    });

    const convertedCase = await db('cases').where({ id: caseId }).first();
    res.json({ success: true, data: { intake_id: id, case: convertedCase } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllIntakes, createIntake, updateIntake, convertToCase };