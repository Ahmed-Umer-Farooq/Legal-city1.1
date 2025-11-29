const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllCalls, createCall, updateCall, deleteCall } = require('../controllers/callController');

router.get('/', authenticateToken, getAllCalls);
router.post('/', authenticateToken, createCall);
router.put('/:id', authenticateToken, updateCall);
router.delete('/:id', authenticateToken, deleteCall);

module.exports = router;