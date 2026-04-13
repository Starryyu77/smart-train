import Link from "next/link";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { coachHomeSummary, coachQueue, studentSummaries } from "@/lib/sample-data";

export default function CoachHomePage() {
  return (
    <ScreenShell
      label="教练 / 今日"
      title="今日重点"
      description="一个教练应该能在一只手上完成今天的优先级判断。"
      footer={<BottomNav active="Today" />}
    >
      <section className="hero-callout">
        <Badge tone="ghost">{coachHomeSummary.reviewCount} 位学员待复核</Badge>
        <h2>{coachHomeSummary.headline}</h2>
        <p>{coachHomeSummary.detail}</p>
      </section>

      <Panel title="第一次使用？" eyebrow="新手引导" badge={<Badge tone="ghost">30 秒</Badge>}>
        <p>先看一遍“今日页 到 学员页 到 记录训练 到 调整计划 到 学员反馈”的顺序，你就知道这个产品怎么用了。</p>
        <ActionLink href="/coach/getting-started">打开新手教程</ActionLink>
      </Panel>

      <section className="metric-grid">
        <MetricTile
          label="今日课程"
          value={String(studentSummaries.length + 3)}
          detail="已记录 2 次"
        />
        <MetricTile
          label="风险提醒"
          value="2"
          detail="1 个阻断"
          tone="lime"
        />
      </section>

      <div className="stack">
        {coachQueue.map((item) => (
          <Link className="panel-link" href={`/coach/students/${item.studentId}`} key={item.studentId}>
            <Panel
              title={item.name}
              eyebrow={item.phase}
              badge={<Badge tone={item.tone}>{item.status}</Badge>}
            >
              <p>{item.summary}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </ScreenShell>
  );
}
