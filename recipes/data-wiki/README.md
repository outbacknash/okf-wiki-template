# Recipe: Data Wiki

A catalog of **datasets, tables, and metrics** that analysts read and agents
query — modeled on Google Cloud's own OKF reference, whose enrichment agent walks
a BigQuery dataset and drafts one concept per table/view using column names, data
types, and descriptions, then enriches each with schemas and join paths.

## Type vocabulary

| `type` | Describes | Key frontmatter |
| --- | --- | --- |
| `dataset` | A logical collection of tables | `resource` (dataset URI) |
| `table` | A physical table/view | `resource` (table URI), schema, grain, join paths |
| `metric` | A defined business measure | `resource` (optional), formula, owner |
| `reference` | A lookup/enumeration shared across tables | `resource` |

## Conventions

- Set **`resource`** to the asset's stable URI (e.g.
  `bigquery://project.dataset.table`). Agents use it as the identity/idempotency
  key when re-ingesting.
- Document the **grain** (one row per …) of every table — it is the single most
  load-bearing fact for correct joins.
- Express relationships as prose + Markdown links ("joins to
  [customers](../tables/customers.md) on `customer_id`"). OKF links carry the
  relationship in the surrounding text, not the link itself.

## Apply

Copy this folder's contents into your bundle root, or merge `types` into your
`okf.config.json`. If you maintain a separate analyst skills/reference repo,
ingest those files via [`../../raw/`](../../raw/README.md) and let an agent draft
`table`/`metric` concepts from them.
