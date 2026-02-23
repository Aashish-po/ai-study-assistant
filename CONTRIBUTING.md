# Contributing to AI Study Assistant

Thanks for your interest in contributing.

## Development setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Start the app and server:

   ```bash
   npm run dev
   ```

## Branch and commit workflow

- Create a feature branch from `main`.
- Keep PRs focused and reasonably small.
- Write clear commit messages in imperative mood.

## Code quality expectations

Run the following before opening a pull request:

```bash
npm run lint
npm run check
npm run test
```

## Pull request checklist

- [ ] Code builds and tests pass locally
- [ ] New behavior is documented in `README.md` when needed
- [ ] Environment changes are reflected in `.env.example`
- [ ] No secrets are committed

## Reporting issues

When filing a bug, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Logs/errors/screenshots if possible

## Feature requests

For new features, please describe:

- The user problem
- The proposed solution
- Any UI or API impact
