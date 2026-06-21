---
title: 2026-06-10 Checkout outage
type: postmortem
description: 22-minute checkout outage caused by gateway timeout cascade.
timestamp: 2026-06-10T22:40:00+10:00
severity: sev1
status: resolved
---

# 2026-06-10 Checkout outage

Blameless review of a 22-minute checkout outage on the
[Payments API](../services/payments-api.md).

## Summary
A slow payment gateway caused request pile-up; the connection pool saturated and
p99 latency breached the [alert](../alerts/payments-p99-latency.md) threshold.

## Timeline
- 22:01 — alert fired.
- 22:08 — on-call followed the [high-latency
  runbook](../runbooks/payments-high-latency.md); identified pool saturation.
- 22:23 — scaled the pool and added a gateway timeout; recovered.

## Action items
- [ ] Add a circuit breaker around the gateway call.
- [ ] Alert on pool saturation directly (earlier signal).
