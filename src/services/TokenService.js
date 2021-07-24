var jsonwebtoken = require('jsonwebtoken');

function TokenService(logger, db) {
  this.logger = logger;
  this.db = db;
}

var signOptions = {
  algorithm: /*'RS512'*/'HS256',
};

var verifyOptions = {
  algorithms: [/*'RS512'*/'HS256'],
};

TokenService.prototype.token = async function(info) {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(info, 'secret', signOptions, (err, token) => err ? reject(err) : resolve(token));
  });
};

TokenService.prototype.verifyToken = function(payload) {
  return new Promise(resolve => {
    jsonwebtoken.verify(payload, 'secret', verifyOptions, (err, token) => err ? resolve(false): resolve(token));
  })
};


module.exports = TokenService;
