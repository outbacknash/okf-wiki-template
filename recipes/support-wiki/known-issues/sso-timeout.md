---
title: SSO sessions time out after 1 hour
type: known-issue
description: SSO users are signed out after ~60 minutes due to a token-refresh bug.
resource: https://status.example.com/issues/SSO-1422
timestamp: 2026-06-21T10:00:00+10:00
status: open
tags: [auth, sso]
---

# SSO sessions time out after 1 hour

## Status
**Open** — tracked as SSO-1422. Fix targeted for the next release.

## Impact
SSO users are unexpectedly signed out after ~60 minutes because the session token
is not refreshed.

## Workaround
Sign in again; for long sessions, ask the user's IdP admin to extend the SAML
session lifetime. Related path: [Stuck in a login
loop](../troubleshooting/login-loop.md).
