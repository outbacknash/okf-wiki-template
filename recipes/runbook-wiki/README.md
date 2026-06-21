# Recipe: Runbook Wiki (On-call / Operations)

Operational knowledge for incident response, so on-call engineers — and an
incident-assist agent — can act fast. Modeled on the **Google SRE Book**
(runbooks/playbooks reduce mean-time-to-repair) and **PagerDuty's incident
response** documentation.

## Type vocabulary

| `type` | For | Key frontmatter |
| --- | --- | --- |
| `service` | A system you operate | `resource` (repo/dashboard), owner, tier |
| `alert` | A specific alert/monitor | severity, the runbook it points to |
| `runbook` | Steps to resolve one alert/symptom | `resource` (dashboard), linked service |
| `playbook` | Process for a class of incident (e.g. sev1) | roles, comms |
| `postmortem` | Blameless review of an incident | date, severity, status |

## Conventions

- Every `alert` links to exactly one `runbook`; every `runbook` links to its
  `service`. The on-call path is: alert → runbook → service.
- Keep `runbook` steps **imperative, copy-pasteable, and safe** (note any
  destructive step explicitly).
- `postmortem`s are **blameless** and link to the `service` and the action items
  they produced.
- Set `resource` to the live dashboard/repo so an agent can deep-link responders.

## Apply

Copy this folder into your bundle root, or merge `types` into your
`okf.config.json`.
