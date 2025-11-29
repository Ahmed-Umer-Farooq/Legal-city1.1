const db = require('../db');
const fs = require('fs');

const getAllExpenses = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, case_id, is_billable } = req.query;
    const offset = (page - 1) * limit;

    let query = db('expenses')
      .select('expenses.*', 'cases.title as case_title', 'users.name as client_name')
      .leftJoin('cases', 'expenses.case_id', 'cases.id')
      .leftJoin('users', 'expenses.client_id', 'users.id')
      .where('expenses.created_by', lawyerId);

    if (case_id) query = query.where('expenses.case_id', case_id);
    if (is_billable !== undefined) query = query.where('expenses.is_billable', is_billable === 'true');

    const expenses = await query.orderBy('expenses.date', 'desc').limit(limit).offset(offset);
    const total = await db('expenses').where({ created_by: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: expenses,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { case_id, client_id, category, description, amount, date, is_billable } = req.body;

    // Validate case_id exists if provided
    if (case_id) {
      const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
      if (!caseExists) {
        return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
      }
    }

    // Validate client_id exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    const [expenseId] = await db('expenses').insert({
      case_id,
      client_id,
      category,
      description,
      amount,
      date,
      is_billable: is_billable !== false,
      created_by: lawyerId
    });

    const newExpense = await db('expenses').where({ id: expenseId }).first();
    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('expenses')
      .where({ id, created_by: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    const updatedExpense = await db('expenses').where({ id }).first();
    res.json({ success: true, data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const expense = await db('expenses').where({ id, created_by: lawyerId }).first();
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    // Delete receipt file if exists
    if (expense.receipt && fs.existsSync(expense.receipt)) {
      fs.unlinkSync(expense.receipt);
    }

    await db('expenses').where({ id }).del();
    res.json({ success: true, data: { message: 'Expense deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No receipt file uploaded' });
    }

    const updated = await db('expenses')
      .where({ id, created_by: lawyerId })
      .update({ receipt: req.file.path, updated_at: new Date() });

    if (!updated) {
      // Delete uploaded file if expense not found
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    const updatedExpense = await db('expenses').where({ id }).first();
    res.json({ success: true, data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense, uploadReceipt };