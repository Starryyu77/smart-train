# Decision Ledger

| Step | Decision | Reason | Rejected options and why | Date |
|------|----------|--------|--------------------------|------|
| 1 | Create `docs/plans/2026-04-13-smart-training-workbench-mvp-plan.md` as the review target. | Gives `/autoplan` one concrete artifact to refine. | Keep reviewing only the PRD and alignment documents: rejected because it fragments the review target. | 2026-04-13 |
| 2 | Use a modular monolith baseline in the first plan draft. | It matches the PRD guidance and reduces early complexity while keeping domain boundaries explicit. | Start with microservices: rejected as premature complexity for an empty repo. | 2026-04-13 |
| 3 | Narrow the first pilot wedge to solo coaches and very small studios in general fitness. | It makes the product and rollout learnable instead of trying to satisfy distinct operating models on day one. | Broad "coach + small studio" wedge from the start: rejected because it blurs the first success case. | 2026-04-13 |
| 4 | Generate `TODOS.md` and a standalone test-plan artifact during review. | The plan needs operational follow-through artifacts, not just narrative review notes. | Keep deferred work and tests buried inside the review prose: rejected because it is harder to execute. | 2026-04-13 |
| 5 | Carry a working recommendation of coach Web first plus student H5 first for the China-facing MVP. | It reduces regulatory and release friction relative to mini-program-first or native-app-first, while matching the coach dashboard workflow better. | Mini-program first: rejected because the coach workbench is desktop-heavy and the platform adds an extra review surface. Native app first: rejected because it adds release overhead before the product loop is stable. | 2026-04-13 |
| 6 | Lock the first implementation batch to a Next.js app workspace with internal `domain` and `platform` packages. | It turns the approved web-first plan into a concrete repository shape without overcommitting to early service sprawl. | Keep the repo docs-only until more decisions are made: rejected because the user approved immediate execution. | 2026-04-13 |

## Notes

- Append new rows when review decisions materially change plan direction.
