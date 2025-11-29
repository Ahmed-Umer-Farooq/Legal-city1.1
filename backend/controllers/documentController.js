const db = require('../db');
const path = require('path');
const fs = require('fs');

const getAllDocuments = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, category, case_id } = req.query;
    const offset = (page - 1) * limit;

    let query = db('documents')
      .select('documents.*', 'cases.title as case_title', 'users.name as client_name')
      .leftJoin('cases', 'documents.case_id', 'cases.id')
      .leftJoin('users', 'documents.client_id', 'users.id')
      .where('documents.uploaded_by', lawyerId);

    if (category) query = query.where('documents.category', category);
    if (case_id) query = query.where('documents.case_id', case_id);

    const documents = await query.orderBy('documents.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('documents').where({ uploaded_by: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: documents,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { category, case_id, client_id, tags, is_confidential } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const [documentId] = await db('documents').insert({
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      file_url: req.file.path,
      category,
      case_id,
      client_id,
      uploaded_by: lawyerId,
      tags: tags ? JSON.stringify(tags.split(',')) : null,
      is_confidential: is_confidential === 'true'
    });

    const newDocument = await db('documents').where({ id: documentId }).first();
    res.status(201).json({ success: true, data: newDocument });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const document = await db('documents')
      .select('documents.*', 'cases.title as case_title')
      .leftJoin('cases', 'documents.case_id', 'cases.id')
      .where({ 'documents.id': id, 'documents.uploaded_by': lawyerId })
      .first();

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.stringify(updateData.tags.split(','));
    }

    const updated = await db('documents')
      .where({ id, uploaded_by: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const updatedDocument = await db('documents').where({ id }).first();
    res.json({ success: true, data: updatedDocument });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const document = await db('documents').where({ id, uploaded_by: lawyerId }).first();
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.file_url)) {
      fs.unlinkSync(document.file_url);
    }

    await db('documents').where({ id }).del();
    res.json({ success: true, data: { message: 'Document deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const document = await db('documents').where({ id, uploaded_by: lawyerId }).first();
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    if (!fs.existsSync(document.file_url)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.download(document.file_url, document.file_name);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllDocuments, uploadDocument, getDocumentById, updateDocument, deleteDocument, downloadDocument };