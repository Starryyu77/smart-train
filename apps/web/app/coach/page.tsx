import Link from "next/link";
import { Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
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
