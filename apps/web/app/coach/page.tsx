import Link from "next/link";
import { Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { coachHomeSummary, coachQueue, studentSummaries } from "@/lib/sample-data";

export default function CoachHomePage() {
  return (
    <ScreenShell
      label="coach / home"
      title="Today"
      description="一个教练应该能在一只手上完成今天的优先级判断。"
      footer={<BottomNav active="Today" />}
    >
      <section className="hero-callout">
        <Badge tone="ghost">{coachHomeSummary.reviewCount} athletes need review</Badge>
        <h2>{coachHomeSummary.headline}</h2>
        <p>{coachHomeSummary.detail}</p>
      </section>

      <section className="metric-grid">
        <MetricTile
          label="today sessions"
          value={String(studentSummaries.length + 3)}
          detail="2 already logged"
        />
        <MetricTile
          label="active alerts"
          value="2"
          detail="1 blocking"
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

