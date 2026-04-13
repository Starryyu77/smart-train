import { ActionLink, Badge, ScreenShell } from "@/components/ui";

export default function HomePage() {
  return (
    <ScreenShell
      label="Smart Train"
      title="选择入口"
      description="教练端和学员端分开查看。"
    >
      <div className="stack">
        <section className="summary-card">
          <Badge tone="ghost">Coach</Badge>
          <div className="summary-item">
            <span className="summary-item__label">教练端</span>
            <p className="summary-item__value">看学员、记训练、调计划</p>
          </div>
          <ActionLink href="/coach">进入教练端</ActionLink>
        </section>

        <section className="summary-card">
          <Badge tone="ghost">Student</Badge>
          <div className="summary-item">
            <span className="summary-item__label">学员端</span>
            <p className="summary-item__value">独立填写恢复反馈</p>
          </div>
          <ActionLink href="/student" tone="secondary">
            进入学员端
          </ActionLink>
        </section>
      </div>
    </ScreenShell>
  );
}
