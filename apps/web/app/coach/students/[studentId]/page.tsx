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
      description="让下一次动作调整变得明确，而不是在聊天记录里翻找依据。"
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

      <section className="metric-grid">
        <MetricTile
          label="完成度"
          value={snapshot.latestExecution.adherence}
          detail="已调整负荷"
        />
        <MetricTile
          label="睡眠"
          value={snapshot.latestFeedback.sleep}
          detail="延迟信号"
          tone="lime"
        />
      </section>

      <div className="stack">
        <Panel
          title="最近一次执行"
          eyebrow={snapshot.latestExecution.completedAt.slice(5, 16).replace("T", " ")}
          badge={<Badge tone="ghost">已记录</Badge>}
        >
          <p>{snapshot.latestExecution.note}</p>
        </Panel>

        <Panel
          title="最近反馈"
          eyebrow={snapshot.latestFeedback.submittedAt.slice(5, 16).replace("T", " ")}
          badge={<Badge tone={snapshot.latestFeedback.painFlag ? "coral" : "ghost"}>{snapshot.latestFeedback.painFlag ? "关注" : "稳定"}</Badge>}
        >
          <div className="stat-list">
            <div className="stat-list__row">
              <span>睡眠</span>
              <strong>{snapshot.latestFeedback.sleep}</strong>
            </div>
            <div className="stat-list__row">
              <span>酸痛</span>
              <strong>{snapshot.latestFeedback.soreness}</strong>
            </div>
            <div className="stat-list__row">
              <span>完成度</span>
              <strong>{snapshot.latestFeedback.adherence}</strong>
            </div>
          </div>
          <p>{snapshot.latestFeedback.note}</p>
        </Panel>

        <Panel
          title="教练判断"
          eyebrow="下一步"
          tone="lime"
        >
          <p>{coachDecision.summary}</p>
          <p className="panel-emphasis">{coachDecision.action}</p>
        </Panel>

        <Panel
          title="时间线"
          eyebrow="证据"
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
