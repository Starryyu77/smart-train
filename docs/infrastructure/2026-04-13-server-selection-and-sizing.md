# Smart Training Workbench Server Selection and Capacity Baseline

- Date: 2026-04-13
- Status: recommended baseline for the first deploy

## 1. What is being sized

- Current runtime shape:
  - One deployable `Next.js + React + TypeScript` app in `apps/web`.
  - Node runtime requirement is `>=22.0.0`.
  - Current demo persistence is local file storage for student feedback, not a real database.
- Current workload shape:
  - Mostly page reads and lightweight form submissions.
  - No video processing, no AI inference, no queue workers, no websocket fanout, no search cluster.
- Engineering inference:
  - This is a light web application today.
  - The first bottleneck is more likely to be memory headroom and deployment robustness than raw CPU.

## 2. Decision drivers

- If the next goal is an internal demo or a very small closed pilot, the cheapest correct answer is a single stateful server.
- If the next goal is a public mainland-China web launch with a domain, region and filing path matter immediately.
- If the next goal includes real coach/student usage rather than demo usage, the real upgrade is not “bigger CPU first”; it is “proper database + backup + deployment discipline”.

## 3. What the official provider docs imply

### Tencent Cloud Lighthouse

- Tencent positions Lighthouse for SMEs and developers building lightweight business scenarios such as websites, web applications, and dev/test environments.
- Tencent also states that Lighthouse is suitable for lightweight scenarios with a moderate number of access requests, and recommends CVM instead for high-concurrency websites and more complex distributed applications.
- Tencent’s official current public bundle page shows:
  - `2 vCPU / 2 GB / 40 GB SSD / 20 Mbps / 0.5 TB` at `$4.2/month`
  - `2 vCPU / 4 GB / 90 GB SSD / 30 Mbps / 2.5 TB` at `$8.5/month`
- Tencent also notes that instances outside the Chinese mainland can experience latency and packet loss when accessed from the mainland.

### Alibaba Cloud SWAS

- Alibaba positions 轻量应用服务器 for website building, development/testing, and small web applications.
- Alibaba’s product page explicitly lists `Web应用/小程序` as a target scenario and recommends pairing it with `RDS` and `OSS`.
- Alibaba’s region guidance says to pick a region close to target users, and explicitly warns that mainland access to non-mainland regions such as Hong Kong or Singapore can have higher latency.
- Alibaba’s filing guidance says mainland web services require ICP filing, and the filing-eligible instance must be purchased for at least 3 months.
- Alibaba also states that light-server peak public bandwidth is not a guaranteed SLA metric and recommends `ECS` if the business requires stronger public network quality guarantees.

## 4. Capacity recommendation by stage

## Stage A: internal demo or very small closed pilot

- Recommended shape: `single server`
- Recommended instance floor: `2 vCPU / 4 GB RAM / 60-90 GB SSD`
- Recommended network floor: `20-30 Mbps`
- Why this is the right floor:
  - `Next.js` on Node 22 is likely to feel cramped on `1 GB` RAM.
  - `2 GB` RAM may run, but it leaves little headroom once you include the app process, reverse proxy, logs, package updates, and operational tooling.
  - `4 GB` is the smallest spec I would trust for a stable demo that other people can actually use.
- Suitable for:
  - internal review
  - design iteration
  - product demos
  - a small private pilot
- Engineering estimate:
  - this should be enough for low single-digit to low double-digit concurrent usage at the current app complexity
  - this estimate is based on the current repo shape, not on load-test data

## Stage B: first real pilot

- Recommended shape:
  - `1 app server`
  - `1 managed Postgres` or a separate DB node
  - object storage for future uploads
- Recommended app server: `4 vCPU / 8 GB RAM / 80-120 GB SSD`
- Recommended database baseline:
  - managed PostgreSQL
  - automated backups enabled
- Why to upgrade:
  - the current repo stores feedback in a local JSON file, which is acceptable for a demo but not for real multi-user use
  - the real need at this stage is durable data, safer deploys, and recoverability
- Suitable for:
  - a small real pilot
  - low hundreds of registered users
  - low tens of concurrent sessions
- Upgrade triggers:
  - RAM consistently above `70%`
  - CPU consistently above `60%` during peak periods
  - p95 page/API latency becomes visibly unstable
  - you need real account/auth data and can no longer tolerate local-file storage

## Stage C: public beta

- Recommended shape:
  - `2 app nodes`
  - `1 load balancer`
  - `1 managed PostgreSQL HA instance`
  - optional `Redis` if session/cache pressure shows up
- Recommended app nodes: `2 x 4 vCPU / 8 GB RAM`
- At this point, prefer `CVM` / `ECS` over the light-server products if:
  - you need stronger public network quality guarantees
  - you expect higher concurrency
  - you need more flexible scaling and networking

## 5. Region recommendation

## If the next 2-6 weeks are mainly internal testing

- Fastest path: `Hong Kong` or `Singapore`
- Reason:
  - avoids getting blocked on mainland filing before the product loop is proven
  - still keeps latency acceptable for internal testing if the test group is small
- Tradeoff:
  - mainland users will see worse latency than a mainland deployment

## If the next milestone is a real mainland-China pilot

- Better path: `mainland China region` from day one
- Reason:
  - you will get more realistic user latency
  - you avoid redoing your launch checklist after pilot feedback already starts
- Tradeoff:
  - you need to handle ICP-related setup earlier

## 6. Concrete recommendation for this repo today

- My recommendation for the current project state:
  - buy `one 2 vCPU / 4 GB / 60-90 GB SSD` server first
  - do **not** buy a `1 GB` or `2 GB` memory machine as the primary environment
  - keep the first deployment single-node
  - treat it as a demo/pilot environment, not a production architecture
- If you want the simplest provider-specific starting point right now:
  - `Tencent Cloud Lighthouse 2 vCPU / 4 GB / 90 GB SSD / 30 Mbps / 2.5 TB`
  - official page price at time of research: `$8.5/month`
- If you already know you want mainland public rollout soon:
  - use a mainland region
  - prepare ICP filing in parallel
  - be prepared to move from light-server class to `ECS` / `CVM` once you care about stronger network guarantees or higher concurrency

## 7. What must happen before real deployment

- Add a production start path for the app.
- Add reverse proxy and process management.
- Replace the local JSON feedback store with PostgreSQL before real user data matters.
- Add backups and environment-variable management.
- Add HTTPS, monitoring, and basic alerting.

## 8. References

- Tencent Cloud Lighthouse official product page: https://www.tencentcloud.com/en/products/lighthouse
- Tencent Cloud Lighthouse overview: https://www.tencentcloud.com/document/product/1103/41261
- Alibaba Cloud SWAS official product page: https://www.aliyun.com/product/swas
- Alibaba Cloud SWAS create-server guidance: https://help.aliyun.com/zh/simple-application-server/user-guide/create-a-server
- Alibaba Cloud ICP filing FAQ: https://help.aliyun.com/zh/icp-filing/basic-icp-service/product-overview/faq-about-icp-filing-applications-in-different-scenarios
