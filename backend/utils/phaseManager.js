const db = require('../db');

// Phase configuration
const PHASES = {
  PHASE_1: 'SOFT_WARNINGS',
  PHASE_2: 'GATED_CREATION', 
  PHASE_3: 'CASE_ONLY_MODE'
};

/**
 * Get current enforcement phase from database
 * @returns {string} Current phase
 */
async function getCurrentPhase() {
  try {
    const config = await db('system_config')
      .where('key', 'communication_enforcement_phase')
      .first();
    
    return config?.value || PHASES.PHASE_1;
  } catch (error) {
    console.error('Error getting current phase:', error);
    return PHASES.PHASE_1; // Default to Phase 1
  }
}

/**
 * Set enforcement phase
 * @param {string} phase - Phase to set
 */
async function setPhase(phase) {
  if (!Object.values(PHASES).includes(phase)) {
    throw new Error(`Invalid phase: ${phase}`);
  }

  try {
    await db('system_config')
      .insert({ key: 'communication_enforcement_phase', value: phase })
      .onConflict('key')
      .merge({ value: phase, updated_at: new Date() });
    
    console.log(`Enforcement phase set to: ${phase}`);
  } catch (error) {
    console.error('Error setting phase:', error);
    throw error;
  }
}

/**
 * Check if action is allowed in current phase
 * @param {string} action - Action to check (SEND_MESSAGE, UPLOAD_DOCUMENT, etc.)
 * @param {boolean} hasCaseAssociation - Whether action has case association
 * @returns {Object} { allowed: boolean, warning?: string, error?: string }
 */
async function checkPhaseCompliance(action, hasCaseAssociation) {
  const currentPhase = await getCurrentPhase();

  switch (currentPhase) {
    case PHASES.PHASE_1:
      // Soft warnings - allow all actions but warn if no case association
      if (!hasCaseAssociation) {
        return {
          allowed: true,
          warning: 'Consider associating this action with a case for better organization and compliance.'
        };
      }
      return { allowed: true };

    case PHASES.PHASE_2:
      // Gated creation - require case association for new content
      if (!hasCaseAssociation) {
        return {
          allowed: false,
          error: 'Case association is required. Please select or create a case before proceeding.'
        };
      }
      return { allowed: true };

    case PHASES.PHASE_3:
      // Case-only mode - all communication must be case-centric
      if (!hasCaseAssociation) {
        return {
          allowed: false,
          error: 'All communication must be associated with a case. General messaging is no longer available.'
        };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}

/**
 * Get phase transition schedule
 * @returns {Object} Phase schedule configuration
 */
async function getPhaseSchedule() {
  try {
    const schedule = await db('system_config')
      .where('key', 'phase_transition_schedule')
      .first();
    
    if (schedule?.value) {
      return JSON.parse(schedule.value);
    }
    
    // Default schedule
    return {
      phase_1_duration: 14, // days
      phase_2_duration: 30, // days
      auto_transition: false,
      notifications: {
        phase_1_warning: 7, // days before Phase 2
        phase_2_warning: 14 // days before Phase 3
      }
    };
  } catch (error) {
    console.error('Error getting phase schedule:', error);
    return null;
  }
}

/**
 * Schedule automatic phase transition
 * @param {Object} schedule - Transition schedule
 */
async function schedulePhaseTransition(schedule) {
  try {
    await db('system_config')
      .insert({ 
        key: 'phase_transition_schedule', 
        value: JSON.stringify(schedule) 
      })
      .onConflict('key')
      .merge({ 
        value: JSON.stringify(schedule), 
        updated_at: new Date() 
      });
    
    console.log('Phase transition schedule updated:', schedule);
  } catch (error) {
    console.error('Error scheduling phase transition:', error);
    throw error;
  }
}

module.exports = {
  PHASES,
  getCurrentPhase,
  setPhase,
  checkPhaseCompliance,
  getPhaseSchedule,
  schedulePhaseTransition
};