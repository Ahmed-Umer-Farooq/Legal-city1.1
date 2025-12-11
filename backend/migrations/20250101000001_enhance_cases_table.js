exports.up = function(knex) {
  return knex.schema.alterTable('cases', function(table) {
    // Add new secure case management fields
    table.uuid('case_uuid').nullable().unique();
    table.string('secure_case_id', 50).nullable().unique(); // LC-FAMILY-2025-ABC123DEF456
    table.string('legacy_case_number', 100); // Preserve old format as alias
    table.enum('practice_area', ['FAMILY', 'CIVIL', 'CRIMINAL', 'CORPORATE', 'TAX', 'IP', 'IMMIGRATION', 'REAL_ESTATE', 'PERSONAL_INJURY']).nullable();
    // Skip status column as it already exists
    
    // Enhanced metadata
    table.text('description_encrypted'); // Encrypted sensitive case details
    table.json('workflow_state'); // Current workflow position
    table.datetime('sla_deadline'); // Service level agreement deadline
    table.integer('assigned_lawyer_id').unsigned().references('id').inTable('lawyers');
    table.integer('case_manager_id').unsigned().references('id').inTable('users');
    
    // Audit fields
    table.datetime('last_activity_at').defaultTo(knex.fn.now());
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    
    // Indexes for performance
    table.index(['practice_area', 'status']);
    table.index(['assigned_lawyer_id']);
    table.index(['created_at']);
    table.index(['sla_deadline']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('cases', function(table) {
    table.dropColumn('case_uuid');
    table.dropColumn('secure_case_id');
    table.dropColumn('legacy_case_number');
    table.dropColumn('practice_area');
    table.dropColumn('status');
    table.dropColumn('description_encrypted');
    table.dropColumn('workflow_state');
    table.dropColumn('sla_deadline');
    table.dropColumn('assigned_lawyer_id');
    table.dropColumn('case_manager_id');
    table.dropColumn('last_activity_at');
    table.dropColumn('created_by');
    table.dropColumn('updated_by');
  });
};