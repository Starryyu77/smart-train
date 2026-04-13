import type { ReactNode } from "react";

export function Hero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero">
      <span className="hero__eyebrow">{eyebrow}</span>
      <div className="page-stack">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

export function Section({
  title,
  description,
  meta,
  children,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section">
      <div className="section__header">
        <div className="page-stack">
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {meta ? <div className="section__meta">{meta}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="card">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      <p>{detail}</p>
    </article>
  );
}

export function StatusPill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "warning" | "danger";
}) {
  const className =
    tone === "warning"
      ? "pill pill--warning"
      : tone === "danger"
        ? "pill pill--danger"
        : "pill";

  return <span className={className}>{children}</span>;
}

