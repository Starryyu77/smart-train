# Handoff

## Task Summary
- Hosting and sizing was evaluated for the current web app stage.

## Completed
- Reviewed the current repo runtime shape and persistence model.
- Researched official provider guidance from Tencent Cloud and Alibaba Cloud.
- Wrote the first server-selection and capacity recommendation document.
- Expanded the work into a fuller cloud-vendor comparison report for Notion delivery.
- Wrote the final report into the target Notion page.
- Refined the report around migration cost and long-term maintenance cost, and promoted `方案 B-Lite` as the preferred medium-term target.
- Synced the refined 2026-04-14 version back into the Notion page as an addendum.
- Wrote `docs/infrastructure/2026-04-14-vendor-deployment-checklists-and-budget-breakdown.md`.
- Synced the detailed deployment-checklist and budget-breakdown artifact into Notion as a child page:
  - `https://app.notion.com/p/3420b4a1b90481789124eb0ba2ca6fa6`

## Key Decisions
- First server floor: `2 vCPU / 4 GB RAM`.
- First deployment shape: single-node.
- Light-server products are acceptable for demo / small pilot, but not the final long-term answer once real scale or stronger network guarantees matter.
- If total cost of ownership is considered, the preferred medium-term architecture is `1 app server + managed PostgreSQL + object storage`.
- Concrete bundle split:
  - `短期 demo`：`腾讯云 Lighthouse 2核4GB`（国内）或 `DigitalOcean Droplet 2vCPU/4GB`（海外）
  - `中期 B-Lite`：`阿里云 B-Lite`（国内）或 `DigitalOcean B-Lite`（海外）

## Open Issues
- The region decision is still conditional on whether the next milestone is `offshore internal demo` or `mainland pilot`.
- The codebase still needs deployment hardening work: production start path, database persistence, backups, and monitoring.
- Tencent Cloud PostgreSQL budgeting remains less transparent than Alibaba Cloud / DigitalOcean because the public pricing path is formula-oriented rather than presented as a simple bundle card.

## Next Session Instructions
- Read `project.md`.
- Read `memory/tasks/server-selection-and-sizing/memory.md`.
- Read `docs/infrastructure/2026-04-13-server-selection-and-sizing.md`.
- Read `docs/infrastructure/2026-04-13-cloud-vendor-comparison-report.md`.
- Read `docs/infrastructure/2026-04-14-vendor-deployment-checklists-and-budget-breakdown.md`.
- If the user chooses a bundle, turn it into a concrete provisioning checklist and deployment runbook.
