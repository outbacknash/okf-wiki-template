# Contributing — Curating this OKF v0.1 Bundle by Hand

This bundle is built for a *dual loop*: humans curate and direct; agents do the
bookkeeping. This guide covers the **human** side. For the agent side, see
[AGENTS.md](./AGENTS.md). For the rules themselves, see
[README.md](./README.md) and `okf.config.json`.

## Validate before you commit

```bash
npm install
npm run validate          # fails only on OKF conformance errors
npm run validate:strict   # also fails on house-style warnings
```

The same check runs in CI (`.github/workflows/validate-okf.yml`).

## Editing in Obsidian

Open this repository as an Obsidian vault. Committed settings in `.obsidian/`
keep your manual edits conformant automatically:

- `useMarkdownLinks: true` + `newLinkFormat: relative` — Obsidian inserts
  standard relative Markdown links (`[text](./path.md)`), **not** `[[WikiLinks]]`,
  which the bundle forbids. `alwaysUpdateLinks` rewrites links on rename.
- The core **Templates** plugin is enabled and pointed at `templates/`. Insert a
  template ("Insert template" command) to get a new page with correct
  frontmatter; the `{{title}}` and `{{date:YYYY-MM-DDTHH:mm:ssZ}}` placeholders
  fill in an ISO 8601 timestamp automatically.
- The **Properties** view lets you edit frontmatter as fields rather than raw
  YAML.

## Editing in VS Code

`.vscode/okf.code-snippets` provides Markdown snippets that emit conformant
frontmatter with a live ISO 8601 timestamp:

| Prefix | Inserts |
| --- | --- |
| `okf-concept` | A concept page |
| `okf-project` | A project page |
| `okf-procedure` | A procedure page |
| `okf-log` | A date-headed `log.md` entry |

Type the prefix in a `.md` file and accept the completion.

## Reserved-file reminders

- A non-root `index.md` has **no frontmatter** — just headings and links.
- The bundle-root `index.md` carries only `okf_version: "0.1"`.
- `log.md` is append-only: add entries under `## YYYY-MM-DD` headings, newest
  first.

## Optional: adding a raw-sources layer

OKF governs only the wiki/bundle layer, so this template ships without one. If you
want the full "ingest" loop (curate sources → agent synthesizes pages), add a
top-level `raw/` directory for immutable source documents and add `raw/**` to
`okf.config.json` → `ignore` so sources are not validated as concepts. Agents then
read from `raw/` and write conformant concepts into the bundle.

## What `templates/` is

`templates/` holds authoring scaffolding (with `{{...}}` placeholders) and is
excluded from validation via `okf.config.json` → `ignore`. Do not treat its files
as live concepts.
