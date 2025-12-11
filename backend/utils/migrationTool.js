const db = require('../db');
const { generateSecureCaseId } = require('./caseIdGenerator');
const { v4: uuidv4 } = require('uuid');
const { PRACTICE_AREAS, CASE_STATUS } = require('./enums');

/**
 * Migrate legacy cases to new secure Case ID format
 * @param {Object} options - Migration options
 * @returns {Object} Migration results
 */
async function migrateLegacyCases(options = {}) {
  const { dryRun = false, batchSize = 100 } = options;
  const results = {
    total: 0,
    migrated: 0,
    errors: [],
    rollbackData: []
  };

  try {
    // Get all cases without secure_case_id
    const legacyCases = await db('cases')
      .whereNull('secure_case_id')
      .orWhereNull('case_uuid');

    results.total = legacyCases.length;
    console.log(`Found ${results.total} legacy cases to migrate`);

    if (dryRun) {
      console.log('DRY RUN - No changes will be made');
      return results;
    }

    // Process in batches
    for (let i = 0; i < legacyCases.length; i += batchSize) {
      const batch = legacyCases.slice(i, i + batchSize);
      
      for (const legacyCase of batch) {
        try {
          // Map legacy type to practice area
          const practiceArea = mapLegacyTypeToPracticeArea(legacyCase.type);
          
          // Generate secure Case ID and UUID
          const { caseId: secureCaseId, uuid: caseUuid } = generateSecureCaseId(practiceArea);
          
          // Store rollback data
          results.rollbackData.push({
            id: legacyCase.id,
            original_case_number: legacyCase.case_number,
            original_type: legacyCase.type
          });

          // Update case with new secure identifiers
          await db('cases')
            .where('id', legacyCase.id)
            .update({
              case_uuid: caseUuid,
              secure_case_id: secureCaseId,
              legacy_case_number: legacyCase.case_number, // Preserve original
              practice_area: practiceArea,
              status: mapLegacyStatus(legacyCase.status) || CASE_STATUS.OPEN,
              updated_at: new Date()
            });

          results.migrated++;
          console.log(`Migrated case ${legacyCase.id}: ${legacyCase.case_number} → ${secureCaseId}`);
        } catch (error) {
          results.errors.push({
            caseId: legacyCase.id,
            error: error.message
          });
          console.error(`Error migrating case ${legacyCase.id}:`, error.message);
        }
      }
    }

    console.log(`Migration completed: ${results.migrated}/${results.total} cases migrated`);
    return results;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback migration for specific cases
 * @param {Array} rollbackData - Array of rollback data
 */
async function rollbackMigration(rollbackData) {
  console.log(`Rolling back ${rollbackData.length} cases`);
  
  for (const rollbackItem of rollbackData) {
    try {
      await db('cases')
        .where('id', rollbackItem.id)
        .update({
          case_number: rollbackItem.original_case_number,
          type: rollbackItem.original_type,
          case_uuid: null,
          secure_case_id: null,
          legacy_case_number: null,
          practice_area: null,
          updated_at: new Date()
        });
      
      console.log(`Rolled back case ${rollbackItem.id}`);
    } catch (error) {
      console.error(`Error rolling back case ${rollbackItem.id}:`, error.message);
    }
  }
}

/**
 * Map legacy case type to practice area
 * @param {string} legacyType - Legacy case type
 * @returns {string} Practice area
 */
function mapLegacyTypeToPracticeArea(legacyType) {
  const mapping = {
    'civil': 'CIVIL',
    'criminal': 'CRIMINAL',
    'family': 'FAMILY',
    'corporate': 'CORPORATE',
    'immigration': 'IMMIGRATION',
    'personal_injury': 'PERSONAL_INJURY',
    'real_estate': 'REAL_ESTATE',
    'other': 'CIVIL' // Default fallback
  };
  
  return mapping[legacyType?.toLowerCase()] || 'CIVIL';
}

/**
 * Map legacy status to new status enum
 * @param {string} legacyStatus - Legacy status
 * @returns {string} New status
 */
function mapLegacyStatus(legacyStatus) {
  const mapping = {
    'active': 'IN_PROGRESS',
    'pending': 'OPEN',
    'closed': 'CLOSED',
    'on_hold': 'ON_HOLD'
  };
  
  return mapping[legacyStatus?.toLowerCase()] || 'OPEN';
}

/**
 * Validate migration integrity
 * @returns {Object} Validation results
 */
async function validateMigration() {
  const results = {
    totalCases: 0,
    migratedCases: 0,
    duplicateSecureIds: 0,
    invalidFormats: 0,
    missingUuids: 0
  };

  try {
    // Count total cases
    const totalCount = await db('cases').count('id as count').first();
    results.totalCases = totalCount.count;

    // Count migrated cases
    const migratedCount = await db('cases')
      .whereNotNull('secure_case_id')
      .whereNotNull('case_uuid')
      .count('id as count')
      .first();
    results.migratedCases = migratedCount.count;

    // Check for duplicate secure IDs
    const duplicates = await db('cases')
      .select('secure_case_id')
      .whereNotNull('secure_case_id')
      .groupBy('secure_case_id')
      .havingRaw('COUNT(*) > 1');
    results.duplicateSecureIds = duplicates.length;

    // Check for invalid formats (basic validation)
    const invalidFormats = await db('cases')
      .whereNotNull('secure_case_id')
      .whereRaw("secure_case_id NOT REGEXP '^LC-[A-Z]+-[0-9]{4}-[A-F0-9]{12}$'");
    results.invalidFormats = invalidFormats.length;

    // Check for missing UUIDs
    const missingUuids = await db('cases')
      .whereNotNull('secure_case_id')
      .whereNull('case_uuid')
      .count('id as count')
      .first();
    results.missingUuids = missingUuids.count;

    return results;
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
}

module.exports = {
  migrateLegacyCases,
  rollbackMigration,
  validateMigration
};