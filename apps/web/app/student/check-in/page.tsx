import { ActionLink, Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";
import { studentCheckInDraft } from "@/lib/sample-data";

export default function StudentCheckInPage() {
  return (
    <ScreenShell
      label="学员 / 恢复"
      title="你现在感觉怎么样？"
      description="一条恢复反馈应该在一分钟内完成。"
      footer={<BottomNav active="Check-in" />}
    >
      <Panel title={studentCheckInDraft.sessionLabel} eyebrow="今日" badge={<Badge tone="ghost">60 秒</Badge>}>
        <div className="progress-meter">
          <div className="progress-meter__fill" style={{ width: `${studentCheckInDraft.progressPercent}%` }} />
        </div>
        <p>{studentCheckInDraft.guidance}</p>
      </Panel>

      <div className="stack">
        {studentCheckInDraft.prompts.map((prompt) => (
          <Panel
            key={prompt.label}
            title={prompt.label}
            badge={<Badge tone={prompt.tone}>{prompt.badge}</Badge>}
          >
            <p className="response-value">{prompt.value}</p>
          </Panel>
        ))}

        <Panel title="备注" eyebrow="可选">
          <p>{studentCheckInDraft.note}</p>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href="/coach/students/student_lin">提交反馈</ActionLink>
        <ActionLink href="/coach" tone="secondary">
          返回教练端流程
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
