import { ActionLink, Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";
import { studentCheckInDraft } from "@/lib/sample-data";

export default function StudentCheckInPage() {
  return (
    <ScreenShell
      label="student / recovery"
      title="How do you feel now?"
      description="一条恢复反馈应该在一分钟内完成。"
      footer={<BottomNav active="Check-in" />}
    >
      <Panel title={studentCheckInDraft.sessionLabel} eyebrow="today" badge={<Badge tone="ghost">60s</Badge>}>
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

        <Panel title="Note" eyebrow="optional">
          <p>{studentCheckInDraft.note}</p>
        </Panel>
      </div>

      <div className="stack">
        <ActionLink href="/coach/students/student_lin">Send check-in</ActionLink>
        <ActionLink href="/coach" tone="secondary">
          Back to coach flow
        </ActionLink>
      </div>
    </ScreenShell>
  );
}

