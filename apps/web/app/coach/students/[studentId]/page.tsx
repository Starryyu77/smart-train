import { notFound } from "next/navigation";
import { Hero, Section, StatusPill } from "@/components/ui";
import { workspaceSnapshots } from "@/lib/sample-data";

export default async function CoachStudentWorkspace({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const snapshot = workspaceSnapshots[studentId];

  if (!snapshot) {
    notFound();
  }

  return (
    <main className="page-stack">
      <Hero
        eyebrow="Coach workspace"
        title={snapshot.student.name}
        description={`${snapshot.currentPhase} · ${snapshot.student.currentGoal}`}
      >
        <div className="nav-links">
          <span className="nav-link">Active plan: {snapshot.student.activeProgramVersion}</span>
          <span className="nav-link">Primary risk: {snapshot.primaryRisk}</span>
        </div>
      </Hero>

      <div className="grid grid--workspace">
        <div className="page-stack">
          <Section
            title="Latest execution"
            description="The first coach view is evidence-first. The active session result stays above charts and historical abstractions."
            meta={<StatusPill>{snapshot.latestExecution.adherence} adherence</StatusPill>}
          >
            <div className="page-stack">
              <div className="split">
                <strong>{snapshot.latestExecution.title}</strong>
                <span className="muted">{snapshot.latestExecution.completedAt}</span>
              </div>
              <p>{snapshot.latestExecution.note}</p>
            </div>
          </Section>

          <Section
            title="Timeline"
            description="Key evidence stays chronological so every later summary can point back to concrete events."
          >
            <div className="timeline">
              {snapshot.timeline.map((event) => (
                <div className="timeline__row" key={event.id}>
                  <div className="timeline__date">{event.occurredAt.slice(5, 16).replace("T", " ")}</div>
                  <div className="page-stack">
                    <strong>{event.title}</strong>
                    <p>{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="page-stack">
          <Section
            title="Latest feedback"
            description="Student H5 stays thin, but the signal quality still shows up clearly inside the coach workspace."
            meta={<StatusPill tone={snapshot.latestFeedback.painFlag ? "warning" : "default"}>{snapshot.latestFeedback.painFlag ? "pain flag" : "stable"}</StatusPill>}
          >
            <div className="list">
              <div className="list-item">
                <div className="split">
                  <strong>Sleep</strong>
                  <span>{snapshot.latestFeedback.sleep}</span>
                </div>
              </div>
              <div className="list-item">
                <div className="split">
                  <strong>Soreness</strong>
                  <span>{snapshot.latestFeedback.soreness}</span>
                </div>
              </div>
              <div className="list-item">
                <div className="split">
                  <strong>Adherence</strong>
                  <span>{snapshot.latestFeedback.adherence}</span>
                </div>
              </div>
              <div className="list-item">
                <p>{snapshot.latestFeedback.note}</p>
              </div>
            </div>
          </Section>

          <Section
            title="Open alerts"
            description="Rules stay ahead of AI. This rail is where blocking risk becomes visible."
            meta={<StatusPill tone="danger">{snapshot.alerts.length} open</StatusPill>}
          >
            <div className="list">
              {snapshot.alerts.map((alert) => (
                <div className="list-item" key={alert.id}>
                  <div className="split">
                    <strong>{alert.title}</strong>
                    <StatusPill tone={alert.severity === "high" ? "danger" : "warning"}>{alert.severity}</StatusPill>
                  </div>
                  <p>{alert.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Draft recovery"
            description="Low-connectivity logging support is now an explicit part of the implementation baseline."
          >
            <div className="page-stack">
              <StatusPill>{snapshot.draftRecovery.status}</StatusPill>
              <p>{snapshot.draftRecovery.note}</p>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}

