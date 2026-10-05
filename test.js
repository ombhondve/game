'use strict';
// Automated API checks (no extra dependencies). Run: npm test
const http = require('http');
const assert = require('assert');
const app = require('./server');

function request(port, method, path, body, raw) {
  return new Promise((resolve, reject) => {
    const payload = raw !== undefined ? raw : body ? JSON.stringify(body) : null;
    const req = http.request({ port, method, path, headers: { 'Content-Type': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  const port = server.address().port;
  let passed = 0;
  const check = (name, fn) => { fn(); passed++; console.log('  ok -', name); };

  let r = await request(port, 'POST', '/api/contact', { name: 'Rahul', email: 'rahul@example.com', message: 'Hello, this is a test message.' });
  check('valid payload -> 201', () => { assert.strictEqual(r.status, 201); assert.strictEqual(r.body.status, 'success'); });

  r = await request(port, 'POST', '/api/contact', { name: '', email: 'bad', message: 'x' });
  check('invalid fields -> 400 with errors', () => { assert.strictEqual(r.status, 400); assert.ok(r.body.errors.name && r.body.errors.email && r.body.errors.message); });

  r = await request(port, 'POST', '/api/contact', null, '{"name": "Rahul", ');
  check('malformed JSON -> 400', () => { assert.strictEqual(r.status, 400); assert.strictEqual(r.body.status, 'error'); });

  r = await request(port, 'POST', '/api/contact', null, '');
  check('empty body -> 400', () => assert.strictEqual(r.status, 400));

  r = await request(port, 'GET', '/api/contact');
  check('stored in memory (count = 1)', () => assert.strictEqual(r.body.count, 1));

  console.log(`\n${passed} checks passed`);
  server.close();
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
