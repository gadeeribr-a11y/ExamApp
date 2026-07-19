# Architecture

## Layers

- `client/src/pages` contains screen-level React components and interaction state.
- `client/src/components` contains reusable UI elements.
- `client/src/services/ApiService.js` is the single frontend boundary for HTTP requests.
- `server/server.js` exposes REST endpoints, authentication middleware, validation, and SQLite persistence.
- SQLite stores `users` and `exams`; questions and submissions are serialized JSON fields belonging to an exam.

## Request flow

`React page -> ApiService -> Express route -> authentication/role check -> validation -> SQLite -> JSON response`

Teacher routes require a signed JWT and the `teacher` role. Student submissions require the `student` role. The server, rather than the UI, enforces these rules.

## Security and validation

- Passwords are hashed with bcrypt; plaintext passwords are never persisted.
- JWTs expire after two hours and protect authenticated routes.
- Parameterized SQLite queries prevent SQL injection.
- Registration validates email format and password length.
- Exam create/update requests validate title, status, and question collection shape.
- Set `JWT_SECRET` through environment configuration in production.

## Database ownership

Every exam has an `ownerId`. Teachers receive only their own exams, so newly registered teachers start with an empty workspace. Students receive published exams only.
