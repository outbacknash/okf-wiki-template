---
title: orders
type: table
description: One row per placed order, including refunds and discounts.
resource: bigquery://acme-analytics.ecommerce.orders
timestamp: 2026-06-21T10:00:00+10:00
grain: one row per order
---

# orders

Part of the [E-commerce](../datasets/ecommerce.md) dataset. **Grain:** one row per
placed order (`order_id` is unique).

## Schema

| Column | Type | Description |
| --- | --- | --- |
| `order_id` | STRING | Primary key. Unique per order. |
| `customer_id` | STRING | FK → customers. |
| `placed_at` | TIMESTAMP | When the order was placed (UTC). |
| `gross_amount` | NUMERIC | Order total before refunds/discounts. |
| `refund_amount` | NUMERIC | Total refunded. |
| `discount_amount` | NUMERIC | Total discounts applied. |
| `status` | STRING | `placed`, `shipped`, `cancelled`, `refunded`. |

## Joins
- Joins to **customers** on `customer_id` (many orders → one customer).
- Feeds [Net Revenue](../metrics/net-revenue.md).
