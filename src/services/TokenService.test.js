var { expect } = require('chai');
var tap = require('tap');

var TokenService = require('./TokenService.js')

var { Logger } = require('../logging');

tap.test('TokenService.test.js', t => {
  tap.test('TokenService.generateKeyPair', t => {
    TokenService.generateKeyPair(512);
    t.end();
  });

  var rsaTokenServiceCfg = { mode: 'rsa', rsa: getTestKeyPair(), };
  var rsaTokenService = new TokenService(new Logger(), rsaTokenServiceCfg);
  var hmacTokenServiceCfg = { mode: 'hmac', hmac: { secret: 'secret', } };
  var hmacTokenService = new TokenService(new Logger(), hmacTokenServiceCfg);

  tap.test('TokenService#parse', t => {

    t.end();
  });

  tap.test('TokenService#stringify', t => {
    t.end();
  });

  tap.test('TokenService#verify', t => {
    t.ok(TokenService.prototype.verify === TokenService.prototype.parse);
    t.end();
  });

  tap.test('TokenService#token', t => {
    t.ok(TokenService.prototype.token === TokenService.prototype.stringify);
    t.end();
  });

  tap.test('TokenService.validateConfig', t => {
    var goodRsa = {
      mode: 'rsa',
      rsa: getTestKeyPair(),
    };
    var badRsa = { mode: 'rsa', };
    var goodHmac = {
      mode: 'hmac',
      hmac: {
        secret: 'secret',
      },
    };
    var badHmac = { mode: 'hmac', };

    t.ok(TokenService.validateConfig(goodRsa));
    t.ok(!TokenService.validateConfig(badRsa));
    t.ok(TokenService.validateConfig(goodHmac));
    t.ok(!TokenService.validateConfig(badHmac));

    t.ok(!TokenService.validateConfig(false));
    t.ok(!TokenService.validateConfig({ mode: () => {}, }));
    t.ok(!TokenService.validateConfig({ mode: 'ecdsa', }));
    t.ok(!TokenService.validateConfig({ mode: 'rsa', rsa: {}, }));
    t.ok(!TokenService.validateConfig({ mode: 'hmac', hmac: {}, }));
    t.end();
  });

  tap.test('TokenService::constructor', t => {
    var ts = new TokenService(new Logger(), {
      mode: 'hmac',
      hmac: {
        secret: 'secret',
      },
    });

    t.throws(() => new TokenService(new Logger(), false));

    t.end();
  });

  t.end();
});

function getTestKeyPair() {
  return {
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
      'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqv++Tl0B9PYUsWhLjYtH\n' +
      'UfiNR53Ra793++4zFrc9BlUIOjT4MW67/dHeSmBnDAvnPb2+G/JAz/vOCwboP8fc\n' +
      'uwJ2QqbxfzSHm0QfeoUjW68hNP14Tf3r4dRkxcSl+bkx6SDbbEzoFaYCFiuXY3AI\n' +
      'e6ttdPpQIrmtoxxx1JHIMWtoI+hsvyp7mnco5UVNPidP2IjTWrbdbXOkwl8VK4bq\n' +
      '8Jn6VEZKKKviX0zc1544doMUW+7/PaLWH9xZFdgMh6d5uK/PtkUW4OptkmuLkDSJ\n' +
      'Cn/dsBe0UWDZuSqmwcgHYQW3R17CDrd1zPeZE3llj+h5YmrZ6YLwurxEGZTD1S6y\n' +
      '8cJHEc21A+qdr3i8yo1dkym9TAIlEzEnF/LpnlOhy0ci1pq4AfQU2fzHsKDu6yuw\n' +
      'UK/zjK025upshO8dAysZDFte/AJzOwof7IeyVAVLCZ3nq76ayzhS5kFPLTD1Bh9q\n' +
      'sYeCnFwDCIqCgH3kh70vCNTvixBC30mzbGvtu/7xonL3wl//qN55OXRvb5kSbNC1\n' +
      'bmGvpUO8vGzANi5YrvmlOjcWWdVnNdGzMC2v40xMFDihh24LEGkI2dbSE5/BBmdb\n' +
      '2D2clhjhStzdhPWVkNEdGZ650Yhx/ZJ9ztuX30dTKqh+UT0Tc4pXBEFpXi3PrmSr\n' +
      'F3pwFTYNzt5RnFrSHr9P0S0CAwEAAQ==\n' +
      '-----END PUBLIC KEY-----\n',
    privateKey: '-----BEGIN PRIVATE KEY-----\n' +
      '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\n' +
      'Ju4cImVHOH3yj33F0kqYIiY3kjQRKNnm\n' +
      '-----END PRIVATE KEY-----\n'
  };
}
