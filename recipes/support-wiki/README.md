# Recipe: Squad Support Wiki

An **agent-consumable** support knowledge base, so a support bot can resolve
requests without pulling in a squad member. Modeled on **Knowledge-Centered
Service (KCS)** (Consortium for Service Innovation) — capture knowledge in the
flow of solving, structure it for reuse — and on standard help-center article
patterns (Zendesk/Intercom).

## Type vocabulary

| `type` | For | Structure the bot relies on |
| --- | --- | --- |
| `article` | A confirmed solution to a known request | Symptom → Cause → Resolution steps |
| `troubleshooting` | A decision path for diagnosing a class of problem | Branching checks |
| `faq` | A short factual answer | Question → Answer |
| `known-issue` | An open bug/limitation with a workaround | Status, workaround, tracking link |
| `policy` | A rule the bot must apply (refunds, eligibility) | The rule + boundaries |

## Conventions that make this agent-friendly

- Write a **one-sentence `description`** for every page — it is what a retrieval
  agent ranks and quotes. Make it match how a user phrases the problem.
- Lead with the **symptom in the user's words**, then resolution. Keep steps
  imperative and numbered.
- Set **`resource`** to the canonical help-center URL or product area, so the bot
  can deep-link the user.
- Add `tags` for the product surface (e.g. `[auth, sso]`) to aid retrieval.
- For anything the bot must **not** decide alone (refunds beyond a threshold,
  account deletion), put the boundary in a `policy` page and reference it.

## Apply

Copy this folder into your bundle root, or merge `types` into your
`okf.config.json`. Point your support bot at the bundle (or Google's OKF HTML
visualizer / Search APIs) as a read-only consumer.
