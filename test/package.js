var { expect } = require('chai');
var tap = require('tap');

tap.test('the "simple-oidc-provider" package exists', t => {
  tap.test('should not fail to require simple-oidc-provider', t => {
    expect(() => require('../')).not.to.throw;
    expect(require('../')).to.be.ok;
    t.end();
  });

  t.end();
});
