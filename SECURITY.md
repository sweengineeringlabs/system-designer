# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email your findings to: security@adentic.dev
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Initial Assessment**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- We will coordinate disclosure with you
- Credit will be given to reporters (unless anonymity is requested)
- We follow responsible disclosure practices

## Security Best Practices

When using System Designer:

1. **Environment Variables**: Never commit `.env` files with secrets
2. **API Keys**: Use environment variables for all API credentials
3. **CORS**: Configure allowed origins appropriately for production
4. **Rate Limiting**: Keep rate limiting enabled in production

## Known Security Considerations

- The application processes user input for AI system design
- All inputs are validated on both client and server side
- No sensitive data is stored persistently by default
