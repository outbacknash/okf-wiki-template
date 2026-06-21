---
title: Stuck in a login loop
type: troubleshooting
description: Diagnose when sign-in keeps redirecting back to the login page.
resource: https://help.example.com/login-loop
timestamp: 2026-06-21T10:00:00+10:00
tags: [auth, sso]
---

# Stuck in a login loop

## Symptom
After entering credentials, the app returns to the login page instead of signing
in.

## Diagnose
1. **Third-party cookies blocked?** Ask the user to allow cookies for the app
   domain, then retry. Resolves most cases.
2. **Using SSO?** If sessions drop after about an hour, this is a known issue —
   see [SSO sessions time out after 1 hour](../known-issues/sso-timeout.md).
3. **Wrong password (not SSO)?** Send [Reset your
   password](../articles/reset-password.md).
4. Still looping → collect the browser/OS and escalate to the squad.
