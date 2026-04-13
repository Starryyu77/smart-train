# Decision Ledger

| Step | Decision | Reason | Rejected options and why | Date |
|------|----------|--------|--------------------------|------|
| 1 | Move UI iteration out of Figma and into the web app. | The user wants direct implementation rather than another design artifact round. | Continue with Figma-led iteration: rejected because it adds an extra loop the user does not want. | 2026-04-13 |
| 2 | Implement the smallest meaningful phone-first route set first. | It keeps the scope tight while making the product direction concrete. | Build many routes at once: rejected because it would dilute the first implementation pass. | 2026-04-13 |
| 3 | Make `/coach` the default product entry route. | It aligns the app entry point with the coach-first operating model. | Keep a neutral homepage as the default entry: rejected because it reads as a demo shell instead of a product. | 2026-04-13 |
| 4 | Extend athlete detail into a dedicated `log-session` route before touching plan editing. | Session logging is the shortest path from “looks like a product” to “supports real coach work”. | Jump straight to plan editing: rejected because it skips the evidence-capture layer the product depends on. | 2026-04-13 |
| 5 | Implement plan adjustment as a diff-and-publish screen, not as a full plan editor. | The MVP job is to support the next coaching decision quickly on mobile, not to ship a heavy authoring tool yet. | Start with a full editor: rejected because it adds too much form complexity before the decision flow is validated. | 2026-04-13 |
| 6 | Add a built-in first-time onboarding route instead of relying on placeholder copy alone. | The current product flow is understandable once seen, but first-time users still need explicit sequencing. | Add only tooltip-like hints: rejected because they do not explain the end-to-end flow. | 2026-04-13 |
| 7 | Redesign comparison-heavy screens around explicit side-by-side structures instead of stacking generic cards. | The user feedback correctly identified that the old UI had text noise but weak visual comparison. | Only tune colors and copy: rejected because it would not fix the structural readability problem. | 2026-04-13 |

## Notes

- Add new rows when direct implementation decisions materially change direction.
