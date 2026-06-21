# `recipes/` — Starter Packs for Common Wiki Flavors

OKF deliberately defines **no** taxonomy of concept `type`s — that is left to the
producer (spec non-goal: *"Defining a fixed taxonomy of concept types"*). This
directory is a **library of producer-defined starting points**, not part of the
active bundle. Each subfolder is a small, fully **conformant** OKF bundle you can
copy from, with a `type` vocabulary grounded in a reputable model.

`recipes/**` is excluded from the main bundle's validation (`okf.config.json` →
`ignore`). Each recipe carries its own `okf.config.json`, so it validates on its
own and the example pages stay pristine (the test suite enforces this).

## Available recipes

| Recipe | For | `type` vocabulary | Grounded in |
| --- | --- | --- | --- |
| [`data-wiki`](./data-wiki/) | A catalog of datasets/tables/metrics for analysts and agents | `dataset`, `table`, `metric`, `reference` | Google OKF reference enrichment agent (BigQuery tables/datasets, schemas, join paths) |
| [`second-brain`](./second-brain/) | Flexible personal knowledge management | `note`, `project`, `area`, `resource`, `person` | PARA (Tiago Forte) + Zettelkasten (Sönke Ahrens) |
| [`research-wiki`](./research-wiki/) | A shareable UX-research repository for a squad | `study`, `nugget`, `insight`, `recommendation`, `persona` | Atomic UX Research (Tomer Sharon / Daniel Pidcock) + NN/g research repositories |
| [`support-wiki`](./support-wiki/) | Agent-consumable support knowledge base | `article`, `troubleshooting`, `faq`, `known-issue`, `policy` | Knowledge-Centered Service (KCS, Consortium for Service Innovation) + help-center patterns |
| [`runbook-wiki`](./runbook-wiki/) | On-call / operational knowledge for incident response | `service`, `runbook`, `alert`, `playbook`, `postmortem` | Google SRE Book + PagerDuty incident response |

## How to apply a recipe

**Start a new bundle from a recipe**

1. Copy the recipe's contents into your bundle root (its `okf.config.json`,
   `index.md`, and example concept folders).
2. Replace the example concepts with your own; keep the `types` list.

**Add a flavor to an existing bundle**

1. Merge the recipe's `types` array into your root `okf.config.json` → `types`.
2. Copy the example concepts you want to use as templates.

Either way, validate from the recipe folder to confirm it is clean:

```bash
cd recipes/data-wiki && node ../../scripts/validator.js
```

## More ideas (not yet built)

`product-wiki` (PRDs, specs, decisions — grounded in Marty Cagan / RFC patterns),
`personal-crm` (people, interactions, follow-ups), `legal-policy` (policies,
clauses, obligations), `course-wiki` (spaced-repetition learning, grounded in
Andy Matuschak's evergreen notes). Open a copy of the closest recipe and adapt
its `types`.
