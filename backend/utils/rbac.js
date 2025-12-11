const db = require('../db');
const { ROLE_PERMISSIONS, PERMISSIONS } = require('./enums');

/**
 * Check if user role has specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function hasPermission(userRole, permission) {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user has access to specific case
 * @param {number} userId - User ID
 * @param {string} userRole - User's role
 * @param {string} caseUuid - Case UUID
 * @returns {boolean}
 */
async function getCaseAccess(userId, userRole, caseUuid) {
  try {
    // Admin and Case Manager have access to all cases
    if (userRole === 'ADMIN' || userRole === 'CASE_MANAGER') {
      return true;
    }

    const caseData = await db('cases')
      .where('case_uuid', caseUuid)
      .first();

    if (!caseData) {
      return false;
    }

    // Check if user is assigned to the case
    if (userRole === 'LAWYER' || userRole === 'SENIOR_LAWYER') {
      return caseData.assigned_lawyer_id === userId;
    }

    if (userRole === 'USER') {
      return caseData.client_id === userId;
    }

    if (userRole === 'PARALEGAL') {
      // Paralegals can access cases assigned to their supervising lawyer
      // This would require additional table for paralegal-lawyer relationships
      return caseData.assigned_lawyer_id === userId; // Simplified for now
    }

    return false;
  } catch (error) {
    console.error('Error checking case access:', error);
    return false;
  }
}

/**
 * Get user's accessible cases
 * @param {number} userId - User ID
 * @param {string} userRole - User's role
 * @returns {Array} Array of case UUIDs
 */
async function getUserAccessibleCases(userId, userRole) {
  try {
    let query = db('cases').select('case_uuid');

    if (userRole === 'ADMIN' || userRole === 'CASE_MANAGER') {
      // No restrictions for admin/case manager
    } else if (userRole === 'LAWYER' || userRole === 'SENIOR_LAWYER') {
      query = query.where('assigned_lawyer_id', userId);
    } else if (userRole === 'USER') {
      query = query.where('client_id', userId);
    } else if (userRole === 'PARALEGAL') {
      query = query.where('assigned_lawyer_id', userId); // Simplified
    } else {
      return [];
    }

    const cases = await query;
    return cases.map(c => c.case_uuid);
  } catch (error) {
    console.error('Error getting accessible cases:', error);
    return [];
  }
}

module.exports = {
  hasPermission,
  getCaseAccess,
  getUserAccessibleCases
};