import Link from "next/link";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { coachHomeSummary, coachQueue, studentSummaries } from "@/lib/sample-data";

export default function CoachHomePage() {
  return (
    <ScreenShell
      label="教练 / 今日"
      title="先处理这 3 人"
      description="不要先翻历史，从今天需要你判断的人开始。"
      footer={<BottomNav active="Today" />}
    >
      <section className="hero-callout hero-callout--tight">
        <div className="row-inline">
          <Badge tone="ghost">{coachHomeSummary.reviewCount} 位学员待复核</Badge>
          <Link className="text-link" href="/coach/getting-started">
            新手教程
          </Link>
        </div>
        <h2>{coachHomeSummary.headline}</h2>
        <p>{coachHomeSummary.detail}</p>
      </section>

      <section className="signal-strip">
        <div className="signal-chip">
          <span className="signal-chip__label">待处理</span>
          <strong className="signal-chip__value">{coachHomeSummary.reviewCount} 人</strong>
          <p className="signal-chip__detail">今天先看谁</p>
        </div>
        <div className="signal-chip">
          <span className="signal-chip__label">今日课程</span>
          <strong className="signal-chip__value">{String(studentSummaries.length + 3)}</strong>
          <p className="signal-chip__detail">已记录 2 次</p>
        </div>
        <div className="signal-chip signal-chip--lime">
          <span className="signal-chip__label">阻断提醒</span>
          <strong className="signal-chip__value">1 个</strong>
          <p className="signal-chip__detail">需要先处理</p>
        </div>
      </section>

      <div className="queue-list">
        {coachQueue.map((item) => (
          <Link className="queue-card" href={`/coach/students/${item.studentId}`} key={item.studentId}>
            <div className="queue-card__top">
              <div className="stack-tight">
                <span className="queue-card__eyebrow">{item.phase}</span>
                <h3>{item.name}</h3>
              </div>
              <Badge tone={item.tone}>{item.status}</Badge>
            </div>
            <div className="queue-card__reason">
              <span className="queue-card__label">为什么现在看</span>
              <p>{item.summary}</p>
            </div>
            <span className="queue-card__cta">进入学员页</span>
          </Link>
        ))}
      </div>
    </ScreenShell>
  );
}
