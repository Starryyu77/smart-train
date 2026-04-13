import Link from "next/link";
import { Hero, MetricCard, Section, StatusPill } from "@/components/ui";
import { activeSurfaces, latestAuditPreview, sampleUploadKey, studentSummaries } from "@/lib/sample-data";

export default function HomePage() {
  return (
    <main className="page-stack">
      <Hero
        eyebrow="Phase 1 / Web-first baseline"
        title="Smart Training Workbench now has a live web scaffold."
        description="This batch locks the approved Web-first direction into the repository and sets up the first deployable app, shared domain contracts, and platform primitives for auth scope, audit, and storage."
      >
        <div className="nav-links">
          <Link className="nav-link" href="/coach/students/student_lin">
            Open coach workspace
          </Link>
          <Link className="nav-link" href="/api/health">
            Health endpoint
          </Link>
        </div>
      </Hero>

      <section className="grid grid--cards">
        <MetricCard label="Deploy shape" value="1 app" detail="One Next.js application with internal packages for domain and platform concerns." />
        <MetricCard label="Current surfaces" value={activeSurfaces.join(" / ")} detail="Coach is the first real route; student H5 and admin remain in the same application boundary." />
        <MetricCard label="Seed students" value={String(studentSummaries.length)} detail="Mock workspace snapshots make the first coach workflow tangible before the database layer lands." />
      </section>

      <Section
        title="Why this scaffold matters"
        description="The product is no longer just a PRD. The repository now encodes the approved platform boundaries and the evidence-first coach experience."
        meta={<StatusPill>Approved baseline</StatusPill>}
      >
        <div className="list">
          <div className="list-item">
            <div className="split">
              <strong>Audit primitive</strong>
              <span className="muted">{latestAuditPreview.action}</span>
            </div>
            <p>Latest seeded event: {latestAuditPreview.targetId} / {latestAuditPreview.occurredAt}</p>
          </div>
          <div className="list-item">
            <div className="split">
              <strong>Object storage strategy</strong>
              <span className="muted">phase-1 abstraction</span>
            </div>
            <p>{sampleUploadKey}</p>
          </div>
          <div className="list-item">
            <div className="split">
              <strong>Next app health</strong>
              <span className="muted">route-backed</span>
            </div>
            <p>`/api/health` returns the current phase, surfaces, and timestamp for CI or deployment checks.</p>
          </div>
        </div>
      </Section>
    </main>
  );
}

