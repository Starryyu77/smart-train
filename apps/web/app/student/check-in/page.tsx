import Link from "next/link";
import { Badge, Panel, ScreenShell } from "@/components/ui";
import { StudentCheckInForm } from "@/components/student-check-in-form";
import { DEMO_STUDENT_ID, getLatestStudentFeedback } from "@/lib/demo-feedback-store";
import { studentCheckInDraft } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

function parseScaleValue(value: string, fallback: number) {
  const parsed = Number(value.split("/")[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function StudentCheckInPage() {
  const latestRecord = await getLatestStudentFeedback(DEMO_STUDENT_ID);
  const initialValues = latestRecord
    ? {
        sleep: latestRecord.sleep,
        soreness: latestRecord.soreness,
        adherence: latestRecord.adherence,
        painText: latestRecord.painText,
        note: latestRecord.note,
      }
    : {
        sleep: parseScaleValue(studentCheckInDraft.prompts[0].value, 5),
        soreness: parseScaleValue(studentCheckInDraft.prompts[1].value, 4),
        adherence: 4,
        painText: studentCheckInDraft.prompts[2].value,
        note: studentCheckInDraft.note,
      };

  return (
    <ScreenShell
      label="学员端 / 恢复"
      title="今天感觉怎么样？"
      description="用 1 分钟回一次反馈。"
      leading={
        <Link className="back-link" href="/student">
          返回
        </Link>
      }
    >
      <Panel title={studentCheckInDraft.sessionLabel} eyebrow="今日" badge={<Badge tone="ghost">60 秒</Badge>}>
        <div className="progress-meter">
          <div className="progress-meter__fill" style={{ width: `${studentCheckInDraft.progressPercent}%` }} />
        </div>
        <p>{studentCheckInDraft.guidance}</p>
        {latestRecord ? <p className="meta-caption">上次提交：{new Date(latestRecord.submittedAt).toLocaleString("zh-CN")}</p> : null}
      </Panel>

      <StudentCheckInForm initialValues={initialValues} studentId={DEMO_STUDENT_ID} />
    </ScreenShell>
  );
}
