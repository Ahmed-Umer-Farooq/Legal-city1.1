exports.up = function(knex) {
  return knex.schema.createTable('expenses', function(table) {
    table.increments('id').primary();
    table.integer('case_id').unsigned().references('id').inTable('cases').onDelete('CASCADE');
    table.integer('client_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('category').notNullable();
    table.text('description').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('date').notNullable();
    table.string('receipt');
    table.boolean('is_billable').defaultTo(true);
    table.integer('invoice_id').unsigned().references('id').inTable('invoices').onDelete('SET NULL');
    table.integer('created_by').unsigned().references('id').inTable('lawyers').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('expenses');
};