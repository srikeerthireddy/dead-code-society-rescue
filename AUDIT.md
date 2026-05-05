# Codebase Audit: LogiTrack Backend

**Date:** May 5, 2026  
**Auditor:** Emergency Code Rescue Team  
**Severity Assessment:** CRITICAL - Multiple security vulnerabilities present

---

## Summary

- **Total code smells tagged:** 18 unique issues
- **CRITICAL:** 5 issues
- **HIGH:** 6 issues
- **MEDIUM:** 7 issues

**Assessment:** This codebase is **NOT production-ready** and poses immediate security risks. Critical vulnerabilities must be fixed before any deployment.

---

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a cryptographic password hashing algorithm. A rainbow table can crack any MD5 hash in under a second. All passwords are immediately compromised. |
| src/routes.js | NoSQL injection via spread operator (register) | CRITICAL | Using `{...req.body}` directly allows attackers to inject MongoDB operators like `{"$ne": null}` to bypass authentication or manipulate data. |
| src/routes.js | NoSQL injection via query parameters (login) | CRITICAL | Email parameter not sanitized. Attacker can pass `{"$ne": null}` as email to bypass password checks. |
| src/routes.js | Missing authorization check on DELETE | CRITICAL | `/delete/:id` endpoint has no permission check. Any authenticated user can delete any shipment belonging to anyone. |
| src/routes.js | MD5 password comparison | CRITICAL | Using `===` for password comparison is not timing-safe and relies on broken MD5 hashing. Should use bcrypt.compare(). |
| src/routes.js | Inline authentication logic duplicated | HIGH | Auth token verification is copied inline in 5 routes. Duplicating security logic leads to bugs if one instance is missed when fixing vulnerabilities. |
| src/routes.js | N+1 query problem | HIGH | Loop fetches user details for each shipment. For 100 shipments, this causes 101 database queries instead of 1. Scales poorly. |
| src/routes.js | Missing .catch() on promise (shipments loop) | HIGH | Nested `User.findById()` has no error handler. If database fails, request hangs silently. |
| src/routes.js | Missing .catch() on promise (/profile) | HIGH | `User.findById()` promise has no `.catch()`. Database errors will crash silently and hang the response. |
| src/routes.js | No input validation | HIGH | POST /register and POST /shipments accept any input without schema validation. Attackers can send malformed or malicious data. |
| src/app.js | No centralized error handler | HIGH | No global error middleware. Errors in routes will crash the process or hang responses. 404 errors not handled. |
| src/routes.js | Using `var` throughout | MEDIUM | Variable hoisting with `var` causes scope confusion and hard-to-debug bugs. Should use `const`/`let`. |
| src/app.js | Using `var` throughout | MEDIUM | Same as above. |
| models/User.js | Using `var` throughout | MEDIUM | Same as above. |
| models/Shipment.js | Using `var` throughout | MEDIUM | Same as above. |
| src/app.js | Promise chains with function syntax | MEDIUM | Using `.then().catch()` with function callbacks instead of async/await. Makes code harder to read and debug. |
| src/routes.js | Unused imports | MEDIUM | path, fs, http, and os are imported but not used in the route setup. Wastes resources and adds confusion. |
| src/routes.js | Dead code (commented endpoints) | MEDIUM | Commented-out routes like `/all-users` and `/test-hash` left in production code. Adds maintenance burden. |
| src/routes.js | Useless padding loop | MEDIUM | Loop that runs 200 times but does nothing. Wastes CPU and suggests developer was gaming line count. |
| src/routes.js | TODOs left unfixed | MEDIUM | Comments like "TODO: fix N+1 later" indicate known issues were deprioritized. These issues ARE CRITICAL. |
| src/routes.js | Magic string for status | MEDIUM | Status values like 'pending', 'in-progress', 'delivered' are hardcoded strings. Should be constants or enum. |
| src/routes.js, src/app.js | Inconsistent HTTP status codes | MEDIUM | All responses use 200 or `.json()` format. Should use proper 201 for creation, 401 for unauthorized, 404 for not found, etc. |
| .env.example | Environment variables undocumented | MEDIUM | JWT_SECRET comment doesn't explain what it should be. DATABASE_URL format not specified. No description of required vs optional vars. |

---

## Risk Analysis

### Immediate Security Threats

1. **Password Breach:** All user passwords stored as MD5 hashes are immediately crackable. User accounts are compromised on day 1.
2. **Authentication Bypass:** NoSQL injection in login endpoint allows attackers to log in as any user without knowing password.
3. **Data Access Violation:** Any authenticated user can delete or modify shipments belonging to other users.
4. **Data Integrity:** No input validation allows injection attacks and malformed data in database.

### Operational Risks

1. **Silent Failures:** Missing error handlers cause requests to hang when database fails.
2. **Performance Degradation:** N+1 queries will cause 100-1000x slowdown as database grows.
3. **Difficult Debugging:** Callback nesting and promise chains make errors hard to trace.
4. **Maintenance Burden:** Duplicated auth logic and dead code increase chance of future bugs.

---

## Remediation Roadmap

This audit tags all issues with `// SMELL:` comments in the code. The next steps are:

1. ✅ **Complete:** Tag all code smells (this file)
2. **Restructure into MVC** – Move routes logic into controllers/services
3. **Replace var with const/let** – Fix variable scope issues
4. **Add Joi validation** – Validate all inputs before database calls
5. **Replace MD5 with bcrypt** – Use proper password hashing
6. **Add centralized error handling** – Create error middleware
7. **Fix N+1 queries** – Use `.populate()` to fetch relationships in one query
8. **Add JSDoc** – Document every function
9. **Write README and CHANGELOG** – Enable cold setup and track decisions

---

## Files Affected

- `src/routes.js` – 14 issues (main problem file)
- `src/app.js` – 5 issues
- `models/User.js` – 1 issue
- `models/Shipment.js` – 1 issue

---

## Next Steps

1. Begin **Step 2: Restructure into MVC architecture**
2. Follow the step-by-step guide to fix each severity level in order
3. Test each step before moving forward
4. Commit after each step with descriptive messages

**Timeline:** All fixes should be completed by end of business day, May 5, 2026.
