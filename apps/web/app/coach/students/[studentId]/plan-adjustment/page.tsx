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

const CHANGE_TONE_LABEL: Record<string, string> = {
  increase: "增加",
  decrease: "降低",
  hold: "保持",
  focus: "关注点",
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
      label="教练 / 计划"
      title={planDraft.nextVersion}
      description="让原计划和新计划并排出现，你才知道这次到底改了什么。"
      leading={
        <Link className="back-link" href={`/coach/students/${studentId}/log-session`}>
          返回
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
            <span className="meta-caption">当前版</span>
            <strong>{planDraft.baseVersion}</strong>
          </div>
          <div className="version-rail__arrow">→</div>
          <div className="version-rail__item version-rail__item--next">
            <span className="meta-caption">下一版</span>
            <strong>{planDraft.nextVersion}</strong>
          </div>
        </div>
      </section>

      <section className="signal-strip">
        <div className="signal-chip">
          <span className="signal-chip__label">来源训练</span>
          <strong className="signal-chip__value">{planDraft.basedOnSession}</strong>
          <p className="signal-chip__detail">完成度 {snapshot.latestExecution.adherence}</p>
        </div>
        <div className="signal-chip signal-chip--lime">
          <span className="signal-chip__label">复核窗口</span>
          <strong className="signal-chip__value">{planDraft.reviewWindow}</strong>
          <p className="signal-chip__detail">{planDraft.focusArea}</p>
        </div>
        <div className="signal-chip">
          <span className="signal-chip__label">发布状态</span>
          <strong className="signal-chip__value">{planDraft.publishStatus}</strong>
          <p className="signal-chip__detail">先确认差异再发布</p>
        </div>
      </section>

      <div className="stack">
        <Panel title="为什么要改这个版本" eyebrow="证据" badge={<Badge tone="ghost">先看差异</Badge>}>
          <p className="panel-emphasis">{planDraft.evidenceSummary}</p>
          <p>{planDraft.reasonDetail}</p>
        </Panel>

        <Panel
          title="原计划 vs 新计划"
          eyebrow="只改必要的地方"
          badge={<Badge tone="ghost">{planDraft.changes.length} 处改动</Badge>}
        >
          <div className="change-list">
            {planDraft.changes.map((change) => (
              <section className={`change-item change-item--${change.tone}`} key={change.id}>
                <div className="change-item__top">
                  <div className="stack-tight">
                    <strong>{change.exerciseLabel}</strong>
                    <p className="meta-caption">{change.sessionLabel}</p>
                  </div>
                  <Badge tone={CHANGE_TONE_TO_BADGE[change.tone]}>{CHANGE_TONE_LABEL[change.tone]}</Badge>
                </div>
                <div className="diff-pair">
                  <div className="diff-pair__side">
                    <span className="meta-caption">原计划</span>
                    <p>{change.fromValue}</p>
                  </div>
                  <div className="diff-pair__divider">→</div>
                  <div className="diff-pair__side diff-pair__side--next">
                    <span className="meta-caption">新计划</span>
                    <p>{change.toValue}</p>
                  </div>
                </div>
                <p>{change.reason}</p>
              </section>
            ))}
          </div>
        </Panel>

        <Panel title="发布前再确认" eyebrow="守门条件" tone="lime">
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
        <ActionLink href={`/coach/students/${studentId}`}>发布 {planDraft.nextVersion}</ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          打开关联恢复反馈
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
