exports.up = function(knex) {
  return knex.schema.createTable('platform_reviews', function(table) {
    table.increments('id').primary();
    table.integer('lawyer_id').unsigned().references('id').inTable('lawyers').onDelete('CASCADE');
    table.string('client_name').notNullable();
    table.string('client_title');
    table.text('review_text').notNullable();
    table.integer('rating').notNullable().checkBetween([1, 5]);
    table.boolean('is_approved').defaultTo(false);
    table.boolean('is_featured').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('platform_reviews');
};