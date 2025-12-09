const db = require('../db');

// Public endpoint - Submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message, legalArea } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    const [submissionId] = await db('contact_submissions').insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      legal_area: legalArea || null,
      status: 'new',
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ 
      success: true, 
      message: 'Your message has been received. We will contact you within 24 hours.',
      data: { id: submissionId }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, error: 'Failed to submit contact form' });
  }
};

// Admin endpoints
const getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = db('contact_submissions')
      .leftJoin('users', 'contact_submissions.assigned_to', 'users.id')
      .select(
        'contact_submissions.*',
        'users.name as assigned_to_name'
      )
      .orderBy('contact_submissions.created_at', 'desc');

    if (status && status !== 'all') {
      query = query.where('contact_submissions.status', status);
    }

    if (search) {
      query = query.where(function() {
        this.where('contact_submissions.name', 'like', `%${search}%`)
          .orWhere('contact_submissions.email', 'like', `%${search}%`)
          .orWhere('contact_submissions.subject', 'like', `%${search}%`)
          .orWhere('contact_submissions.message', 'like', `%${search}%`);
      });
    }

    const submissions = await query.limit(limit).offset(offset);
    const [{ count }] = await db('contact_submissions').count('id as count');

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

const getSubmissionStats = async (req, res) => {
  try {
    const [newCount, inProgressCount, resolvedCount, totalCount] = await Promise.all([
      db('contact_submissions').where('status', 'new').count('id as count').first(),
      db('contact_submissions').where('status', 'in_progress').count('id as count').first(),
      db('contact_submissions').where('status', 'resolved').count('id as count').first(),
      db('contact_submissions').count('id as count').first()
    ]);

    const recentSubmissions = await db('contact_submissions')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(5);

    res.json({
      success: true,
      stats: {
        new: newCount.count,
        in_progress: inProgressCount.count,
        resolved: resolvedCount.count,
        total: totalCount.count
      },
      recentSubmissions
    });
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, assigned_to } = req.body;

    const updateData = { updated_at: new Date() };
    
    if (status) updateData.status = status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
    if (status === 'resolved') updateData.resolved_at = new Date();

    await db('contact_submissions').where('id', id).update(updateData);

    const submission = await db('contact_submissions').where('id', id).first();
    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ success: false, error: 'Failed to update submission' });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await db('contact_submissions').where('id', id).del();
    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ success: false, error: 'Failed to delete submission' });
  }
};

module.exports = {
  submitContactForm,
  getAllSubmissions,
  getSubmissionStats,
  updateSubmissionStatus,
  deleteSubmission
};
