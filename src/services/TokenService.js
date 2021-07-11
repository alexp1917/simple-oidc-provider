var crypto = require('crypto');
var util = require('util');

function TokenService(logger, config) {
  this.logger = logger;
  this.config = config;

  if (!TokenService.validateConfig(config)) {
    this.logger.debug("invalid config");
    throw new Error("Couldn't validate config " + util.format(config));
  }

  this.logger.debug('created TokenService', config);
}

var validModes = new Map([
  ['hmac', true],
  ['rsa', true],
]);

var cryptoGenerateKeyPair = util.promisify(crypto.generateKeyPair);

TokenService.generateKeyPair = async function (modulusLength) {
  return await cryptoGenerateKeyPair('rsa', {
    modulusLength,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      // cipher: 'aes-256-cbc',
      // passphrase: 'top secret'
    },
  });
}

TokenService.validateConfig = function (config) {
  if (!config)
    return false;

  if (typeof config.mode !== 'string') {
    return false;
  }

  config.mode = config.mode.toLowerCase();

  if (!validModes.has(config.mode)) {
    return false;
  }

  if (config.mode === 'rsa') {
    if (!config.rsa) {
      return false;
    }

    if (!(config.rsa.publicKey && config.rsa.privateKey)) {
      return false;
    }
  }

  if (config.mode === 'hmac') {
    if (!(config.secret)) {
      return false;
    }
  }

  return true;
}

module.exports = TokenService;
