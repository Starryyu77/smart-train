import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";
import { coachDecisionByStudentId, workspaceSnapshots } from "@/lib/sample-data";

const STUDENT_PAGE_COPY: Record<
  string,
  { goal: string; risk: string; execution: string; recovery: string }
> = {
  student_lin: {
    goal: "增肌推进",
    risk: "腰背观察",
    execution: "RDL 已降重",
    recovery: "晨起腰背有顶感",
  },
  student_zhou: {
    goal: "恢复规律",
    risk: "暂不加复杂度",
    execution: "上肢完成稳定",
    recovery: "恢复平稳",
  },
  student_mei: {
    goal: "重建节奏",
    risk: "计划待刷新",
    execution: "训练中途结束",
    recovery: "重返节奏困难",
  },
};

export default async function CoachStudentWorkspace({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const snapshot = workspaceSnapshots[studentId];
  const coachDecision = coachDecisionByStudentId[studentId];
  const pageCopy = STUDENT_PAGE_COPY[studentId];

  if (!snapshot || !coachDecision || !pageCopy) {
    notFound();
  }

  return (
    <ScreenShell
      label="教练 / 学员"
      title={snapshot.student.name}
      description="先看执行和恢复。"
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
          <span className="summary-item__label">目标</span>
          <p className="summary-item__value">{pageCopy.goal}</p>
        </section>
        <section className="summary-item summary-item--accent">
          <span className="summary-item__label">风险</span>
          <p className="summary-item__value">{pageCopy.risk}</p>
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
              <p>{pageCopy.execution}</p>
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
              <p>{pageCopy.recovery}</p>
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
