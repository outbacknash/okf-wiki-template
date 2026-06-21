---
title: Net Revenue
type: metric
description: Gross order revenue after subtracting refunds and discounts.
timestamp: 2026-06-21T10:00:00+10:00
owner: finance-analytics
unit: AUD
---

# Net Revenue

Revenue recognized after refunds and discounts.

## Definition
`SUM(gross_amount - refund_amount - discount_amount)` over
[orders](../tables/orders.md) where `status != 'cancelled'`.

## Grain & filters
- Reported per calendar day (Australia/Brisbane), then rolled up.
- Excludes cancelled orders; refunds reduce the day they are issued.

## Caveats
- Not the same as *recognized accounting revenue* — this is an operational
  metric. For the finance figure, see the GL, not this catalog.
