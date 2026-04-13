import Link from "next/link";
import { Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";
import { coachHomeSummary, coachQueue, studentSummaries } from "@/lib/sample-data";

export default function CoachHomePage() {
  return (
    <ScreenShell
      label="教练 / 今日"
      title="先处理这 3 人"
      description="不要先翻历史，从今天需要你判断的人开始。"
      footer={<BottomNav active="Today" />}
    >
      <Panel
        title="先从待复核学员开始"
        eyebrow="今天怎么开始"
        badge={<Badge tone="ghost">{coachHomeSummary.reviewCount} 位待复核</Badge>}
      >
        <p>{coachHomeSummary.detail}</p>
        <Link className="text-link" href="/coach/getting-started">
          打开新手教程
        </Link>
      </Panel>

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
            <p className="queue-card__summary">{item.summary}</p>
            <span className="queue-card__cta">查看学员页</span>
          </Link>
        ))}
      </div>
    </ScreenShell>
  );
}
