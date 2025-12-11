const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Practice Area enum mapping
const PRACTICE_AREAS = {
  FAMILY: 'FAMILY',
  CIVIL: 'CIVIL', 
  CRIMINAL: 'CRIMINAL',
  CORPORATE: 'CORPORATE',
  TAX: 'TAX',
  IP: 'IP',
  IMMIGRATION: 'IMMIGRATION',
  REAL_ESTATE: 'REALESTATE',
  PERSONAL_INJURY: 'INJURY'
};

/**
 * Generate secure Case ID: LC-{PRACTICEAREA}-{YEAR}-{RANDOMSTRING}
 * @param {string} practiceArea - Practice area from PRACTICE_AREAS enum
 * @returns {Object} { caseId: string, uuid: string }
 */
function generateSecureCaseId(practiceArea) {
  if (!PRACTICE_AREAS[practiceArea]) {
    throw new Error(`Invalid practice area: ${practiceArea}`);
  }

  const year = new Date().getFullYear();
  const randomString = crypto.randomBytes(6).toString('hex').toUpperCase();
  const caseId = `LC-${PRACTICE_AREAS[practiceArea]}-${year}-${randomString}`;
  const uuid = uuidv4();

  return { caseId, uuid };
}

/**
 * Validate Case ID format
 * @param {string} caseId - Case ID to validate
 * @returns {boolean}
 */
function validateCaseId(caseId) {
  const pattern = /^LC-[A-Z]+-(20\d{2})-[A-F0-9]{12}$/;
  return pattern.test(caseId);
}

module.exports = {
  generateSecureCaseId,
  validateCaseId,
  PRACTICE_AREAS
};