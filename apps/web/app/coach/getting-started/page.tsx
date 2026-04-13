import Link from "next/link";
import { Badge, BottomNav, Panel, ScreenShell } from "@/components/ui";

const steps = [
  {
    id: "01",
    title: "先看今日页",
    detail: "这里不是首页装饰，而是你今天要先处理谁。先从待复核学员里选一个人进入。",
    ctaLabel: "打开今日页",
    href: "/coach",
  },
  {
    id: "02",
    title: "打开一个学员",
    detail: "学员页只看四件事：最近执行、最近反馈、教练判断、时间线。不要一开始就找复杂图表。",
    ctaLabel: "进入演示学员",
    href: "/coach/students/student_lin",
  },
  {
    id: "03",
    title: "记录这次训练",
    detail: "训练结束后先记实际发生了什么：完成了几组、哪里降重了、疼痛是不是抬头了。",
    ctaLabel: "查看训练记录",
    href: "/coach/students/student_lin/log-session",
  },
  {
    id: "04",
    title: "再决定下一版计划",
    detail: "不是先写长计划，而是先看 version diff，明确这次到底改哪几处、为什么改。",
    ctaLabel: "查看计划调整",
    href: "/coach/students/student_lin/plan-adjustment",
  },
  {
    id: "05",
    title: "最后让学员回反馈",
    detail: "学员端很薄，只负责把恢复信号回传给你，让下一次判断有证据。",
    ctaLabel: "查看学员反馈页",
    href: "/student/check-in",
  },
] as const;

const glossary = [
  {
    label: "待复核",
    detail: "说明这个学员今天需要你判断，不适合直接略过。",
  },
  {
    label: "延迟信号",
    detail: "反馈回来晚了，但依然有价值，不能当作没发生。",
  },
  {
    label: "版本调整",
    detail: "每次计划变化都要保留前后差异，而不是直接覆盖旧计划。",
  },
] as const;

export default function CoachGettingStartedPage() {
  return (
    <ScreenShell
      label="教练 / 上手"
      title="第一次先这样用"
      description="如果你第一次打开不知道先点哪里，就按这 5 步走一遍。"
      leading={
        <Link className="back-link" href="/coach">
          返回
        </Link>
      }
      footer={<BottomNav active="Today" />}
    >
      <Panel title="先照这个顺序走" eyebrow="30 秒理解" tone="lime" badge={<Badge tone="ghost">推荐顺序</Badge>}>
        <p>今天先看谁，再看这个学员发生了什么，然后记录训练、调整下一版，最后再收回恢复反馈。</p>
        <p>你把它当成一个 5 步流程，而不是 5 张独立页面，就不会乱。</p>
      </Panel>

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

      <Panel title="先记住这三个词" eyebrow="术语" badge={<Badge tone="ghost">新手最常卡住</Badge>}>
        <div className="glossary-list">
          {glossary.map((item) => (
            <section className="glossary-item" key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </section>
          ))}
        </div>
      </Panel>
    </ScreenShell>
  );
}
