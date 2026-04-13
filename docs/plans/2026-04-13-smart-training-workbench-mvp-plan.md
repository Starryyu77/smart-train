# Smart Training Workbench MVP Foundation Plan

> Initial plan synthesized from the current PRD and internal alignment document so `/autoplan` has a concrete artifact to review.

**Goal:** Build the first usable version of a coach-first smart training workbench that captures the full training decision loop, `state -> plan -> execution -> feedback -> adjustment -> result`, with low recording friction and AI-ready data from day one.

**Architecture:** Start with a modular monolith, not microservices. Use a coach-first web app, a lightweight student feedback surface, a single relational data store with strict `org_id` boundaries, object storage for files, background jobs for summaries and alerts, and a rules-first intelligence layer with a provider adapter for future model integration.

**Why this plan exists now:** The repository currently contains product documents but no implementation scaffold. This plan translates those documents into a buildable MVP shape, explicit boundaries, and phased execution so strategy, design, and engineering review can happen against one shared artifact.

## 1. Product Premises

1. The first customer is the offline fitness coach, not the trainee.
2. The first product job is to improve coaching decisions, not to maximize trainee engagement.
3. The MVP must make post-session logging realistically usable, with a target of about 2 minutes for a normal session.
4. The product must capture a continuous and auditable decision chain, not just store notes.
5. AI is downstream of data quality. The first release ships rules, structure, diffs, summaries, and suggestions before any autonomous plan generation.
6. Safety, permissioning, and auditability are MVP requirements, not later hardening work.

## 2. Users And Jobs To Be Done

### Primary user
- Offline individual coaches and small studio coaches who need to manage repeated training decisions across multiple students.

### Secondary users
- Head coach or organization owner who needs oversight, templates, and quality control.
- Assistant coach with narrower write scope.
- Student who only needs lightweight feedback input and progress visibility.

### Core jobs
- Record student baseline state and goals.
- Create and publish versioned training plans.
- Record real execution with minimum duplicate input.
- Collect recovery and subjective feedback.
- Compare planned vs actual, this week vs last week, version vs version.
- Generate structured evidence for the next coaching adjustment.

## 3. MVP Scope

### In scope for MVP
- Coach authentication and multi-tenant org boundaries.
- Student profile and lifecycle state.
- Initial assessment, re-assessment, and goals.
- Training plan hierarchy: cycle, week, session.
- Versioned plan publishing with diff and change reason.
- Session execution recording driven by planned values with diff-first entry.
- Student mobile-first feedback check-in.
- Unified student timeline across assessments, plans, sessions, feedback, alerts, and reviews.
- Review dashboard with key trends, plan-vs-actual, and weekly/stage summary skeletons.
- Rules-based alerts for pain, adherence drop, overdue reassessment, and expired plan.
- Audit logs for sensitive access, export, approval, and major mutations.

### In scope for MVP foundation but may ship behind internal flags
- Raw-note preservation plus structured extraction record.
- Suggestion drafts generated from rules and derived features.
- Exportable coach-facing and student-facing stage reports.

### Explicitly out of scope now
- Full business ERP, payroll, marketing automation, and finance.
- Heavy consumer trainee app with social/community features.
- Fully autonomous AI plan publishing.
- High-risk medical rehab, pregnancy, elite sport specialization.
- Deep wearable or hardware integrations beyond placeholder adapter boundaries.

## 4. Success Criteria

### Product success
- A coach can finish a normal session record in about 2 minutes without attachments.
- A coach can open one student page and immediately see current goal, latest plan version, latest execution signals, latest feedback, and outstanding risk/tasks.
- A weekly review can be generated from system evidence without manually reconstructing the week from chat tools.

### Data success
- Every key training decision is linkable to prior state and later outcome.
- Published plans are versioned, never overwritten silently.
- Raw notes, structured facts, derived features, and decision logs are all retained.

### Operational success
- Every sensitive export and approval is auditable.
- Every core object is tenant-scoped.
- The architecture supports later split-out of alerts, intelligence, and search without rewriting domain logic.

## 5. Proposed System Shape

### High-level deployment
- One modular monolith application for the first release.
- One primary relational database.
- One object storage bucket for media and file artifacts.
- One background job processor for alerts, summaries, and async extraction.
- One provider adapter boundary for future LLM or recommendation integrations.

### Runtime surfaces
- Coach web app, desktop-first but usable on tablet.
- Student lightweight mobile web surface for feedback and limited progress views.
- Admin web surface for org configuration, exports, audits, and policy settings.

### Architectural principles
- Domain boundaries must exist in code even if deployment is single-binary.
- Cross-module communication prefers explicit domain services and emitted events.
- `org_id` and actor identity travel with every business mutation and query.
- Rules can block or downgrade AI suggestions, never the other way around.
- Versioning is default behavior for plans and templates.

## 6. Proposed Domain Modules

1. Identity and access
2. Organizations and teams
3. Students
4. Assessments and goals
5. Plan authoring and versioning
6. Session execution
7. Student feedback
8. Timeline and notes
9. Analytics and review
10. Templates and exercise library
11. Alerts and tasks
12. Audit, import, and export
13. Intelligence adapter and derived features

## 7. Core Domain Model

### Key entities
- `org`
- `team`
- `user`
- `coach_assignment`
- `student`
- `student_risk_profile`
- `assessment`
- `goal`
- `program`
- `program_version`
- `session_plan`
- `session_execution`
- `exercise_execution`
- `student_feedback`
- `timeline_event`
- `raw_note`
- `note_extraction`
- `derived_feature_snapshot`
- `alert`
- `task`
- `audit_log`

### Relationship summary
- One org has many teams, users, students, templates, and audits.
- One student has many assessments, goals, program versions, session executions, feedback items, and timeline events.
- One program has many program versions.
- One program version has many session plans.
- One session execution links back to one session plan and one active program version.
- Feedback may link to a session execution or exist as day/week standalone signal.
- Derived features and alerts are computed from assessments, plans, execution, and feedback.

## 8. UX Surfaces And Screens

### Coach web
- Login
- Coach dashboard
- Student list
- Student workspace overview
- Assessment entry and comparison
- Goal management
- Program planner and version history
- Session record flow
- Timeline and notes
- Review dashboard
- Alert/task center
- Template and exercise library

### Student lightweight surface
- Login or magic link entry
- Daily or post-session feedback form
- Plan view
- Progress summary view

### Admin surface
- Org settings
- Team and role management
- Data import/export
- Audit review
- Policy and AI switch settings

## 9. Primary User Flows

### Flow A: New student onboarding
1. Coach creates student profile.
2. Coach records initial assessment and baseline goals.
3. System stores structured values, original notes, and timeline events.
4. Coach creates and publishes first program version.

### Flow B: Standard training session
1. Coach opens student workspace and active session plan.
2. Coach records execution by adjusting planned values, not re-entering every field.
3. Coach adds pain flag, remarks, or media if needed.
4. System stores planned-vs-actual diff and updates timeline.

### Flow C: Recovery feedback
1. Student receives prompt and opens a one-screen check-in.
2. Student submits sleep, energy, soreness, pain, adherence, and notes.
3. System marks anomalies and updates recent signal cards.

### Flow D: Weekly review and adjustment
1. Coach opens review page for one student.
2. System shows trend cards, execution adherence, feedback risk changes, and current plan/version deltas.
3. System drafts a summary and suggested adjustment skeleton.
4. Coach confirms or edits, then publishes next version if needed.

## 10. State And Event Model

### Student lifecycle
- `lead`
- `active`
- `paused`
- `completed`
- `churned`

### Session outcome
- `completed`
- `partial`
- `cancelled`
- `no_show`

### Alert lifecycle
- `open`
- `acknowledged`
- `resolved`
- `dismissed_with_reason`

### Plan lifecycle
- `draft`
- `published`
- `superseded`
- `archived`

### Timeline event families
- `student_created`
- `assessment_recorded`
- `goal_updated`
- `program_published`
- `session_logged`
- `feedback_submitted`
- `alert_created`
- `review_generated`
- `adjustment_published`

## 11. Security And Compliance Baseline

- Every request must pass authenticated actor identity and org scope.
- Sensitive reads and exports require explicit authorization and audit logging.
- Student health-like data is treated as high-sensitivity internal data.
- AI access is mediated by an adapter that enforces least-necessary data exposure.
- No direct model-generated action can publish or modify a plan without coach confirmation.
- Delete and export flows must be governed, logged, and policy-aware.

## 12. Technical Foundations To Build Early

- Shared design tokens and component primitives for the coach web app.
- AuthN/AuthZ layer with RBAC plus resource scope.
- Domain event outbox.
- File upload and object storage abstraction.
- Derived feature calculation pipeline.
- Alert rules engine with versioned thresholds.
- Audit log middleware.
- Query and analytics patterns that respect org boundaries.

## 13. Testing Strategy

### Core automated tests
- Permission boundary tests across org, team, and coach scopes.
- Versioning invariants for plans and templates.
- Session record diff correctness.
- Feedback anomaly detection and alert generation.
- Timeline completeness and ordering.
- Audit log coverage for sensitive actions.
- Summary/review generation correctness from seeded data.

### Required manual or exploratory validation
- Coach session logging median time under realistic workflow.
- Student mobile feedback usability on narrow viewports.
- Review dashboard evidence quality for real coaching scenarios.
- Export and approval flows for sensitive data.

## 14. Implementation Phases

### Phase 1: Repository and platform foundations
- Add monorepo or app skeleton, tooling, CI, and environment structure.
- Stand up auth, org boundaries, audit primitives, and file storage abstraction.
- Create shared docs for architecture, domain language, and security assumptions.

### Phase 2: Core training loop
- Implement student profile, assessments, goals, plans, plan versioning, and session recording.
- Ship coach student workspace with unified context.
- Ship student feedback surface.

### Phase 3: Review and intelligence baseline
- Add derived features, alerts, weekly review dashboard, and summary skeletons.
- Add note retention plus extraction auditability.
- Add export/report foundation.

### Phase 4: Hardening and trial readiness
- Tighten permissions, audit coverage, observability, and import/export.
- Pilot with a small coach cohort and collect workflow friction data.

## 15. Key Risks

- The data model becomes too abstract before real usage proves it.
- Session logging is still too slow, which kills adoption.
- UI tries to surface too much context at once and becomes cognitively heavy.
- Alerting creates noise instead of trust.
- AI language appears before evidence quality is strong enough to justify it.
- Security and audit work gets deferred because no real customer is live yet.

## 16. Open Decisions

- Exact framework choice for the first coach web app and backend.
- Whether to keep a single repo app or use app/package split from day one.
- Whether student feedback ships as a dedicated frontend surface or a thin route within the main web app.
- Whether weekly review output is stored as materialized snapshots, generated on demand, or both.
- How much of note extraction is rules-based in MVP vs queued for later AI integration.

## 17. Recommended Next Planning Outputs

- A reviewed architecture section with explicit data flow and module boundaries.
- A reviewed UX section with screen hierarchy, empty states, responsive behavior, and interaction states.
- A reviewed engineering plan with test diagram, rollout order, and failure modes.
