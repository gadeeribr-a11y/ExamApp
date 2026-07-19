# Git workflow

1. Create a branch from `main`: `git switch -c feature/short-description`.
2. Keep each commit focused and descriptive, for example `feat: validate exam input`.
3. Run `npm run build` in `client` and `npm test` in `server` before opening a pull request.
4. Open a pull request, explain the change and test evidence, and request review.
5. Squash or rebase as agreed by the team, then merge only after CI passes.

Never commit `.env`, SQLite database files, or credentials.
