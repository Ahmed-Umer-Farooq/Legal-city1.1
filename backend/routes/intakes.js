const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllIntakes, createIntake, updateIntake, convertToCase } = require('../controllers/intakeController');

router.get('/', authenticateToken, getAllIntakes);
router.post('/', authenticateToken, createIntake);
router.put('/:id', authenticateToken, updateIntake);
router.put('/:id/convert', authenticateToken, convertToCase);

module.exports = router;