const crypto = require('crypto');
const db = require('../db');
const { AUDIT_EVENTS } = require('./enums');

/**
 * Generate tamper-evident checksum for audit entry
 * @param {Object} auditData - Audit log data
 * @returns {string} SHA-256 hash
 */
function generateAuditChecksum(auditData) {
  const dataString = JSON.stringify({
    actor_id: auditData.actor_id,
    role: auditData.role,
    case_uuid: auditData.case_uuid,
    action: auditData.action,
    entity: auditData.entity,
    metadata: auditData.metadata,
    timestamp: auditData.timestamp
  });
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Log audit event with tamper-evident checksum
 * @param {Object} auditData - Audit log data
 */
async function logAuditEvent(auditData) {
  try {
    const timestamp = new Date();
    const auditEntry = {
      ...auditData,
      timestamp,
      checksum: generateAuditChecksum({ ...auditData, timestamp })
    };

    await db('audit_logs').insert(auditEntry);
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not break main functionality
  }
}

/**
 * Verify audit log integrity
 * @param {Object} auditEntry - Audit log entry from database
 * @returns {boolean} True if checksum is valid
 */
function verifyAuditIntegrity(auditEntry) {
  const { checksum, ...dataWithoutChecksum } = auditEntry;
  const expectedChecksum = generateAuditChecksum(dataWithoutChecksum);
  return checksum === expectedChecksum;
}

module.exports = {
  logAuditEvent,
  verifyAuditIntegrity,
  AUDIT_EVENTS
};