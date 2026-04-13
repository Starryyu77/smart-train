import { ActionLink, Badge, Panel, ScreenShell } from "@/components/ui";
import { studentCheckInDraft } from "@/lib/sample-data";

export default function StudentHomePage() {
  return (
    <ScreenShell
      label="学员端"
      title="今日恢复反馈"
      description="这是单独的学员入口。"
    >
      <Panel title={studentCheckInDraft.studentName} eyebrow="今天要做" badge={<Badge tone="ghost">独立入口</Badge>}>
        <p>{studentCheckInDraft.sessionLabel}</p>
        <p className="panel-emphasis">1 分钟完成</p>
      </Panel>

      <div className="stack">
        <ActionLink href="/student/check-in">开始填写反馈</ActionLink>
        <ActionLink href="/" tone="secondary">
          返回入口选择
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
