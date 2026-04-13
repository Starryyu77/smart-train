# Decision Ledger

| Step | Decision | Reason | Rejected options and why | Date |
|------|----------|--------|--------------------------|------|
| 1 | Treat the current repo as a lightweight web workload for sizing. | The app is a single Next.js service with light reads/writes and no heavy compute jobs. | Size it as if it already needed distributed infra: rejected because the current product shape does not justify it. | 2026-04-13 |
| 2 | Set `2 vCPU / 4 GB RAM` as the first-server floor. | This is the smallest spec likely to keep a Node 22 + Next.js runtime comfortable for demos and small pilot traffic. | `1 GB` and `2 GB` memory tiers: rejected because they leave too little runtime headroom. | 2026-04-13 |
| 3 | Keep the first deploy single-node. | The current app still uses local-file-backed demo persistence, so simple stateful deployment is the correct near-term fit. | Multi-node architecture now: rejected because the operational complexity is premature. | 2026-04-13 |
| 4 | Use light-server products only for demo / small pilot and plan to move to ECS/CVM when network guarantees or concurrency needs rise. | Official provider docs position the light-server products for lighter workloads and explicitly steer heavier scenarios toward ECS/CVM. | Assume the light-server class is the permanent production architecture: rejected because it weakens the long-term deployment path. | 2026-04-13 |
| 5 | Compare vendors by stage fit rather than pretending one global “best provider” exists. | The right answer changes materially between offshore demo, mainland pilot, and more formal production stages. | Choose a provider only on headline price: rejected because region, compliance, and service maturity matter more than raw instance cost. | 2026-04-13 |

## Notes

- Region choice is still conditional on whether the next launch is offshore internal testing or mainland public-facing pilot.
