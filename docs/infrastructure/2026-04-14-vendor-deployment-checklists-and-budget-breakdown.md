# Smart Training Workbench 部署清单与预算拆分

- 日期：2026-04-14
- 目的：把前一版服务器选型报告细化成可执行的厂商部署清单与预算口径。

## 1. 预算口径说明

- 本文把预算分成三类：
  - `公开可确认固定成本`：能从官方页面直接读到的月费或年费。
  - `使用量相关成本`：对象存储、超额流量、备份超额空间等，需要按实际使用结算。
  - `规划预留预算`：为了做决策而给出的工程预算，不等于最终账单。
- 由于国内外官网展示币种不一致，本文保留原币种，避免因为临时汇率换算造成误导。
- 预算默认不包含：
  - 域名注册费
  - 短信、邮件、CDN、WAF 等增值服务
  - 人工运维时间成本

## 2. 基础假设

## 2.1 短期 demo 环境

- 目标：内部评审 / 小范围试用 / 4-8 周验证
- 组件：
  - 1 台应用服务器
  - 反向代理
  - Docker 化部署
  - 免费 SSL
- 不包含：
  - 托管数据库
  - 负载均衡
  - 多实例高可用

## 2.2 B-Lite 中期 pilot 环境

- 目标：1-3 个月内接真实用户
- 组件：
  - 1 台应用服务器
  - 1 个托管 PostgreSQL
  - 1 个对象存储
  - 反向代理
  - Docker Compose
- 不包含：
  - 负载均衡
  - Redis
  - 多活架构

## 3. 腾讯云

## 3.1 腾讯云短期 demo 清单

### 部署清单

- `Lighthouse`：`2核 4GB / 100GB SSD / 7Mbps / 1000GB月流量`
- 区域：
  - 中国内地：如果很快就要面向国内用户做真实测试
  - 香港：如果先做内部跨境试用
- 操作系统：`Ubuntu 24.04 LTS`
- 应用层：
  - `Node 22`
  - `Docker`
  - `Caddy` 或 `Nginx`
- 发布：
  - GitHub 拉取部署或手动滚动发布
- 证书：
  - `Let's Encrypt`
- 备份：
  - 应用配置备份
  - 代码在 GitHub
  - 轻量实例快照

### 预算拆分

- 公开可确认固定成本：
  - `Lighthouse 2核4GB`：`100元/月` 或 `1020元/年`
- 使用量相关成本：
  - 超额流量：按地域另计
- 规划预留预算：
  - `100-130元/月 + 域名`

### 适合什么时候用

- 只打算做一轮 demo
- 暂时不接真实长期数据
- 希望先把产品跑起来

## 3.2 腾讯云 B-Lite 清单

### 部署清单

- 应用层：
  - 方案 1：继续用 `Lighthouse 2核4GB`
  - 方案 2：切到 `CVM 2核4GB`
- 数据层：
  - `TencentDB for PostgreSQL`
- 文件层：
  - `COS`
- 网络与安全：
  - `VPC`
  - `安全组`
  - 内网访问数据库
- 应用运行：
  - `Docker Compose`
  - `Caddy` / `Nginx`
  - `.env` secrets
- 备份：
  - TencentDB 自动备份
  - COS 桶版本控制或生命周期策略

### 预算拆分

- 公开可确认固定成本：
  - `CVM 2核4GB 北京 50G系统盘 1Mbps`：`1567元/年`
    - 折算约 `130.6元/月`
  - 如果继续用 `Lighthouse 2核4GB`，应用层可维持在 `100元/月`
- 使用量相关成本：
  - `TencentDB for PostgreSQL`：官方采用按量计费，费用由 `内存/CPU + 存储 + 备份超额空间` 组成
  - `COS`：按存储量、请求量和下行流量计费
  - PostgreSQL 备份超额空间：
    - 中国内地：`0.000118 美元 / GB / 小时`
    - 但免费额度是已购存储的 `100%`
- 预算外推：
  - 按腾讯云 PostgreSQL 官方计费示例的阶梯规则外推，在广州地域、`4GB 内存 + 20GB 存储` 的入门实例，月度大致会落在 `500+ 元` 人民币量级，未含超额备份和其他增值项。
- 规划预留预算：
  - 如果应用层继续用 `Lighthouse`：
    - 建议按 `650-900元/月 + 域名` 预留
  - 如果应用层改用 `CVM`：
    - 建议按 `700-1000元/月 + 域名` 预留

### 适合什么时候用

- 你明确要优先服务中国用户
- 你愿意为国内网络体验和迁移工具支付更高数据库预算
- 你希望后续继续留在腾讯云生态

## 4. 阿里云

## 4.1 阿里云短期 demo 清单

### 部署清单

- `Simple Application Server`
- 推荐规格：
  - `2核 4GB / 80GB SSD / 15Mbps / 4TB月流量`
- 操作系统：`Ubuntu 24.04 LTS`
- 应用层：
  - `Node 22`
  - `Docker`
  - `Caddy` / `Nginx`
- 证书：
  - `Let's Encrypt`
- 备份：
  - 官方 FAQ 说明轻量实例快照在配额范围内免费

### 预算拆分

- 公开可确认固定成本：
  - `Simple Application Server 2核4GB 80GB`：`$19/月`
- 使用量相关成本：
  - 超额流量：按地域另计
- 规划预留预算：
  - `19-25 美元/月 + 域名`

### 适合什么时候用

- 想先在阿里云跑国内 demo
- 想保留后续切到 ECS / RDS / OSS 的路径

## 4.2 阿里云 B-Lite 清单

### 部署清单

- 应用层：
  - `Simple Application Server 2核4GB`
  - 或后续迁移到 `ECS`
- 数据层：
  - `ApsaraDB RDS for PostgreSQL`
  - 优先考虑：
    - 入门试用：`Serverless`
    - 更稳定 pilot：`标准 RDS`
- 文件层：
  - `OSS`
- 网络与安全：
  - 安全组 / 白名单
  - 数据库内网访问
- 应用运行：
  - `Docker Compose`
  - 反向代理
- 备份：
  - RDS 自动备份
  - OSS 生命周期策略

### 预算拆分

- 公开可确认固定成本：
  - 应用服务器：`$19/月`
  - `RDS Serverless`：`$0.02/小时` 起
    - 如果整月持续占用同一最低单位，粗略下限约 `14.6美元/月`
  - `RDS Standard`：`$0.05/小时` 起
    - 粗略下限约 `36.5美元/月`
- 使用量相关成本：
  - `OSS`：按存储量、请求量、下行流量计费
- 规划预留预算：
  - `Serverless B-Lite`：`35-55 美元/月 + 域名`
  - `Standard RDS B-Lite`：`55-80 美元/月 + 域名`

### 适合什么时候用

- 希望走国内正式生产路线
- 更看重长期运营和文档完备性
- 希望数据库预算更透明

## 5. DigitalOcean

## 5.1 DigitalOcean 短期 demo 清单

### 部署清单

- `Droplet 2 vCPU / 4 GB / 80 GB SSD`
- 区域优先：`Singapore`
- 操作系统：`Ubuntu 24.04`
- 应用层：
  - `Docker`
  - `Caddy` / `Nginx`
- SSL：
  - `Let's Encrypt`
- 备份：
  - 可选 Droplet Backups

### 预算拆分

- 公开可确认固定成本：
  - `Droplet 2 vCPU / 4 GB / 80 GB`：`$24/月`
- 可选固定成本：
  - 周备份：Droplet 费用的 `20%`
  - 日备份：Droplet 费用的 `30%`
- 规划预留预算：
  - 不带备份：`$24/月 + 域名`
  - 带周备份：`$28.8/月 + 域名`
  - 带日备份：`$31.2/月 + 域名`

## 5.2 DigitalOcean B-Lite 清单

### 部署清单

- 应用层：
  - `Droplet 2 vCPU / 4 GB`
- 数据层：
  - `Managed PostgreSQL`
- 文件层：
  - `Spaces`
- 网络与安全：
  - VPC
  - Firewall
- 运行：
  - Docker Compose
- 备份：
  - Managed DB 自带每日备份和 PITR

### 预算拆分

- 公开可确认固定成本：
  - Droplet：`$24/月`
  - Managed Database：`$15/月` 起
  - Spaces：`$5/月` 起
- 规划预留预算：
  - `44-55 美元/月 + 域名`
  - 如果应用层升到 `4 vCPU / 8 GB`：
    - Droplet 变为 `48美元/月`
    - 总预算约 `68-80美元/月 + 域名`

### 适合什么时候用

- 海外节点验证
- 小团队优先考虑维护简单
- 不以中国内地网络体验为第一目标

## 6. AWS

## 6.1 AWS 短期 demo 清单

### 部署清单

- `Lightsail 2 vCPU / 4 GB / 80 GB SSD`
- 区域：`Singapore` 优先
- 操作系统：`Ubuntu`
- 应用层：
  - Docker
  - Caddy / Nginx
- SSL：
  - Let's Encrypt

### 预算拆分

- 公开可确认固定成本：
  - Lightsail `2 vCPU / 4 GB / 80 GB`：`$24/月`
- 规划预留预算：
  - `24-30 美元/月 + 域名`

## 6.2 AWS B-Lite 清单

### 部署清单

- 应用层：
  - `Lightsail 2 vCPU / 4 GB`
  - 或后续迁到 `EC2`
- 数据层：
  - `Lightsail Managed Database`
    - `Micro $15/月`
    - `Small $30/月`
- 文件层：
  - `S3`
- 网络：
  - Security Group / Firewall
- 运行：
  - Docker Compose

### 预算拆分

- 公开可确认固定成本：
  - App：`$24/月`
  - DB：`$15-30/月`
- 使用量相关成本：
  - `S3`：按量计费，无最低消费
- 规划预留预算：
  - `40-60 美元/月 + 域名`

### 适合什么时候用

- 海外路线
- 将来可能走更完整 AWS 全球化体系
- 可接受更高学习和平台复杂度

## 7. 我建议你怎么选

## 7.1 如果你要的是“这周就能上线 demo”

- 国内优先：
  - `腾讯云 Lighthouse 2核4GB`
  - 预算口径：`100-130元/月 + 域名`
- 海外优先：
  - `DigitalOcean Droplet 2vCPU/4GB`
  - 预算口径：`24-31.2美元/月 + 域名`

## 7.2 如果你要的是“1-3 个月内可持续试用”

- 国内优先：
  - `阿里云 B-Lite`
  - 原因：
    - 公开价格更透明
    - 托管 PostgreSQL 下限更容易估
    - 长期运维文档完整
  - 预算口径：
    - `35-80美元/月 + 域名`
- 海外优先：
  - `DigitalOcean B-Lite`
  - 预算口径：
    - `44-55美元/月 + 域名`

## 7.3 如果你问我今天最实用的决策

- `短期 demo`：
  - 直接上 `腾讯云 Lighthouse 2核4GB`
- `准备接真实用户`：
  - 直接上 `阿里云 B-Lite` 或 `DigitalOcean B-Lite`

- 原因：
  - 腾讯云的轻量主机做 demo 非常划算。
  - 但从公开可读价格和数据库预算透明度看，阿里云 / DigitalOcean 的 B-Lite 更容易做预算和长期维护。

## 8. 参考来源

- 腾讯云 Lighthouse 中文定价页：https://cloud.tencent.com/product/lighthouse/pricing
- 腾讯云 CVM 中文产品页：https://cloud.tencent.com/product/cvm
- 腾讯云 PostgreSQL 计费概述：https://www.tencentcloud.com/document/product/409/39560
- 腾讯云 PostgreSQL 备份空间计费：https://www.tencentcloud.com/document/product/409/55351
- 腾讯云 DTS 产品页：https://www.tencentcloud.com/products/dts
- 腾讯云 COS 产品页：https://www.tencentcloud.com/products/cos
- 腾讯云 COS S3 兼容配置文档：https://www.tencentcloud.com/document/product/436/34688
- 阿里云 Simple Application Server Pricing：https://www.alibabacloud.com/product/swas/pricing
- 阿里云轻量应用服务器 Billing FAQ：https://www.alibabacloud.com/help/en/simple-application-server/product-overview/billing-faq
- 阿里云 RDS 产品页：https://www.alibabacloud.com/product/apsaradb-rds
- 阿里云 RDS 产品说明文档：https://www.alibabacloud.com/help/en/rds/product-overview/what-is-apsaradb-rds-what-is-apsaradb-rds
- DigitalOcean Pricing：https://www.digitalocean.com/pricing
- DigitalOcean PostgreSQL 特性：https://docs.digitalocean.com/products/databases/postgresql/details/features/
- DigitalOcean Spaces：https://www.digitalocean.com/products/spaces
- AWS Lightsail Pricing：https://aws.amazon.com/lightsail/pricing/
- AWS Lightsail 功能总览：https://docs.aws.amazon.com/lightsail/latest/userguide/what-is-amazon-lightsail.html
- AWS Lightsail 数据库规格说明：https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-choosing-a-database.html
- Amazon S3 Pricing：https://aws.amazon.com/s3/pricing/
