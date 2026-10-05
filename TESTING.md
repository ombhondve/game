# Testing Checklist

## Automated (API)
Run `npm test` – covers valid submit (201), invalid fields (400), malformed JSON (400), empty body (400), in-memory storage.

## Manual
- [ ] **Layout:** Open the page on desktop width and in DevTools mobile view (<= 700px); layout adapts, hamburger menu appears.
- [ ] **Navigation:** About / Skills / Projects / Contact links scroll to the right sections; mobile menu closes after click.
- [ ] **Validation (client):** Submit empty form -> an error appears under each field and focus moves to the first invalid field.
- [ ] **Validation (email):** Enter `abc` as email -> "valid email" error.
- [ ] **AJAX success:** Fill valid data -> green success message, form resets, no page reload.
- [ ] **Server error:** Stop the server and submit -> network error message is shown.
- [ ] **Server validation:** `curl -X POST localhost:3000/api/contact -H "Content-Type: application/json" -d '{bad'` -> HTTP 400.
- [ ] **Accessibility:** Tab through the page – skip link, nav, form fields in logical order with visible focus; labels read by a screen reader.
