<!-- /autoplan restore point: git commit a1accb4 (Add MVP foundation plan draft) -->
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

## /autoplan Review Context

- Review mode: `SELECTIVE_EXPANSION`
- Base branch: `main`
- UI scope: yes
- Review target: this plan file
- Restore point: git commit `a1accb4`
- Outside voices: Codex CLI attempt hung without returning review text, and no subagent run was used in this environment. Proceeding in `single-reviewer mode`.
- Design system status: no `DESIGN.md` exists in the repository, so the design pass used universal product-design principles instead of project-specific tokens.

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
| 1 | CEO | Narrow the first pilot ICP to solo coaches and very small studios serving general fitness clients. | mechanical | completeness | The current plan says "offline coach + small studio" which is directionally right but still too broad for first distribution and feedback loops. | Keep the ICP broad from day one, rejected because it turns one product into two go-to-market motions. |
| 2 | CEO | Add low-connectivity session draft recovery to the MVP plan. | mechanical | completeness | Logging friction is existential for this product. A lost session log is a trust break, not a minor edge case. | Pure online happy path, rejected because gyms often have weak connectivity. |
| 3 | CEO | Keep the modular monolith baseline. | mechanical | explicit over clever | The repository is empty and the PRD already leans this way. Splitting services now would add coordination cost before learning velocity exists. | Start with microservices, rejected as early complexity theater. |
| 4 | CEO | Treat autonomous plan publishing as out of scope until rules, provenance, and audit are proven. | mechanical | pragmatic | This is the right safety boundary and keeps the product honest. | "AI-first autopilot" positioning, rejected because it is unsafe and not yet data-justified. |
| 5 | CEO | Add explicit pilot instrumentation and adoption review to the rollout plan. | mechanical | bias toward action | The plan needs a way to learn whether coaches actually sustain the workflow, not just whether features ship. | Feature delivery without instrumentation, rejected because it delays truth. |
| 6 | Design | Make the student workspace evidence-first, not dashboard-first. | mechanical | explicit over clever | Coaches need the current goal, active plan, latest execution, latest feedback, and active risks before they need pretty summaries. | KPI-heavy dashboard landing, rejected because it hides the next decision under visual noise. |
| 7 | Design | Require loading, empty, error, success, and partial states for all core coach and student flows. | mechanical | completeness | Those states are product behavior, not polish. | Leave states implicit, rejected because implementers will fill gaps inconsistently. |
| 8 | Design | Recommend a thin student feedback surface inside the same product shell for MVP. | taste | pragmatic | It reduces product surface area and auth complexity while preserving the trainee job to be done. | A separate student app from day one, viable but heavier in auth, release, and design maintenance. |
| 9 | Eng | Ship seven core modules first, and defer templates marketplace, full report exports, and advanced org operations. | mechanical | boil lakes | The MVP needs a usable closed loop, not all thirteen conceptual modules at first release depth. | Try to deliver all modules equally in the first pass, rejected because it spreads effort and delays pilot learning. |
| 10 | Eng | Recommend one deployable app plus internal packages, not multiple deployable apps on day one. | taste | explicit over clever | It preserves boundaries without multiplying deployment and CI complexity. | Multi-app split from day one, viable but premature for an empty codebase. |
| 11 | Eng | Use on-demand review generation backed by cached read models, not fully materialized weekly snapshots first. | taste | pragmatic | It supports evidence-first review without locking the system into an overly rigid snapshot pipeline too early. | Snapshot-everything upfront, viable but heavier before real workload patterns are known. |
| 12 | Eng | Generate a standalone test-plan artifact and a root `TODOS.md`. | mechanical | completeness | The plan needs executable follow-through artifacts, not just prose. | Leave test/debt as inline notes only, rejected because it becomes non-operational. |

## Phase 1: CEO Review

### Step 0A. Premise Challenge

What is strong:
- Coach-first is right. The highest-quality data and the highest willingness to pay both sit closest to the coach workflow.
- Rules-first before model-first is right. It keeps the product useful before the dataset matures.
- Audit and safety as MVP requirements is right. This product handles health-adjacent data and professional judgment.

What is still assumed:
- The ICP is still too loose. "Offline individual coaches and small studios" sounds one notch more precise than it is. The first pilot should likely target independent coaches or studios with at most a handful of coaches, not multi-team operations with real management layers.
- The plan assumes coaches will consistently log after each session because the UX is good enough. That is not a premise, that is a hypothesis the rollout must test.
- The plan assumes a lightweight student surface is sufficient to drive high-quality recovery and adherence signals. That may be true, but only if reminders, friction, and feedback timing are designed deliberately.

Recommended premise baseline:
1. First paying wedge: coach-led, general fitness, non-medical scenarios.
2. First organizational wedge: solo coach or very small studio, not complex multi-role staffing.
3. First product promise: "faster, more reliable weekly coaching decisions," not "AI generates better plans."

### Step 0B. Existing Code Leverage

There is no implementation code yet. What already exists is product clarity:

| Sub-problem | Existing asset | How it helps |
|-------------|----------------|--------------|
| Product boundary | `fitness_coach_internal_alignment_doc_v1_zh.md` | Strong definition of what this is and what it is not. |
| MVP module direction | `fitness_coach_intelligent_workbench_prd_v1_zh.docx` | Good starting module map, roles, and functional baseline. |
| Project continuity | `memory/` | Gives this project durable task state and decision history. |

### Step 0C. Dream State Mapping

```text
CURRENT
  Product docs, repo memory, no implementation scaffold
        |
        v
THIS PLAN
  Coach-first MVP
  Versioned plans
  Diff-first session logging
  Student feedback
  Review dashboard
  Alerts + audit
        |
        v
12-MONTH IDEAL
  Trusted coaching operating system
  Strong evidence rails
  Team quality oversight
  Suggestion engine with proven provenance
  Gradual automation on top of validated workflows
```

### Step 0C-bis. Implementation Alternatives

| Approach | Effort | Pros | Cons | Verdict |
|----------|--------|------|------|---------|
| Coach-first modular monolith with thin student surface | M | Fastest path to the real loop, simplest audit model, lowest coordination tax | Requires discipline to preserve boundaries in one codebase | Selected |
| Coach note assistant only, no real structured loop | S | Faster to demo, less UI scope | Does not produce the decision-chain data asset this product is trying to build | Rejected |
| Full coach operating system with heavy org/admin/reporting from day one | L | More complete on paper | Delays pilot learning, increases UX and permission complexity, likely stalls adoption work | Rejected |

### Step 0D. Scope Decisions

#### Accepted Scope Additions
- Explicit pilot ICP definition and rollout instrumentation.
- Low-connectivity draft recovery for session logging.
- Student workspace read model so the key evidence rail is fast and stable.
- Provenance rules for derived features, alerts, and suggestion drafts.

#### Deferred To `TODOS.md`
- Separate student app shell.
- Full coach-facing and student-facing polished report builder.
- Rich org-level multi-team staffing workflows.
- Wearable and external hardware adapters.

### Step 0E. Temporal Interrogation

- Hour 1 after scaffold: auth and org boundaries are working, but the product still has no user value.
- Week 1 after core loop ships: one coach can onboard one student, publish one plan, log one session, collect one feedback cycle, and review one week.
- Month 1 after pilot: the real question is not feature count, it is whether coaches keep logging after the novelty wears off.
- Month 6 regret scenario: the team ships lots of dashboards and AI copy, but logging friction remains high and no one trusts the summaries.

### Step 0F. Mode Selection

`SELECTIVE_EXPANSION` is correct. The current scope is directionally right. The job is to harden the wedge, add the missing safety and adoption-critical details, and defer tempting side systems.

### CEO DUAL VOICES — CONSENSUS TABLE

Outside voices unavailable in this environment. Proceeding in single-reviewer mode.

| Dimension | Claude | Codex | Consensus |
|-----------|--------|-------|-----------|
| Premises valid? | N/A | N/A | single-reviewer mode |
| Right problem to solve? | N/A | N/A | single-reviewer mode |
| Scope calibration correct? | N/A | N/A | single-reviewer mode |
| Alternatives sufficiently explored? | N/A | N/A | single-reviewer mode |
| Competitive and market risks covered? | N/A | N/A | single-reviewer mode |
| 6-month trajectory sound? | N/A | N/A | single-reviewer mode |

### Section 1. Architecture Review

The current plan names the right modules, but it still reads like a domain inventory more than an execution architecture. The biggest gap is the "student workspace assembly" path. That is the single most important page in the product, and the plan needs to define how plans, latest execution, feedback, alerts, and goals come together without turning into a join-heavy blob.

Recommended system view:

```text
Coach Web / Student Feedback Web / Admin Web
                   |
                   v
              HTTP API Layer
                   |
    +--------------+--------------+
    |                             |
    v                             v
 Domain Modules              Async Jobs
    |                             |
    +-------> Event Outbox <------+
                   |
         +---------+----------+
         |                    |
         v                    v
      Postgres          Object Storage
```

Architecture issues to fix:
1. The plan should explicitly call out a read-model or aggregation layer for the student workspace and review dashboard.
2. The plan should define where cross-module summaries are allowed, otherwise "timeline + analytics + alerts" will leak across modules.
3. The admin surface should not drive MVP architecture. Treat it as a thinner operational layer over the same domain rules.

### Section 2. Error & Rescue Map

The plan currently describes the happy loop well enough, but the rescue paths are where trust will be won or lost. This product is a notebook replacement. Lost work or ambiguous state will get it abandoned fast.

| Trigger | User-facing failure | Required rescue path | Owner |
|---------|---------------------|----------------------|-------|
| Session logging interrupted | Coach loses mid-session notes or must retype | Auto-save draft, recover unsent log, show explicit "draft restored" state | Session execution |
| Plan version changes while a session is in progress | Coach records against the wrong plan context | Lock execution to referenced version and warn if a newer version exists | Plan versioning |
| Student submits feedback late | Weekly review looks inconsistent | Keep feedback timestamp and effective window, show "late signal" label | Feedback + review |
| High pain signal conflicts with aggressive planned load | Unsafe suggestion or silent inconsistency | Create blocking alert and suspend load-increase recommendations | Alerts + rules |
| Cross-org access attempt | Data leak risk | Deny, log, alert if repeated | Auth + audit |
| Summary job fails | Review page looks blank or stale | Show last successful summary timestamp plus fallback evidence view | Review + jobs |

### Section 3. Security And Threat Model

The baseline security section is good, but not complete enough for an implementation team. Two gaps matter:
1. Consent and data-usage policy for any AI-facing processing is not described. The adapter boundary is good, but provenance and allowed use still need a rule.
2. Export rules need object-level scope. "Coach can export" is not enough. Export of one student, many students, or org-wide stats are different controls.

High-severity risks:
- Cross-tenant query leakage through convenience joins.
- AI suggestion generation over broader data than the active coach is allowed to see.
- Attachment uploads containing sensitive media without lifecycle policy.

### Section 4. Data Flow And Interaction Edge Cases

The plan needs one canonical end-to-end flow so the team does not implement each module in isolation.

```text
assessment -> program_version -> session_plan -> session_execution
      \                               ^
       \                              |
        -> student_goal --------------+
                     \
                      -> student_feedback -> derived_features -> alert/review
```

Edge cases that need explicit handling:
- Two coaches touch the same student in one week.
- Student is paused, then returns with stale goals and expired plan versions.
- A session is partially completed across two time windows.
- Feedback is missing for a week but execution still exists.
- A review is generated before all expected signals arrive.

### Section 5. Code Quality Review

There is no code yet, so this is about guardrails. The plan should require a canonical naming scheme for aggregates, events, and IDs before implementation starts. Otherwise the codebase will mirror the document language loosely and drift fast.

Guardrails to add:
- One ubiquitous term per business object. For example, do not mix "program," "plan," "cycle," and "template" inconsistently.
- Append-only version history for published plans and templates.
- A single place where permission checks happen, not ad hoc route logic.

### Section 6. Test Review

The testing section is directionally good but still too checklist-shaped. The plan needs an explicit coverage model. The hardest bugs in this product will come from state drift across modules, not isolated CRUD failures.

Testing gaps:
1. No explicit concurrency or stale-version tests.
2. No recovery tests for interrupted session logging.
3. No cross-role authorization test matrix.
4. No evidence-integrity tests proving that weekly review output can be traced back to source records.

The detailed test artifact lives at `docs/plans/artifacts/2026-04-13-smart-training-workbench-mvp-test-plan.md`.

### Section 7. Performance Review

The most likely slow path is the student workspace and weekly review page, not login or CRUD. Those views are cross-cutting aggregations. If the team builds them straight from raw joins across assessments, plans, execution, feedback, and alerts, the first pilot dataset will already feel sluggish.

Performance implications to design for:
- Read models or cached aggregates for the student workspace.
- Async generation for review summaries and heavier derived features.
- Query budgets for timeline and trend pages.

### Section 8. Observability And Debuggability Review

The plan needs explicit debug surfaces for jobs, rules, and suggestions. If a coach sees a strange alert or a missing summary, the system should be able to answer "why" without grep-driven archaeology.

Add:
- Rule-evaluation logs with source inputs and triggered thresholds.
- Summary-generation job status with last run time and failure reason.
- Traceable IDs linking UI review cards back to source rows.

### Section 9. Deployment And Rollout Review

The rollout plan is too thin right now. "Pilot with a small coach cohort" is directionally right but operationally incomplete. This product should ship behind feature flags and pilot gating, especially the suggestion layer.

Rollout controls to add:
- Internal-only mode for rules and summary features before external pilot.
- Seed/demo fixtures for realistic student histories.
- Pilot success review after the first 2 weeks, focused on logging completion and weekly review usefulness.

### Section 10. Long-Term Trajectory Review

The plan protects against one common failure, jumping to AI too fast. Good. The bigger long-term risk is the opposite: building an over-generalized data machine before one coaching segment loves the workflow. The product wins if one slice of coaches cannot imagine going back to notes and chat apps. Then the rest can follow.

### Section 11. Design And UX Review

UI scope is real, so the design review is not optional. The coach workspace, session recorder, student feedback form, and weekly review page are the product. The detailed design pass is below.

### NOT In Scope

- Multi-team operational management beyond basic org and role boundaries, because the first wedge should optimize for solo or very small teams.
- Standalone student app shell, because a thin MVP feedback surface is enough to learn whether the loop works.
- Heavy reporting/export templating, because the review loop itself matters more than polished presentation first.
- Hardware and wearable integrations, because they distract from the manual workflow the product is trying to structure.

### What Already Exists

- Clear product boundary documentation in the alignment document.
- Detailed functional inventory in the PRD.
- Repo-local `memory/` for durable planning context.

### Dream State Delta

This plan gets the product from zero to "trusted digital coaching memory." It does not yet get the product to "trusted coaching operating system." The missing delta is not mostly AI. It is pilot proof that coaches repeatedly use the loop, trust the evidence rail, and act on the review outputs.

### Failure Modes Registry

| Failure mode | Why it matters | Detection | Preventative control |
|--------------|----------------|-----------|----------------------|
| Coaches stop logging after the first week | Kills the whole data strategy | Drop in completed session records per active student | Draft recovery, fast logging UX, pilot instrumentation |
| Plan versions drift from real execution | Makes reviews unreliable | Execution records referencing stale or missing versions | Version locking plus warnings |
| Alert fatigue | Coaches stop trusting system guidance | Low close rates or mass dismissals | Priority tiers, reasoned alerts, tune thresholds |
| Cross-tenant data bleed | Severe trust and legal risk | Audit anomalies, cross-org query tests | Mandatory `org_id` scoping in every module |
| Review summaries become opaque | Coaches cannot trust recommendations | Support tickets, manual spot checks | Evidence links, source provenance, rule trace logs |

### CEO Completion Summary

| Review area | Result |
|-------------|--------|
| Step 0 | SELECTIVE_EXPANSION, scope hardened around pilot wedge |
| Section 1 (Arch) | 3 issues found |
| Section 2 (Errors) | 6 error paths mapped, 3 major rescue gaps |
| Section 3 (Security) | 3 issues found, 2 high severity |
| Section 4 (Data and UX) | 5 edge cases mapped, 4 unhandled |
| Section 5 (Quality) | 3 guardrail gaps found |
| Section 6 (Tests) | Coverage model missing, test artifact required |
| Section 7 (Perf) | 2 high-risk aggregation paths flagged |
| Section 8 (Observability) | 3 gaps found |
| Section 9 (Deploy) | 3 rollout risks flagged |
| Section 10 (Future) | Reversibility 4/5, biggest debt is ICP overbreadth |
| Section 11 (Design) | review required, handled below |

## Phase 2: Design Review

### System Audit

- `DESIGN.md`: missing
- Existing reusable UI patterns: none in repository
- UI scope: strong, because the MVP depends on coach workspace, session logging, feedback, and review interactions

### Step 0. Design Scope Assessment

#### 0A. Initial Design Rating

This plan starts at `6/10` on design completeness. It knows what screens exist, but not yet what each screen prioritizes, how states behave, or what interaction burden the coach actually feels.

#### 0B. DESIGN.md Status

No design system file exists. Proceeding with universal design principles: evidence-first hierarchy, low-noise surfaces, strong typography, and state clarity over decorative dashboards.

#### 0C. Existing Design Leverage

The only design leverage today is the product intent: coach-first, low friction, evidence-first. There are no components, tokens, or visual patterns to reuse yet.

#### 0D. Focus Areas

- Student workspace hierarchy
- Session logging friction and rescue states
- Mobile student feedback form clarity
- Review dashboard evidence ordering

#### 0.5 Visual Mockups

No mockup binary was used in this environment. Review proceeded from plan structure only.

### DESIGN DUAL VOICES — CONSENSUS TABLE

Outside voices unavailable in this environment. Proceeding in single-reviewer mode.

| Dimension | Claude | Codex | Consensus |
|-----------|--------|-------|-----------|
| Information architecture | N/A | N/A | single-reviewer mode |
| Interaction state coverage | N/A | N/A | single-reviewer mode |
| User journey | N/A | N/A | single-reviewer mode |
| AI slop risk | N/A | N/A | single-reviewer mode |
| Design system alignment | N/A | N/A | single-reviewer mode |
| Responsive and accessibility | N/A | N/A | single-reviewer mode |
| Unresolved decisions | N/A | N/A | single-reviewer mode |

### Pass 1. Information Architecture

Current rating: `6/10`. The plan lists screens, but it does not define what wins the top of each one. For this product, hierarchy is the job.

Recommended coach navigation:

```text
Dashboard
├── Students
│   └── Student Workspace
│       ├── Current Goal + Active Risks
│       ├── Active Plan Version
│       ├── Latest Execution
│       ├── Latest Feedback
│       ├── Timeline
│       └── Weekly Review
├── Alerts / Tasks
├── Templates / Exercise Library
└── Settings / Audit / Team
```

Fix to `8/10`:
- Student workspace top rail should show current goal, current plan version, last session status, latest feedback status, and open alerts.
- The weekly review page should lead with evidence and recommended action, not charts.

### Pass 2. Interaction State Coverage

Current rating: `4/10`. Critical states are mostly implicit.

Required states to add:
- Student list empty: friendly setup state with create/import actions.
- Session recorder partial save: explicit draft state and resume action.
- Student feedback submitted late: state label showing that it arrived after the expected review window.
- Review page loading and stale summary: show last successful summary timestamp plus direct evidence fallback.
- Alert resolution success: clear "resolved by X at Y" confirmation.

Fix to `8/10`: explicitly specify loading, empty, error, success, and partial states for all four critical surfaces.

### Pass 3. User Journey And Emotional Arc

Current rating: `6/10`.

The emotional arc should be:
- Onboarding: "I can set this student up without fighting the system."
- Session end: "I can log what actually happened fast."
- Weekly review: "The system helped me remember and compare, it did not lecture me."

Right now the plan has the screens, but not the emotional burden. Add one design sentence per critical flow describing what the user should feel, not just what they should click.

### Pass 4. AI Slop Risk

Current rating: `5/10`.

This product is at risk of becoming a generic "fitness analytics dashboard" with gradient cards and fake intelligence copy. That would be a mistake. The UI should feel like a sharp coach console, not a generic SaaS analytics panel.

Hard rules:
- No homepage full of vanity KPI cards before the user sees students who need attention.
- No review screen where charts outrank actual plan changes and evidence.
- No AI copy blocks that cannot be traced back to source records.

Fix to `8/10`: keep the interface calm, structured, and evidence-first.

### Pass 5. Design System Alignment

Current rating: `3/10` because there is no design system document.

Minimum direction to add now:
- Typography: calm, professional, information-dense without feeling cramped.
- Color: low-noise neutrals plus a small semantic set for risk, success, stale, and draft.
- Component primitives: cards, evidence rows, diff chips, timeline items, alert banners, and form steps.

Recommended follow-up: create `DESIGN.md` before implementation goes too far.

### Pass 6. Responsive And Accessibility

Current rating: `4/10`.

The plan mentions desktop coach and mobile student, but it does not define responsive behavior intentionally.

Add:
- Coach workspace on tablet: stacked evidence rail with sticky top summary.
- Student feedback on mobile: one-screen form, large targets, zero horizontal scroll.
- Accessibility: 44px touch targets, keyboard navigation for major coach workflows, semantic landmarks, contrast requirements, and non-color-only alert encoding.

Fix to `8/10`: define the layout changes instead of saying "mobile-friendly."

### Pass 7. Unresolved Design Decisions

Deferred design choices:
- Whether the coach dashboard is student-list-first or alert-list-first.
- Whether student feedback is route-level inside the main product or its own shell.
- Whether review pages show charts before narrative evidence blocks.

My recommendation:
- Student-list-first for coach home, because coaches usually start from a client, not a dashboard.
- Thin route inside the main product shell for MVP student feedback.
- Evidence block before charts on review pages.

### Design Completion Summary

| Review area | Result |
|-------------|--------|
| System audit | `DESIGN.md` missing, UI scope confirmed |
| Step 0 | `6/10`, biggest gaps are hierarchy and state coverage |
| Pass 1 (Info Arch) | `6/10 -> 8/10` after fixes |
| Pass 2 (States) | `4/10 -> 8/10` after fixes |
| Pass 3 (Journey) | `6/10 -> 8/10` after fixes |
| Pass 4 (AI Slop) | `5/10 -> 8/10` after fixes |
| Pass 5 (Design Sys) | `3/10 -> 6/10` after interim direction |
| Pass 6 (Responsive) | `4/10 -> 8/10` after fixes |
| Pass 7 (Decisions) | 3 decisions surfaced, 0 blocked |

## Phase 3: Engineering Review

### Step 0. Scope Challenge

There is no code yet, so this step reviews implementation blast radius rather than changed files. The plan is valid, but the first build should not try to ship all thirteen conceptual modules at equal depth.

Recommended first-build modules:
1. Identity and access
2. Organizations and teams
3. Students
4. Assessments and goals
5. Plan authoring and versioning
6. Session execution
7. Student feedback
8. Review and alerts
9. Audit and file storage as horizontal foundations

Defer as second-wave depth:
- Advanced template management beyond the minimum needed to create plans.
- Rich export/report templating.
- AI extraction correction UI.
- Full org operations center.

### ENG DUAL VOICES — CONSENSUS TABLE

Outside voices unavailable in this environment. Proceeding in single-reviewer mode.

| Dimension | Claude | Codex | Consensus |
|-----------|--------|-------|-----------|
| Architecture sound? | N/A | N/A | single-reviewer mode |
| Test coverage sufficient? | N/A | N/A | single-reviewer mode |
| Performance risks addressed? | N/A | N/A | single-reviewer mode |
| Security threats covered? | N/A | N/A | single-reviewer mode |
| Error paths handled? | N/A | N/A | single-reviewer mode |
| Deployment risk manageable? | N/A | N/A | single-reviewer mode |

### 1. Architecture Review

The architecture should preserve one deployable system while making future extraction possible. That means boundaries in code first, not in infrastructure first.

Recommended dependency graph:

```text
UI Layer
├── Coach Web
├── Student Feedback Web
└── Admin Web
      |
      v
Application Services
├── Auth / Org Scope
├── Student Workspace
├── Plan Authoring
├── Session Logging
├── Feedback Intake
├── Review / Alerts
└── Audit / Export
      |
      v
Domain + Persistence
├── Postgres
├── Event Outbox
├── Read Models
└── Object Storage
```

Architecture issues:
1. Add an explicit `student workspace` aggregation service or query model. Without it, every feature will build its own cross-module join path.
2. Define which events are authoritative inputs to derived features and alerts.
3. Make review summaries a consumer of evidence models, not a place that invents its own sourcing.

### 2. Code Quality Review

Before code exists, the team should agree on three guardrails:
- Domain API boundaries. A module can call another module's service contract, not its tables directly.
- Naming discipline. `program_version` and `session_plan` are good anchors; keep them consistent.
- Auditable commands. Any mutation that publishes, exports, approves, or resolves should have a command path plus audit emission.

Likely quality pitfalls:
- Document-defined modules becoming thin folders with hidden shared-state coupling.
- Business rules leaking into controller or route code.
- Timeline becoming a junk drawer for unrelated rendering hacks instead of a proper event ledger.

### 3. Test Review

There is no framework configured yet, so the test strategy must be expressed as behavior coverage first. Once the stack is chosen, map these to unit, integration, and end-to-end suites.

Execution coverage diagram:

```text
student onboarding
    -> assessment saved
    -> goal saved
    -> timeline event emitted
    -> first plan version published

session logging
    -> session draft created/recovered
    -> execution persisted
    -> diff computed
    -> timeline updated
    -> alert rules evaluated

student feedback
    -> feedback persisted
    -> anomaly detected or ignored
    -> review inputs updated

weekly review
    -> read model assembled
    -> summary generated
    -> evidence linked
    -> plan adjustment published
```

Critical test gaps to cover:
- Cross-tenant authorization matrix.
- Stale version and concurrent edit handling.
- Draft recovery after interruption.
- Late feedback inclusion/exclusion rules.
- Alert suppression when safety constraints block aggressive suggestions.
- Review evidence provenance.

The detailed artifact is committed in `docs/plans/artifacts/2026-04-13-smart-training-workbench-mvp-test-plan.md`.

### 4. Performance Review

The plan does not yet protect the two most obvious expensive views:
- Student workspace, because it aggregates many recent objects.
- Weekly review, because it combines trends, diffs, and derived features.

Performance actions:
- Build a thin read model for the workspace.
- Keep timeline pagination explicit.
- Run heavier review/suggestion work in background jobs where possible.
- Treat attachments as object storage references, not DB-heavy payloads.

### Engineering Required Outputs

#### NOT In Scope

- Multiple deployable services from day one.
- Full report rendering system in the first release.
- General-purpose AI extraction workflows beyond the minimum provenance path.

#### What Already Exists

- Strong domain and scope definition in docs.
- A committed baseline plan to review against.
- Project memory and Git discipline already in place.

#### Failure Modes

| Failure mode | Critical gap? | Mitigation |
|--------------|---------------|------------|
| Session log drafts are lost | Yes | Draft persistence plus recovery banner |
| Review page mixes stale and fresh evidence without labeling | Yes | Source timestamps and stale-state UI |
| Alert engine spams low-signal warnings | No, but serious | Priority tiers and alert close reasons |
| Auth scope enforced in UI only | Yes | Central permission layer with integration tests |
| Timeline events become inconsistent across modules | Yes | Event schema plus contract tests |

#### Worktree Parallelization Strategy

- Stream 1: Auth, org scope, audit foundation
- Stream 2: Student, assessment, goal, plan versioning
- Stream 3: Session logging, feedback intake, read models, alerts

This is only valid once the stack scaffold exists and module contracts are written down.

### Engineering Completion Summary

| Review area | Result |
|-------------|--------|
| Step 0 | Scope accepted, but first build narrowed to core loop modules |
| Architecture Review | 3 issues found |
| Code Quality Review | 3 guardrail gaps found |
| Test Review | Coverage diagram produced, 6 major gaps identified |
| Performance Review | 4 issues found |
| NOT in scope | written |
| What already exists | written |
| Failure modes | 4 critical gaps flagged |

## Cross-Phase Themes

1. **Narrow the wedge.** Strategy, design, and engineering all point to the same thing: the product gets better if the first pilot is solo or very small-team coaches in general fitness, not broad coach operations.
2. **Evidence beats dashboard theater.** The UI, architecture, and testing all need to support a fast, trusted evidence rail around one student, not a generic analytics homepage.
3. **Logging reliability is existential.** Session draft recovery, plan-version locking, and feedback timing all showed up as first-order concerns. This is not polish.
4. **AI must stay traceable.** Strategy, security, and review logic all improve when suggestions are clearly downstream of rules and evidence instead of acting like a black box.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope and strategy | 1 | issues_open | 3 core strategic tightening points, 3 rescue gaps |
| Codex Review | `codex exec` | Independent second opinion | 1 | unavailable | CLI attempt hung, no review text returned |
| Eng Review | `/plan-eng-review` | Architecture and tests | 1 | issues_open | 3 architecture issues, 6 test gaps, 4 critical failure modes |
| Design Review | `/plan-design-review` | UI and UX gaps | 1 | issues_open | hierarchy, state coverage, responsive and design-system gaps |

**VERDICT:** REVIEWED, NOT YET APPROVED. The plan is viable, but it still needs your approval on the surfaced taste decisions before it should become the execution baseline.
