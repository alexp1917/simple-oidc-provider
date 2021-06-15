var cookieParser = require('cookie-parser');
var express = require('express');
require('express-async-errors');
var exphbs  = require('express-handlebars');
var createError = require('http-errors');
var morgan = require('morgan');

var path = require('path');
var status = 'error';

var layoutsDir = path.join(__dirname, 'views');
var expressHandlebarsConfig = {
  extname: '.hbs',
  defaultLayout: 'index',
  layoutsDir,
};

function makeApp(logger, controllers, config) {
  var {
    baseUrl,
  } = config;

  var {
    oAuth2Controller,
  } = controllers;

  var app = express();

  app.locals.title = 'Simple OIDC Provider';
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.set('view engine', '.hbs');
  app.set('views', layoutsDir);
  app.engine('.hbs', exphbs(expressHandlebarsConfig));


  app.get(baseUrl + '/', (r, s, n) => s.render('index'));
  app.get(baseUrl + '/it-works', (r, s, n) => s.send('<h1>It Works!</h1>'));
  app.get(baseUrl + '/authorize', (r, s, n) => oAuth2Controller.authorize(r, s, n));
  app.get(baseUrl + '/oauth2', (r, s, n) => oAuth2Controller.get(r, s, n));
  app.use(baseUrl + '/oauth2/token', (r, s, n) => oAuth2Controller.token(r, s, n));

  app.use((req, res, next) => {

    logger.log('hello from no route');
    logger.log(req.originalUrl);
    logger.log(req.method);
    logger.log(req.query);
    logger.log(req.body);
    next();
  });

  app.use(function(req, res, next) {
    next(createError(404));
  });

  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({
      status,
      ...res.locals
    });
  });

  return app;
}

module.exports = {
  makeApp,
};
