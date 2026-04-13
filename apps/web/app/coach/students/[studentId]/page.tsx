import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";
import { coachDecisionByStudentId, workspaceSnapshots } from "@/lib/sample-data";

export default async function CoachStudentWorkspace({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const snapshot = workspaceSnapshots[studentId];
  const coachDecision = coachDecisionByStudentId[studentId];

  if (!snapshot || !coachDecision) {
    notFound();
  }

  return (
    <ScreenShell
      label="教练 / 学员"
      title={snapshot.student.name}
      description="先把这次训练和恢复信号比清楚，再决定下一步。"
      leading={
        <Link className="back-link" href="/coach">
          返回
        </Link>
      }
      footer={<BottomNav active="Athletes" />}
    >
      <section className="summary-card">
        <div className="row-inline">
          <Badge>{snapshot.student.activeProgramVersion}</Badge>
          <Badge tone="coral">疼痛观察</Badge>
        </div>
        <section className="summary-item">
          <span className="summary-item__label">当前目标</span>
          <p className="summary-item__value">{snapshot.student.currentGoal}</p>
        </section>
        <section className="summary-item summary-item--accent">
          <span className="summary-item__label">当前风险</span>
          <p className="summary-item__value">{snapshot.primaryRisk}</p>
        </section>
      </section>

      <div className="stack">
        <Panel
          title="执行 vs 恢复"
          eyebrow="先看这两个信号"
          badge={<Badge tone="ghost">一眼判断</Badge>}
        >
          <div className="compare-grid">
            <section className="compare-cell">
              <div className="compare-cell__summary">
                <span className="compare-cell__label">最近执行</span>
                <p className="compare-cell__headline">{snapshot.latestExecution.title}</p>
              </div>
              <div className="mini-stat-list">
                <div className="mini-stat-row">
                  <span>时间</span>
                  <span className="mini-stat-row__value">
                    {snapshot.latestExecution.completedAt.slice(5, 16).replace("T", " ")}
                  </span>
                </div>
                <div className="mini-stat-row">
                  <span>完成度</span>
                  <span className="mini-stat-row__value">{snapshot.latestExecution.adherence}</span>
                </div>
              </div>
              <p>{snapshot.latestExecution.note}</p>
            </section>

            <section className="compare-cell compare-cell--accent">
              <div className="compare-cell__summary">
                <span className="compare-cell__label">最近恢复</span>
                <p className="compare-cell__headline">
                  {snapshot.latestFeedback.painFlag ? "需要关注" : "基本稳定"}
                </p>
              </div>
              <div className="mini-stat-list">
                <div className="mini-stat-row">
                  <span>睡眠</span>
                  <span className="mini-stat-row__value">{snapshot.latestFeedback.sleep}</span>
                </div>
                <div className="mini-stat-row">
                  <span>酸痛</span>
                  <span className="mini-stat-row__value">{snapshot.latestFeedback.soreness}</span>
                </div>
                <div className="mini-stat-row">
                  <span>完成度</span>
                  <span className="mini-stat-row__value">{snapshot.latestFeedback.adherence}</span>
                </div>
              </div>
              <p>{snapshot.latestFeedback.note}</p>
            </section>
          </div>
        </Panel>

        <Panel title="教练判断" eyebrow="现在该怎么做" tone="lime">
          <p>{coachDecision.summary}</p>
          <p className="panel-emphasis">{coachDecision.action}</p>
        </Panel>

        <Panel
          title="时间线"
          eyebrow="只保留关键证据"
          badge={<Badge tone="ghost">{snapshot.timeline.length} 条事件</Badge>}
        >
          <div className="timeline-list">
            {snapshot.timeline.map((event) => (
              <div className="timeline-list__item" key={event.id}>
                <span className="timeline-list__stamp">
                  {event.occurredAt.slice(5, 16).replace("T", " ")}
                </span>
                <div className="stack-tight">
                  <p className="timeline-list__title">{event.title}</p>
                  <p>{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href={`/coach/students/${studentId}/log-session`}>记录训练</ActionLink>
        <ActionLink href={`/coach/students/${studentId}/plan-adjustment`} tone="secondary">
          调整计划
        </ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          打开恢复反馈
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
