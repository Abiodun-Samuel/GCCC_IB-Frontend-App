# Home Page Redesign — Design Spec

Date: 2026-09-04
Status: Approved (direction), pending spec review
Scope: `src/components/Home/**`, plus one approved migration into `src/pages/Dashboard/DashboardPage.jsx`

---

## 1. Goal

Rebuild the GCCC Ibadan public home page as an image-led, motion-rich editorial experience of Awwwards calibre, using the 29 photographs in `public/images/new`.

Success criteria:

1. Every section is driven by photography, not by blocks of text.
2. The page loads fast enough to survive performance scrutiny — optimised formats, zero layout shift, prioritised hero image.
3. Motion is deliberate and fully reversible under `prefers-reduced-motion`.
4. No regression: attendance clock-in, celebrations, media, events and quick actions all keep working, some from new homes.
5. Keyboard and screen-reader usable throughout.

---

## 2. Constraints discovered during investigation

These are facts verified against the repo, not assumptions.

| # | Constraint | Source |
|---|---|---|
| C1 | Project is JavaScript/JSX. No `tsc`, no `.ts` in `src/`. `typescript` exists only for `typescript-eslint`. | `package.json`, `jsconfig.json` |
| C2 | Verification is `npm run lint`, `npm run build`, `npm test`. There is no typecheck step. | `package.json` scripts |
| C3 | Header scroll-nav targets `#about`, `#events`, `#media`, `#contact`. These IDs must survive. | `src/layout/home/Header.jsx:133-136` |
| C4 | `#contact` lives in the Footer, not on the home page. | `src/layout/home/Footer.jsx:381` |
| C5 | Tailwind v4 via `@tailwindcss/postcss`. Tokens live in the `@theme` block of `src/index.css`. `tailwind.config.js` is **not** loaded (no `@config` directive) and is effectively dead. | `postcss.config.js`, `src/index.css:33` |
| C6 | `SanctuaryHub.jsx` is the sole consumer of `useMarkAttendance`, `useTodaysService`, `useCoreAppData`, `useSendMessage`. | repo-wide grep |
| C7 | `/dashboard/attendance` is view-only history. Self clock-in exists nowhere else. | `src/pages/Dashboard/AttendancePage.jsx` |
| C8 | `/?source=online\|onsite` is read by SanctuaryHub and drives the attendance mode — a QR entry point. | `SanctuaryHub.jsx:1748` |
| C9 | `SectionHeader` is duplicated in four Home files and has zero consumers outside `src/components/Home/`. | repo-wide grep |
| C10 | There is no public events route. `/dashboard/events` is behind `ProtectedRoute`. | `src/router/index.jsx` |
| C11 | framer-motion 12.23.24 exports `useScroll`, `useTransform`, `useReducedMotion`, `useInView`. Verified against the installed package. | `node_modules/framer-motion` |
| C12 | `sharp` is not installed. | `node_modules` |
| C13 | `versionedAsset(path)` appends `?v=<version>`; in dev the version is `Date.now()`, so it busts cache on every reload. | `src/utils/helper.js:374-379` |
| C14 | AOS is initialised globally in `App.jsx` and is used by non-Home pages. | `src/App.jsx` |

---

## 3. Decisions taken (with rationale)

| # | Decision | Rationale |
|---|---|---|
| D1 | **Art direction: "dark theatre, light breath."** Hero, Gallery, Events, Face of the Week and MediaHub run on the near-black `PAGE_BG` (`#020c16`). About and QuickActions stay light. | The photographs are warm amber and magenta; brand cyan `#0998d5` is amber's complement. Against dark ground the photos become the light source and cyan works as a hairline accent. Honours the instruction to retain About and QuickActions. |
| D2 | **Self clock-in moves to `/dashboard`.** | It is the only clock-in path in the product (C6, C7). Deleting it would remove a live feature and break QR codes (C8). |
| D3 | **Celebrations stay in the new events section**, still auth-gated. | User decision. |
| D4 | **Face of the Week is a curated static file** with `TODO` placeholders for real names. | No public member API exists. Attaching invented names or testimonies to photographs of real, identifiable people is not acceptable, so nothing factual about an individual ships until the user fills it in. |
| D5 | **Events = featured + upcoming list.** `useClosestEvent()` for the feature, `useEvents({ per_page: 6 })` for the grid. | A single card cannot carry an image-led section. Both endpoints are public and cached. |
| D6 | **Image pipeline: `sharp` devDependency + `npm run images`, outputs committed.** Not wired to `prebuild`. | A deploy must not be able to fail on image encoding, and build times should not vary. Idempotent: skips when output is newer than input. |
| D7 | **Home page uses framer-motion only; AOS stays for the rest of the app.** | Two scroll-animation systems on one page is a consistency and performance smell. AOS remains initialised globally (C14) so no other page regresses. |
| D8 | **Originals stay at `public/images/new/`**, renamed semantically. Optimised derivatives go to `public/images/home/`. | The user's mental model points at `public/images/new`; keeping it is lower friction when they add photos. Cost is ~5 MB of unreferenced static files in the deploy, which is storage, not transfer. |
| D9 | **Docs = inline code comments only.** No README rewrite, no `docs/` content beyond this spec. | User decision. |
| D10 | **Duplicate and low-resolution images are renamed but never referenced.** | User did not approve deleting them. `neon-five-women-lowres.jpg` is 450×335 — too soft for any slot on this page. |

---

## 4. Image manifest

29 originals in `public/images/new`, renamed. Dimensions read from the JPEG headers, not estimated.

### 4.1 Renames

| New name | W×H | Subject |
|---|---|---|
| `neon-trio-joy.jpg` | 1440×960 | Three women laughing, neon "Home Is Where You Are" |
| `neon-embrace.jpg` | 1440×960 | Two women embracing, neon sign legible |
| `neon-celebrate.jpg` | 1440×960 | Woman in purple batik, arm raised |
| `neon-family-four.jpg` | 1440×960 | Family of four at the arch backdrop |
| `neon-group-balcony.jpg` | 1440×960 | Large group, warm arch backdrop |
| `neon-duo-portrait.jpg` | 1440×1919 | Man and woman, full length |
| `neon-agbada-portrait.jpg` | 1440×1920 | Man in white agbada and cap, solo |
| `neon-sisters-portrait.jpg` | 1440×1919 | Two young women back to back |
| `neon-black-tee-portrait.jpg` | 1440×1919 | Man in black tee, solo |
| `neon-smile-portrait.jpg` | 1440×1919 | Man in black, smiling, solo |
| `neon-couple-portrait.jpg` | 1440×1919 | Couple at the arch backdrop |
| `neon-five-women-lowres.jpg` | 450×335 | Five women — **unused, too low-res** |
| `magenta-women-joy.jpg` | 1070×716 | Nine women, peace signs, high energy |
| `magenta-women-laugh.jpg` | 1070×716 | Eight women laughing |
| `magenta-trio-women.jpg` | 1070×716 | Three women laughing |
| `magenta-trio-smile.jpg` | 1070×716 | Three women, arms linked |
| `magenta-trio-men.jpg` | 1065×710 | Three men, magenta stage wash |
| `magenta-pastor-trio.jpg` | 1065×710 | Woman, bearded man, man |
| `magenta-pastor-trio-duplicate.jpg` | 1065×710 | Byte-identical copy — **unused** |
| `magenta-youth-group.jpg` | 1065×710 | Nine young people |
| `magenta-children.jpg` | 1065×710 | Woman with five children |
| `congregation-wide.jpg` | 1440×1080 | ~35 people, full congregation |
| `congregation-stage.jpg` | 1440×1080 | ~25 people on stage |
| `congregation-row.jpg` | 1440×1080 | ~15 people in a row |
| `congregation-family.jpg` | 1440×1080 | ~25 people, families and children |
| `congregation-full.jpg` | 1440×1693 | ~40 people, widest group shot |
| `worship-lead.jpg` | 1440×960 | Woman singing, band behind — editorial |
| `word-ministration.jpg` | 959×1131 | Man preaching at the podium, blue wash |
| `fellowship-outdoors.jpg` | 1440×1444 | Three people outdoors, daylight |

### 4.2 Placement

| Section | Images |
|---|---|
| Hero mosaic (8) | `neon-trio-joy`, `neon-sisters-portrait`, `worship-lead`, `neon-agbada-portrait`, `magenta-women-joy`, `word-ministration`, `congregation-wide`, `neon-celebrate` |
| About slider (12) | `congregation-wide`, `congregation-stage`, `congregation-row`, `congregation-family`, `neon-embrace`, `neon-family-four`, `neon-group-balcony`, `magenta-women-laugh`, `magenta-trio-women`, `magenta-trio-men`, `worship-lead`, `fellowship-outdoors` |
| Gallery Rail (11) | `neon-couple-portrait`, `magenta-women-joy`, `neon-black-tee-portrait`, `congregation-full`, `neon-embrace`, `word-ministration`, `magenta-youth-group`, `neon-duo-portrait`, `neon-celebrate`, `magenta-children`, `congregation-family` |
| Gallery Mosaic (9) | `neon-trio-joy`, `magenta-trio-smile`, `neon-smile-portrait`, `congregation-stage`, `magenta-pastor-trio`, `neon-sisters-portrait`, `worship-lead`, `magenta-women-laugh`, `neon-family-four` |
| Face of the Week (5 slots) | `neon-agbada-portrait`, `neon-black-tee-portrait`, `neon-smile-portrait`, `neon-couple-portrait`, `neon-duo-portrait` |
| QuickActions card headers (3) | `magenta-trio-men` (Questions), `word-ministration` (Prayer), `magenta-women-joy` (Testimony) |

Events and MediaHub use remote imagery (API event posters, YouTube thumbnails) and take no local images.

---

## 5. Image pipeline

### 5.1 `scripts/optimize-images.mjs`

- Input: `public/images/new/*.jpg`
- Output: `public/images/home/<name>-<width>.<avif|webp|jpg>`
- Widths: `[480, 768, 1200, 1600]`, never upscaled past the intrinsic width
- Quality: AVIF 50, WebP 72, JPEG 78 (mozjpeg)
- Idempotent: skips a target whose mtime is newer than its source
- Also writes `src/components/Home/shared/imageManifest.json`: `{ "<name>": { "width": n, "height": n, "widths": [n, ...] } }`

Wired as `"images": "node scripts/optimize-images.mjs"`. Run manually; outputs are committed. `sharp` is added to `devDependencies` only.

### 5.2 Data separation

- `imageManifest.json` — **generated**: intrinsic dimensions and available widths.
- `shared/homeImages.js` — **authored**: semantic keys, alt text, section groupings. Joins to the manifest by key.

Alt text is written per image describing what is actually in frame. No `"Church image 3"` placeholders.

### 5.3 `Picture` component

`shared/Picture.jsx` emits a `<picture>` with an AVIF `<source>`, a WebP `<source>` and a JPEG `<img>` fallback, each carrying a `srcSet` across the generated widths plus the caller's `sizes`.

Props: `name`, `alt`, `sizes`, `priority`, `className`, `imgClassName`.

The `<img>` always receives `width` and `height` from the manifest, so every image reserves its box and CLS stays at zero. `loading` is `eager` when `priority` is set and `lazy` otherwise; `fetchPriority` mirrors it; `decoding` is always `async`.

Exactly one image on the page gets `priority` — the hero mosaic's largest cell — plus a matching `<link rel="preload">`.

---

## 6. Section designs

Shared across all sections: one `SectionHeader`, the existing `SECTION_SPACING` scale, brand cyan reserved for eyebrows, hairlines and focus rings.

### 6.1 Hero — "The Wall"

`id="hero"`. Full-bleed asymmetric mosaic filling the viewport; 8 images, mixed 3:4 and 3:2. The headline occupies a deliberate gap in the grid rather than floating over a photo.

- **Layout**: CSS Grid. Desktop 12 columns × 6 rows with named areas; tablet 6 columns; mobile 2 columns with the headline stacked above.
- **Parallax**: `useScroll({ target, offset: ['start start', 'end start'] })` feeding `useTransform` to per-column `y` values (three speeds: -60, -20, -100 px). Transform only — no layout properties animated.
- **Entry**: images `scale 1.06 → 1` with a `clipPath` inset reveal, stagger 60 ms; headline words rise from `overflow-hidden` masks.
- **Responsive**: parallax disabled below `md` (`matchMedia`), mosaic collapses to 2 columns and 4 images.
- **Reduced motion**: `useReducedMotion()` collapses all of the above to a single 200 ms opacity fade. No transforms.
- **States**: static content — no loading, empty or error states.
- **A11y**: `<h1>` is real text, not an image. Decorative overlays are `aria-hidden`. CTA is a real `<Link>`.

### 6.2 About — retained, re-imaged

`id="about"`. Structure unchanged: `ImagePanel` (auto-advancing slider, thumbnail strip, counter, corner brackets, location badge) + `TextPanel` + three `ValueCard`s.

Changes only:

- `ABOUT_IMAGES` sources the 12 images from §4.2 via `homeImages.js`.
- Alt text rewritten to describe the actual subject.
- `<img>` replaced with `Picture` so the panel gets AVIF/WebP and fixed dimensions.
- Its local `SectionLabel` is replaced by the shared `SectionHeader`.

Existing `about-glitch-in` / `about-glitch-out` / `about-pb-fill` keyframes are retained.

### 6.3 Gallery — "The Rail"

Replaces the letter-tile accordion entirely.

- A tall spacer section; inside it a `position: sticky` viewport containing a horizontal rail of 11 mixed-aspect frames.
- Vertical scroll progress maps to `translateX` on the rail via `useScroll` + `useTransform`. One transform on one element.
- A running index (`03 / 11`) and per-image caption update from the same progress value.
- **Mobile**: the sticky/horizontal mapping is dropped; it becomes a native `overflow-x: auto` rail with `scroll-snap-type: x mandatory`, so it stays usable by touch and by keyboard.
- **Reduced motion**: same as mobile — native scroll, no scroll-jacking.
- **A11y**: the rail is a `<ul>` with `role="list"`; focusable items scroll into view on `:focus-visible`; the section is labelled.

### 6.4 GallerySection — "The Mosaic"

- Editorial masonry, 9 images, CSS columns with `break-inside: avoid`.
- Reveal on `useInView` (`once: true`, `margin: '-10%'`), 80 ms stagger, opacity + 24 px rise.
- Click or `Enter` opens a lightbox.
- **Lightbox**: `role="dialog"`, `aria-modal="true"`, focus trapped on open, focus restored to the trigger on close, `Esc` closes, arrow keys navigate, background scroll locked, full-size `Picture` at `sizes="100vw"`.
- **Reduced motion**: reveals become instant; the lightbox opens without scale.

### 6.5 Events — rebuilt

`id="events"` (C3 — must not change). Dark section on `PAGE_BG` with `AnimatedBackground`.

- **Featured event** — `useClosestEvent()`. Large image-led card: poster art, status pill (`ongoing` / `upcoming` / `past`), title, date range, time range, location, description, streaming and registration CTAs, share button. Keeps the existing portrait/landscape detection (portrait posters get a taller box, `object-contain`, blurred backdrop fill).
- **Upcoming grid** — `useEvents({ per_page: 6 })`. Image cards, filtered to exclude the featured event's id.
- **Celebrations** — birthdays and anniversaries, retained verbatim in behaviour, restyled to the new system. Auth-gated. Keeps `ConfettiShower` and `SendMessageModal`.
- **Removed**: `ServiceRail`, `ClockInButton`, `CountdownTimer`, `AttendanceRecordedState`, `ServiceEndedState`, `NoServiceContent`, `UnauthContent`, `RecapLinks`, `useMarkAttendance`, `useTodaysService`, the `?source` handling, and the ~200 lines of commented-out `EventCardInner`.
- **States, each explicitly designed**:
  - Featured: loading skeleton matching the new card geometry; error card; empty ("nothing scheduled").
  - Grid: skeleton grid of 3; error row; empty state hidden entirely if the featured event is present, otherwise a single empty card.
  - Celebrations: only rendered when authenticated **and** non-empty.
- **"View all events"** link renders only when `isAuthenticated`, pointing at `/dashboard/events` (C10). Guests see no dead link.

### 6.6 Face of the Week — new

Placed between the Gallery Mosaic and MediaHub (see §7.2). Dark section.

- Full-bleed 3:4 portrait, oversized name, unit, joined date, one-line story, scripture line.
- Data: `shared/facesOfTheWeek.js`, an array of five entries. Rotation is date-derived — ISO week number modulo array length — so it advances weekly with no deploy.
- Every human-fact field ships as `TODO: <field>` so it is obvious in the UI and in review that it is unfilled. The section renders correctly with placeholders.
- **Empty state**: if the array is empty the section returns `null` rather than rendering a broken card.
- **A11y**: the portrait has descriptive alt text; the name is an `<h3>`; no text is baked into the image.

### 6.7 MediaHub — light touch

`id="media"` (C3). Data flow, category filters, `useVideos`, `useAwardPoints` and `YouTubeModal` are untouched.

Changes: larger 16:9 thumbnails, an explicit play affordance on hover and `:focus-visible`, a tighter filter row, the shared `SectionHeader`, and a skeleton updated to match the new card geometry.

### 6.8 QuickActions — kept, sharpened

Three cards and the quote strip stay. The "ghost image" treatment (currently `opacity: 0.12`, effectively invisible) is replaced by a real photographic card header from §4.2, with a duotone wash in the card's accent colour and a legible gradient scrim. Card copy, links, icons and numbering are unchanged.

`QUICK_ACTION_LINKS` in `src/utils/constant.js` is repointed at the new photos. This orphans `public/images/forms/{prayer2,question2,testimony2}.png`; they are **left on disk**, since their deletion was not approved.

---

## 7. Architecture

### 7.1 Target structure

```
src/components/Home/
  HomePage.jsx
  shared/
    SectionHeader.jsx        one header, replacing four copies (C9)
    Picture.jsx              responsive <picture> wrapper
    Reveal.jsx               useInView + reduced-motion aware reveal
    useParallax.js           useScroll/useTransform helper
    useLockBodyScroll.js     lightbox support
    homeImages.js            authored manifest (keys, alt, groups)
    imageManifest.json       generated dimensions
    facesOfTheWeek.js        curated Face of the Week data
    motion.js                shared easing/duration tokens
  hero/          HeroSection.jsx, HeroMosaic.jsx, HeroHeadline.jsx
  about/         AboutSection.jsx, ImagePanel.jsx, TextPanel.jsx, ValuesGrid.jsx
  gallery/       GalleryRail.jsx, GalleryMosaic.jsx, Lightbox.jsx
  events/        EventsSection.jsx, FeaturedEvent.jsx, EventCard.jsx,
                 EventsGrid.jsx, EventSkeletons.jsx,
                 celebrations/ CelebrationsSection.jsx, BirthdayCard.jsx,
                               AnniversaryCard.jsx, SendMessageModal.jsx
  face/          FaceOfTheWeek.jsx
  media/         MediaHub.jsx, VideoCard.jsx, FilterRow.jsx, MediaSkeletons.jsx
  quick-actions/ QuickActionsSection.jsx, ActionCard.jsx, QuoteStrip.jsx
```

`YoutubeModal.jsx` moves to `media/`. Old flat files are deleted once their replacements are in place.

### 7.2 Section order in `HomePage.jsx`

1. Hero (dark)
2. About (light)
3. Gallery Rail (dark)
4. Events (dark)
5. Gallery Mosaic (dark)
6. Face of the Week (dark)
7. MediaHub (dark)
8. QuickActions (light)

### 7.3 Motion tokens — `shared/motion.js`

```
EASE_OUT    = [0.22, 1, 0.36, 1]
EASE_IN_OUT = [0.65, 0, 0.35, 1]
DUR         = { fast: 0.24, base: 0.48, slow: 0.8 }
STAGGER     = 0.06
```

Every animated component reads `useReducedMotion()` and short-circuits to a plain opacity transition when it returns true.

---

## 8. Approved migration: clock-in to the dashboard

New `src/components/dashboard/ServiceClockInCard.jsx`, rendered as the first child of `<main>` in `DashboardPage.jsx` at `col-span-12`, above `AttendanceMetrics` — it is the most time-sensitive action on the page.

Carries over from `SanctuaryHub`, behaviour for behaviour:

- `useTodaysService()` and `useMarkAttendance()`
- Status machine: `upcoming` → countdown with refresh; `ongoing` → clock-in button or recorded state; `ended` → ended state with recap links
- Loading, error and no-service states
- **`?source=online|onsite`** read from `useSearchParams`, defaulting to `onsite`, so `/dashboard?source=onsite` keeps working

Because the QR codes point at `/?source=onsite` (C8), the home page adds a redirect: when `source` is present in the query string, redirect to `/dashboard?source=<value>` **regardless of auth state**.

This works for guests too, and the reason is verified rather than assumed. `ProtectedRoute` redirects to `/login?redirect=<pathname + search>` — it preserves `location.search` — and `PublicRoute` reads `?redirect=` back on successful login (`src/layout/route/ProtectedRoute.jsx:11`, `src/layout/route/PublicRoute.jsx:6-9`). So an unauthenticated scan of `/?source=onsite` lands on `/dashboard?source=onsite`, bounces to `/login?redirect=%2Fdashboard%3Fsource%3Donsite`, and returns to the dashboard with the source intact after signing in. The QR flow survives end to end for both authenticated and unauthenticated users.

Guard: the redirect fires only when `source` is exactly `online` or `onsite`, so an arbitrary query string cannot push visitors off the home page.

**This is the highest-risk item in the plan and is verified manually against a live service payload before completion.**

---

## 9. Cleanup

Deleted, each verified to have zero references by grep first:

- `public/images/home/hero/hero1-7.jpg` (7)
- `public/images/home/about/about1-15.jpg` (15)
- `public/images/home/about1-6.jpg` (6)
- `public/images/gallery/gallery1-6.jpg` (6)
- `public/images/forms/{prayer,questions,testimony}.png` (3, already orphaned)
- `public/images/user/avatar.jpeg` (1, already orphaned)

Dead CSS removed from `src/index.css`: keyframes and classes belonging to components that no longer exist. Each is grepped across `src/` before removal.

Not touched, and flagged rather than fixed: `src/components/table/BasicTable.jsx` references 16 `/images/user/user-NN.jpg` files that do not exist — a pre-existing bug outside this scope.

---

## 10. Blast radius

| File | Change |
|---|---|
| `src/components/Home/**` | Rewritten and restructured |
| `src/pages/Dashboard/DashboardPage.jsx` | One new section (approved) |
| `src/components/dashboard/ServiceClockInCard.jsx` | New |
| `src/utils/constant.js` | `QUICK_ACTION_LINKS` repointed |
| `src/index.css` | Dead keyframes removed, new ones added |
| `package.json` | `sharp` devDependency, `images` script |
| `scripts/optimize-images.mjs` | New |
| `public/images/**` | Renames, deletions, generated derivatives |

Untouched: admin, auth, router, Header, Footer, all dashboard tables, and all services and queries except where noted.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| QR codes at `/?source=onsite` break | Home-page redirect to `/dashboard?source=…` (§8); manual verification |
| Scroll-jacking in the Gallery Rail hurts usability | Sticky mapping only on pointer-fine, `md`+, reduced-motion-off; native snap-scroll otherwise |
| Page weight from 29 photographs | AVIF/WebP at four widths, one prioritised image, everything else lazy; measured before completion |
| Losing a working celebrations feature during the rewrite | Behaviour ported first, restyled second; verified against a live authenticated session |
| Section IDs drift and break Header nav | `#about`, `#events`, `#media` asserted explicitly after the rewrite |
| Removing CSS still used elsewhere | Every keyframe and class grepped across `src/` before deletion |
| `sharp` install fails on the user's platform | It is a devDependency only; if install fails, derivatives are already committed and the app still builds |

---

## 12. Verification

Run and pass before any completion claim:

1. `npm run lint` — zero errors
2. `npm run build` — succeeds
3. `npm test` — passes
4. Dev server: 375 / 768 / 1024 / 1440 px, light and dark
5. `prefers-reduced-motion: reduce` pass — no transforms, no scroll-jacking
6. Keyboard pass — tab order, lightbox focus trap, `Esc`, focus restoration
7. Console clean — no errors, no warnings, no 404s on images
8. Authenticated and unauthenticated passes — celebrations, events, clock-in
9. `?source=onsite` redirect verified end to end

No typecheck (C1).

---

## 13. Out of scope

- README rewrite (D9)
- `BasicTable.jsx` broken image references
- Backend endpoints of any kind
- Any page other than the home page and the one dashboard addition
- Deleting `public/images/forms/*2.png`, the duplicate, or the low-res image
