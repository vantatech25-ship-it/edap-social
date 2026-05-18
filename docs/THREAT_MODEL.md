# Threat Model & Security: EDAP Social

## 1. System Boundaries & Data Assets
- **External Interfaces:** Web Client (Browser), Mobile Client (Future), 3rd Party OAuth.
- **Internal Interfaces:** API Gateway, WebSocket Server, Database, Cache, Object Storage.
- **Data Assets:** PII (Names, Emails, Biometrics/Health Data references), User Content (Posts, Messages), Authentication Credentials (Passwords, Tokens).

## 2. Threat Actors
- **Malicious Users:** Attempting to spam, harass, or exploit application logic.
- **Unauthenticated Attackers:** Attempting data scraping, credential stuffing, DDoS.
- **Insider Threats:** Compromised admin accounts.

## 3. OWASP Top 10 Risks & Mitigations

### A01: Broken Access Control
- **Mitigation:** Strict Role-Based Access Control (RBAC) middleware on all backend routes. Explicit ownership checks for edits/deletions (e.g., User A cannot delete User B's post).

### A02: Cryptographic Failures
- **Mitigation:** TLS 1.3 enforced for all transit. Argon2id for password hashing. Sensitive health/biometric markers encrypted at rest.

### A03: Injection (SQL/NoSQL)
- **Mitigation:** Use of an ORM/Query Builder (e.g., Prisma) with parameterized queries. Strict input validation using Zod/Joi.

### A04: Insecure Design
- **Mitigation:** Security integrated into early design. Rate limiting per IP and user account to prevent brute force and scraping.

### A05: Security Misconfiguration
- **Mitigation:** Automated CI/CD checks for exposed secrets. Principle of least privilege for database roles. Docker containers run as non-root.

### A07: Identification and Authentication Failures
- **Mitigation:** Short-lived access tokens (15 mins), HTTPOnly secure cookies for refresh tokens. Password strength policies.

### A08: Software and Data Integrity Failures
- **Mitigation:** Dependency scanning (e.g., `npm audit`, Snyk). Content Security Policy (CSP) to prevent loading unauthorized scripts.

## 4. POPIA (South Africa) Compliance
- **Consent:** Explicit opt-in for tracking and data usage during onboarding.
- **Data Subject Rights:** Automated endpoints for data export (`/api/users/me/export`) and right to be forgotten (`/api/users/me/delete`).
- **Audit Logging:** Immutable audit logs for all Admin/Moderator actions affecting user accounts.

## 5. Abuse & Moderation
- **File Uploads:** Strict MIME type validation, file size limits, and asynchronous virus scanning hook before moving to permanent storage.
- **Anti-Spam:** Velocity checks (e.g., max 10 posts/hour for new accounts), shadow-banning capabilities for automated bot behavior.
