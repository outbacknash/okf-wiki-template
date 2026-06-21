# Agent Instructions — Writing to this OKF v0.1 Bundle

This repository is an **Open Knowledge Format (OKF) v0.1** bundle: a directory of
Markdown files with YAML frontmatter that both humans and autonomous agents read
and write. Spec:
<https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md>.

Autonomous agents (Claude Code, sync/ingest workers) MUST follow the rules below.
They are enforced by `npm run validate`. **Run it before you finalize any change.**

## The two-tier contract (read this first)

The validator separates two kinds of rule. Treat them differently:

- **Conformance errors** (exit code 1, fails CI) — genuine OKF v0.1 violations.
  You MUST fix these before finishing. They are objective: an unparseable file or
  a concept with no `type` is broken, full stop.
- **House-style warnings** (do not fail CI by default) — drift signals for a human
  curator. Do not paper over them with hacks. In particular, **never invent a file
  just to silence a broken-link warning** (see "Forward references" below).

## Adding or updating a concept

A *concept* is any `.md` file that is not a reserved file (`index.md`, `log.md`).

1. **Filename:** lowercase `kebab-case.md` (e.g. `vector-search.md`). Place it in
   the directory that fits the topic.
2. **Frontmatter** — a single YAML mapping between `---` fences at the very top:
   - `type` — **required, non-empty.** Use a value from `okf.config.json` →
     `types` (currently `concept`, `project`, `procedure`). To introduce a new
     type, add it to that list **in the same change** so the vocabulary evolves
     deliberately instead of drifting.
   - `title` — recommended, human-readable.
   - `description` — recommended, **one sentence.** `index.md` entries quote it, so
     it is high-value; always write one.
   - `timestamp` — recommended, ISO 8601 with offset
     (`2026-06-16T17:22:39+10:00`). Set it to the time of the change.
   - You MAY add any other keys (`tags`, `resource`, domain fields).
3. **`resource`** — when the concept describes a concrete asset (a table, an API,
   a document), add `resource:` with a stable URI identifying it. Use this URI as
   the **idempotency key**: if a concept for that resource already exists, update
   it in place rather than creating a duplicate.
4. **Body:** standard Markdown. Cross-link related concepts (see below).

## Links — standard Markdown only

- Use `[text](./relative/path.md)` or bundle-root-absolute `[text](/dir/file.md)`.
- **Never use `[[WikiLinks]]`** — they need a bespoke resolver and break plain
  Markdown consumers. (House rule; warned by the validator.)
- A link asserts a relationship; the *kind* of relationship is carried by your
  prose, not the link.

### Forward references are allowed

Linking to a concept that does not exist yet is **valid** — the spec treats a
missing target as "not-yet-written knowledge," and so do we. The validator emits
a `broken-link` *warning*, not an error. If the stub is intentional, leave it.
Do **not** fabricate an empty target file to silence the warning.

## Reserved files — strict rules

- **`index.md`** lists a directory's contents for navigation.
  - A non-root `index.md` MUST contain **no frontmatter** at all.
  - Only the **bundle-root** `index.md` may carry frontmatter, and only the single
    key `okf_version: "0.1"`.
  - Entries SHOULD include each linked concept's `description`.
- **`log.md`** records history for its scope.
  - Entries grouped under ISO 8601 `## YYYY-MM-DD` date headings, **newest first**.
  - `log.md` is **append-only**: add new entries, do not rewrite old ones.
  - Prefer a stable key (the concept's `resource` URI or path) in each entry so
    repeated or concurrent runs do not duplicate history.

## Ingesting from `raw/` (optional source layer)

If the bundle has a `raw/` directory, it holds **immutable source documents**
(transcripts, exports, clippings). It is excluded from validation and is **not**
part of the bundle. To ingest:

1. **Read** a source from `raw/`. Do not edit or delete it — sources are immutable.
2. **Draft or update** concept pages that summarize and cross-link it. Upsert by
   `resource`/path; don't create a duplicate if a concept for that source exists.
3. **Set provenance**: record the source as the concept's `resource` (or link to
   it) so claims can be traced back.
4. **Append** a `log.md` entry and **run `npm run validate`**.

See [`raw/README.md`](./raw/README.md) for the full contract.

## `recipes/` is a library, not live content

The `recipes/` directory holds starter packs for different wiki flavors. It is
**not** part of the active bundle (it is ignored by validation). Do not treat
recipe files as live concepts or edit them as part of normal curation; copy from
them when bootstrapping a new area, then adjust `okf.config.json` → `types`.

## Concurrent / repeated writes

Multiple agents may write to this bundle. Make writes **idempotent and
order-independent**: key concept upserts on `resource` (or the file path), and
key log entries on the change they describe. This matters more than merge-conflict
resolution — it prevents duplicates and ordering bias when agents run in parallel.

## Two kinds of "lint" — keep them separate

- **Structural lint = `npm run validate`** (this validator). Deterministic; the CI
  gate. Always run it before finishing.
- **Semantic lint = your job, periodically.** Audit for orphaned pages,
  contradictions, stale claims, and missing cross-links; fix what you can and
  report the rest. The validator does **not** do this and never will — it only
  checks structure.

## Definition of done (checklist)

1. New/updated concepts have non-empty `type`, plus `title`/`description`/
   `timestamp`.
2. Reserved-file rules respected (no frontmatter in non-root `index.md`; log is
   date-headed, newest-first, append-only).
3. Relevant `index.md` and `log.md` updated.
4. `npm run validate` exits 0 with **no errors**. (Run `npm run validate:strict`
   to also clear warnings when you want a spotless bundle.)
