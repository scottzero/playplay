exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('favorites_playlists', function(table){
      table.increments('id').primary();
      table.integer('favorite_id').references('favorites.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('playlist_id').references('playlists.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  ]);
};


exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('favorites_playlists')
  ]);
};
