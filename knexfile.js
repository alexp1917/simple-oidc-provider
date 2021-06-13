// Update with your config settings.
var config = require('./config');
var databaseNamePrefix = config.db && config.db.databaseNamePrefix || '';

var path = require('path');

module.exports = {

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    pool: {
      min: 1,
      max: 1,
    },
    useNullAsDefault: true,
    asyncStackTraces: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations'),
    }
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    asyncStackTraces: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations'),
    }
  },

  /*
   * CREATE USER 'soidc'@'localhost' IDENTIFIED WITH mysql_native_password BY 'soidc';
   * grant all on oidc_provider.* to 'soidc'@'localhost';
   */
  staging: {
    client: 'mysql',
    connection: {
      database: databaseNamePrefix + 'oidc_provider',
      user:     'soidc',
      password: 'soidc'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations'),
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: databaseNamePrefix + 'oidc_provider',
      user:     'soidc',
      password: 'soidc'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations'),
    }
  }

};