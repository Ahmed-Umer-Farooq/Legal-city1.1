exports.up = function(knex) {
  return knex.schema.alterTable('chat_messages', function(table) {
    // Mandatory case association
    table.uuid('case_uuid').notNullable();
    table.string('case_id', 50).notNullable(); // Formatted Case ID for easy reference
    
    // Enhanced message metadata
    table.text('content_encrypted'); // Encrypted message content
    table.enum('message_priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT']).defaultTo('NORMAL');
    table.boolean('is_internal_note').defaultTo(false); // Lawyer-only notes
    table.json('attachments_metadata'); // File metadata
    
    // Compliance fields
    table.boolean('requires_approval').defaultTo(false);
    table.integer('approved_by').unsigned().references('id').inTable('users');
    table.datetime('approved_at');
    
    // Indexes
    table.index(['case_uuid', 'created_at']);
    table.index(['case_id']);
    table.index(['sender_id', 'sender_type']);
    
    // Foreign key constraints
    table.foreign('case_uuid').references('case_uuid').inTable('cases').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('chat_messages', function(table) {
    table.dropColumn('case_uuid');
    table.dropColumn('case_id');
    table.dropColumn('content_encrypted');
    table.dropColumn('message_priority');
    table.dropColumn('is_internal_note');
    table.dropColumn('attachments_metadata');
    table.dropColumn('requires_approval');
    table.dropColumn('approved_by');
    table.dropColumn('approved_at');
  });
};