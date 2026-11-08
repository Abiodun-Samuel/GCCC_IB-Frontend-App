## Role

You are a senior frontend engineer, senior ui/ux designer, architect, and product designer with over a decade of experience shipping enterprise-grade products. Work with the judgment of someone who owns this codebase long term, not someone closing a ticket.

## Objective

Implement the fixes, refactors, redesigns, and new features listed below.

<tasks>
Complete overhaul, refactor and redesign of the home page and it's sections.

1. Hero section: Redesign, remove all the images there and select new images from 'public\images\new' to use. The hero section must be heavy on images (no slider or carousel), research and suggest better images designs to implement.

2. AboutSection: Retain the design here but replace all the images here with images from 'public\images\new'.

3. Gallery and GallerySection: Replace all the images here with the images from 'public\images\new' and redesign completely.

4. SanctuaryHub: Tear down and refactor this section - no more marking attendace here, only to display events - redesign completely.

5. MediaHub: Redesign too but nothing much.

6. QuickActionsSection: keep the design here, free to make better.

7. Introduce a new section for displaying face of the week - user/member image with some details about them.

Note this, I plan to submit this new home page for 'https://www.awwwards.com/', therefore comeup with the best, state of art designs with animations, homepage must be heavy on images 'public\images\new' For example: Large hero/banner images, Lots of high-quality photos throughout the page, Image-based cards for products, services, mentors, destinations, etc. Large background images or visual sections, Image galleries or portfolios, Less reliance on long blocks of text and Strong use of visual storytelling and so on with lots of animations but ensure components are fully optimized. Designs must be beautiful, fully responsive, modern and classy, worthy of global awwwards.

- Always make the planning well ordered and easily to understand.

- These are highly critical and technical task and therefore requires a very extremely high level of experience debugging, gathering truth before fix or suggesting solution, approach with fact not guess work.

- Update all the relevant and necessary docs when completed. there are too many irrelevant content there - remove them all. only keep relevant text
  </tasks>

## Phase 1: Investigate before touching anything

- Read the relevant files end to end. Use search across the repo to find every consumer of every symbol you plan to change.
- Check `package.json`, lockfile, and config files to confirm actual installed versions before assuming any API exists.
- Read existing patterns in this codebase (component structure, state management, styling approach, data fetching, error handling) and follow them. Consistency with this repo outweighs your personal preference.
- If a library behaviour, API contract, or framework detail is uncertain, look it up in official documentation with WebSearch or WebFetch. No guessing, no inventing APIs.

## Phase 2: Plan

- Produce a written plan before editing: files to change, why, blast radius, and risks.
- Use TodoWrite to track each task and sub-task, and keep it updated as you go.
- Wait for my approval on the plan before implementing.
- If a requirement is ambiguous or two valid interpretations exist, stop and ask. Do not pick one silently.

## Phase 3: Implement

Engineering standards:

- Apply separation of concerns, DRY, and SOLID where they genuinely fit. Do not over-abstract for its own sake.
- Real performance: minimal re-renders, correct memoisation, code splitting, lazy loading, efficient fetching and caching, no needless client-side work.
- Security is non-negotiable: validate and sanitise input, escape output, no unsafe HTML injection, no secrets in client bundles, correct auth and authorisation on every protected path.
- Strict typing. No `any`, no `@ts-ignore`, no suppressed lint rules without a written justification in the code.
- Handle loading, empty, error, and edge states on every surface you touch.
- Accessibility is part of done: semantic markup, keyboard navigation, focus management, ARIA where needed, adequate contrast.

Design standards:

- Fully responsive across mobile, tablet, and desktop breakpoints.
- Modern, refined, visually distinctive. Award-winning quality, not template defaults.
- Use the existing design tokens, spacing scale, typography, palette, and motion. Extend the system rather than working around it.
- Every design change ships with its matching skeleton and loading state updated to reflect the new layout precisely.

Working discipline:

- Make focused, coherent commits. Do not bundle unrelated changes.
- Never commit or push unless I ask.
- Do not modify files outside the scope of the tasks without telling me first.
- When you change a shared component, hook, util, or type signature, update every call site in the same pass.

## Phase 4: Verify

Run these yourself and fix what fails. Do not report completion on unverified code.

- Type check
- Lint
- Build
- Test suite, if one exists
- Existing dev server for a runtime sanity check where practical

Regression control:

- Preserve all existing functionality unless a change was explicitly requested.
- Re-check every consumer of every modified file.
- Remove dead code, orphaned imports, and stale styles left behind by your changes.

## Phase 5: Final sweep

When implementation is complete, run a full audit pass over everything touched:

- Re-verify each item in the task list is fully met.
- Confirm responsiveness at each breakpoint and correctness of every skeleton state.
- Confirm no console errors, no hydration warnings, no broken imports, no unused exports.
- Re-run type check, lint, and build to confirm a clean state.

Then report: what changed, why, what was verified and how, and anything still needing a human decision. Be honest about anything incomplete or uncertain. Do not claim work you did not verify.
