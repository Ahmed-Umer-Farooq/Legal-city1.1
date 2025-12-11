#!/usr/bin/env node

const { migrateLegacyCases, validateMigration } = require('../utils/migrationTool');
const { setPhase, PHASES } = require('../utils/phaseManager');

async function runEnterpriseMigration() {
  console.log('🚀 Starting LegalCity Enterprise Migration');
  console.log('=====================================');

  try {
    // Step 1: Run database migrations
    console.log('\n📊 Step 1: Running database migrations...');
    const { exec } = require('child_process');
    await new Promise((resolve, reject) => {
      exec('npm run migrate:latest', (error, stdout, stderr) => {
        if (error) {
          console.error('Migration failed:', error);
          reject(error);
        } else {
          console.log('✅ Database migrations completed');
          resolve();
        }
      });
    });

    // Step 2: Migrate legacy cases (dry run first)
    console.log('\n🔄 Step 2: Analyzing legacy cases...');
    const dryRunResults = await migrateLegacyCases({ dryRun: true });
    console.log(`Found ${dryRunResults.total} legacy cases to migrate`);

    if (dryRunResults.total > 0) {
      console.log('\n🔧 Step 3: Migrating legacy cases...');
      const migrationResults = await migrateLegacyCases({ 
        dryRun: false, 
        batchSize: 50 
      });
      
      console.log(`✅ Migration completed: ${migrationResults.migrated}/${migrationResults.total} cases migrated`);
      
      if (migrationResults.errors.length > 0) {
        console.log(`⚠️  ${migrationResults.errors.length} errors occurred during migration`);
        migrationResults.errors.forEach(error => {
          console.log(`   - Case ${error.caseId}: ${error.error}`);
        });
      }

      // Save rollback data
      const fs = require('fs');
      const rollbackFile = `./migration-rollback-${Date.now()}.json`;
      fs.writeFileSync(rollbackFile, JSON.stringify(migrationResults.rollbackData, null, 2));
      console.log(`💾 Rollback data saved to: ${rollbackFile}`);
    }

    // Step 4: Validate migration
    console.log('\n🔍 Step 4: Validating migration...');
    const validation = await validateMigration();
    console.log('Validation Results:');
    console.log(`  - Total cases: ${validation.totalCases}`);
    console.log(`  - Migrated cases: ${validation.migratedCases}`);
    console.log(`  - Duplicate secure IDs: ${validation.duplicateSecureIds}`);
    console.log(`  - Invalid formats: ${validation.invalidFormats}`);
    console.log(`  - Missing UUIDs: ${validation.missingUuids}`);

    if (validation.duplicateSecureIds > 0 || validation.invalidFormats > 0 || validation.missingUuids > 0) {
      console.log('⚠️  Validation issues detected. Please review before proceeding.');
      return;
    }

    // Step 5: Set initial phase
    console.log('\n⚙️  Step 5: Setting enforcement phase...');
    await setPhase(PHASES.PHASE_1);
    console.log('✅ Set to Phase 1 (Soft Warnings)');

    console.log('\n🎉 Enterprise migration completed successfully!');
    console.log('\nNext Steps:');
    console.log('1. Test the new secure Case ID system');
    console.log('2. Monitor Phase 1 warnings for 2 weeks');
    console.log('3. Transition to Phase 2 (Gated Creation)');
    console.log('4. Eventually move to Phase 3 (Case-Only Mode)');
    console.log('\nUse the admin dashboard to monitor progress and manage phases.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  runEnterpriseMigration();
}

module.exports = { runEnterpriseMigration };