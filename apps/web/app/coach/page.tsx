import Link from "next/link";
import { ActionLink, Badge, BottomNav, ScreenShell } from "@/components/ui";
import { coachHomeSummary, coachQueue } from "@/lib/sample-data";

const QUEUE_HINTS: Record<string, string> = {
  student_lin: "腰背信号抬头",
  student_zhou: "可以小步进阶",
  student_mei: "计划 12 天未刷新",
};

export default function CoachHomePage() {
  return (
    <ScreenShell
      label="教练 / 今日"
      title="今日"
      description="先选一个人。"
      footer={<BottomNav active="Today" />}
    >
      <div className="stack">
        <ActionLink href="/coach/getting-started">第一次使用？先看 30 秒上手</ActionLink>
        <p className="meta-caption">新手教程还在，这里就是入口。</p>
      </div>

      <section className="signal-strip signal-strip--two">
        <div className="signal-chip">
          <span className="signal-chip__label">待处理</span>
          <strong className="signal-chip__value">{coachHomeSummary.reviewCount} 人</strong>
          <p className="signal-chip__detail">先处理</p>
        </div>
        <div className="signal-chip signal-chip--lime">
          <span className="signal-chip__label">阻断提醒</span>
          <strong className="signal-chip__value">1 个</strong>
          <p className="signal-chip__detail">优先复核</p>
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
            <p className="queue-card__summary">{QUEUE_HINTS[item.studentId]}</p>
            <span className="queue-card__cta">查看学员页</span>
          </Link>
        ))}
      </div>
    </ScreenShell>
  );
}
