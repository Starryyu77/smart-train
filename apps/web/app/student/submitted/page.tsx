import { ActionLink, Badge, Panel, ScreenShell } from "@/components/ui";

export default function StudentSubmittedPage() {
  return (
    <ScreenShell
      label="学员端 / 已提交"
      title="已提交"
      description="这次反馈已经回给教练。"
    >
      <Panel title="今天完成了" eyebrow="反馈状态" badge={<Badge tone="lime">完成</Badge>} tone="lime">
        <p className="panel-emphasis">恢复反馈已发送</p>
        <p>下次训练前，教练会看到这次状态。</p>
      </Panel>

      <div className="stack">
        <ActionLink href="/student">返回学员端首页</ActionLink>
        <ActionLink href="/student/check-in" tone="secondary">
          重新查看反馈
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
