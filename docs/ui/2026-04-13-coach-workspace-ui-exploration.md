# Coach Workspace UI Exploration

- Date: 2026-04-13
- Figma file: `Smart Training Workbench - Coach Workspace Exploration`
- Figma URL: `https://www.figma.com/design/v2OIqqdvMmgdDA3bWegbQY`
- Focus: current UI direction for coach and student phone-first web surfaces

## Status

- The first desktop-first concept was rejected by user feedback as visually weak and wrong for the target interaction shape.
- The active direction is now `mobile-first for both coach and student`.

## What is currently designed

### 1. Coach mobile
- A `Today` triage screen for quickly spotting who needs review.
- A coach athlete detail screen that keeps the decision chain on one narrow screen:
  - current goal
  - plan version
  - adherence
  - latest execution
  - latest feedback
  - explicit coach decision

### 2. Student mobile H5
- A narrow recovery check-in surface focused on signal collection, not engagement theater.
- Explicit inputs for sleep, soreness, and pain, plus a short note field and a single submit action.

## Design choices locked in this exploration
- Product screens are dark, compact, and phone-first.
- Lime is used as the strongest action/progress color.
- Coral is reserved for signals that need review.
- Coach and student flows now share one visual language instead of splitting into desktop vs mobile aesthetics.

## What this exploration resolved
- The product should not be designed as a desktop dashboard.
- Coach and student surfaces can both live comfortably as phone-first web flows.
- Student H5 can stay intentionally small while still feeling coherent with the main product.

## What still needs iteration
- Some copy and labels should be localized more consistently into Chinese.
- The coach mobile information density still needs tuning after real data arrives.
- We should decide whether the next screen to design is:
  - the session logging flow
  - the plan authoring/version diff screen
  - the coach dashboard
