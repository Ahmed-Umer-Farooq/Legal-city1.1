const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../utils/middleware');
const {
  submitContactForm,
  getAllSubmissions,
  getSubmissionStats,
  updateSubmissionStatus,
  deleteSubmission
} = require('../controllers/contactSubmissionsController');

// Public route
router.post('/submit', submitContactForm);

// Admin routes
router.get('/', requireAuth, requireAdmin, getAllSubmissions);
router.get('/stats', requireAuth, requireAdmin, getSubmissionStats);
router.put('/:id', requireAuth, requireAdmin, updateSubmissionStatus);
router.delete('/:id', requireAuth, requireAdmin, deleteSubmission);

module.exports = router;
