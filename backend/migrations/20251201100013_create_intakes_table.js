exports.up = function(knex) {
  return knex.schema.createTable('intakes', function(table) {
    table.increments('id').primary();
    table.string('intake_number').unique().notNullable();
    table.string('client_name').notNullable();
    table.string('client_email');
    table.string('client_phone');
    table.string('legal_issue').notNullable();
    table.text('description').notNullable();
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.enum('status', ['new', 'reviewing', 'accepted', 'declined', 'converted']).defaultTo('new');
    table.date('intake_date').notNullable();
    table.integer('assigned_to').unsigned().references('id').inTable('lawyers').onDelete('SET NULL');
    table.decimal('estimated_value', 10, 2);
    table.text('notes');
    table.integer('converted_case_id').unsigned().references('id').inTable('cases').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('intakes');
};