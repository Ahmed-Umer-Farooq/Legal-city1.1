exports.up = function(knex) {
  return knex.schema.createTable('system_config', function(table) {
    table.increments('id').primary();
    table.string('key', 100).unique().notNullable();
    table.text('value').notNullable();
    table.text('description');
    table.enum('type', ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']).defaultTo('STRING');
    table.boolean('is_public').defaultTo(false); // Whether config is visible to non-admins
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['key']);
    table.index(['is_public']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('system_config');
};