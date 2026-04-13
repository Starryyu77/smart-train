# Task Memory

- Task ID: figma-ui-exploration
- Task name: Create the first Figma UI exploration for the coach workspace
- Started: 2026-04-13
- Updated: 2026-04-13
- Workspace: `/Users/starryyu/2026/Smart Training Workbench for Fitness Coaches`
- Status: active

## 1. Task Goal
- Turn the approved Web-first baseline into a visible UI direction inside Figma, starting with the coach desktop workspace and a supporting student H5 recovery screen.

## 2. Current Progress
- Used the Figma plugin to create a new design file in the user's drafts/team space.
- Confirmed the new file had no linked design-system components, variables, or styles available for reuse.
- Created a first-pass design board containing:
  - one coach desktop workspace concept
  - one student H5 check-in concept
- Captured the Figma file URL and wrote a repo-local design exploration note under `docs/ui/`.

## 3. Decisions Made + Reasons

| Step | Decision | Reason | Rejected options and why |
|------|----------|--------|--------------------------|
| 1 | Start with the coach student workspace instead of a generic dashboard. | It is the most important product surface and best expresses the approved evidence-first product logic. | Design the landing page first: rejected because it would optimize presentation before core workflow clarity. |
| 2 | Add a student H5 check-in concept on the same board. | It helps validate the thin student surface assumption without starting a second design stream later. | Design coach-only in isolation: rejected because the coach workspace depends on the shape of student feedback input. |
| 3 | Use a custom local visual language instead of waiting for an external design system. | The repository already has a design baseline and the new Figma file had no reusable design-system assets. | Stop until a design system exists: rejected because the user asked to start designing now. |

## 4. Open Issues
- The board still needs a second pass for copy consistency and tighter localization.
- No reusable Figma component library exists yet.
- We still need to choose the next highest-value screen for iteration.

## 5. Task-Specific Constraints
- Preserve the approved coach-first, evidence-first, Web-first baseline.
- Keep student H5 thin and supportive rather than turning it into a second product.
- Every meaningful round of changes should be committed.

## 6. Next Step
- Review the first Figma board with the user, capture UI feedback, and then design the next core screen.

