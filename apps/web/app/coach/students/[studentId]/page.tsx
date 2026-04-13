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
      label="coach / athlete"
      title={snapshot.student.name}
      description="让下一次动作调整变得明确，而不是在聊天记录里翻找依据。"
      leading={
        <Link className="back-link" href="/coach">
          Back
        </Link>
      }
      footer={<BottomNav active="Athletes" />}
    >
      <section className="hero-panel">
        <div className="row-inline">
          <Badge>{snapshot.student.activeProgramVersion}</Badge>
          <Badge tone="coral">pain watch</Badge>
        </div>
        <h2>{snapshot.student.currentGoal}</h2>
        <p>{snapshot.primaryRisk}</p>
      </section>

      <section className="metric-grid">
        <MetricTile
          label="adherence"
          value={snapshot.latestExecution.adherence}
          detail="load adjusted"
        />
        <MetricTile
          label="sleep"
          value={snapshot.latestFeedback.sleep}
          detail="late signal"
          tone="lime"
        />
      </section>

      <div className="stack">
        <Panel
          title="Latest execution"
          eyebrow={snapshot.latestExecution.completedAt.slice(5, 16).replace("T", " ")}
          badge={<Badge tone="ghost">logged</Badge>}
        >
          <p>{snapshot.latestExecution.note}</p>
        </Panel>

        <Panel
          title="Latest feedback"
          eyebrow={snapshot.latestFeedback.submittedAt.slice(5, 16).replace("T", " ")}
          badge={<Badge tone={snapshot.latestFeedback.painFlag ? "coral" : "ghost"}>{snapshot.latestFeedback.painFlag ? "watch" : "stable"}</Badge>}
        >
          <div className="stat-list">
            <div className="stat-list__row">
              <span>Sleep</span>
              <strong>{snapshot.latestFeedback.sleep}</strong>
            </div>
            <div className="stat-list__row">
              <span>Soreness</span>
              <strong>{snapshot.latestFeedback.soreness}</strong>
            </div>
            <div className="stat-list__row">
              <span>Adherence</span>
              <strong>{snapshot.latestFeedback.adherence}</strong>
            </div>
          </div>
          <p>{snapshot.latestFeedback.note}</p>
        </Panel>

        <Panel
          title="Coach decision"
          eyebrow="next step"
          tone="lime"
        >
          <p>{coachDecision.summary}</p>
          <p className="panel-emphasis">{coachDecision.action}</p>
        </Panel>

        <Panel
          title="Timeline"
          eyebrow="evidence"
          badge={<Badge tone="ghost">{snapshot.timeline.length} events</Badge>}
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
        <ActionLink href={`/coach/students/${studentId}/log-session`}>Log session</ActionLink>
        <ActionLink href={`/coach/students/${studentId}/plan-adjustment`} tone="secondary">
          Adjust plan
        </ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          Open recovery check-in
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
