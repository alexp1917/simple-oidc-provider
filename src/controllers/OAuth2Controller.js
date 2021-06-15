var jsonwebtoken = require('jsonwebtoken');

function OAuth2Controller(logger, db, tokenService) {
  this.logger = logger;
  this.db = db; // todo use tokenService
}

OAuth2Controller.prototype.get = function(req, res, next) {
  res.send('hello world from OAuth2Controller');
};

OAuth2Controller.prototype.token = async function(req, res, next) {
  this.logger.log('hello from token route');
  this.logger.log(req.originalUrl);
  this.logger.log(req.method);
  this.logger.log(req.query);
  this.logger.log(req.body);

  var {
    code,
    grant_type,
    redirect_uri,
  } = req.body;

  // e.g. 'code',
  // e.g. 'authorization_code',
  // e.g. 'http://localhost:5000/login/generic_oauth

  var options = {
    algorithm: 'RS512',
  };

  var url = new URL(redirect_uri);
  url.searchParams.append('token', jsonwebtoken.sign(payload, 'secret', options, ))
  res.redirect(url.toString());

};

OAuth2Controller.prototype.authorize = async function(req, res, next) {
  this.logger.log('hello from authorize route');
  this.logger.log(req.originalUrl);
  this.logger.log(req.method);
  this.logger.log(req.headers);
  this.logger.log(req.query);
  this.logger.log(req.body);

  var {
    access_type,
    client_id,
    redirect_uri,
    // grant tpe
    response_type,
    // https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html
    // response_mode,
    scope,
    state,
  } = req.query;

  var url = new URL(redirect_uri);
  url.searchParams.append('state', state);
  url.searchParams.append('code', 'code');

  res.redirect(url.toString());
  // res.send(404, 'its hard sometimes');

  // eg
  // access_type=online
  // client_id=def1234567890
  // redirect_uri=http://localhost:5000/login/generic_oauth
  // response_type=code
  // scope=grafana
  // state=7ds5PDHBmqIp-ZA0eOne9bFtHxkxDbXkF7h3sOuxx6Q=
};

module.exports = OAuth2Controller;
