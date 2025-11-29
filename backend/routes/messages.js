const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllMessages, createMessage, sendMessage, deleteMessage } = require('../controllers/messageController');

router.get('/', authenticateToken, getAllMessages);
router.post('/', authenticateToken, createMessage);
router.put('/:id/send', authenticateToken, sendMessage);
router.delete('/:id', authenticateToken, deleteMessage);

module.exports = router;