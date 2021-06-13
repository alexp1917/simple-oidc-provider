var config = require('../config');
var tablePrefix = config.db && config.db.tablePrefix || '';

exports.up = async knex => {
  await knex.schema.createTable(tablePrefix + 'users', t => {
    t.increments();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable(tablePrefix + 'users');
};
