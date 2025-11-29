const db = require('../db');

const getAllNotes = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, case_id, client_id, is_private } = req.query;
    const offset = (page - 1) * limit;

    let query = db('notes')
      .select('notes.*', 'cases.title as case_title', 'users.name as client_name')
      .leftJoin('cases', 'notes.case_id', 'cases.id')
      .leftJoin('users', 'notes.client_id', 'users.id')
      .where('notes.created_by', lawyerId);

    if (case_id) query = query.where('notes.case_id', case_id);
    if (client_id) query = query.where('notes.client_id', client_id);
    if (is_private !== undefined) query = query.where('notes.is_private', is_private === 'true');

    const notes = await query.orderBy('notes.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('notes').where({ created_by: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: notes,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { title, content, case_id, client_id, is_private, tags } = req.body;

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

    const [noteId] = await db('notes').insert({
      title,
      content,
      case_id,
      client_id,
      created_by: lawyerId,
      is_private: is_private || false,
      tags: tags ? JSON.stringify(tags.split(',')) : null
    });

    const newNote = await db('notes').where({ id: noteId }).first();
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.stringify(updateData.tags.split(','));
    }

    const updated = await db('notes')
      .where({ id, created_by: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const updatedNote = await db('notes').where({ id }).first();
    res.json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('notes').where({ id, created_by: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({ success: true, data: { message: 'Note deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };