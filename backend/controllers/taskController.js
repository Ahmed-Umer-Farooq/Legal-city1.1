const db = require('../db');

const getAllTasks = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, status, priority, case_id } = req.query;
    const offset = (page - 1) * limit;

    let query = db('tasks')
      .select('tasks.*', 'cases.title as case_title', 'assigned.name as assigned_to_name', 'creator.name as created_by_name')
      .leftJoin('cases', 'tasks.case_id', 'cases.id')
      .leftJoin('lawyers as assigned', 'tasks.assigned_to', 'assigned.id')
      .leftJoin('lawyers as creator', 'tasks.created_by', 'creator.id')
      .where(function() {
        this.where('tasks.assigned_to', lawyerId).orWhere('tasks.created_by', lawyerId);
      });

    if (status) query = query.where('tasks.status', status);
    if (priority) query = query.where('tasks.priority', priority);
    if (case_id) query = query.where('tasks.case_id', case_id);

    const tasks = await query.orderBy('tasks.due_date').limit(limit).offset(offset);
    const total = await db('tasks')
      .where(function() {
        this.where('assigned_to', lawyerId).orWhere('created_by', lawyerId);
      })
      .count('id as count')
      .first();

    res.json({
      success: true,
      data: tasks,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { title, description, priority, due_date, case_id, assigned_to } = req.body;

    // Validate case_id exists if provided
    if (case_id) {
      const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
      if (!caseExists) {
        return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
      }
    }

    // Validate assigned_to exists if provided
    if (assigned_to && assigned_to !== lawyerId) {
      const assigneeExists = await db('lawyers').where({ id: assigned_to }).first();
      if (!assigneeExists) {
        return res.status(400).json({ success: false, error: 'Assigned lawyer not found' });
      }
    }

    const [taskId] = await db('tasks').insert({
      title,
      description,
      priority,
      due_date,
      case_id,
      assigned_to: assigned_to || lawyerId,
      created_by: lawyerId
    });

    const newTask = await db('tasks').where({ id: taskId }).first();
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('tasks')
      .where({ id })
      .where(function() {
        this.where('assigned_to', lawyerId).orWhere('created_by', lawyerId);
      })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const updatedTask = await db('tasks').where({ id }).first();
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('tasks')
      .where({ id })
      .where(function() {
        this.where('assigned_to', lawyerId).orWhere('created_by', lawyerId);
      })
      .del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.json({ success: true, data: { message: 'Task deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lawyerId = req.user.id;

    const updateData = { status, updated_at: new Date() };
    if (status === 'completed') {
      updateData.completed_at = new Date();
    }

    const updated = await db('tasks')
      .where({ id })
      .where(function() {
        this.where('assigned_to', lawyerId).orWhere('created_by', lawyerId);
      })
      .update(updateData);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const updatedTask = await db('tasks').where({ id }).first();
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { status = 'pending' } = req.query;

    const tasks = await db('tasks')
      .select('tasks.*', 'cases.title as case_title')
      .leftJoin('cases', 'tasks.case_id', 'cases.id')
      .where({ 'tasks.assigned_to': lawyerId, 'tasks.status': status })
      .orderBy('tasks.due_date');

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask, updateTaskStatus, getMyTasks };