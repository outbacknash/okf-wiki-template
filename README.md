# OKF Wiki Template

A starter template for an **Open Knowledge Format (OKF) v0.1** bundle — a
directory of Markdown files with YAML frontmatter, designed to be curated by
humans and maintained by autonomous agents without structural drift.

OKF v0.1 is Google Cloud's vendor-neutral spec for sharing curated knowledge with
AI agents. Spec:
<https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md>.

## Getting Started

1. Use this template to create a new repository.
2. Edit the bundle-root `index.md` and `log.md`.
3. Add concepts as Markdown files (e.g. in `concepts/`). Copy a file from
   `templates/` or use the editor snippets (see "Curating manually").

## What OKF v0.1 requires (and what this template adds)

OKF is deliberately minimal. A bundle is **conformant** if every non-reserved
`.md` file has a parseable YAML frontmatter block containing a non-empty `type`,
and the reserved files (`index.md`, `log.md`) follow their structure. Only `type`
is required; `title`, `description`, `resource`, `tags`, and `timestamp` are
recommended.

On top of conformance, this template adds **house-style** conventions (standard
Markdown links instead of WikiLinks, ISO 8601 timestamps, a curated `type`
vocabulary). The validator reports conformance breaches as **errors** and
house-style drift as **warnings** — see `okf.config.json`.

- **Reserved files**: only `index.md` and `log.md`. A non-root `index.md` carries
  **no frontmatter**; the bundle-root `index.md` may carry only `okf_version`.
- **Links**: standard Markdown, relative (`./path.md`) or bundle-root-absolute
  (`/dir/path.md`). Broken links are tolerated (they may be not-yet-written
  knowledge) and only warned about.

## Local Validation

```bash
npm install
npm run validate          # fails only on conformance errors
npm run validate:strict   # also fails on house-style warnings
```

## Curating manually

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the Obsidian and VS Code setup that
keeps human-authored pages conformant automatically.

## Agents

Autonomous agents must follow [AGENTS.md](./AGENTS.md).
