import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { sessionLogDraftByStudentId, workspaceSnapshots } from "@/lib/sample-data";

function formatStamp(value: string) {
  return value.slice(5, 16).replace("T", " ");
}

export default async function CoachStudentLogSessionPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const snapshot = workspaceSnapshots[studentId];
  const sessionDraft = sessionLogDraftByStudentId[studentId];

  if (!snapshot || !sessionDraft) {
    notFound();
  }

  return (
    <ScreenShell
      label="coach / session"
      title={`Log ${sessionDraft.sessionLabel}`}
      description="训练结束后，教练应该能在 90 秒内留下足够准确的证据。"
      leading={
        <Link className="back-link" href={`/coach/students/${studentId}`}>
          Back
        </Link>
      }
      footer={<BottomNav active="Athletes" />}
    >
      <section className="hero-panel">
        <div className="row-inline">
          <Badge>{snapshot.student.activeProgramVersion}</Badge>
          <Badge tone={sessionDraft.draftRecovered ? "ghost" : "lime"}>
            {sessionDraft.draftRecovered ? "draft restored" : "live capture"}
          </Badge>
        </div>
        <h2>{snapshot.student.name}</h2>
        <p>{sessionDraft.handoffNote}</p>
        <div className="stack-tight">
          <div className="progress-meter">
            <div className="progress-meter__fill" style={{ width: `${sessionDraft.progressPercent}%` }} />
          </div>
          <p className="meta-caption">
            Started {formatStamp(sessionDraft.startedAt)} · {sessionDraft.syncStatus}
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <MetricTile
          label="sets logged"
          value={`${sessionDraft.loggedSets}/${sessionDraft.plannedSets}`}
          detail={sessionDraft.syncStatus}
        />
        <MetricTile
          label="load call"
          value={sessionDraft.painStatus}
          detail={sessionDraft.loadDecision}
          tone={sessionDraft.painRaised ? "default" : "lime"}
        />
      </section>

      <div className="stack">
        <Panel
          title="Session read"
          eyebrow="intensity"
          badge={<Badge tone={sessionDraft.painRaised ? "coral" : "ghost"}>{sessionDraft.readinessBadge}</Badge>}
        >
          <div className="stat-list">
            <div className="stat-list__row">
              <span>Target RPE</span>
              <strong>{sessionDraft.targetRpe}</strong>
            </div>
            <div className="stat-list__row">
              <span>Actual RPE</span>
              <strong>{sessionDraft.actualRpe}</strong>
            </div>
            <div className="stat-list__row">
              <span>Load change</span>
              <strong>{sessionDraft.loadChange}</strong>
            </div>
          </div>
          <p>{sessionDraft.intensityNote}</p>
        </Panel>

        <Panel
          title="Exercise blocks"
          eyebrow="actual vs planned"
          badge={<Badge tone="ghost">{sessionDraft.blocks.length} blocks</Badge>}
        >
          <div className="log-block-list">
            {sessionDraft.blocks.map((block) => (
              <section className="log-block" key={block.id}>
                <div className="log-block__top">
                  <div className="stack-tight">
                    <strong>{block.title}</strong>
                    <p className="meta-caption">Planned {block.planned}</p>
                  </div>
                  <Badge
                    tone={
                      block.status === "on-plan"
                        ? "ghost"
                        : block.status === "adjusted"
                          ? "coral"
                          : "default"
                    }
                  >
                    {block.status}
                  </Badge>
                </div>
                <p className="log-block__actual">{block.actual}</p>
                <p>{block.note}</p>
              </section>
            ))}
          </div>
        </Panel>

        <Panel title="Coach note" eyebrow="handoff" tone="lime">
          <p className="panel-emphasis">{sessionDraft.coachNote}</p>
          <p>{sessionDraft.handoffNote}</p>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href={`/coach/students/${studentId}/plan-adjustment`}>Adjust next plan</ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          Request recovery
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
