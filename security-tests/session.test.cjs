const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');
test('production requires a strong deployment secret', () => {
  assert.throws(() => load('configs/session.config.js', {}, { process: { env: { NODE_ENV: 'production' } } }), /SESSION_SECRET/);
  assert.throws(() => load('configs/session.config.js', {}, { process: { env: { NODE_ENV: 'production', SECRET: 'weak' } } }), /SESSION_SECRET/);
  const config = load('configs/session.config.js', {}, { process: { env: { NODE_ENV: 'production', SESSION_SECRET: 's'.repeat(40) } } });
  assert.equal(config.cookie.secure, true); assert.equal(config.cookie.sameSite, 'lax'); assert.equal(config.saveUninitialized, false);
});
