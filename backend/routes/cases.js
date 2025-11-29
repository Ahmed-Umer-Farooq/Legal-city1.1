const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllCases, getCaseById, createCase, updateCase, deleteCase, getCaseTimeline, getCaseStats } = require('../controllers/caseController');

router.get('/', authenticateToken, getAllCases);
router.get('/stats', authenticateToken, getCaseStats);
router.get('/:id', authenticateToken, getCaseById);
router.get('/:id/timeline', authenticateToken, getCaseTimeline);
router.post('/', authenticateToken, createCase);
router.put('/:id', authenticateToken, updateCase);
router.delete('/:id', authenticateToken, deleteCase);

module.exports = router;