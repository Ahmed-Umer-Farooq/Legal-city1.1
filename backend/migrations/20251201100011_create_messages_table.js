exports.up = function(knex) {
  return knex.schema.createTable('lawyer_messages', function(table) {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.text('content').notNullable();
    table.enum('message_type', ['email', 'sms', 'internal']).defaultTo('email');
    table.enum('status', ['draft', 'sent', 'delivered', 'failed']).defaultTo('draft');
    table.integer('contact_id').unsigned().references('id').inTable('contacts').onDelete('CASCADE');
    table.integer('case_id').unsigned().references('id').inTable('cases').onDelete('SET NULL');
    table.integer('sent_by').unsigned().references('id').inTable('lawyers').onDelete('CASCADE');
    table.datetime('sent_at');
    table.json('attachments');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lawyer_messages');
};