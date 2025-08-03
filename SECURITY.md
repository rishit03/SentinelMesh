# Security Policy

## Supported Versions

We take security seriously at SentinelMesh. The following versions of SentinelMesh are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in SentinelMesh, please report it responsibly. We appreciate your efforts to improve the security of our project.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing us at:
**security@sentinelmesh.dev** (or create a private issue if this email is not available)

### What to Include

When reporting a vulnerability, please include the following information:

1. **Description**: A clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Your assessment of the potential impact
4. **Affected Components**: Which parts of SentinelMesh are affected
5. **Suggested Fix**: If you have ideas for how to fix the issue (optional)
6. **Your Contact Information**: So we can follow up with questions

### Response Timeline

We will acknowledge receipt of your vulnerability report within **48 hours** and will send a more detailed response within **7 days** indicating the next steps in handling your report.

After the initial reply to your report, we will:

- Confirm the problem and determine the affected versions
- Audit code to find any potential similar problems
- Prepare fixes for all supported versions
- Release security patches as soon as possible

### Disclosure Policy

We follow a **coordinated disclosure** approach:

1. **Investigation**: We investigate and develop a fix
2. **Coordination**: We coordinate with you on the disclosure timeline
3. **Release**: We release the security patch
4. **Public Disclosure**: We publicly disclose the vulnerability details after the patch is available

Typically, we aim to release security patches within **30 days** of receiving a report, though complex issues may take longer.

### Security Best Practices

When using SentinelMesh, we recommend:

1. **Keep Updated**: Always use the latest version of SentinelMesh
2. **Secure Configuration**: Follow security best practices in your deployment
3. **Network Security**: Implement proper network security measures
4. **Access Control**: Use strong authentication and authorization
5. **Monitoring**: Monitor your SentinelMesh deployment for suspicious activity

### Security Features

SentinelMesh includes several security features:

- **Token-based Authentication**: Secure API access with tokens
- **CORS Protection**: Cross-origin request protection
- **Input Validation**: Comprehensive input validation using Pydantic
- **SQL Injection Protection**: Parameterized queries and ORM usage
- **Rate Limiting**: (Planned) API rate limiting to prevent abuse

### Vulnerability Disclosure History

We will maintain a record of disclosed vulnerabilities here:

*No vulnerabilities have been disclosed yet.*

### Security Contact

For security-related questions or concerns, please contact:
- **Email**: security@sentinelmesh.dev
- **GitHub**: Create a private security advisory

### Bug Bounty Program

We currently do not have a formal bug bounty program, but we deeply appreciate security researchers who help improve SentinelMesh's security. We will acknowledge your contribution in our security advisories and release notes.

---

Thank you for helping keep SentinelMesh and our users safe!

