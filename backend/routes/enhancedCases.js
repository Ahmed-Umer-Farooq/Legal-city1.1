const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllCases, getCaseById, createCase, updateCaseStatus } = require('../controllers/enhancedCaseController');

// All routes require authentication
router.use(authenticateToken);

// GET /api/cases - Get all cases (role-based filtering)
router.get('/', getAllCases);

// POST /api/cases/create - Create new case with secure Case ID
router.post('/create', createCase);

// GET /api/cases/:caseId - Get case by secure Case ID
router.get('/:caseId', getCaseById);

// PATCH /api/cases/:caseId/status - Update case status with workflow validation
router.patch('/:caseId/status', updateCaseStatus);

module.exports = router;