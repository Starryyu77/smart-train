# Handoff

## Task Summary
- Hosting and sizing was evaluated for the current web app stage.

## Completed
- Reviewed the current repo runtime shape and persistence model.
- Researched official provider guidance from Tencent Cloud and Alibaba Cloud.
- Wrote the first server-selection and capacity recommendation document.

## Key Decisions
- First server floor: `2 vCPU / 4 GB RAM`.
- First deployment shape: single-node.
- Light-server products are acceptable for demo / small pilot, but not the final long-term answer once real scale or stronger network guarantees matter.

## Open Issues
- The region decision is still conditional on whether the next milestone is `offshore internal demo` or `mainland pilot`.
- The codebase still needs deployment hardening work: production start path, database persistence, backups, and monitoring.

## Next Session Instructions
- Read `project.md`.
- Read `memory/tasks/server-selection-and-sizing/memory.md`.
- Read `docs/infrastructure/2026-04-13-server-selection-and-sizing.md`.
- If the user chooses a region/provider direction, turn this recommendation into a concrete deployment setup task.
