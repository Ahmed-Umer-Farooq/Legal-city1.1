exports.up = function(knex) {
  return knex.schema.alterTable('invoices', function(table) {
    table.integer('client_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('case_id').unsigned().references('id').inTable('cases').onDelete('CASCADE');
    table.decimal('tax', 10, 2).defaultTo(0);
    table.decimal('total_amount', 10, 2);
    table.date('issue_date');
    table.date('due_date');
    table.date('paid_date');
    table.json('items');
    table.text('notes');
    table.dropColumn('client_name');
    table.dropColumn('created_date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('invoices');
};