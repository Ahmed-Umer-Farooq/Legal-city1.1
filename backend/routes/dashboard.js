const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getOverview, getRecentActivity, getRevenue, getCasesChart } = require('../controllers/dashboardController');

router.get('/overview', authenticateToken, getOverview);
router.get('/recent-activity', authenticateToken, getRecentActivity);
router.get('/revenue', authenticateToken, getRevenue);
router.get('/cases-chart', authenticateToken, getCasesChart);

module.exports = router;