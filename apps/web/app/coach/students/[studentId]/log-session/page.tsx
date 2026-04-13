import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLink, Badge, BottomNav, MetricTile, Panel, ScreenShell } from "@/components/ui";
import { sessionLogDraftByStudentId, workspaceSnapshots } from "@/lib/sample-data";

const SESSION_BLOCK_STATUS_LABEL: Record<string, string> = {
  "on-plan": "按计划",
  adjusted: "已调整",
  "cut-short": "提前结束",
};

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
      label="教练 / 记录"
      title={`记录 ${sessionDraft.sessionLabel}`}
      description="训练结束后，教练应该能在 90 秒内留下足够准确的证据。"
      leading={
        <Link className="back-link" href={`/coach/students/${studentId}`}>
          返回
        </Link>
      }
      footer={<BottomNav active="Athletes" />}
    >
      <section className="hero-panel">
        <div className="row-inline">
          <Badge>{snapshot.student.activeProgramVersion}</Badge>
          <Badge tone={sessionDraft.draftRecovered ? "ghost" : "lime"}>
            {sessionDraft.draftRecovered ? "已恢复草稿" : "实时记录"}
          </Badge>
        </div>
        <h2>{snapshot.student.name}</h2>
        <p>{sessionDraft.handoffNote}</p>
        <div className="stack-tight">
          <div className="progress-meter">
            <div className="progress-meter__fill" style={{ width: `${sessionDraft.progressPercent}%` }} />
          </div>
          <p className="meta-caption">
            开始于 {formatStamp(sessionDraft.startedAt)} · {sessionDraft.syncStatus}
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <MetricTile
          label="已记录组数"
          value={`${sessionDraft.loggedSets}/${sessionDraft.plannedSets}`}
          detail={sessionDraft.syncStatus}
        />
        <MetricTile
          label="负荷判断"
          value={sessionDraft.painStatus}
          detail={sessionDraft.loadDecision}
          tone={sessionDraft.painRaised ? "default" : "lime"}
        />
      </section>

      <div className="stack">
        <Panel
          title="本次判断"
          eyebrow="强度"
          badge={<Badge tone={sessionDraft.painRaised ? "coral" : "ghost"}>{sessionDraft.readinessBadge}</Badge>}
        >
          <div className="stat-list">
            <div className="stat-list__row">
              <span>目标 RPE</span>
              <strong>{sessionDraft.targetRpe}</strong>
            </div>
            <div className="stat-list__row">
              <span>实际 RPE</span>
              <strong>{sessionDraft.actualRpe}</strong>
            </div>
            <div className="stat-list__row">
              <span>负荷变化</span>
              <strong>{sessionDraft.loadChange}</strong>
            </div>
          </div>
          <p>{sessionDraft.intensityNote}</p>
        </Panel>

        <Panel
          title="动作记录"
          eyebrow="实际 vs 计划"
          badge={<Badge tone="ghost">{sessionDraft.blocks.length} 个动作块</Badge>}
        >
          <div className="log-block-list">
            {sessionDraft.blocks.map((block) => (
              <section className="log-block" key={block.id}>
                <div className="log-block__top">
                  <div className="stack-tight">
                    <strong>{block.title}</strong>
                    <p className="meta-caption">计划 {block.planned}</p>
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
                    {SESSION_BLOCK_STATUS_LABEL[block.status]}
                  </Badge>
                </div>
                <p className="log-block__actual">{block.actual}</p>
                <p>{block.note}</p>
              </section>
            ))}
          </div>
        </Panel>

        <Panel title="教练备注" eyebrow="交接" tone="lime">
          <p className="panel-emphasis">{sessionDraft.coachNote}</p>
          <p>{sessionDraft.handoffNote}</p>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href={`/coach/students/${studentId}/plan-adjustment`}>调整下一版计划</ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          请求恢复反馈
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
