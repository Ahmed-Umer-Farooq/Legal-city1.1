const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { sendCaseMessage, getCaseMessages, getCaseConversations } = require('../controllers/enhancedChatController');

// All routes require authentication
router.use(authenticateToken);

// GET /api/chat/conversations - Get all case-centric conversations
router.get('/conversations', getCaseConversations);

// POST /api/chat/cases/:caseId/messages - Send message to case (MANDATORY case association)
router.post('/cases/:caseId/messages', sendCaseMessage);

// GET /api/chat/cases/:caseId/messages - Get messages for specific case
router.get('/cases/:caseId/messages', getCaseMessages);

module.exports = router;