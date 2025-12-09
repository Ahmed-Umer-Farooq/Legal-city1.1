const express = require('express');
const router = express.Router();
const platformReviewController = require('../controllers/platformReviewController');
const { authenticateToken, requireAuth, requireLawyer, requireAdmin } = require('../utils/middleware');

// Public routes
router.get('/featured', platformReviewController.getFeaturedReviews);
router.get('/approved', platformReviewController.getApprovedReviews);

// Protected routes
router.get('/', requireAuth, platformReviewController.getAllReviews);
router.post('/', requireAuth, platformReviewController.createReview);
router.put('/:id/status', requireAuth, requireAdmin, platformReviewController.updateReviewStatus);

module.exports = router;