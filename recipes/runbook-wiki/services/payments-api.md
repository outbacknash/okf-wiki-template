---
title: Payments API
type: service
description: Processes checkout payments and talks to the payment gateway.
resource: https://github.com/acme/payments-api
timestamp: 2026-06-21T10:00:00+10:00
owner: payments-squad
tier: 1
---

# Payments API

Tier-1 service that authorizes and captures checkout payments via the gateway.

## Operations
- Alert: [Payments p99 latency high](../alerts/payments-p99-latency.md)
- Runbook: [Payments API high latency](../runbooks/payments-high-latency.md)
- Dashboard: see `resource`.

## Dependencies
- Payment gateway (third party), primary Postgres, Redis cache.
