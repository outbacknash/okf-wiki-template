---
title: Reset your password
type: article
description: How to reset your password when you are locked out or forgot it.
resource: https://help.example.com/reset-password
timestamp: 2026-06-21T10:00:00+10:00
tags: [auth, account]
---

# Reset your password

## Symptom
"I forgot my password" / "I can't log in and need to reset it."

## Resolution
1. Go to the sign-in page and choose **Forgot password**.
2. Enter your account email and submit.
3. Open the reset email (check spam) and click the link within 30 minutes.
4. Set a new password (12+ characters).

## If it doesn't work
- No email after 5 minutes → see [Stuck in a login
  loop](../troubleshooting/login-loop.md).
- SSO users cannot reset a password here; sign-in is governed by your identity
  provider. If sessions keep dropping, see [SSO sessions time out after 1
  hour](../known-issues/sso-timeout.md).
