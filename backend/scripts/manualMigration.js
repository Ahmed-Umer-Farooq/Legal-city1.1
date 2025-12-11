const db = require('../db');
const { generateSecureCaseId } = require('../utils/caseIdGenerator');
const { v4: uuidv4 } = require('uuid');

async function runManualMigration() {
  console.log('🚀 Running Manual Enterprise Migration');
  
  try {
    // Step 1: Add columns to cases table if they don't exist
    console.log('📊 Adding enterprise columns to cases table...');
    
    const columns = await db.raw("SHOW COLUMNS FROM cases LIKE 'case_uuid'");
    if (columns[0].length === 0) {
      await db.raw('ALTER TABLE cases ADD COLUMN case_uuid VARCHAR(36) NULL');
      await db.raw('ALTER TABLE cases ADD COLUMN secure_case_id VARCHAR(50) NULL');
      await db.raw('ALTER TABLE cases ADD COLUMN legacy_case_number VARCHAR(100) NULL');
      await db.raw('ALTER TABLE cases ADD COLUMN practice_area VARCHAR(20) NULL');
      await db.raw('ALTER TABLE cases ADD COLUMN sla_deadline DATETIME NULL');
      await db.raw('ALTER TABLE cases ADD COLUMN last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Cases table enhanced');
    } else {
      console.log('✅ Cases table already enhanced');
    }

    // Step 2: Create audit_logs table
    console.log('📋 Creating audit_logs table...');
    const auditExists = await db.schema.hasTable('audit_logs');
    if (!auditExists) {
      await db.schema.createTable('audit_logs', function(table) {
        table.increments('id').primary();
        table.integer('actor_id').notNullable();
        table.string('actor_role', 20).notNullable();
        table.string('case_uuid', 36).nullable();
        table.string('action', 50).notNullable();
        table.string('entity', 100);
        table.json('metadata');
        table.datetime('timestamp').defaultTo(db.fn.now());
        table.string('checksum', 64).notNullable();
        table.string('ip_address', 45);
        table.text('user_agent');
      });
      console.log('✅ Audit logs table created');
    } else {
      console.log('✅ Audit logs table already exists');
    }

    // Step 3: Create system_config table
    console.log('⚙️ Creating system_config table...');
    const configExists = await db.schema.hasTable('system_config');
    if (!configExists) {
      await db.schema.createTable('system_config', function(table) {
        table.increments('id').primary();
        table.string('key', 100).unique().notNullable();
        table.text('value').notNullable();
        table.string('type', 20).defaultTo('STRING');
        table.datetime('created_at').defaultTo(db.fn.now());
        table.datetime('updated_at').defaultTo(db.fn.now());
      });
      
      // Insert initial phase configuration
      await db('system_config').insert({
        key: 'communication_enforcement_phase',
        value: 'PHASE_1',
        type: 'STRING'
      });
      console.log('✅ System config table created with Phase 1 setting');
    } else {
      console.log('✅ System config table already exists');
    }

    // Step 4: Migrate existing cases
    console.log('🔄 Migrating existing cases...');
    const legacyCases = await db('cases').whereNull('secure_case_id');
    console.log(`Found ${legacyCases.length} cases to migrate`);

    let migrated = 0;
    for (const caseItem of legacyCases) {
      try {
        // Map legacy type to practice area
        const practiceAreaMap = {
          'civil': 'CIVIL',
          'criminal': 'CRIMINAL',
          'family': 'FAMILY',
          'corporate': 'CORPORATE',
          'immigration': 'IMMIGRATION',
          'personal_injury': 'PERSONAL_INJURY',
          'real_estate': 'REAL_ESTATE'
        };
        
        const practiceArea = practiceAreaMap[caseItem.type] || 'CIVIL';
        const { caseId: secureCaseId, uuid: caseUuid } = generateSecureCaseId(practiceArea);
        
        await db('cases')
          .where('id', caseItem.id)
          .update({
            case_uuid: caseUuid,
            secure_case_id: secureCaseId,
            legacy_case_number: caseItem.case_number,
            practice_area: practiceArea,
            last_activity_at: new Date()
          });
        
        migrated++;
        if (migrated % 10 === 0) {
          console.log(`Migrated ${migrated}/${legacyCases.length} cases...`);
        }
      } catch (error) {
        console.error(`Error migrating case ${caseItem.id}:`, error.message);
      }
    }

    console.log(`✅ Migration completed: ${migrated}/${legacyCases.length} cases migrated`);

    // Step 5: Add case association columns to chat_messages
    console.log('💬 Enhancing chat_messages table...');
    const chatColumns = await db.raw("SHOW COLUMNS FROM chat_messages LIKE 'case_uuid'");
    if (chatColumns[0].length === 0) {
      await db.raw('ALTER TABLE chat_messages ADD COLUMN case_uuid VARCHAR(36) NULL');
      await db.raw('ALTER TABLE chat_messages ADD COLUMN case_id VARCHAR(50) NULL');
      console.log('✅ Chat messages table enhanced');
    }

    // Step 6: Add case association columns to documents
    console.log('📄 Enhancing documents table...');
    const docColumns = await db.raw("SHOW COLUMNS FROM documents LIKE 'case_uuid'");
    if (docColumns[0].length === 0) {
      await db.raw('ALTER TABLE documents ADD COLUMN case_uuid VARCHAR(36) NULL');
      await db.raw('ALTER TABLE documents ADD COLUMN case_id VARCHAR(50) NULL');
      console.log('✅ Documents table enhanced');
    }

    console.log('\n🎉 Manual migration completed successfully!');
    console.log('\nSystem Status:');
    console.log('- Phase 1 (Soft Warnings) is now active');
    console.log('- Legacy cases have been migrated with secure Case IDs');
    console.log('- Audit logging is enabled');
    console.log('- Case-centric communication is ready');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  runManualMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runManualMigration };