var config = require('../config');
var p = name => (config.db && config.db.tablePrefix || '') + name;

exports.up = async knex => {
  await knex.schema.createTable(p('oauth_client'), t => {
    t.increments();
    t.string('name').notNullable();
    t.string('client_id').notNullable().unique();
    t.string('client_secret').notNullable();
  });

  await knex(p('oauth_client')).insert({
    name: 'abc',
    client_id: 'def1234567890',
    client_secret: 'ghi1234567890',
  });

  await knex.schema.createTable(p('scope'), t => {
    t.increments();
    t.string('name').unique().notNullable();
    t.string('description');
  });

  await knex(p('scope')).insert({ name: 'prometheus' });

  await knex.schema.createTable(p('resource_owner'), t => {
    t.increments();
    t.string('username').unique().notNullable();
    t.string('password').notNullable();
  });

  await knex(p('resource_owner')).insert({
    username: 'username',
    password: await require('bcrypt').hash('password', 12),
  });

  await knex.schema.createTable(p('ro_scope'), t => {
    t.increments();
    t.integer('resource_owner_id').unsigned().notNullable();
    t.integer('scope_id').unsigned().notNullable();
  });

  await knex.schema.alterTable(p('ro_scope'), t => {
    t.foreign('resource_owner_id').references('id').inTable(p('resource_owner')).onDelete('cascade');
    t.foreign('scope_id').references('id').inTable(p('scope')).onDelete('cascade');
  });

  await knex(p('ro_scope')).insert({
    resource_owner_id: knex(p('resource_owner')).select('id').where({ username: 'username' }).first(),
    scope_id: knex(p('scope')).select('id').where({ name: 'prometheus' }).first(),
  });
};

exports.down = async knex => {
  await knex.schema.alterTable(p('ro_scope'), t => {
    t.dropForeign('resource_owner_id');
    t.dropForeign('scope_id');
  });

  await knex.schema.dropTable(p('oauth_client'));
  await knex.schema.dropTable(p('scope'));
  await knex.schema.dropTable(p('resource_owner'));
  await knex.schema.dropTable(p('ro_scope'));
};
