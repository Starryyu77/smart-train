# Task Memory

- Task ID: mobile-ui-implementation
- Task name: Implement the mobile-first coach and student UI directly in code
- Started: 2026-04-13
- Updated: 2026-04-13
- Workspace: `/Users/starryyu/2026/Smart Training Workbench for Fitness Coaches`
- Status: active

## 1. Task Goal
- Replace the current desktop-leaning scaffold with runnable mobile-first coach and student web screens in the Next.js app.

## 2. Current Progress
- The user rejected using Figma as the main delivery path and asked for direct implementation in the web app.
- The existing repository already has a working Next.js scaffold and seed data.
- Replaced the old desktop-leaning home and athlete detail UI with mobile-first route implementations.
- Added three runnable surfaces:
  - `/coach`
  - `/coach/students/[studentId]`
  - `/student/check-in`
- Verified the implementation with `npm run typecheck` and `npm run build`.
- Added the next core coach workflow: `/coach/students/[studentId]/log-session`.
- Rewired the athlete detail screen so the primary next action is logging a session instead of only viewing the student recovery surface.
- Added the next route in the decision loop: `/coach/students/[studentId]/plan-adjustment`.
- Connected the flow from session logging into a mobile-first version diff and publish screen.
- Localized all current user-facing mobile UI copy into Chinese so the product demo surfaces no longer mix Chinese and English labels.
- Added a first-time coach onboarding tutorial at `/coach/getting-started` and exposed it from the coach home screen.
- Reworked the visual hierarchy of the coach mobile surfaces so comparison-heavy screens now emphasize `执行 vs 恢复` and `原计划 vs 新计划` instead of stacking similar-looking text cards.
- Tightened the onboarding typography so the tutorial no longer mixes oversized emphasis text with smaller body copy inside the same content block.
- Flattened the typography hierarchy on the coach home screen and athlete detail screen so each content block now has a single dominant text line instead of multiple competing emphasis styles.
- After user review, reversed the over-explained direction: reduced copy volume on home, onboarding, and athlete detail, and restored onboarding as an explicit top-level action on the coach home screen.

## 3. Decisions Made + Reasons

| Step | Decision | Reason | Rejected options and why |
|------|----------|--------|--------------------------|
| 1 | Implement the next design iteration directly in the app rather than in Figma. | The user explicitly asked to stop using Figma and let the code become the source of truth. | Continue iterating only in Figma: rejected because it no longer matches the requested workflow. |
| 2 | Ship three runnable mobile surfaces first: coach home, coach athlete detail, and student recovery check-in. | They are the smallest set that makes the product direction concrete in code. | Rebuild the whole product shell first: rejected because it would delay visible progress. |
| 3 | Redirect `/` to `/coach` and treat coach home as the default entry surface. | It keeps the first impression aligned with the coach-first product premise. | Leave a generic root landing page in place: rejected because it weakens the operational product feel. |
| 4 | Implement session logging before plan adjustment. | It adds the first true evidence-capture workflow without forcing the product into heavier editing complexity too early. | Jump directly to plan editing: rejected because it skips the core session evidence layer. |
| 5 | Reduce mixed-size emphasis inside home, onboarding, and athlete blocks instead of only tweaking font sizes globally. | The user’s discomfort came from multiple “headline-like” elements competing within one card, so the fix needed structural hierarchy changes. | Only shrink the largest text: rejected because it would keep the hierarchy conflict intact. |
| 6 | Treat the current mobile demo as an action-first product surface, not a documentation-like explainer. | The user explicitly objected to dense text and wanted a more obvious tutorial entry, which means the UI must bias toward short labels, direct actions, and fewer explanatory sentences. | Keep explanatory copy and only polish styling: rejected because it preserves the underlying “too much text” problem. |

## 4. Open Issues
- The final visual density and copy may still need another pass after the latest typography cleanup is reviewed in-browser.
- The visual direction may still need another pass if the action-first version is still not strong enough after browser review.
- Session logging and plan adjustment are still powered by seed data and do not persist.
- No real plan publish mutation exists yet; the current route is a product-shape prototype.
- The onboarding tutorial is still static and not conditionally shown based on first-run state.

## 5. Task-Specific Constraints
- Preserve the approved Web-first baseline.
- Treat both coach and student surfaces as mobile-first.
- Every meaningful round of changes should be committed.

## 6. Next Step
- Review the new low-copy, action-first pass with the user, then implement real data persistence, publish flows, and first-run state behind the tutorial.
