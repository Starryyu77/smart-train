# Smart Training Workbench Architecture Baseline

## Approved Execution Baseline
- Delivery surface: coach mobile-first web first, student mobile-first web first, with admin capability deferred or embedded as narrower internal routes later.
- Stack baseline: `Next.js + React + TypeScript` for the first deployable app.
- Packaging baseline: one deployable app plus internal packages for domain contracts and platform primitives.
- China rollout baseline: offshore private pilot is acceptable for early validation; public mainland rollout requires the filing path already captured in project memory.

## Repository Shape
```text
apps/web
packages/domain
packages/platform
docs/
memory/
```

## Runtime Shape
```text
Coach Mobile Web / Student Mobile Web / Internal Admin Routes
                 |
                 v
           Next.js App Router
                 |
       Domain + Platform Packages
                 |
       Postgres / Object Storage / Async Jobs
```

## Phase 1 Module Boundaries

### `@smart-train/domain`
- Shared business vocabulary.
- Student workspace snapshot contracts.
- Alert, feedback, plan, and actor types.

### `@smart-train/platform`
- Auth and surface-access primitives.
- Org-scoping guards.
- Audit event primitives.
- Object-storage key strategy.

### `apps/web`
- Route surfaces and view composition.
- Read-model assembly for coach mobile surfaces and student mobile surfaces.
- Health endpoint and environment wiring.

## Domain Language
- `workspace snapshot`: the assembled coach view for one student.
- `active program version`: the published version a session should log against.
- `late signal`: feedback received outside the preferred review window but still retained as evidence.
- `blocking alert`: a rule outcome that should prevent unreviewed load progression.
- `draft recovery`: the ability to recover interrupted session logging work.

## Security Assumptions
- Every business object is tenant-scoped by `orgId`.
- Surface access is role-bound and explicit.
- Sensitive actions must be auditable even before the full auth stack is integrated.
- AI-facing processing stays behind a later adapter boundary and is not part of the current scaffold.

## Next Technical Steps
1. Add a real auth provider and session persistence.
2. Add database schema, migrations, and seeded workspace snapshots.
3. Add low-connectivity draft recovery for session logging.
4. Replace mock read models with data-access services behind org guards.
