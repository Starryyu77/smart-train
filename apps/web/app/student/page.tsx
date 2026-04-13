import { ActionLink, Badge, Panel, ScreenShell } from "@/components/ui";
import { DEMO_STUDENT_ID, getLatestStudentFeedback } from "@/lib/demo-feedback-store";
import { studentCheckInDraft } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export default async function StudentHomePage() {
  const latestRecord = await getLatestStudentFeedback(DEMO_STUDENT_ID);

  return (
    <ScreenShell
      label="学员端"
      title="今日恢复反馈"
      description="这是单独的学员入口。"
    >
      <Panel title={studentCheckInDraft.studentName} eyebrow="今天要做" badge={<Badge tone="ghost">独立入口</Badge>}>
        <p>{studentCheckInDraft.sessionLabel}</p>
        <p className="panel-emphasis">1 分钟完成</p>
        {latestRecord ? <p className="meta-caption">最近一次提交：{new Date(latestRecord.submittedAt).toLocaleString("zh-CN")}</p> : null}
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
