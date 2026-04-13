import Link from "next/link";
import type { ReactNode } from "react";

type BadgeTone = "default" | "lime" | "coral" | "ghost";
type PanelTone = "default" | "lime";
type ActionTone = "primary" | "secondary";

export function ScreenShell({
  label,
  title,
  description,
  leading,
  children,
  footer,
}: {
  label: string;
  title: string;
  description: string;
  leading?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="screen-shell-wrap">
      <section className="screen-shell">
        <header className="screen-shell__header">
          <div className="stack-tight">
            {leading}
            <Badge tone="ghost">{label}</Badge>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>

        <div className="screen-shell__body">{children}</div>
        {footer ? <div className="screen-shell__footer">{footer}</div> : null}
      </section>
    </main>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function MetricTile({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "lime";
}) {
  return (
    <article className={`metric-tile metric-tile--${tone}`}>
      <span className="metric-tile__label">{label}</span>
      <strong className="metric-tile__value">{value}</strong>
      <p className="metric-tile__detail">{detail}</p>
    </article>
  );
}

export function Panel({
  title,
  eyebrow,
  badge,
  tone = "default",
  children,
}: {
  title: string;
  eyebrow?: string;
  badge?: ReactNode;
  tone?: PanelTone;
  children: ReactNode;
}) {
  return (
    <section className={`panel panel--${tone}`}>
      <div className="panel__top">
        <div className="stack-tight">
          {eyebrow ? <span className="panel__eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {badge}
      </div>
      <div className="stack-tight">{children}</div>
    </section>
  );
}

export function ActionLink({
  href,
  tone = "primary",
  children,
}: {
  href: string;
  tone?: ActionTone;
  children: ReactNode;
}) {
  return (
    <Link className={`action-link action-link--${tone}`} href={href}>
      {children}
    </Link>
  );
}

export function BottomNav({ active }: { active: "Today" | "Athletes" | "Guide" }) {
  const items = [
    { key: "Today", label: "今日", href: "/coach" },
    { key: "Athletes", label: "学员", href: "/coach/students/student_lin" },
    { key: "Guide", label: "上手", href: "/coach/getting-started" },
  ] as const;

  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map((item) => (
        <Link
          className={`bottom-nav__item ${item.key === active ? "bottom-nav__item--active" : ""}`}
          href={item.href}
          key={item.key}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
