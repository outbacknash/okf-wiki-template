# Recipe: Second Brain

A flexible personal knowledge base for all sorts of information. The `type`
vocabulary combines two well-known systems:

- **PARA** (Tiago Forte, *Building a Second Brain*) — organize by actionability:
  **P**rojects, **A**reas, **R**esources, Archives.
- **Zettelkasten** (Sönke Ahrens, *How to Take Smart Notes*) — atomic, densely
  linked `note`s that each capture one idea and connect to others.

## Type vocabulary

| `type` | PARA / ZK role | Use for |
| --- | --- | --- |
| `note` | Zettel | One atomic idea, written in your own words, linked to related notes |
| `project` | Project | A goal with an end state and a deadline |
| `area` | Area | An ongoing responsibility with a standard to maintain (health, finances) |
| `resource` | Resource | A topic or reference you collect material on |
| `person` | — | People you want to remember things about |

## Conventions

- Keep `note`s **atomic** — one idea each — and link generously. The value is in
  the connections, which form the OKF knowledge graph.
- Archiving = move the file to an `archive/` folder; the `type` does not change.
- Set `resource` frontmatter on a `resource`/`note` to the canonical URL of the
  source it summarizes, for provenance.

## Apply

Copy this folder into your bundle root, or merge `types` into your
`okf.config.json`. Pairs well with Obsidian (this template already forces
relative Markdown links).
