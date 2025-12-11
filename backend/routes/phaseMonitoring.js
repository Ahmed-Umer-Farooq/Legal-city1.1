const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../utils/middleware');
const { getCurrentPhase, setPhase, PHASES } = require('../utils/phaseManager');
const { hasPermission, PERMISSIONS } = require('../utils/enums');

// Middleware for admin access
const requireAdmin = (req, res, next) => {
  const userRole = req.user.role || 'USER';
  if (userRole !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

router.use(authenticateToken);

// GET /api/phase/status - Get current phase and adoption metrics
router.get('/status', async (req, res) => {
  try {
    const currentPhase = await getCurrentPhase();
    
    // Case association metrics
    const totalMessages = await db('chat_messages').count('id as count').first();
    const caseAssociatedMessages = await db('chat_messages').whereNotNull('case_uuid').count('id as count').first();
    
    const totalDocuments = await db('documents').count('id as count').first();
    const caseAssociatedDocs = await db('documents').whereNotNull('case_uuid').count('id as count').first();
    
    // Recent activity
    const recentActivity = await db('audit_logs')
      .where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .count('id as count')
      .first();

    // Phase 1 specific metrics
    const phase1Metrics = {
      message_association_rate: totalMessages.count > 0 ? 
        Math.round((caseAssociatedMessages.count / totalMessages.count) * 100) : 0,
      document_association_rate: totalDocuments.count > 0 ? 
        Math.round((caseAssociatedDocs.count / totalDocuments.count) * 100) : 0,
      weekly_activity: recentActivity.count
    };

    res.json({
      success: true,
      data: {
        current_phase: currentPhase,
        phase_description: getPhaseDescription(currentPhase),
        metrics: phase1Metrics,
        recommendations: getPhaseRecommendations(currentPhase, phase1Metrics)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/phase/transition - Transition to next phase (Admin only)
router.post('/transition', requireAdmin, async (req, res) => {
  try {
    const { target_phase, reason } = req.body;
    const currentPhase = await getCurrentPhase();
    
    if (!Object.values(PHASES).includes(target_phase)) {
      return res.status(400).json({ success: false, error: 'Invalid target phase' });
    }

    // Validate transition logic
    const canTransition = validatePhaseTransition(currentPhase, target_phase);
    if (!canTransition.allowed) {
      return res.status(400).json({ success: false, error: canTransition.reason });
    }

    await setPhase(target_phase);

    // Log phase transition
    const { logAuditEvent } = require('../utils/auditLogger');
    await logAuditEvent({
      actor_id: req.user.id,
      actor_role: req.user.role,
      case_uuid: null,
      action: 'PHASE_TRANSITION',
      entity: 'system_config',
      metadata: { 
        from_phase: currentPhase, 
        to_phase: target_phase, 
        reason 
      },
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        previous_phase: currentPhase,
        current_phase: target_phase,
        transition_time: new Date(),
        reason
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/phase/adoption - Get detailed adoption metrics
router.get('/adoption', requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Daily adoption trends
    const dailyMetrics = await db.raw(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_messages,
        COUNT(case_uuid) as case_associated_messages
      FROM chat_messages 
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [startDate]);

    // User adoption by role
    const userAdoption = await db.raw(`
      SELECT 
        u.role,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN cm.case_uuid IS NOT NULL THEN u.id END) as adopting_users
      FROM users u
      LEFT JOIN chat_messages cm ON u.id = cm.sender_id AND cm.sender_type = 'user'
      WHERE u.created_at >= ?
      GROUP BY u.role
    `, [startDate]);

    res.json({
      success: true,
      data: {
        period_days: days,
        daily_trends: dailyMetrics[0],
        user_adoption: userAdoption[0],
        summary: {
          total_period_messages: dailyMetrics[0].reduce((sum, day) => sum + day.total_messages, 0),
          case_associated_messages: dailyMetrics[0].reduce((sum, day) => sum + day.case_associated_messages, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function getPhaseDescription(phase) {
  const descriptions = {
    [PHASES.PHASE_1]: 'Soft Warnings - Users see prompts to associate communication with cases',
    [PHASES.PHASE_2]: 'Gated Creation - New messages and documents require case association',
    [PHASES.PHASE_3]: 'Case-Only Mode - All communication must be case-centric'
  };
  return descriptions[phase] || 'Unknown phase';
}

function getPhaseRecommendations(phase, metrics) {
  const recommendations = [];
  
  if (phase === PHASES.PHASE_1) {
    if (metrics.message_association_rate < 30) {
      recommendations.push('Consider user training on case association benefits');
    }
    if (metrics.message_association_rate > 70) {
      recommendations.push('High adoption rate - consider transitioning to Phase 2');
    }
    if (metrics.weekly_activity < 10) {
      recommendations.push('Low activity - monitor user engagement');
    }
  }
  
  return recommendations;
}

function validatePhaseTransition(currentPhase, targetPhase) {
  // Define valid transitions
  const validTransitions = {
    [PHASES.PHASE_1]: [PHASES.PHASE_2],
    [PHASES.PHASE_2]: [PHASES.PHASE_3, PHASES.PHASE_1], // Allow rollback
    [PHASES.PHASE_3]: [PHASES.PHASE_2] // Allow rollback only
  };

  if (!validTransitions[currentPhase]?.includes(targetPhase)) {
    return {
      allowed: false,
      reason: `Invalid transition from ${currentPhase} to ${targetPhase}`
    };
  }

  return { allowed: true };
}

module.exports = router;