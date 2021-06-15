// var url = new URL('http://localhost:5000/login/generic_oauth')

// console.log(url);
// console.log(url.searchParams.append('a', 'b'));
// console.log(url.toString());


var jsonwebtoken = require('jsonwebtoken');

var { generateKeyPair } = require('crypto');
/*generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    // cipher: 'aes-256-cbc',
    // passphrase: 'top secret'
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  jsonwebtoken.sign({payload:'payload'}, privateKey, { algorithm: 'RS256' }, function () {
    console.log(...arguments);

    var [ data, token ] = arguments;
    console.log('token is token');
    jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'], }, function() {
    // jsonwebtoken.verify(token, publicKey.substring(0, 100) + 'a' + publicKey.substring(101), { algorithms: ['RS256'], }, function() {

      console.log('returning');
      console.log(...arguments);
    })
  });
});*/

(async () => {
  var generateKeyPairAsync = require('util').promisify(generateKeyPair);
  var keyConfig = {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      // cipher: 'aes-256-cbc',
      // passphrase: 'top secret'
    }
  };
  var { publicKey, privateKey } = await generateKeyPairAsync('rsa', keyConfig);

  var token = await jsonwebtoken.sign({payload:'payload'}, privateKey, { algorithm: 'RS256' });
  var payload = await jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'], });
  console.log('returning', payload);

})();
