var crypto = require('crypto');
var util = require('util');
var jsonwebtoken = require('jsonwebtoken');

function TokenService(logger, config) {
  this.logger = logger;
  this.config = config;

  if (!TokenService.validateConfig(config)) {
    this.logger.debug("invalid config");
    throw new Error("Couldn't validate config " + util.format(config));
  }

  this.logger.debug('created TokenService', config);
}

TokenService.prototype.parse = async function(token) {
};

TokenService.prototype.stringify = async function(token) {
};

TokenService.prototype.verify = TokenService.prototype.parse;

TokenService.prototype.token = TokenService.prototype.stringify;

var validModes = new Map([
  ['hmac', {
    algorithms: [
      'HS256',
      'HS384',
      'HS512',
    ],
  }],
  ['rsa', {
    algorithms: [
      'RS384',
      'RS512',
    ],
  }],
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
    } else {
      config.secretOrPublicKey = config.rsa.privateKey;
    }
  }

  if (config.mode === 'hmac') {
    if (!config.hmac) {
      return false;
    }

    if (!(config.hmac.secret)) {
      return false;
    } else {
      config.secretOrPublicKey = config.hmac.secret;
    }
  }

  return true;
}

module.exports = TokenService;
