# Decision Ledger

| Step | Decision | Reason | Rejected options and why | Date |
|------|----------|--------|--------------------------|------|
| 1 | Use `git@github.com:Starryyu77/smart-train.git` as the source of truth. | Centralizes collaboration and keeps history shared. | Continue from a detached local folder: rejected because it creates coordination drift. | 2026-04-13 |
| 2 | Record project state in repo-local `memory/`. | Keeps context restartable and versioned with the project. | Chat-only memory: rejected because it is not durable enough for project work. | 2026-04-13 |
| 3 | Commit each meaningful work round when feasible. | Preserves an auditable sequence of changes and decisions. | Leave a dirty worktree between rounds: rejected because it makes handoff and rollback harder. | 2026-04-13 |

## Notes

- This ledger should be appended to when rules or direction change.
