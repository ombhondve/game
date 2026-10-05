'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for contact submissions (cleared on restart)
const submissions = [];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------- Middleware ----------
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Input validation middleware
function validateContact(req, res, next) {
  const body = req.body || {};
  const errors = {};

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters.';
  }
  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    errors.email = 'A valid email address is required.';
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message = 'Message must be between 10 and 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid payload.',
      errors
    });
  }

  req.cleanBody = { name, email, message };
  next();
}

// ---------- Routes ----------
app.post('/api/contact', validateContact, (req, res) => {
  const entry = {
    id: submissions.length + 1,
    ...req.cleanBody,
    receivedAt: new Date().toISOString()
  };
  submissions.push(entry);
  console.log(`New contact submission #${entry.id} from ${entry.email}`);

  res.status(201).json({
    status: 'success',
    message: 'Thanks! Your message has been received.',
    id: entry.id
  });
});

// Helper endpoint for manual testing (lists stored submissions)
app.get('/api/contact', (req, res) => {
  res.json({ status: 'success', count: submissions.length, submissions });
});

// ---------- Error handling ----------
// Malformed JSON and other body-parser errors -> 400
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON payload.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', message: 'Payload too large.' });
  }
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
