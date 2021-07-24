function OAuth2Controller(logger, tokenService, db) {
  this.logger = logger;
  this.db = db; // todo use tokenService
  this.tokenService = tokenService;
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

  var token = await this.tokenService.token({
    username: 'abc',
    email: 'some@localhost',
    name: 'ABC def',
    // 'email:primary': 'some@example.localhost',
  });
  console.log(token)

  var url = new URL(redirect_uri);
  url.searchParams.append('token', token);
  // res.redirect(url.toString());

  res.send({
    access_token: token,
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: undefined,
    scope: 'grafana',
  });
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

OAuth2Controller.prototype.grafanaInfo = async function(req, res, next) {
  var token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('token', token);

  var payload = await this.tokenService.verifyToken(token);
  console.log('payload', payload);

  res.send(payload);
};

module.exports = OAuth2Controller;
