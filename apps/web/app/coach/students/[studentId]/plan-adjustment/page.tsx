import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { planAdjustmentDraftByStudentId, workspaceSnapshots } from "@/lib/sample-data";

const CHANGE_TONE_TO_BADGE: Record<string, "lime" | "coral" | "ghost" | "default"> = {
  increase: "lime",
  decrease: "coral",
  hold: "ghost",
  focus: "default",
};

export default async function CoachPlanAdjustmentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const snapshot = workspaceSnapshots[studentId];
  const planDraft = planAdjustmentDraftByStudentId[studentId];

  if (!snapshot || !planDraft) {
    notFound();
  }

  return (
    <ScreenShell
      label="coach / plan"
      title={planDraft.nextVersion}
      description="版本调整应该是一页内做完的判断，不该退化成重型编辑器。"
      leading={
        <Link className="back-link" href={`/coach/students/${studentId}/log-session`}>
          Back
        </Link>
      }
      footer={<BottomNav active="Athletes" />}
    >
      <section className="hero-panel">
        <div className="row-inline">
          <Badge>{planDraft.baseVersion}</Badge>
          <Badge tone="lime">{planDraft.publishStatus}</Badge>
        </div>
        <h2>{planDraft.reasonHeadline}</h2>
        <p>{planDraft.reasonDetail}</p>

        <div className="version-rail">
          <div className="version-rail__item">
            <span className="meta-caption">base</span>
            <strong>{planDraft.baseVersion}</strong>
          </div>
          <div className="version-rail__arrow">→</div>
          <div className="version-rail__item version-rail__item--next">
            <span className="meta-caption">next</span>
            <strong>{planDraft.nextVersion}</strong>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        <MetricTile
          label="linked session"
          value={planDraft.basedOnSession}
          detail={snapshot.latestExecution.adherence}
        />
        <MetricTile
          label="review window"
          value={planDraft.reviewWindow}
          detail={planDraft.focusArea}
          tone="lime"
        />
      </section>

      <div className="stack">
        <Panel title="Why this version changes" eyebrow="evidence" badge={<Badge tone="ghost">diff-first</Badge>}>
          <p className="panel-emphasis">{planDraft.evidenceSummary}</p>
          <p>{planDraft.reasonDetail}</p>
        </Panel>

        <Panel
          title="Version diff"
          eyebrow="changes"
          badge={<Badge tone="ghost">{planDraft.changes.length} edits</Badge>}
        >
          <div className="change-list">
            {planDraft.changes.map((change) => (
              <section className="change-item" key={change.id}>
                <div className="change-item__top">
                  <div className="stack-tight">
                    <strong>{change.exerciseLabel}</strong>
                    <p className="meta-caption">{change.sessionLabel}</p>
                  </div>
                  <Badge tone={CHANGE_TONE_TO_BADGE[change.tone]}>{change.tone}</Badge>
                </div>
                <div className="diff-pair">
                  <div className="diff-pair__side">
                    <span className="meta-caption">from</span>
                    <p>{change.fromValue}</p>
                  </div>
                  <div className="diff-pair__divider">→</div>
                  <div className="diff-pair__side diff-pair__side--next">
                    <span className="meta-caption">to</span>
                    <p>{change.toValue}</p>
                  </div>
                </div>
                <p>{change.reason}</p>
              </section>
            ))}
          </div>
        </Panel>

        <Panel title="Publish checklist" eyebrow="guardrails" tone="lime">
          <div className="check-list">
            {planDraft.checklist.map((item) => (
              <div className="check-list__item" key={item}>
                <span className="check-list__dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p>{planDraft.publishNote}</p>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href={`/coach/students/${studentId}`}>Publish {planDraft.nextVersion}</ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          Open linked recovery flow
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
