var crypto = require('crypto');
var util = require('util');
var jsonwebtoken = require('jsonwebtoken');

var cryptoGenerateKeyPair = util.promisify(crypto.generateKeyPair);
var jwtVerifyPromisified = util.promisify(jsonwebtoken.verify);
var jwtSignPromisified = util.promisify(jsonwebtoken.sign);

function TokenService(logger, config) {
  this.logger = logger;
  this.config = config;

  if (!TokenService.validateConfig(config)) {
    this.logger.debug("invalid config");
    throw new Error("Couldn't validate config " + util.format(config));
  }

  this.logger.debug('created TokenService', config);
}

TokenService.prototype.parse = async function(token, clientInfo) {
  var {
    mode,
    secretOrPublicKey,
  } = this.config;

  var {
    algorithms,
  } = validModes.get(mode);

  var options = {
    algorithms,
    audience: [clientInfo.clientId],
    // complete: false,
    // candidate for tenant?
    issuer: ['TokenService'],
    // jwtid: null, (dont have this)
    // subject: [/* what goes here? */],
    // ignoreExpiration: false
  };

  return await jwtVerifyPromisified(token, secretOrPublicKey, options);
};

TokenService.prototype.stringify = async function(payload, clientInfo) {
  var {
    mode,
    secretOrPublicKey,
  } = this.config;

  var {
    algorithm,
  } = validModes.get(mode);

  var specialClaims = {
    expiresIn: clientInfo.expiresIn,
    audience: clientInfo.clientId,
    issuer: 'TokenService',
  };

  // for (var prop in specialClaims) {
  //   if (!specialClaims[prop]) {
  //     delete specialClaims[prop];
  //   }
  // }

  if (!TokenService.counter)
    TokenService.counter = 0;

  // https://github.com/auth0
  // /node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
  var options = {
    algorithm,
    ...specialClaims,

    // brick number
    // goes into payload as 'jti'
    jwtid: String(TokenService.counter++),

    // subject: '', /* what goes here? */
    // noTimestamp: false,
    // header: {},
    // which key was used (only one is allowed so far)
    // goes into header as 'kid'
    keyid: '1',
  };

  return await jwtSignPromisified(payload, secretOrPublicKey, options);
};

TokenService.prototype.verify = TokenService.prototype.parse;

TokenService.prototype.token = TokenService.prototype.stringify;

var validModes = new Map([
  ['hmac', {
    algorithm: 'HS512',
    algorithms: [
      'HS256',
      'HS384',
      'HS512',
    ],
  }],
  ['rsa', {
    algorithm: 'RS512',
    algorithms: [
      'RS384',
      'RS512',
    ],
  }],
]);

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
