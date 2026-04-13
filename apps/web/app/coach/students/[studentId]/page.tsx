import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
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
      <section className="hero-panel">
        <div className="row-inline">
          <Badge>{snapshot.student.activeProgramVersion}</Badge>
          <Badge tone="coral">疼痛观察</Badge>
        </div>
        <h2>{snapshot.student.currentGoal}</h2>
        <p>{snapshot.primaryRisk}</p>
      </section>

      <div className="stack">
        <Panel
          title="执行 vs 恢复"
          eyebrow="先看这两个信号"
          badge={<Badge tone="ghost">一眼判断</Badge>}
        >
          <div className="compare-grid">
            <section className="compare-cell">
              <span className="compare-cell__label">最近执行</span>
              <strong>{snapshot.latestExecution.title}</strong>
              <div className="mini-stat-list">
                <div className="mini-stat-row">
                  <span>时间</span>
                  <strong>{snapshot.latestExecution.completedAt.slice(5, 16).replace("T", " ")}</strong>
                </div>
                <div className="mini-stat-row">
                  <span>完成度</span>
                  <strong>{snapshot.latestExecution.adherence}</strong>
                </div>
              </div>
              <p>{snapshot.latestExecution.note}</p>
            </section>

            <section className="compare-cell compare-cell--accent">
              <span className="compare-cell__label">最近恢复</span>
              <strong>{snapshot.latestFeedback.painFlag ? "需要关注" : "基本稳定"}</strong>
              <div className="mini-stat-list">
                <div className="mini-stat-row">
                  <span>睡眠</span>
                  <strong>{snapshot.latestFeedback.sleep}</strong>
                </div>
                <div className="mini-stat-row">
                  <span>酸痛</span>
                  <strong>{snapshot.latestFeedback.soreness}</strong>
                </div>
                <div className="mini-stat-row">
                  <span>完成度</span>
                  <strong>{snapshot.latestFeedback.adherence}</strong>
                </div>
              </div>
              <p>{snapshot.latestFeedback.note}</p>
            </section>
          </div>
        </Panel>

        <Panel
          title="教练判断"
          eyebrow="现在该怎么做"
          tone="lime"
        >
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
                  <strong>{event.title}</strong>
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
