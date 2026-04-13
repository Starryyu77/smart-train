# Task Memory

- Task ID: autoplan-mvp-foundation
- Task name: Create and review the MVP foundation plan
- Started: 2026-04-13
- Updated: 2026-04-13
- Workspace: `/Users/starryyu/2026/Smart Training Workbench for Fitness Coaches`
- Status: active

## 1. Task Goal
- Turn the current PRD and alignment docs into a reviewable MVP plan, then run an autoplan-style strategy, design, and engineering review on it.

## 2. Current Progress
- Read the repository PRD and internal alignment doc.
- Confirmed there was no existing implementation plan in the repo.
- Drafted a first MVP foundation plan under `docs/plans/`.
- Ran an autoplan-style CEO, design, and engineering review against the draft plan.
- Generated a standalone test-plan artifact and root `TODOS.md`.
- Started a product and compliance discussion about China-first delivery surfaces.
- Collected current official constraints for mainland-hosted websites, apps, and public internet services.
- Formed a working recommendation of coach Web first plus student H5 first, with mini-program or native app deferred until distribution or device needs are proven.

## 3. Decisions Made + Reasons

| Step | Decision | Reason | Rejected options and why |
|------|----------|--------|--------------------------|
| 1 | Synthesize an initial plan from the current documents before running autoplan. | `autoplan` needs a concrete plan artifact, not just source docs. | Review the raw PRD directly: rejected because it mixes product intent with implementation detail and lacks a single execution shape. |
| 2 | Treat the documented product premises as the current confirmed baseline unless contradicted by the user later. | The PRD and alignment doc already capture explicit strategic choices. | Block immediately on premise confirmation before any synthesis: rejected because it would stall progress despite the existing written premise set. |
| 3 | Carry a working recommendation of coach Web first plus student H5 first for the China-facing MVP. | It keeps the compliance and release path simpler than mini-program-first or native-app-first while fitting a dense coach workflow better. | Mini-program first: rejected for now because the coach workbench needs richer desktop interaction and adds platform review friction. Native app first: rejected for now because it adds client release overhead before product fit is proven. |

## 4. Open Issues
- The reviewed plan still needs user approval on the surfaced taste decisions.
- No formal design system or `DESIGN.md` exists yet.
- No implementation scaffold exists yet, so engineering review remains plan-first rather than code-first.
- The project still needs explicit user confirmation on the China go-to-market surface and hosting path.
- If the MVP is Web-first, the deployment path still needs to be chosen: mainland-hosted and filed, or offshore private pilot first then mainland later.

## 5. Task-Specific Constraints
- Keep the first plan grounded in the current docs; do not invent unrelated product lines.
- Preserve coach-first, training-loop-first scope.
- Every meaningful round of changes should be committed.

## 6. Next Step
- Resolve the delivery-surface discussion with the user, then fold the confirmed recommendation into the execution baseline and implementation plan.
