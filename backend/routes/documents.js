const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { upload } = require('../utils/upload');
const { getAllDocuments, uploadDocument, getDocumentById, updateDocument, deleteDocument, downloadDocument } = require('../controllers/documentController');

router.get('/', authenticateToken, getAllDocuments);
router.get('/:id', authenticateToken, getDocumentById);
router.get('/:id/download', authenticateToken, downloadDocument);
router.post('/', authenticateToken, (req, res, next) => {
  req.uploadType = 'document';
  next();
}, upload.single('document'), uploadDocument);
router.put('/:id', authenticateToken, updateDocument);
router.delete('/:id', authenticateToken, deleteDocument);

module.exports = router;