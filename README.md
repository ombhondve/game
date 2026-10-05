# Personal Portfolio with Contact Form

A single page personal portfolio for **Rahul Deshmukh** with a contact form backed by a minimal Node.js/Express API.

**Stack:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript, Node.js, Express

## Features
- Semantic, accessible single page layout: About, Skills, Projects gallery, Contact
- Responsive navigation menu with smooth scrolling (hamburger menu on mobile)
- Client side validation for name, email and message
- AJAX submission (`fetch`) to `/api/contact` with success / error messages
- Express backend with validation middleware, in-memory storage and proper error codes (400 for invalid payload)

## Project Structure
```
portfolio-contact/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── test.js
├── package.json
├── TESTING.md
└── README.md
```

## Setup
Requirements: Node.js 18+ and npm.

```bash
npm install
npm start          # http://localhost:3000
npm run dev        # live reload with nodemon
npm test           # automated API checks
```
Set a custom port with `PORT=4000 npm start`.

## API Documentation

### `POST /api/contact`
Validates and stores a contact submission in memory.

**Request body (JSON)**
| Field   | Type   | Rules                     |
|---------|--------|---------------------------|
| name    | string | 2 - 100 characters        |
| email   | string | valid email address       |
| message | string | 10 - 2000 characters      |

**Success – `201 Created`**
```json
{ "status": "success", "message": "Thanks! Your message has been received.", "id": 1 }
```

**Invalid payload – `400 Bad Request`**
```json
{ "status": "error", "message": "Invalid payload.", "errors": { "email": "A valid email address is required." } }
```
Malformed JSON also returns `400` with `{ "status": "error", "message": "Malformed JSON payload." }`.

**Example**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul","email":"rahul@example.com","message":"Hello from curl!"}'
```

### `GET /api/contact`
Helper endpoint that lists submissions stored since the server started (for testing only; remove or protect it in production).

## Notes
- Submissions are stored **in memory** and are lost when the server restarts.
- See `TESTING.md` for the testing checklist.

## Suggested Git Workflow
```bash
git init
git add . && git commit -m "chore: initialize project"
```
Commit in logical steps: setup, HTML structure, CSS styling, JS validation, Express route, README/tests.
