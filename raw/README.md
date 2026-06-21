# `raw/` — Source Layer (immutable inputs)

This directory holds **raw source documents**: the inputs your knowledge is
derived from. It is the first of the three layers in the
[Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
knowledge-base pattern — `raw/` (sources) → the bundle (curated concepts) →
`AGENTS.md`/`okf.config.json` (the schema).

**`raw/` is not part of the OKF bundle.** It is excluded from validation via
`okf.config.json` → `ignore` (`raw/**`), so its files do **not** need frontmatter,
a `type`, or Markdown links. Put anything here: PDFs, transcripts, CSV/JSON
exports, scraped HTML, meeting notes, screenshots.

## The contract

- **Sources are immutable.** Agents and humans *read* from `raw/`; they do not
  rewrite source files. New information arrives as a new source.
- **The bundle is derived.** Curated concepts (in `concepts/` and your own
  directories) summarize, cross-link, and synthesize what is in `raw/`.
- **Provenance flows forward.** When an agent writes a concept from a source, it
  should record the source as the concept's `resource` (or link to it), so a
  reader can trace a claim back to its origin.

## How forks use this layer

Pick whatever fits — the layer is optional and additive:

1. **Manual curation only.** Ignore `raw/` entirely and author concepts by hand
   (Obsidian/VS Code). You can delete this directory.
2. **Agent ingest.** Drop sources here, then ask an agent to ingest them: read
   each source, draft/update concepts, cross-link, and append to `log.md`. See
   the *Ingest* workflow in [`../AGENTS.md`](../AGENTS.md).
3. **Synced sources.** A background worker writes `raw/` from an external system
   (a Zendesk export, a Slack channel dump, BigQuery `INFORMATION_SCHEMA`, a
   Google Drive sync). Agents then enrich those into concepts on a schedule.

## Organizing and ignoring

- Organize `raw/` however you like (e.g. `raw/transcripts/`, `raw/exports/`,
  `raw/clippings/`). Subfolders here have no schema requirements.
- Source files are version-controlled by default, which gives you history and
  diffs for free. If sources are **large, binary, or sensitive**, add specific
  paths to `.gitignore` (e.g. `raw/exports/*.csv`) instead of committing them —
  keep a small `*.md` manifest describing what should be there.
