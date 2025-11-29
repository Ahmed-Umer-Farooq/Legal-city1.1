const db = require('../db');

const getAllMessages = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, message_type, status, case_id } = req.query;
    const offset = (page - 1) * limit;

    let query = db('lawyer_messages')
      .select('lawyer_messages.*', 'contacts.name as contact_name', 'cases.title as case_title')
      .leftJoin('contacts', 'lawyer_messages.contact_id', 'contacts.id')
      .leftJoin('cases', 'lawyer_messages.case_id', 'cases.id')
      .where('lawyer_messages.sent_by', lawyerId);

    if (message_type) query = query.where('lawyer_messages.message_type', message_type);
    if (status) query = query.where('lawyer_messages.status', status);
    if (case_id) query = query.where('lawyer_messages.case_id', case_id);

    const messages = await query.orderBy('lawyer_messages.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('lawyer_messages').where({ sent_by: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: messages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { subject, content, message_type, contact_id, case_id, attachments } = req.body;

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

    const [messageId] = await db('lawyer_messages').insert({
      subject,
      content,
      message_type: message_type || 'email',
      contact_id,
      case_id,
      sent_by: lawyerId,
      attachments: attachments ? JSON.stringify(attachments) : null
    });

    const newMessage = await db('lawyer_messages').where({ id: messageId }).first();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const updated = await db('lawyer_messages')
      .where({ id, sent_by: lawyerId })
      .update({ status: 'sent', sent_at: new Date(), updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const message = await db('lawyer_messages').where({ id }).first();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('lawyer_messages').where({ id, sent_by: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true, data: { message: 'Message deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllMessages, createMessage, sendMessage, deleteMessage };