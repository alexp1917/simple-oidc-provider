function OAuth2Controller(logger, tokenService) {
  this.logger = logger;
}

OAuth2Controller.prototype.get = function(req, res, next) {
  res.send('hello world from OAuth2Controller');
};

module.exports = OAuth2Controller;
