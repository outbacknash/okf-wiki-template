---
title: Refund eligibility
type: policy
description: When a refund can be issued and when it must be escalated to a human.
resource: https://help.example.com/refunds
timestamp: 2026-06-21T10:00:00+10:00
tags: [billing]
---

# Refund eligibility

## Rule
- Refunds may be issued within **30 days** of a charge for unused subscription
  time.
- The support bot may **auto-approve** refunds up to **$50**.
- Anything over $50, older than 30 days, or for an annual plan **must be escalated
  to a human** — do not auto-approve.

## Boundary for agents
This is a `policy` page: the bot applies the rule but never exceeds the
auto-approval limit. When in doubt, escalate.
