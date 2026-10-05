'use strict';

(function () {
  // ----- Footer year -----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ----- Responsive navigation -----
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const navLinks = nav.querySelectorAll('a');

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Smooth scroll (with JS fallback) and close mobile menu after click
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight active section link while scrolling
  const sections = Array.from(navLinks).map((l) => document.querySelector(l.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => s && observer.observe(s));
  }

  // ----- Contact form -----
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate(values) {
    const errors = {};
    if (values.name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
    if (!EMAIL_REGEX.test(values.email)) errors.email = 'Please enter a valid email address.';
    if (values.message.length < 10) errors.message = 'Message must be at least 10 characters.';
    return errors;
  }

  function showErrors(errors) {
    Object.keys(fields).forEach((key) => {
      const errEl = document.getElementById(key + 'Error');
      errEl.textContent = errors[key] || '';
      fields[key].classList.toggle('invalid', Boolean(errors[key]));
      fields[key].setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
    });
  }

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = 'status' + (type ? ' ' + type : '');
  }

  // Clear a field's error as the user fixes it
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener('input', () => {
      document.getElementById(key + 'Error').textContent = '';
      fields[key].classList.remove('invalid');
      fields[key].removeAttribute('aria-invalid');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');

    const values = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim()
    };

    const errors = validate(values);
    showErrors(errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      fields[firstInvalid].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus(data.message || 'Message sent successfully!', 'success');
        form.reset();
      } else {
        if (data.errors) showErrors(data.errors);
        setStatus(data.message || 'Something went wrong. Please try again.', 'error-msg');
      }
    } catch (err) {
      setStatus('Network error. Please check your connection and try again.', 'error-msg');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
})();
