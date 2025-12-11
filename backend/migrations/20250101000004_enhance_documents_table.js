exports.up = function(knex) {
  return knex.schema.alterTable('documents', function(table) {
    // Mandatory case association
    table.uuid('case_uuid').notNullable();
    table.string('case_id', 50).notNullable();
    
    // Enhanced document metadata
    table.string('document_hash', 64); // SHA-256 for integrity verification
    table.text('description_encrypted'); // Encrypted document description
    table.enum('access_level', ['PUBLIC', 'CONFIDENTIAL', 'RESTRICTED', 'TOP_SECRET']).defaultTo('CONFIDENTIAL');
    table.json('access_permissions'); // Who can view/download
    table.datetime('retention_until'); // Document retention policy
    
    // Version control
    table.integer('version_number').defaultTo(1);
    table.integer('parent_document_id').unsigned().references('id').inTable('documents');
    
    // Compliance tracking
    table.integer('downloaded_count').defaultTo(0);
    table.datetime('last_accessed_at');
    table.integer('last_accessed_by').unsigned().references('id').inTable('users');
    
    // Indexes
    table.index(['case_uuid', 'created_at']);
    table.index(['case_id']);
    table.index(['access_level']);
    table.index(['retention_until']);
    
    // Foreign key constraints
    table.foreign('case_uuid').references('case_uuid').inTable('cases').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('documents', function(table) {
    table.dropColumn('case_uuid');
    table.dropColumn('case_id');
    table.dropColumn('document_hash');
    table.dropColumn('description_encrypted');
    table.dropColumn('access_level');
    table.dropColumn('access_permissions');
    table.dropColumn('retention_until');
    table.dropColumn('version_number');
    table.dropColumn('parent_document_id');
    table.dropColumn('downloaded_count');
    table.dropColumn('last_accessed_at');
    table.dropColumn('last_accessed_by');
  });
};