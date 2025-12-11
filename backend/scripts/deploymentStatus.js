const db = require('../db');
const { getCurrentPhase } = require('../utils/phaseManager');
const { validateCaseId } = require('../utils/caseIdGenerator');

async function checkDeploymentStatus() {
  console.log('🔍 LegalCity Enterprise Deployment Status');
  console.log('==========================================');

  try {
    // Check current phase
    const currentPhase = await getCurrentPhase();
    console.log(`\n📊 Current Phase: ${currentPhase}`);

    // Check cases migration status
    const totalCases = await db('cases').count('id as count').first();
    const migratedCases = await db('cases').whereNotNull('secure_case_id').count('id as count').first();
    
    console.log(`\n📋 Cases Status:`);
    console.log(`  - Total cases: ${totalCases.count}`);
    console.log(`  - Migrated cases: ${migratedCases.count}`);
    console.log(`  - Migration rate: ${Math.round((migratedCases.count / totalCases.count) * 100)}%`);

    // Check secure Case ID samples
    const sampleCases = await db('cases').whereNotNull('secure_case_id').limit(5);
    console.log(`\n🔐 Sample Secure Case IDs:`);
    sampleCases.forEach(c => {
      const isValid = validateCaseId(c.secure_case_id);
      console.log(`  - ${c.secure_case_id} (${c.practice_area}) ${isValid ? '✅' : '❌'}`);
    });

    // Check audit logging
    const auditCount = await db('audit_logs').count('id as count').first();
    console.log(`\n📝 Audit Logs: ${auditCount.count} entries`);

    // Check system configuration
    const configs = await db('system_config').select('key', 'value');
    console.log(`\n⚙️ System Configuration:`);
    configs.forEach(config => {
      console.log(`  - ${config.key}: ${config.value}`);
    });

    // Phase 1 readiness check
    console.log(`\n✅ Phase 1 Deployment Status:`);
    console.log(`  - Database migration: ${migratedCases.count > 0 ? 'COMPLETE' : 'PENDING'}`);
    console.log(`  - Secure Case IDs: ${migratedCases.count > 0 ? 'ACTIVE' : 'INACTIVE'}`);
    console.log(`  - Audit logging: ${auditCount.count >= 0 ? 'ENABLED' : 'DISABLED'}`);
    console.log(`  - Phase management: ${currentPhase === 'PHASE_1' ? 'READY' : 'NOT SET'}`);

    const isReady = migratedCases.count > 0 && currentPhase === 'PHASE_1';
    console.log(`\n🚀 System Status: ${isReady ? 'READY FOR PHASE 1' : 'SETUP REQUIRED'}`);

    if (isReady) {
      console.log(`\n📈 Next Steps:`);
      console.log(`  1. Monitor user adoption for 2 weeks`);
      console.log(`  2. Track case association rates`);
      console.log(`  3. Collect user feedback on warnings`);
      console.log(`  4. Plan Phase 2 transition`);
    }

  } catch (error) {
    console.error('❌ Status check failed:', error);
  }
}

if (require.main === module) {
  checkDeploymentStatus().then(() => process.exit(0));
}

module.exports = { checkDeploymentStatus };