import Link from "next/link";
import { ActionLink, BottomNav, ScreenShell } from "@/components/ui";

const steps = [
  {
    id: "01",
    title: "先看今日页",
    detail: "先决定今天看谁。",
    ctaLabel: "打开今日页",
    href: "/coach",
  },
  {
    id: "02",
    title: "打开一个学员",
    detail: "只看执行、恢复、判断。",
    ctaLabel: "进入演示学员",
    href: "/coach/students/student_lin",
  },
  {
    id: "03",
    title: "记录这次训练",
    detail: "先记实际发生了什么。",
    ctaLabel: "查看训练记录",
    href: "/coach/students/student_lin/log-session",
  },
  {
    id: "04",
    title: "再调整下一版计划",
    detail: "只改必要的地方。",
    ctaLabel: "查看计划调整",
    href: "/coach/students/student_lin/plan-adjustment",
  },
] as const;

export default function CoachGettingStartedPage() {
  return (
    <ScreenShell
      label="教练 / 上手"
      title="30 秒上手"
      description="按这个顺序点一遍。"
      leading={
        <Link className="back-link" href="/coach">
          返回
        </Link>
      }
      footer={<BottomNav active="Guide" />}
    >
      <div className="guide-step-list">
        {steps.map((step) => (
          <Link className="guide-step" href={step.href} key={step.id}>
            <div className="guide-step__top">
              <span className="guide-step__index">{step.id}</span>
              <div className="stack-tight">
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </div>
            </div>
            <span className="guide-step__link">{step.ctaLabel}</span>
          </Link>
        ))}
      </div>

      <div className="stack">
        <ActionLink href="/coach/students/student_lin">直接进入演示学员</ActionLink>
        <ActionLink href="/student" tone="secondary">
          打开学员端
        </ActionLink>
      </div>
    </ScreenShell>
  );
}
