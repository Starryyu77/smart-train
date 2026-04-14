# Task Memory

- Task ID: server-selection-and-sizing
- Task name: Evaluate hosting options and size the first server for the web pilot
- Started: 2026-04-13
- Updated: 2026-04-14
- Workspace: `/Users/starryyu/2026/Smart Training Workbench for Fitness Coaches`
- Status: active

## 1. Task Goal
- Give the project a concrete first-server recommendation, including region strategy, expected capacity envelope, and when to upgrade beyond a light single-node deployment.

## 2. Current Progress
- Reviewed the current app runtime shape:
  - one `Next.js` deployable app
  - Node `>=22.0.0`
  - local file-backed demo persistence rather than a real database
- Confirmed the product is still in a lightweight web-app stage rather than a heavy compute or media-processing stage.
- Researched current official provider guidance relevant to the project:
  - Tencent Cloud Lighthouse product positioning, pricing, and scenario limits
  - Alibaba Cloud SWAS product positioning, region guidance, and filing implications
- Wrote the first hosting and sizing recommendation to `docs/infrastructure/2026-04-13-server-selection-and-sizing.md`.
- Expanded the work into a fuller vendor-comparison report covering:
  - our current workload assumptions
  - three architecture options
  - domestic vs international cloud-vendor comparison
  - deployment recommendations by stage
- Prepared the report for delivery into the target Notion page supplied by the user.
- Wrote the finished report into the target Notion page `服务器选型与云厂商对比报告`.
- Refined the report from the perspective of migration cost and long-term maintenance cost.
- Re-ranked the options around total cost of ownership and made `方案 B-Lite` the preferred medium-term architecture.
- Synced the 2026-04-14 refinement back into the target Notion page as an addendum section focused on migration and maintenance cost.

## 3. Decisions Made + Reasons

| Step | Decision | Reason | Rejected options and why |
|------|----------|--------|--------------------------|
| 1 | Size the current project as a light web app, not as a high-scale system. | The repo currently contains a single Next.js app with lightweight form writes and no heavy compute workloads. | Jump straight to a multi-service or high-spec architecture: rejected because it would be over-engineering for the current product stage. |
| 2 | Recommend `2 vCPU / 4 GB RAM` as the first server floor. | It is the smallest spec likely to give Next.js on Node 22 enough runtime headroom for a stable demo and small pilot. | `1 GB` or `2 GB` RAM primary server: rejected because it is too likely to feel cramped and unstable once normal operational overhead is included. |
| 3 | Keep the first deployment single-node and stateful. | The current persistence path is local-file-backed, so the real bottleneck is deployment simplicity and safe persistence, not horizontal scale. | Start with load balancers and multiple app nodes: rejected because the app is not yet at that operational stage. |
| 4 | Treat CVM/ECS as the next step once public network guarantees or higher concurrency matter. | Both provider docs position their light-server products for lighter workloads and point heavier or more demanding public-network scenarios toward the main cloud-server products. | Assume the light-server class should remain the long-term production shape: rejected because the official docs explicitly limit that positioning. |

## 4. Open Issues
- The real expected pilot size is still unknown: internal demo, closed beta, and public pilot lead to different region decisions.
- The project still lacks a production `start` script, deployment automation, and database persistence.
- Final provider choice between Tencent Cloud and Alibaba Cloud is not locked.
- Real load testing has not been run yet, so the capacity estimates are engineering planning estimates only.
- The user still needs to choose whether the next environment is `internal offshore demo` or `mainland pilot`.

## 5. Task-Specific Constraints
- Recommendations must fit the current project stage instead of over-engineering for hypothetical future scale.
- Recommendations must consider China-facing latency and filing implications.
- Every meaningful round of conclusions must be written into `memory/` and committed.

## 6. Next Step
- Ask the user to choose between `internal offshore demo` and `mainland pilot`, then turn the chosen path into a concrete deployment checklist.
