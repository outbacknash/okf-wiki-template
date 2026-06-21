---
title: Payments API high latency
type: runbook
description: Diagnose and mitigate elevated latency on the Payments API.
resource: https://grafana.example.com/d/payments
timestamp: 2026-06-21T10:00:00+10:00
service: ../services/payments-api.md
---

# Payments API high latency

For alert [Payments p99 latency high](../alerts/payments-p99-latency.md) on the
[Payments API](../services/payments-api.md).

## Steps
1. Open the dashboard (`resource`) and confirm the latency spike is real, not a
   single bad host.
2. Check the **gateway status page** — most latency originates upstream.
3. Check DB connection-pool saturation. If saturated, scale the pool (safe).
4. If a recent deploy correlates, **roll it back** (destructive to in-flight
   deploys — announce in the incident channel first).
5. If unresolved in 15 min, escalate per the sev process and start a
   [postmortem](../postmortems/2026-06-10-checkout-outage.md) draft.
