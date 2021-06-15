/**
 * inversion of control module
 */
var config = require('../config');
var logging = require('./logging');
var makeDb = require('./makeDb');
var app = require('./app');
var repositories = require('./repositories');
var services = require('./services');
var controllers = require('./controllers');

var {
  makeApp,
} = app;

module.exports.config = config;
module.exports.logger = new logging.Logger();

module.exports.db = makeDb();

module.exports.oAuth2Controller = new controllers.OAuth2Controller(
  module.exports.logger,
  module.exports.db,
);

module.exports.app = makeApp(module.exports.logger, module.exports, config);

module.exports.refresh = async function refresh() {
  await makeDb.migrateLatest(module.exports.db);
};

module.exports.shutdown = async function shutdown() {
  await module.exports.db.destroy();
};
