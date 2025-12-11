exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', function(table) {
    table.increments('id').primary();
    table.integer('actor_id').unsigned().notNullable();
    table.enum('actor_role', ['USER', 'LAWYER', 'SENIOR_LAWYER', 'PARALEGAL', 'CASE_MANAGER', 'ADMIN']).notNullable();
    table.uuid('case_uuid').nullable(); // Nullable for global events
    table.enum('action', [
      'LOGIN', 'LOGOUT', 'CASE_CREATED', 'CASE_UPDATED', 'CASE_CLOSED',
      'CHAT_MESSAGE_SENT', 'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED',
      'INVOICE_GENERATED', 'ROLE_CHANGED', 'PERMISSION_UPDATED'
    ]).notNullable();
    table.string('entity', 100); // Table/resource affected
    table.json('metadata'); // Additional context data
    table.datetime('timestamp').notNullable().defaultTo(knex.fn.now());
    table.string('checksum', 64).notNullable(); // SHA-256 for tamper detection
    table.string('ip_address', 45); // IPv4/IPv6 support
    table.text('user_agent');
    
    // Indexes for audit queries
    table.index(['actor_id', 'timestamp']);
    table.index(['case_uuid', 'timestamp']);
    table.index(['action', 'timestamp']);
    table.index(['timestamp']); // For retention policies
    
    // Foreign key constraints
    table.foreign('case_uuid').references('case_uuid').inTable('cases').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('audit_logs');
};