# Git Workflow

## Branch Naming

- `feature/TICKET-123-user-authentication`
- `fix/TICKET-456-login-redirect`
- `hotfix/critical-security-patch`
- `refactor/user-store-cleanup`

## Commit Messages

```
type(scope): subject

body (optional)

footer (optional)
```

Examples:
```
feat(auth): add login with Google OAuth
fix(ui): resolve button alignment on mobile
refactor(stores): separate UserStore into UserStore and UserPreferencesStore
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `hotfix`

## Pull Request Process

1. Create feature branch from `main`
2. Make changes with atomic commits
3. Push and open PR with description
4. Request review
5. Address feedback
6. Squash and merge

## Code Review Guidelines

- Review within 24 hours
- Be constructive, not critical
- Suggest fixes, don't just point out problems
- Approve when ready, not when perfect

## Protected Branches

- `main` — requires PR, approvals
- Never push directly to main
