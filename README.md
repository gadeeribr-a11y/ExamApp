# ExamApp

ExamApp is a professional exam management platform with a teacher dashboard, student participation flow, draft auto-save, notification feedback, analytics, and cloud deployment readiness.

## Key capabilities
- Teacher and student role flow
- Exam creation, editing, status changes, and access-code generation
- Auto-save for exam drafts and question editing
- Real-time in-app feedback through toast notifications
- Teacher analytics overview for exam counts and average scores
- Docker support for containerized deployment
- Node/Express API serving the built frontend from a single process

## Engineering evidence

- [Architecture and security design](ARCHITECTURE.md)
- [Git workflow and contribution guide](CONTRIBUTING.md)
- GitHub Actions CI builds the client and runs server checks on every push and pull request.

## Local development
1. Install client dependencies:
   - `cd client`
   - `npm install`
2. Build the frontend:
   - `npm run build`
3. Install server dependencies and start the app:
   - `cd ../server`
   - `npm install`
   - `npm start`

The app will be available at `http://127.0.0.1:5000`.

## Deployment
- Render configuration is available in [render.yaml](render.yaml).
- Docker support is available through [Dockerfile](Dockerfile).
- Set a secure `JWT_SECRET` value in production environments.
- Copy `.env.example` to `.env` locally and set a unique `JWT_SECRET` before deployment.
