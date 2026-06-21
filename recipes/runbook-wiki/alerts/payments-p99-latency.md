---
title: Payments p99 latency high
type: alert
description: Fires when Payments API p99 request latency exceeds 800ms for 5 min.
timestamp: 2026-06-21T10:00:00+10:00
severity: high
service: ../services/payments-api.md
---

# Payments p99 latency high

## Condition
p99 latency on the [Payments API](../services/payments-api.md) > 800ms for 5
minutes.

## Respond
Follow the runbook: [Payments API high
latency](../runbooks/payments-high-latency.md).
