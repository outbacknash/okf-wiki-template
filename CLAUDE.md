# Build and Validation Commands

This repository is an **Open Knowledge Format (OKF) v0.1** bundle. Before
finalizing any change, validate it.

## Lint / Validate
- `npm run validate`: Run the OKF v0.1 validator (fails on conformance errors).
- `npm run validate:strict`: Same, but also fails on house-style warnings.
- `node scripts/validator.js`: Direct invocation of the validator.

## Agent rules
- Read **`AGENTS.md`** before writing to the bundle — it defines exactly how to
  add concepts, the reserved-file rules, link conventions, and the
  conformance-vs-house-style contract.
- Rule severities and the known `type` vocabulary live in **`okf.config.json`**.
