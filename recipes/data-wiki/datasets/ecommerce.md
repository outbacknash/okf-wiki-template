---
title: E-commerce
type: dataset
description: Orders, customers, and product events for the storefront.
resource: bigquery://acme-analytics.ecommerce
timestamp: 2026-06-21T10:00:00+10:00
owner: data-platform
---

# E-commerce

Curated storefront data: transactional orders, customer profiles, and clickstream
product events. Source of truth for revenue and funnel reporting.

## Tables
- [orders](../tables/orders.md) — One row per placed order.

## Metrics
- [Net Revenue](../metrics/net-revenue.md)
