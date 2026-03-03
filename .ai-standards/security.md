# Security

## Input Validation

- Validate all user inputs on client AND server
- Use Zod or Yup for schema validation
- Sanitize data before rendering (React handles this by default)

## Authentication

- Store tokens securely (httpOnly cookies preferred)
- Implement proper logout (clear all tokens)
- Use short-lived access tokens + refresh tokens
- Never store sensitive data in localStorage

## XSS Prevention

- React escapes content by default
- Avoid `dangerouslySetInnerHTML` unless necessary
- Sanitize any user-provided HTML
- Be careful with URL parameters

## API Security

- Use HTTPS in production
- Implement CSRF protection
- Add rate limiting
- Never expose API keys in frontend code

## Dependencies

- Keep dependencies updated
- Run `npm audit` regularly
- Review dependencies before adding

## Secrets

- Never commit secrets to git
- Use environment variables (`.env` files)
- Add `.env*` to `.gitignore`
