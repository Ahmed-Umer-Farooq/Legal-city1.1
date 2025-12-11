const db = require('../db');
const { validateCaseId } = require('../utils/caseIdGenerator');
const { logAuditEvent } = require('../utils/auditLogger');
const { AUDIT_EVENTS, PERMISSIONS } = require('../utils/enums');
const { hasPermission, getCaseAccess } = require('../utils/rbac');

// Send message - REQUIRES case association
const sendCaseMessage = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { content, message_type = 'text', is_internal_note = false } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';
    const userType = userRole === 'USER' ? 'user' : 'lawyer';

    // Validate Case ID format
    if (!validateCaseId(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Case ID format' });
    }

    // Validate permissions
    if (!hasPermission(userRole, PERMISSIONS.SEND_MESSAGES)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions to send messages' });
    }

    // Get case data and validate access
    const caseData = await db('cases').where('secure_case_id', caseId).first();
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const hasAccess = await getCaseAccess(userId, userRole, caseData.case_uuid);
    if (!hasAccess) {
      return res.status(403).json({ success: false, error: 'Access denied to this case' });
    }

    // Determine receiver (simplified - in real system, this would be more complex)
    let receiverId, receiverType;
    if (userType === 'user') {
      receiverId = caseData.assigned_lawyer_id;
      receiverType = 'lawyer';
    } else {
      receiverId = caseData.client_id;
      receiverType = 'user';
    }

    // Insert message with mandatory case association
    const messageData = {
      case_uuid: caseData.case_uuid,
      case_id: caseId,
      sender_id: userId,
      sender_type: userType,
      receiver_id: receiverId,
      receiver_type: receiverType,
      content,
      message_type,
      is_internal_note,
      read_status: false,
      created_at: new Date()
    };

    const [messageId] = await db('chat_messages').insert(messageData);
    const newMessage = await db('chat_messages').where('id', messageId).first();

    // Update case last activity
    await db('cases')
      .where('case_uuid', caseData.case_uuid)
      .update({ last_activity_at: new Date() });

    // Log audit event
    await logAuditEvent({
      actor_id: userId,
      actor_role: userRole,
      case_uuid: caseData.case_uuid,
      action: AUDIT_EVENTS.CHAT_MESSAGE_SENT,
      entity: 'chat_messages',
      metadata: { 
        case_id: caseId, 
        message_type, 
        is_internal_note,
        receiver_id: receiverId,
        receiver_type: receiverType
      },
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get case messages
const getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';

    // Validate Case ID format
    if (!validateCaseId(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Case ID format' });
    }

    // Get case data and validate access
    const caseData = await db('cases').where('secure_case_id', caseId).first();
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const hasAccess = await getCaseAccess(userId, userRole, caseData.case_uuid);
    if (!hasAccess) {
      return res.status(403).json({ success: false, error: 'Access denied to this case' });
    }

    // Get messages for this case
    let query = db('chat_messages')
      .where('case_uuid', caseData.case_uuid)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Filter internal notes for non-lawyers
    if (userRole === 'USER') {
      query = query.where('is_internal_note', false);
    }

    const messages = await query;

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all conversations (case-centric)
const getCaseConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'LAWYER';

    // Get accessible cases for user
    let casesQuery = db('cases')
      .select('case_uuid', 'secure_case_id', 'title', 'practice_area', 'status');

    // Apply role-based filtering
    if (userRole === 'LAWYER' || userRole === 'SENIOR_LAWYER') {
      casesQuery = casesQuery.where('assigned_lawyer_id', userId);
    } else if (userRole === 'USER') {
      casesQuery = casesQuery.where('client_id', userId);
    }
    // ADMIN and CASE_MANAGER can see all cases

    const cases = await casesQuery;

    // Get latest message for each case
    const conversationsWithMessages = await Promise.all(
      cases.map(async (caseItem) => {
        const lastMessage = await db('chat_messages')
          .where('case_uuid', caseItem.case_uuid)
          .orderBy('created_at', 'desc')
          .first();

        const unreadCount = await db('chat_messages')
          .where({
            case_uuid: caseItem.case_uuid,
            receiver_id: userId,
            receiver_type: userRole === 'USER' ? 'user' : 'lawyer',
            read_status: false
          })
          .count('id as count')
          .first();

        return {
          case_uuid: caseItem.case_uuid,
          case_id: caseItem.secure_case_id,
          case_title: caseItem.title,
          practice_area: caseItem.practice_area,
          case_status: caseItem.status,
          last_message: lastMessage?.content,
          last_message_time: lastMessage?.created_at,
          unread_count: unreadCount.count || 0
        };
      })
    );

    // Sort by last message time
    conversationsWithMessages.sort((a, b) => 
      new Date(b.last_message_time || 0) - new Date(a.last_message_time || 0)
    );

    res.json({ success: true, data: conversationsWithMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  sendCaseMessage,
  getCaseMessages,
  getCaseConversations
};