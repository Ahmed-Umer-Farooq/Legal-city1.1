exports.up = function(knex) {
  return knex.schema.createTable('time_entries', function(table) {
    table.increments('id').primary();
    table.integer('case_id').unsigned().references('id').inTable('cases').onDelete('CASCADE');
    table.integer('lawyer_id').unsigned().references('id').inTable('lawyers').onDelete('CASCADE');
    table.text('description').notNullable();
    table.decimal('hours', 5, 2).notNullable();
    table.decimal('billable_rate', 8, 2).notNullable();
    table.date('date').notNullable();
    table.boolean('is_billable').defaultTo(true);
    table.integer('invoice_id').unsigned().references('id').inTable('invoices').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('time_entries');
};