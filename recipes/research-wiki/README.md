# Recipe: Research Wiki (UXR Repository)

A shareable **UX-research repository** so a squad can tap into the research behind
the roadmap without re-reading raw reports. Modeled on **Atomic UX Research**
(Tomer Sharon's nuggets; Daniel Pidcock's "atomic research") and Nielsen Norman
Group guidance on research repositories.

The core idea: break findings into the smallest reusable units and link them, so
evidence is searchable and reusable across projects.

## Type vocabulary (the atomic chain)

| `type` | Layer | Answers |
| --- | --- | --- |
| `study` | Experiment | What did we do? (method, participants, dates) |
| `nugget` | Evidence | What did we observe? (one verbatim observation + tags) |
| `insight` | Finding | What does it mean? (a claim supported by ≥1 nugget) |
| `recommendation` | Action | What should we do about it? |
| `persona` | Who | The user segment an insight applies to |

A `recommendation` cites `insight`s; an `insight` cites `nugget`s; a `nugget`
comes from a `study`. Follow the links backward to trace any recommendation to
its raw evidence.

## Conventions

- A `nugget` is **atomic**: one observation, ideally a verbatim quote, tagged for
  retrieval. Set `resource` to the session recording/transcript in
  [`../../raw/`](../../raw/README.md) for provenance.
- `insight`s state confidence (`confidence: high|medium|low`) based on how many
  independent nuggets support them.
- Share read access with the squad; let agents draft `nugget`s from transcripts
  dropped in `raw/`, but keep `insight`/`recommendation` human-reviewed.

## Apply

Copy this folder into your bundle root, or merge `types` into your
`okf.config.json`.
