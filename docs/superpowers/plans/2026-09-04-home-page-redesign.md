# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the GCCC Ibadan public home page as an image-led, motion-rich editorial experience worthy of Awwwards, driven by the 29 photographs in `public/images/new`.

**Architecture:** Eight sections alternating dark "theatre" (Hero, Gallery Rail, Events, Gallery Mosaic, Face of the Week, MediaHub) and light "breath" (About, QuickActions). A shared primitives layer (`Home/shared/`) supplies one section header, one responsive `<picture>` wrapper, one reveal component and one set of motion tokens, so the page reads as a single system. A `sharp` script generates AVIF/WebP derivatives at four widths; a generated manifest supplies intrinsic dimensions so every image reserves its box and CLS stays at zero.

**Tech Stack:** React 19, Vite 6, Tailwind v4 (CSS-first `@theme`), framer-motion 12.23.24, TanStack Query v5, react-router-dom 7, Jest 30 + Testing Library, `sharp` (new devDependency).

**Spec:** `docs/superpowers/specs/2026-09-04-home-page-redesign-design.md` — read it alongside this plan. Section references below (§4.2, §6.3, etc.) point into it.

---

## Global Constraints

- **This is a JavaScript/JSX project.** No TypeScript, no `tsc`, no type annotations. Do not add `.ts`/`.tsx` files or JSDoc type gymnastics.
- **Never run `git commit` or `git push`.** The user commits. Every task ends with a verification gate, not a commit. If a task's gate passes, report and stop.
- **These four DOM ids are load-bearing** and must exist on the finished page: `#about`, `#events`, `#media` (and `#contact`, which lives in the Footer — do not touch it). The Header's scroll-nav targets them (`src/layout/home/Header.jsx:133-136`).
- **Tailwind v4 is CSS-first.** Design tokens live in the `@theme` block of `src/index.css`. `tailwind.config.js` is NOT loaded (there is no `@config` directive) — do not edit it expecting an effect.
- **Brand tokens, exact values:** `BRAND = '#0998d5'`, `BRAND_RGB = '9,152,213'`, `PAGE_BG = '#020c16'`. Import from `@/components/common/AnimatedBackground` — do not redeclare.
- **Section spacing:** import `SECTION_SPACING` / `SECTION_SPACING_BOTTOM` from `@/utils/constant`. Current value: `'py-20 sm:py-28 lg:py-36'`.
- **Motion is opt-out.** Every animated component calls `useReducedMotion()` from framer-motion and collapses to a plain opacity transition when it returns true. No exceptions.
- **The home page uses framer-motion only.** Do not add `data-aos` attributes to any file under `src/components/Home/`. AOS stays initialised globally in `App.jsx` for other pages — do not remove it.
- **Never invent facts about a real person.** Face of the Week placeholder fields ship as the literal string `TODO` plus the field name. Do not substitute plausible-looking names, roles or testimonies.
- **Alt text describes what is in the photograph.** No `"Church image 3"`, no empty alt on content images. Decorative overlays get `aria-hidden="true"`.

### Verified baselines (measured 2026-09-04, before any change)

Compare against these. A regression is a change relative to these numbers, not a non-zero number.

| Check | Baseline |
|---|---|
| `npm run lint` | exit 0 — **0 errors, 118 warnings** |
| `npm run build` | exit 0, ~78 s. `HomePage` chunk **490.22 kB (119.56 kB gzip)** |
| `npm test` | **9 passed, 9 total** (`test/component/Button.test.jsx`) |

**Do not "fix" the 118 pre-existing warnings.** They are outside this scope. Your work must add zero new errors and should add no new warnings.

### How to read the code blocks in this plan

Test code blocks are **complete and literal** — type them as written. Implementation blocks give the **exact interface** (exports, signatures, prop names, return shapes) plus the subtle parts that are easy to get wrong (grid templates, scroll maths, reduced-motion guards, ARIA wiring). Routine JSX and Tailwind classes around them are yours to write. Where a later task consumes an earlier one, the **Interfaces** block is the contract — match those names exactly.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `scripts/optimize-images.mjs` | sharp pipeline: derivatives + generated manifest |
| `src/components/Home/shared/imageManifest.json` | Generated. Intrinsic dimensions + available widths |
| `src/components/Home/shared/homeImages.js` | Authored. Semantic keys, alt text, per-section groups |
| `src/components/Home/shared/Picture.jsx` | Responsive `<picture>` with AVIF/WebP/JPEG |
| `src/components/Home/shared/motion.js` | Easing and duration tokens |
| `src/components/Home/shared/Reveal.jsx` | `useInView` reveal, reduced-motion aware |
| `src/components/Home/shared/useParallax.js` | `useScroll`/`useTransform` helper |
| `src/components/Home/shared/useLockBodyScroll.js` | Lightbox scroll lock |
| `src/components/Home/shared/SectionHeader.jsx` | One header, replacing four copies |
| `src/components/Home/shared/facesOfTheWeek.js` | Curated data + ISO-week rotation |
| `src/components/Home/hero/*` | Hero mosaic |
| `src/components/Home/about/*` | About, re-imaged |
| `src/components/Home/gallery/*` | Rail, Mosaic, Lightbox |
| `src/components/Home/events/*` | Featured event, grid, skeletons, celebrations |
| `src/components/Home/face/FaceOfTheWeek.jsx` | Face of the Week |
| `src/components/Home/media/*` | MediaHub, refreshed |
| `src/components/Home/quick-actions/*` | QuickActions, sharpened |
| `src/components/dashboard/ServiceClockInCard.jsx` | Migrated clock-in |

**Modified:** `src/components/Home/HomePage.jsx`, `src/pages/Dashboard/DashboardPage.jsx`, `src/utils/constant.js`, `src/index.css`, `package.json`, `test/setupTests.js`.

**Deleted (after replacements land):** the eight flat files in `src/components/Home/`, plus the orphaned images listed in Task 17.

---

## Task 1: Test harness polyfills

jsdom implements none of `matchMedia`, `IntersectionObserver` or `ResizeObserver`. framer-motion's `useReducedMotion` calls `matchMedia`, and `Reveal` uses `useInView` (IntersectionObserver). Without these, every component test from Task 4 onward throws. This task exists so the other 17 don't fail for an unrelated reason.

**Files:**
- Modify: `test/setupTests.js`
- Test: `test/setup/polyfills.test.js` (create)

**Interfaces:**
- Consumes: nothing
- Produces: working `window.matchMedia`, `global.IntersectionObserver`, `global.ResizeObserver` in every test file. Also `setMatchMediaReducedMotion(boolean)` exported from `test/test-utils.js` for tests that need to flip the reduced-motion preference.

- [ ] **Step 1: Write the failing test**

Create `test/setup/polyfills.test.js`:

```jsx
import { setMatchMediaReducedMotion } from '../test-utils';

describe('jsdom polyfills', () => {
  test('window.matchMedia exists and reports a MediaQueryList', () => {
    const mql = window.matchMedia('(min-width: 768px)');
    expect(typeof mql.matches).toBe('boolean');
    expect(typeof mql.addEventListener).toBe('function');
    expect(typeof mql.removeEventListener).toBe('function');
  });

  test('IntersectionObserver exists and can observe without throwing', () => {
    const io = new IntersectionObserver(() => {});
    expect(() => io.observe(document.createElement('div'))).not.toThrow();
    expect(() => io.disconnect()).not.toThrow();
  });

  test('ResizeObserver exists and can observe without throwing', () => {
    const ro = new ResizeObserver(() => {});
    expect(() => ro.observe(document.createElement('div'))).not.toThrow();
    expect(() => ro.disconnect()).not.toThrow();
  });

  test('setMatchMediaReducedMotion flips the reduced-motion query', () => {
    setMatchMediaReducedMotion(true);
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);

    setMatchMediaReducedMotion(false);
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest test/setup/polyfills.test.js`
Expected: FAIL — `window.matchMedia is not a function`, and `setMatchMediaReducedMotion` is not exported.

- [ ] **Step 3: Implement the polyfills**

Append to `test/setupTests.js`. The reduced-motion flag lives on a module-scoped variable so `setMatchMediaReducedMotion` can flip it between tests:

```js
// ─── jsdom polyfills ──────────────────────────────────────────────────────────
// jsdom ships none of these. framer-motion's useReducedMotion needs matchMedia,
// useInView needs IntersectionObserver, and Gallery/Hero measure with ResizeObserver.

global.__REDUCED_MOTION__ = false;

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    media: query,
    matches:
      query.includes('prefers-reduced-motion') ? global.__REDUCED_MOTION__ : false,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
  window.IntersectionObserver = global.IntersectionObserver;
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.ResizeObserver = global.ResizeObserver;
}
```

Then add to `test/test-utils.js`:

```js
export const setMatchMediaReducedMotion = (value) => {
  global.__REDUCED_MOTION__ = value;
};
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npx jest test/setup/polyfills.test.js`
Expected: PASS — 4 tests.

- [ ] **Step 5: Confirm nothing regressed**

Run: `npm test`
Expected: 13 passed, 13 total (9 baseline + 4 new). Then `npm run lint` — still 0 errors.

---

## Task 2: Image rename and the sharp pipeline

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create (generated): `src/components/Home/shared/imageManifest.json`
- Modify: `package.json`
- Rename: all 29 files in `public/images/new/`

**Interfaces:**
- Consumes: nothing
- Produces: `public/images/home/<name>-<width>.{avif,webp,jpg}` and `imageManifest.json` shaped `{ "<name>": { "width": number, "height": number, "widths": number[] } }`. Task 3 reads this file.

- [ ] **Step 1: Install sharp**

Run: `npm install --save-dev sharp`
Expected: installs cleanly. If it fails on this platform, stop and report — do not work around it.

- [ ] **Step 2: Rename the 29 source files**

Use the exact mapping in spec §4.1. Apply with `git mv` so history follows the file:

```bash
cd public/images/new
git mv "730223321_18087339719554014_6406598895761980872_n.jpg" neon-trio-joy.jpg
git mv "734313831_18087339755554014_4282825297145877959_n.jpg" neon-embrace.jpg
git mv "733911961_18087333734554014_7676819327603466549_n.jpg" neon-celebrate.jpg
git mv "730313456_18087333704554014_5324029421584511797_n.jpg" neon-family-four.jpg
git mv "730570551_18087333668554014_6623233396027835429_n.jpg" neon-group-balcony.jpg
git mv "730244744_18087339746554014_1784584750179676711_n.jpg" neon-duo-portrait.jpg
git mv "730275149_18087333650554014_7063810664474355933_n.jpg" neon-agbada-portrait.jpg
git mv "730776644_18087339584554014_578434238997226418_n.jpg" neon-sisters-portrait.jpg
git mv "730776656_18087339671554014_2677181653319829212_n.jpg" neon-black-tee-portrait.jpg
git mv "731147267_18087339653554014_5689998985656313586_n.jpg" neon-smile-portrait.jpg
git mv "732620698_18087339680554014_4345419160427045276_n.jpg" neon-couple-portrait.jpg
git mv "730083644_18087341270554014_4459636848177529300_n.jpg" neon-five-women-lowres.jpg
git mv "712468840_18083714111554014_7008032394171988931_n.jpg" magenta-women-joy.jpg
git mv "712684081_18083714084554014_1224580923596817446_n.jpg" magenta-women-laugh.jpg
git mv "711720374_18083714051554014_5819698903047895575_n.jpg" magenta-trio-women.jpg
git mv "712410156_18083714042554014_8136261811676824174_n.jpg" magenta-trio-smile.jpg
git mv "711466545_18083714015554014_4762341123760471000_n.jpg" magenta-trio-men.jpg
git mv "713405082_18083714024554014_183068212494597512_n.jpg" magenta-pastor-trio.jpg
git mv "713405082_18083714024554014_183068212494597512_n (1).jpg" magenta-pastor-trio-duplicate.jpg
git mv "710556265_18083713979554014_5799251281693166902_n.jpg" magenta-youth-group.jpg
git mv "710147422_18083713997554014_1328317741639735468_n.jpg" magenta-children.jpg
git mv "687247316_18081312278554014_2466681927218142551_n.jpg" congregation-wide.jpg
git mv "696525833_18081312290554014_654337251883658769_n.jpg" congregation-stage.jpg
git mv "687651891_18081312593554014_2509449602954813671_n.jpg" congregation-row.jpg
git mv "779957410_18093863705554014_3307726553308550774_n.jpg" congregation-family.jpg
git mv "787017311_18094753121554014_1197243431068232365_n.jpg" congregation-full.jpg
git mv "731058949_18087333725554014_5608977641464323794_n.jpg" worship-lead.jpg
git mv "786853633_18094752755554014_1153532773599532426_n.jpg" word-ministration.jpg
git mv "684262241_18080548193554014_638761302743549311_n.jpg" fellowship-outdoors.jpg
```

Then confirm: `ls public/images/new | wc -l` → **29**, and `ls public/images/new | grep -c '_n\.jpg'` → **0**.

- [ ] **Step 3: Write the script**

Create `scripts/optimize-images.mjs`:

```js
// Generates responsive AVIF/WebP/JPEG derivatives from public/images/new
// into public/images/home, plus the dimension manifest the Picture component reads.
//
// Idempotent: a target is skipped when it is newer than its source, so re-running
// after adding one photo only encodes that photo.
//
// Run: npm run images

import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/images/new';
const OUT_DIR = 'public/images/home';
const MANIFEST = 'src/components/Home/shared/imageManifest.json';

const WIDTHS = [480, 768, 1200, 1600];
const FORMATS = [
  { ext: 'avif', options: { quality: 50 } },
  { ext: 'webp', options: { quality: 72 } },
  { ext: 'jpg', options: { quality: 78, mozjpeg: true } },
];

const mtimeOf = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
};

const run = async () => {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.jpe?g$/i.test(f));
  const manifest = {};
  let encoded = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const name = path.parse(file).name;

    const image = sharp(srcPath);
    const { width, height } = await image.metadata();

    // Never upscale: cap the ladder at the intrinsic width, and always include it.
    const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(width))].sort(
      (a, b) => a - b
    );

    manifest[name] = { width, height, widths };

    const srcMtime = await mtimeOf(srcPath);

    for (const w of widths) {
      for (const { ext, options } of FORMATS) {
        const outPath = path.join(OUT_DIR, `${name}-${w}.${ext}`);

        if ((await mtimeOf(outPath)) > srcMtime) {
          skipped += 1;
          continue;
        }

        await sharp(srcPath)
          .resize({ width: w, withoutEnlargement: true })
          .toFormat(ext === 'jpg' ? 'jpeg' : ext, options)
          .toFile(outPath);

        encoded += 1;
      }
    }
  }

  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);

  console.log(`images: ${files.length} sources, ${encoded} encoded, ${skipped} up to date`);
  console.log(`manifest: ${MANIFEST}`);
};

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
```

- [ ] **Step 4: Add the npm script**

In `package.json`, add to `"scripts"`:

```json
"images": "node scripts/optimize-images.mjs"
```

- [ ] **Step 5: Run it**

Run: `npm run images`
Expected: reports 29 sources and a non-zero encoded count; creates `public/images/home/` and writes the manifest.

- [ ] **Step 6: Verify the output**

```bash
node -e "const m=require('./src/components/Home/shared/imageManifest.json'); const k=Object.keys(m); console.log('keys:',k.length); console.log('neon-trio-joy:',JSON.stringify(m['neon-trio-joy'])); console.log('missing dims:',k.filter(x=>!m[x].width||!m[x].height))"
```

Expected: `keys: 29`; `neon-trio-joy` reports `{"width":1440,"height":960,...}`; no missing dimensions.

- [ ] **Step 7: Confirm idempotency and size**

Run `npm run images` a second time. Expected: `0 encoded`, everything skipped.

Then measure the win:

```bash
du -sh public/images/new public/images/home
```

Record both numbers in your task report. Source is ~5.2 MB; the AVIF derivatives should be dramatically smaller per width.

- [ ] **Step 8: Gate**

Run `npm run lint` — expected 0 errors (the script is covered by the `**/*.{cjs,mjs}` node-globals block in `eslint.config.js`, so `console` and `process` are fine).

---

## Task 3: The authored image manifest

**Files:**
- Create: `src/components/Home/shared/homeImages.js`
- Test: `test/component/homeImages.test.js`

**Interfaces:**
- Consumes: `imageManifest.json` from Task 2
- Produces:
  - `getImage(name)` → `{ name, alt, width, height, widths }`. Throws on an unknown name.
  - `HERO_IMAGES`, `ABOUT_IMAGES`, `RAIL_IMAGES`, `MOSAIC_IMAGES`, `FACE_IMAGES`, `QUICK_ACTION_IMAGES` — arrays of name strings, in render order.
  - `ALT_TEXT` — the raw name→alt map.

- [ ] **Step 1: Write the failing test**

Create `test/component/homeImages.test.js`:

```jsx
import manifest from '@/components/Home/shared/imageManifest.json';
import {
  getImage,
  ALT_TEXT,
  HERO_IMAGES,
  ABOUT_IMAGES,
  RAIL_IMAGES,
  MOSAIC_IMAGES,
  FACE_IMAGES,
  QUICK_ACTION_IMAGES,
} from '@/components/Home/shared/homeImages';

const GROUPS = {
  HERO_IMAGES,
  ABOUT_IMAGES,
  RAIL_IMAGES,
  MOSAIC_IMAGES,
  FACE_IMAGES,
  QUICK_ACTION_IMAGES,
};

const UNUSED = ['neon-five-women-lowres', 'magenta-pastor-trio-duplicate'];

describe('homeImages manifest', () => {
  test('every alt-text key exists in the generated manifest', () => {
    const missing = Object.keys(ALT_TEXT).filter((k) => !manifest[k]);
    expect(missing).toEqual([]);
  });

  test('every image referenced by a group resolves', () => {
    Object.entries(GROUPS).forEach(([group, names]) => {
      names.forEach((name) => {
        expect({ group, name, ok: Boolean(manifest[name]) }).toEqual({
          group,
          name,
          ok: true,
        });
      });
    });
  });

  test('getImage returns dimensions and alt text', () => {
    const img = getImage('neon-trio-joy');
    expect(img.name).toBe('neon-trio-joy');
    expect(img.width).toBe(1440);
    expect(img.height).toBe(960);
    expect(Array.isArray(img.widths)).toBe(true);
    expect(img.widths.length).toBeGreaterThan(0);
    expect(img.alt.length).toBeGreaterThan(10);
  });

  test('getImage throws loudly on an unknown name', () => {
    expect(() => getImage('does-not-exist')).toThrow(/does-not-exist/);
  });

  test('no alt text is a placeholder', () => {
    Object.entries(ALT_TEXT).forEach(([name, alt]) => {
      expect(alt).not.toMatch(/^(image|photo|church image)\s*\d*$/i);
      expect(alt.trim().length).toBeGreaterThan(10);
    });
  });

  test('group sizes match the spec', () => {
    expect(HERO_IMAGES).toHaveLength(8);
    expect(ABOUT_IMAGES).toHaveLength(12);
    expect(RAIL_IMAGES).toHaveLength(11);
    expect(MOSAIC_IMAGES).toHaveLength(9);
    expect(FACE_IMAGES).toHaveLength(5);
    expect(QUICK_ACTION_IMAGES).toHaveLength(3);
  });

  test('the low-res and duplicate images are never used in any group', () => {
    const used = new Set(Object.values(GROUPS).flat());
    UNUSED.forEach((name) => expect(used.has(name)).toBe(false));
  });

  test('every usable image appears in at least one group', () => {
    const used = new Set(Object.values(GROUPS).flat());
    const orphans = Object.keys(manifest).filter(
      (name) => !used.has(name) && !UNUSED.includes(name)
    );
    expect(orphans).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest test/component/homeImages.test.js`
Expected: FAIL — cannot resolve `@/components/Home/shared/homeImages`.

- [ ] **Step 3: Implement**

Create `src/components/Home/shared/homeImages.js`. Alt text describes what is actually in each frame — these strings are the accessible description of a real photograph, so keep them specific:

```js
import manifest from './imageManifest.json';

export const ALT_TEXT = {
  'neon-trio-joy':
    'Three women laughing together in front of the glowing "Home Is Where You Are" neon sign',
  'neon-embrace':
    'Two women embracing and smiling beneath the "Home Is Where You Are" neon lettering',
  'neon-celebrate':
    'A woman in a purple patterned outfit raising her hand in celebration on stage',
  'neon-family-four':
    'A family of four standing together in front of the wooden arch and floral backdrop',
  'neon-group-balcony':
    'A large group of church members gathered together under warm arch lighting',
  'neon-duo-portrait':
    'A man in traditional dress and a young woman posing together at the arch backdrop',
  'neon-agbada-portrait':
    'A man in a white agbada and woven cap standing before the neon-lit wooden arch',
  'neon-sisters-portrait':
    'Two young women standing back to back, laughing, at the floral arch backdrop',
  'neon-black-tee-portrait':
    'A young man in a black t-shirt smiling in front of the neon-lit wooden arch',
  'neon-smile-portrait':
    'A man in a black tunic smiling in front of the "Home Is Where You Are" sign',
  'neon-couple-portrait':
    'A couple standing together in front of the warm neon and dried-floral backdrop',
  'neon-five-women-lowres':
    'Five women posing together in front of the neon sign',
  'magenta-women-joy':
    'Nine women laughing and making peace signs under magenta stage lighting',
  'magenta-women-laugh':
    'Eight women laughing together against a wooden slat wall in magenta light',
  'magenta-trio-women':
    'Three women in bright dresses laughing together under warm stage lighting',
  'magenta-trio-smile':
    'Three women with arms linked, smiling, against a wooden slat wall',
  'magenta-trio-men':
    'Three men with arms around each other, smiling, under magenta stage lighting',
  'magenta-pastor-trio':
    'A woman and two men standing arm in arm in front of a lit wooden wall',
  'magenta-pastor-trio-duplicate':
    'A woman and two men standing arm in arm in front of a lit wooden wall',
  'magenta-youth-group':
    'A group of young church members standing together under warm stage lighting',
  'magenta-children':
    'A woman standing with five children in front of a wooden slat wall',
  'congregation-wide':
    'The GCCC Ibadan congregation gathered together for a group photograph after service',
  'congregation-stage':
    'Church members of all ages gathered on stage beneath warm string lights',
  'congregation-row':
    'Members of the church standing in a row, smiling, beneath festoon lighting',
  'congregation-family':
    'Families and children gathered together on stage after a service',
  'congregation-full':
    'The full church family, adults and children, gathered for a photograph',
  'worship-lead':
    'A worship leader singing into a microphone with the band playing behind her',
  'word-ministration':
    'A minister speaking from the podium during a service, bathed in blue stage light',
  'fellowship-outdoors':
    'Three church members standing together outdoors on a bright afternoon',
};

export const getImage = (name) => {
  const entry = manifest[name];
  if (!entry) {
    throw new Error(
      `[homeImages] Unknown image "${name}". Run "npm run images" if you just added it.`
    );
  }
  return { name, alt: ALT_TEXT[name] ?? '', ...entry };
};

// Render order matters — these arrays drive layout position, not just membership.

export const HERO_IMAGES = [
  'neon-trio-joy',
  'neon-sisters-portrait',
  'worship-lead',
  'neon-agbada-portrait',
  'magenta-women-joy',
  'word-ministration',
  'congregation-wide',
  'neon-celebrate',
];

export const ABOUT_IMAGES = [
  'congregation-wide',
  'congregation-stage',
  'congregation-row',
  'congregation-family',
  'neon-embrace',
  'neon-family-four',
  'neon-group-balcony',
  'magenta-women-laugh',
  'magenta-trio-women',
  'magenta-trio-men',
  'worship-lead',
  'fellowship-outdoors',
];

export const RAIL_IMAGES = [
  'neon-couple-portrait',
  'magenta-women-joy',
  'neon-black-tee-portrait',
  'congregation-full',
  'neon-embrace',
  'word-ministration',
  'magenta-youth-group',
  'neon-duo-portrait',
  'neon-celebrate',
  'magenta-children',
  'congregation-family',
];

export const MOSAIC_IMAGES = [
  'neon-trio-joy',
  'magenta-trio-smile',
  'neon-smile-portrait',
  'congregation-stage',
  'magenta-pastor-trio',
  'neon-sisters-portrait',
  'worship-lead',
  'magenta-women-laugh',
  'neon-family-four',
];

export const FACE_IMAGES = [
  'neon-agbada-portrait',
  'neon-black-tee-portrait',
  'neon-smile-portrait',
  'neon-couple-portrait',
  'neon-duo-portrait',
];

export const QUICK_ACTION_IMAGES = [
  'magenta-trio-men',
  'word-ministration',
  'magenta-women-joy',
];
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npx jest test/component/homeImages.test.js`
Expected: PASS — 8 tests. The "every usable image appears in at least one group" test is the important one: it proves all 27 usable photographs are actually on the page.

- [ ] **Step 5: Gate**

`npm test` → 21 passed. `npm run lint` → 0 errors.

---

## Task 4: The Picture component

**Files:**
- Create: `src/components/Home/shared/Picture.jsx`
- Test: `test/component/Picture.test.jsx`

**Interfaces:**
- Consumes: `getImage` from Task 3
- Produces: `<Picture name sizes alt priority className imgClassName />`, default export. `alt` defaults to the manifest's alt text; passing `alt=""` marks the image decorative and adds `aria-hidden`.

- [ ] **Step 1: Write the failing test**

Create `test/component/Picture.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import Picture from '@/components/Home/shared/Picture';

describe('Picture', () => {
  test('renders avif and webp sources plus a jpg fallback', () => {
    const { container } = render(
      <Picture name="neon-trio-joy" sizes="100vw" />
    );

    const sources = container.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[1]).toHaveAttribute('type', 'image/webp');

    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toMatch(/\.jpg$/);
  });

  test('reserves layout space with intrinsic width and height', () => {
    const { container } = render(<Picture name="neon-trio-joy" sizes="100vw" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width', '1440');
    expect(img).toHaveAttribute('height', '960');
  });

  test('srcSet lists every generated width with a w descriptor', () => {
    const { container } = render(<Picture name="neon-trio-joy" sizes="100vw" />);
    const avif = container.querySelector('source[type="image/avif"]');
    const srcSet = avif.getAttribute('srcset');

    expect(srcSet).toMatch(/neon-trio-joy-480\.avif 480w/);
    expect(srcSet).toMatch(/neon-trio-joy-1440\.avif 1440w/);
  });

  test('passes the caller sizes through to every source', () => {
    const { container } = render(
      <Picture name="neon-trio-joy" sizes="(max-width: 768px) 100vw, 50vw" />
    );
    container.querySelectorAll('source').forEach((s) => {
      expect(s).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    });
  });

  test('defaults to lazy loading and auto fetch priority', () => {
    const { container } = render(<Picture name="neon-trio-joy" sizes="100vw" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('fetchpriority', 'auto');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  test('priority flips to eager and high', () => {
    const { container } = render(
      <Picture name="neon-trio-joy" sizes="100vw" priority />
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  test('uses manifest alt text by default', () => {
    render(<Picture name="worship-lead" sizes="100vw" />);
    expect(
      screen.getByAltText(/worship leader singing into a microphone/i)
    ).toBeInTheDocument();
  });

  test('an explicit empty alt marks the image decorative', () => {
    const { container } = render(
      <Picture name="worship-lead" sizes="100vw" alt="" />
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('aria-hidden', 'true');
  });

  test('throws on an unknown image name', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Picture name="nope" sizes="100vw" />)).toThrow(/nope/);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest test/component/Picture.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `src/components/Home/shared/Picture.jsx`. Note `fetchPriority` is the React 19 prop name and lands in the DOM as lowercase `fetchpriority`:

```jsx
import { memo } from 'react';
import { getImage } from './homeImages';

const BASE = '/images/home';

const srcSetFor = (name, widths, ext) =>
  widths.map((w) => `${BASE}/${name}-${w}.${ext} ${w}w`).join(', ');

/**
 * Responsive image. Always emits width/height from the generated manifest so the
 * box is reserved before the bytes arrive — this is what keeps CLS at zero.
 *
 * Pass `alt=""` to mark an image decorative; anything else uses the manifest's
 * description. Exactly one image per page should get `priority`.
 */
const Picture = ({
  name,
  alt,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
}) => {
  const image = getImage(name);
  const { widths, width, height } = image;

  const decorative = alt === '';
  const resolvedAlt = decorative ? '' : (alt ?? image.alt);

  // Largest generated width is the safest single-URL fallback for browsers
  // that ignore srcSet entirely.
  const fallbackWidth = widths[widths.length - 1];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSetFor(name, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(name, widths, 'webp')} sizes={sizes} />
      <img
        src={`${BASE}/${name}-${fallbackWidth}.jpg`}
        srcSet={srcSetFor(name, widths, 'jpg')}
        sizes={sizes}
        alt={resolvedAlt}
        {...(decorative && { 'aria-hidden': 'true' })}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
};

export default memo(Picture);
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npx jest test/component/Picture.test.jsx`
Expected: PASS — 9 tests.

If the `fetchpriority` assertions fail, check the rendered attribute casing with `screen.debug()` before changing the test — React 19 lowercases it, React 18 did not.

- [ ] **Step 5: Gate**

`npm test` → 30 passed. `npm run lint` → 0 errors.

---

## Task 5: Shared primitives — motion, Reveal, useParallax, SectionHeader

**Files:**
- Create: `src/components/Home/shared/motion.js`
- Create: `src/components/Home/shared/Reveal.jsx`
- Create: `src/components/Home/shared/useParallax.js`
- Create: `src/components/Home/shared/SectionHeader.jsx`
- Test: `test/component/Reveal.test.jsx`, `test/component/SectionHeader.test.jsx`

**Interfaces:**
- Consumes: framer-motion
- Produces:
  - `motion.js` — `EASE_OUT`, `EASE_IN_OUT`, `DUR` (`{ fast, base, slow }`), `STAGGER`
  - `Reveal.jsx` — `<Reveal delay={0} y={24} as="div" className="">children</Reveal>`, default export
  - `useParallax.js` — `useParallax(ref, distance)` → framer MotionValue for `y`; returns a static `0` MotionValue when reduced motion is on
  - `SectionHeader.jsx` — `<SectionHeader eyebrow titleLead titleAccent subtitle tone="dark"|"light" action />`, default export

- [ ] **Step 1: Write the failing tests**

Create `test/component/Reveal.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { setMatchMediaReducedMotion } from '../test-utils';
import Reveal from '@/components/Home/shared/Reveal';

describe('Reveal', () => {
  afterEach(() => setMatchMediaReducedMotion(false));

  test('renders its children', () => {
    render(<Reveal>hello world</Reveal>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  test('renders the requested element type', () => {
    const { container } = render(<Reveal as="li">item</Reveal>);
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  test('passes className through', () => {
    const { container } = render(<Reveal className="mt-4">x</Reveal>);
    expect(container.firstChild).toHaveClass('mt-4');
  });

  test('still renders children when reduced motion is on', () => {
    setMatchMediaReducedMotion(true);
    render(<Reveal>reduced</Reveal>);
    expect(screen.getByText('reduced')).toBeInTheDocument();
  });
});
```

Create `test/component/SectionHeader.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import SectionHeader from '@/components/Home/shared/SectionHeader';

describe('SectionHeader', () => {
  test('renders eyebrow, both title halves and subtitle', () => {
    render(
      <SectionHeader
        eyebrow="Who We Are"
        titleLead="A Family"
        titleAccent="on Mission"
        subtitle="More than a gathering."
      />
    );

    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText(/A Family/)).toBeInTheDocument();
    expect(screen.getByText('on Mission')).toBeInTheDocument();
    expect(screen.getByText('More than a gathering.')).toBeInTheDocument();
  });

  test('the title is a level-2 heading', () => {
    render(<SectionHeader titleLead="Events" titleAccent="Coming Up" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Events');
    expect(heading).toHaveTextContent('Coming Up');
  });

  test('omits the eyebrow and subtitle when not supplied', () => {
    const { container } = render(<SectionHeader titleLead="Just" titleAccent="Title" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  test('renders an action node when given', () => {
    render(
      <SectionHeader
        titleLead="Media"
        titleAccent="Hub"
        action={<a href="/x">View all</a>}
      />
    );
    expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them to confirm they fail**

Run: `npx jest test/component/Reveal.test.jsx test/component/SectionHeader.test.jsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `motion.js`**

```js
// Shared motion vocabulary. Every animated home-page component pulls from here so
// the page moves as one system rather than eight.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const DUR = { fast: 0.24, base: 0.48, slow: 0.8 };

export const STAGGER = 0.06;
```

- [ ] **Step 4: Implement `Reveal.jsx`**

```jsx
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from './motion';

/**
 * Reveals its children once, when they scroll into view.
 *
 * Under prefers-reduced-motion the vertical travel is dropped entirely and only
 * opacity is animated — motion sickness triggers are movement, not fades.
 */
const Reveal = ({ children, delay = 0, y = 24, as = 'div', className = '', ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();

  const Component = motion[as] ?? motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: reduced ? DUR.fast : DUR.base,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;
```

- [ ] **Step 5: Implement `useParallax.js`**

```js
import { useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion';

/**
 * Maps a section's scroll progress to a vertical offset.
 *
 * `distance` is the total travel in pixels across the section — negative moves the
 * layer up faster than the page (a "far" layer), positive moves it down.
 *
 * Returns a constant 0 when the user prefers reduced motion, so callers can bind
 * the result to `style={{ y }}` unconditionally.
 */
export const useParallax = (ref, distance) => {
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const moving = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const still = useMotionValue(0);

  return reduced ? still : moving;
};

export default useParallax;
```

- [ ] **Step 6: Implement `SectionHeader.jsx`**

This replaces four separate copies. `tone` switches the text colours between the dark and light sections; everything else is identical across the page.

```jsx
import { memo } from 'react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Reveal from './Reveal';

const TONE = {
  dark: { title: 'text-white', subtitle: 'text-white/45' },
  light: {
    title: 'text-gray-900 dark:text-white',
    subtitle: 'text-gray-500 dark:text-gray-400',
  },
};

/**
 * The single section header for the home page.
 * Replaced four near-identical local copies (About, QuickActions, MediaHub, Hub).
 */
const SectionHeader = ({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  tone = 'dark',
  action,
  className = '',
}) => {
  const t = TONE[tone] ?? TONE.dark;

  return (
    <Reveal className={`flex flex-col gap-3 mb-16 sm:mb-24 ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-0.5 rounded-full shrink-0" style={{ background: BRAND }} />
          <span
            className="text-[10px] font-black uppercase tracking-[0.24em]"
            style={{ color: BRAND }}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <div className="flex items-end justify-between gap-6 flex-wrap">
        <h2
          className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight ${t.title}`}
        >
          {titleLead && <span>{titleLead} </span>}
          {titleAccent && <span style={{ color: BRAND }}>{titleAccent}</span>}
        </h2>
        {action}
      </div>

      {subtitle && (
        <p className={`text-base leading-relaxed max-w-lg ${t.subtitle}`}>{subtitle}</p>
      )}
    </Reveal>
  );
};

export default memo(SectionHeader);
```

- [ ] **Step 7: Run the tests to confirm they pass**

Run: `npx jest test/component/Reveal.test.jsx test/component/SectionHeader.test.jsx`
Expected: PASS — 8 tests.

- [ ] **Step 8: Gate**

`npm test` → 38 passed. `npm run lint` → 0 errors.

---

## Task 6: Migrate clock-in to the dashboard

Do this **before** touching SanctuaryHub. At the end of this task both the old home-page flow and the new dashboard flow work; Task 11 then removes the old one. At no point is clock-in broken.

**Files:**
- Create: `src/components/dashboard/ServiceClockInCard.jsx`
- Modify: `src/pages/Dashboard/DashboardPage.jsx`
- Test: `test/component/ServiceClockInCard.test.jsx`, `test/component/sourceRedirect.test.jsx`
- Reference (read, copy behaviour from): `src/components/Home/SanctuaryHub.jsx:692-945`

**Interfaces:**
- Consumes: `useTodaysService`, `useMarkAttendance`, `useSearchParams`, `useAuthStore`
- Produces:
  - `ServiceClockInCard` — default export, no props
  - `resolveAttendanceSource(searchParams)` → `'online' | 'onsite'`, named export from the same file
  - `shouldRedirectToDashboard(search)` → `string | null`, named export from `src/components/Home/HomePage.jsx`

- [ ] **Step 1: Write the failing tests**

Create `test/component/ServiceClockInCard.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import ServiceClockInCard, {
  resolveAttendanceSource,
} from '@/components/dashboard/ServiceClockInCard';

const mockMutate = jest.fn();
let mockService = {};

jest.mock('@/queries/service.query', () => ({
  useTodaysService: () => mockService,
}));

jest.mock('@/queries/attendance.query', () => ({
  useMarkAttendance: () => ({ mutate: mockMutate, isPending: false, isSuccess: false }),
}));

describe('resolveAttendanceSource', () => {
  test('returns onsite by default', () => {
    expect(resolveAttendanceSource(new URLSearchParams(''))).toBe('onsite');
  });

  test('returns online only for the exact value', () => {
    expect(resolveAttendanceSource(new URLSearchParams('source=online'))).toBe('online');
    expect(resolveAttendanceSource(new URLSearchParams('source=ONLINE'))).toBe('onsite');
    expect(resolveAttendanceSource(new URLSearchParams('source=garbage'))).toBe('onsite');
  });
});

describe('ServiceClockInCard', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockService = { data: undefined, isLoading: true, isError: false, refetch: jest.fn() };
  });

  test('shows a loading state while the service is being fetched', () => {
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-loading')).toBeInTheDocument();
  });

  test('shows the no-service state when the request errors', () => {
    mockService = { data: undefined, isLoading: false, isError: true, refetch: jest.fn() };
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-no-service')).toBeInTheDocument();
  });

  test('shows a countdown while the service is upcoming', () => {
    mockService = {
      data: {
        service: { id: 1, name: 'Sunday Service' },
        service_status: 'upcoming',
        seconds_until_start: 3600,
        can_mark: false,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-countdown')).toBeInTheDocument();
  });

  test('clocking in sends the service id and the resolved source', async () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ongoing',
        can_mark: true,
        attendance: null,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />, { route: '/dashboard?source=online' });

    await userEvent.click(screen.getByRole('button', { name: /clock in/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      service_id: 42,
      mode: 'online',
      status: 'present',
    });
  });

  test('shows the recorded state instead of the button once attendance exists', () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ongoing',
        can_mark: false,
        attendance: { id: 7, created_at: '2026-09-04T09:00:00Z' },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-recorded')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clock in/i })).not.toBeInTheDocument();
  });

  test('shows the ended state after the service has finished', () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ended',
        can_mark: false,
        attendance: null,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-ended')).toBeInTheDocument();
  });
});
```

Create `test/component/sourceRedirect.test.jsx`:

```jsx
import { shouldRedirectToDashboard } from '@/components/Home/HomePage';

describe('shouldRedirectToDashboard', () => {
  test('redirects for the two valid QR sources', () => {
    expect(shouldRedirectToDashboard('?source=onsite')).toBe('/dashboard?source=onsite');
    expect(shouldRedirectToDashboard('?source=online')).toBe('/dashboard?source=online');
  });

  test('ignores anything else, so arbitrary query strings cannot bounce visitors', () => {
    expect(shouldRedirectToDashboard('')).toBeNull();
    expect(shouldRedirectToDashboard('?source=')).toBeNull();
    expect(shouldRedirectToDashboard('?source=evil')).toBeNull();
    expect(shouldRedirectToDashboard('?source=ONSITE')).toBeNull();
    expect(shouldRedirectToDashboard('?utm_campaign=x')).toBeNull();
  });

  test('preserves nothing but the source, so no open redirect is possible', () => {
    expect(shouldRedirectToDashboard('?source=onsite&next=https://evil.test')).toBe(
      '/dashboard?source=onsite'
    );
  });
});
```

- [ ] **Step 2: Run them to confirm they fail**

Run: `npx jest test/component/ServiceClockInCard.test.jsx test/component/sourceRedirect.test.jsx`
Expected: FAIL — modules and exports not found.

- [ ] **Step 3: Implement `ServiceClockInCard.jsx`**

Port the behaviour from `SanctuaryHub.jsx:692-945` — `StateIconCircle`, `TimeUnit`, `CountdownTimer`, `ClockInButton`, `AttendanceRecordedState`, `ServiceEndedState`, `RecapLinks`, `NoServiceContent`, `ServiceLoadingContent`. Restyle for the light dashboard surface (the dashboard uses white/`dark:bg-gray-900` cards, not `PAGE_BG`).

The exact contract the tests pin down:

```jsx
export const ATTENDANCE_SOURCES = { ONLINE: 'online', ONSITE: 'onsite' };

export const resolveAttendanceSource = (searchParams) =>
  searchParams.get('source') === ATTENDANCE_SOURCES.ONLINE
    ? ATTENDANCE_SOURCES.ONLINE
    : ATTENDANCE_SOURCES.ONSITE;
```

The component's required `data-testid` values and branch order:

| Condition | `data-testid` |
|---|---|
| `isLoading` | `clockin-loading` |
| `isError` or no `service_status` | `clockin-no-service` |
| `service_status === 'upcoming'` | `clockin-countdown` |
| `'ongoing'` and attendance already recorded | `clockin-recorded` |
| `'ongoing'` and not yet recorded | a `<button>` whose accessible name matches `/clock in/i` |
| `'ended'` | `clockin-ended` |

"Attendance already recorded" is `isSuccess || (data && !can_mark && attendance)` — the same expression SanctuaryHub uses at line 1741. The click handler:

```jsx
const handleClockIn = useCallback(
  (e) => {
    e.preventDefault();
    if (!service?.id) return;
    mutate({ service_id: service.id, mode: source, status: 'present' });
  },
  [service?.id, source, mutate]
);
```

`useTodaysService` is already gated on `isAuthenticated` internally (`src/queries/service.query.js:36-38`), so the card needs no auth guard of its own — but it renders inside `ProtectedRoute` anyway.

Clear the countdown interval on unmount. Give the clock-in button a real `<button>` element with an accessible name, not a styled `<div>`.

- [ ] **Step 4: Mount it on the dashboard**

In `src/pages/Dashboard/DashboardPage.jsx`, import the card and render it as the **first** child of `<main>`:

```jsx
<main className="grid grid-cols-12 gap-4 md:gap-6">
  <div className="col-span-12">
    <ServiceClockInCard />
  </div>

  <section className="relative col-span-12 space-y-5 xl:col-span-7">
```

Leave everything below it untouched.

- [ ] **Step 5: Add the home-page redirect**

In `src/components/Home/HomePage.jsx`, add the named export and wire it up. Keep it a pure function so it is testable without a router:

```jsx
const VALID_SOURCES = new Set(['onsite', 'online']);

/**
 * QR codes printed for the building point at `/?source=onsite`. Clock-in now lives
 * on the dashboard, so forward those scans.
 *
 * Deliberately rebuilds the target from a whitelist rather than forwarding the
 * original query string — that makes an open redirect impossible.
 *
 * Guests are safe to redirect too: ProtectedRoute preserves `pathname + search`
 * in `?redirect=` and PublicRoute reads it back after login, so the source
 * survives the round trip through the login screen.
 */
export const shouldRedirectToDashboard = (search) => {
  const source = new URLSearchParams(search).get('source');
  return VALID_SOURCES.has(source) ? `/dashboard?source=${source}` : null;
};
```

In the component body:

```jsx
const location = useLocation();
const redirectTo = shouldRedirectToDashboard(location.search);
if (redirectTo) return <Navigate to={redirectTo} replace />;
```

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `npx jest test/component/ServiceClockInCard.test.jsx test/component/sourceRedirect.test.jsx`
Expected: PASS — 11 tests (8 + 3).

- [ ] **Step 7: Manual verification — this is the highest-risk item in the plan**

Start the dev server (`npm run dev`) and, signed in as a member:

1. Visit `/dashboard` — the clock-in card renders in whichever state today's service is in.
2. Visit `/?source=onsite` — you land on `/dashboard?source=onsite`.
3. Sign out, visit `/?source=onsite` — you reach `/login?redirect=%2Fdashboard%3Fsource%3Donsite`; sign in; you land back on `/dashboard?source=onsite`.
4. Visit `/?source=evil` — you stay on the home page.
5. If a service is live, clock in and confirm the network request carries the right `service_id` and `mode`.

Record which of these you could actually exercise. **If no service is live today, say so explicitly in your report rather than implying you tested the live path.**

- [ ] **Step 8: Gate**

`npm test` → 49 passed. `npm run lint` → 0 errors. `npm run build` → succeeds.

---

## Task 7: Hero — "The Wall"

**Files:**
- Create: `src/components/Home/hero/HeroSection.jsx`, `HeroMosaic.jsx`, `HeroHeadline.jsx`
- Modify: `index.html` (preload the priority image)
- Test: `test/component/HeroSection.test.jsx`

**Interfaces:**
- Consumes: `Picture`, `HERO_IMAGES`, `getImage`, `useParallax`, `motion.js`
- Produces: `HeroSection` default export, no props. Renders `<section id="hero">`.

- [ ] **Step 1: Write the failing test**

Create `test/component/HeroSection.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { setMatchMediaReducedMotion } from '../test-utils';
import HeroSection from '@/components/Home/hero/HeroSection';
import { HERO_IMAGES } from '@/components/Home/shared/homeImages';

describe('HeroSection', () => {
  afterEach(() => setMatchMediaReducedMotion(false));

  test('renders a single level-1 heading as real text', () => {
    render(<HeroSection />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent.trim().length).toBeGreaterThan(0);
  });

  test('keeps the #hero anchor', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('section#hero')).toBeInTheDocument();
  });

  test('renders every hero image', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelectorAll('picture')).toHaveLength(HERO_IMAGES.length);
  });

  test('exactly one image is prioritised for LCP', () => {
    const { container } = render(<HeroSection />);
    const eager = container.querySelectorAll('img[loading="eager"]');
    expect(eager).toHaveLength(1);
    expect(eager[0]).toHaveAttribute('fetchpriority', 'high');
  });

  test('every hero image carries descriptive alt text', () => {
    const { container } = render(<HeroSection />);
    container.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('alt').length).toBeGreaterThan(10);
    });
  });

  test('renders the primary call to action as a link', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: /join our community/i })).toBeInTheDocument();
  });

  test('still renders fully under reduced motion', () => {
    setMatchMediaReducedMotion(true);
    const { container } = render(<HeroSection />);
    expect(container.querySelectorAll('picture')).toHaveLength(HERO_IMAGES.length);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest test/component/HeroSection.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the mosaic grid**

The grid is the design. Use CSS Grid with explicit placement, not a masonry library. Desktop is 12 columns × 6 rows; the headline occupies a deliberate gap rather than sitting on top of a photo.

```jsx
// Desktop placement: [colStart, colSpan, rowStart, rowSpan] per HERO_IMAGES index.
// Index 0 is the LCP image — largest cell, top-left weight.
const DESKTOP_CELLS = [
  { col: '1 / 5', row: '1 / 4', speed: -60 },   // neon-trio-joy      (LCP)
  { col: '5 / 7', row: '1 / 3', speed: -20 },   // neon-sisters-portrait
  { col: '9 / 13', row: '1 / 3', speed: -100 }, // worship-lead
  { col: '7 / 9', row: '1 / 4', speed: -20 },   // neon-agbada-portrait
  { col: '5 / 9', row: '4 / 7', speed: -60 },   // magenta-women-joy
  { col: '9 / 11', row: '3 / 7', speed: -100 }, // word-ministration
  { col: '11 / 13', row: '3 / 5', speed: -100 },// congregation-wide
  { col: '1 / 5', row: '4 / 7', speed: -60 },   // neon-celebrate
];

// The headline sits in the hole this leaves: columns 5-9, rows 3-4.
const HEADLINE_CELL = { col: '5 / 9', row: '3 / 4' };
```

Mobile (`< md`) drops to a 2-column grid showing `HERO_IMAGES.slice(0, 4)` with the headline stacked above, and no parallax.

Parallax: group the cells into three layers by `speed` and bind one `useParallax(sectionRef, speed)` MotionValue per layer — **three MotionValues total, not eight**. Binding one per image multiplies the subscription cost for no visual gain.

```jsx
const sectionRef = useRef(null);
const yFar = useParallax(sectionRef, -100);
const yMid = useParallax(sectionRef, -60);
const yNear = useParallax(sectionRef, -20);
const layers = { '-100': yFar, '-60': yMid, '-20': yNear };
```

`sizes` for the mosaic cells: `"(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"`. The LCP cell gets `priority`.

Entry animation, per image, staggered by `index * STAGGER`:

```jsx
initial={{ opacity: 0, scale: reduced ? 1 : 1.06, clipPath: reduced ? undefined : 'inset(12% 0 12% 0)' }}
animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)' }}
transition={{ duration: reduced ? DUR.fast : DUR.slow, delay: reduced ? 0 : index * STAGGER, ease: EASE_OUT }}
```

- [ ] **Step 4: Implement the headline**

`HeroHeadline.jsx` — words rise out of `overflow-hidden` masks. Keep the text in a single `<h1>` so screen readers read one continuous string; the masks are `<span>`s inside it.

```jsx
<h1 className="...">
  {WORDS.map((word, i) => (
    <span key={word + i} className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: reduced ? 0 : '110%', opacity: reduced ? 0 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.slow, delay: 0.1 + i * 0.05, ease: EASE_OUT }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  ))}
</h1>
```

Keep the existing copy — "Where God Meets With His People" — and the existing CTA, a `<Link>` to `/#contact` whose accessible name is "Join Our Community". Preserve the current smooth-scroll handler from `HeroSection.jsx:311-320`.

- [ ] **Step 5: Preload the LCP image**

In `index.html`, inside `<head>`, add a preload for the AVIF the hero will request. Match the `imagesizes` to the `sizes` used on that cell or the browser will fetch a second copy:

```html
<link
  rel="preload"
  as="image"
  type="image/avif"
  href="/images/home/neon-trio-joy-1200.avif"
  imagesrcset="/images/home/neon-trio-joy-480.avif 480w, /images/home/neon-trio-joy-768.avif 768w, /images/home/neon-trio-joy-1200.avif 1200w, /images/home/neon-trio-joy-1440.avif 1440w"
  imagesizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
/>
```

- [ ] **Step 6: Run the test to confirm it passes**

Run: `npx jest test/component/HeroSection.test.jsx`
Expected: PASS — 7 tests.

- [ ] **Step 7: Gate**

`npm test` → 56 passed. `npm run lint` → 0 errors. `npm run build` → succeeds.

Then check the preload actually matched: in DevTools Network, `neon-trio-joy-*.avif` should be fetched **once**, with high priority. Two fetches means the `imagesizes` is wrong.

---

## Task 8: About — re-imaged

Structure is retained per spec §6.2. Only the image source, alt text, `<img>` → `Picture`, and the local `SectionLabel` → shared `SectionHeader` change.

**Files:**
- Create: `src/components/Home/about/AboutSection.jsx`, `ImagePanel.jsx`, `TextPanel.jsx`, `ValuesGrid.jsx`
- Test: `test/component/AboutSection.test.jsx`
- Reference: `src/components/Home/AboutSection.jsx` (the file being replaced — copy structure from it)

**Interfaces:**
- Consumes: `Picture`, `ABOUT_IMAGES`, `SectionHeader`
- Produces: `AboutSection` default export, no props. Renders `<section id="about">`.

- [ ] **Step 1: Write the failing test**

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import AboutSection from '@/components/Home/about/AboutSection';
import { ABOUT_IMAGES } from '@/components/Home/shared/homeImages';

describe('AboutSection', () => {
  test('keeps the #about anchor the header nav scrolls to', () => {
    const { container } = render(<AboutSection />);
    expect(container.querySelector('section#about')).toBeInTheDocument();
  });

  test('renders the three value cards', () => {
    render(<AboutSection />);
    expect(screen.getByText('Love')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Kingdom')).toBeInTheDocument();
  });

  test('the slide counter reports the full image count', () => {
    render(<AboutSection />);
    expect(
      screen.getByText(new RegExp(String(ABOUT_IMAGES.length).padStart(2, '0')))
    ).toBeInTheDocument();
  });

  test('renders a thumbnail strip of accessible buttons', () => {
    render(<AboutSection />);
    const thumbs = screen.getAllByRole('button');
    expect(thumbs.length).toBeGreaterThan(0);
    thumbs.forEach((b) => expect(b.getAttribute('aria-label').length).toBeGreaterThan(10));
  });

  test('sources no image from the deleted legacy folders', () => {
    const { container } = render(<AboutSection />);
    container.querySelectorAll('img, source').forEach((el) => {
      const url = el.getAttribute('src') || el.getAttribute('srcset') || '';
      expect(url).not.toMatch(/images\/home\/about\d|images\/home\/hero|images\/gallery/);
    });
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest test/component/AboutSection.test.jsx` — FAIL, module not found.

- [ ] **Step 3: Port the existing component**

Copy `src/components/Home/AboutSection.jsx` into the four new files, splitting at the existing component boundaries — `ImagePanel` (with `GlitchSlider`, `ProgressBar`, `SlideCounter`, `LocationBadge`, `ThumbnailStrip`), `TextPanel` (with `GhostWatermark`), `ValuesGrid` (with `ValueCard`), and `AboutSection` as the composition root.

Changes while porting:

1. `ABOUT_IMAGES` now comes from `homeImages.js`. Build the slider's list with `getImage`:
   ```js
   const IMAGES = ABOUT_IMAGES.map(getImage);
   ```
   Keep the existing `fisherYates` shuffle and the `useMemo` that freezes the order for the session.
2. `GlitchSlider` and `ThumbnailStrip` render `Picture` instead of `<img>`. The slider needs `sizes="(max-width: 1023px) 100vw, 50vw"`; thumbnails need `sizes="80px"`.
3. `SlideCounter`'s `total` becomes `IMAGES.length` (12, not 15).
4. Replace the local `SectionLabel` with `<SectionHeader tone="light" eyebrow="Who We Are" titleLead="A Family" titleAccent="on Mission" subtitle="More than a gathering, a family of believers committed to the Word, the Spirit, and one another." />`.
5. Strip every `data-aos` attribute; wrap the panels in `Reveal` instead.
6. Keep `id="about"`, `SECTION_SPACING`, and the `about-glitch-in` / `about-glitch-out` / `about-pb-fill` CSS classes exactly as they are.
7. Thumbnail buttons keep their `aria-label={img.alt}`.

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx jest test/component/AboutSection.test.jsx` — PASS, 5 tests.

- [ ] **Step 5: Gate**

`npm test` → 61 passed. `npm run lint` → 0 errors.

---

## Task 9: Gallery Rail

**Files:**
- Create: `src/components/Home/gallery/GalleryRail.jsx`
- Test: `test/component/GalleryRail.test.jsx`

**Interfaces:**
- Consumes: `Picture`, `RAIL_IMAGES`, `getImage`, `SectionHeader`, `motion.js`
- Produces: `GalleryRail` default export, no props.

- [ ] **Step 1: Write the failing test**

```jsx
import { render } from '../test-utils';
import { setMatchMediaReducedMotion } from '../test-utils';
import GalleryRail from '@/components/Home/gallery/GalleryRail';
import { RAIL_IMAGES } from '@/components/Home/shared/homeImages';

describe('GalleryRail', () => {
  afterEach(() => setMatchMediaReducedMotion(false));

  test('renders every rail image', () => {
    const { container } = render(<GalleryRail />);
    expect(container.querySelectorAll('picture')).toHaveLength(RAIL_IMAGES.length);
  });

  test('the rail is a semantic list', () => {
    const { container } = render(<GalleryRail />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll('li')).toHaveLength(RAIL_IMAGES.length);
  });

  test('the section is labelled for screen readers', () => {
    const { container } = render(<GalleryRail />);
    const section = container.querySelector('section');
    const labelled =
      section.hasAttribute('aria-label') || section.hasAttribute('aria-labelledby');
    expect(labelled).toBe(true);
  });

  test('renders the total count in the index readout', () => {
    const { container } = render(<GalleryRail />);
    expect(container.textContent).toMatch(new RegExp(`${RAIL_IMAGES.length}`));
  });

  test('renders all images under reduced motion too', () => {
    setMatchMediaReducedMotion(true);
    const { container } = render(<GalleryRail />);
    expect(container.querySelectorAll('picture')).toHaveLength(RAIL_IMAGES.length);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails** — module not found.

- [ ] **Step 3: Implement**

Two modes, chosen at runtime. **Scroll-driven** only when the viewport is `md`+, the pointer is fine, and reduced motion is off. **Native scroll-snap** otherwise — never trap a touch user or a reduced-motion user in a hijacked scroll.

```jsx
const useRailMode = () => {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return wide && !reduced ? 'pinned' : 'native';
};
```

**Pinned mode.** The outer `<section>` is tall; a `sticky` viewport inside it holds the rail. Vertical progress drives `translateX`:

```jsx
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
const x = useTransform(scrollYProgress, [0, 1], ['0px', `-${scrollDistance}px`]);
```

`scrollDistance` is `railWidth - viewportWidth`, measured with a `ResizeObserver` on the rail element. Section height is `100vh + scrollDistance` so the mapping is 1:1 and never runs out. Guard against `scrollDistance <= 0`.

Index readout: `useTransform(scrollYProgress, (p) => Math.min(RAIL_IMAGES.length, Math.floor(p * RAIL_IMAGES.length) + 1))`, rendered via `useMotionValueEvent` into state — do not read `.get()` during render.

**Native mode.** A plain `<ul>` with `overflow-x: auto`, `scroll-snap-type: x mandatory`, each `<li>` `scroll-snap-align: center`. No sticky, no transform, no extra section height.

Both modes: `<ul role="list">` with `<li>` per frame; alternate the frame aspect between `3/4` and `3/2` following each image's real orientation from `getImage(name)`. `sizes="(max-width: 767px) 80vw, 40vw"`. Captions come from the alt text.

Add `scroll-margin-inline: 2rem` on the `<li>` so `:focus-visible` brings a focused frame fully into view.

- [ ] **Step 4: Run the test to confirm it passes** — 5 tests.

- [ ] **Step 5: Gate + manual check**

`npm test` → 66 passed. `npm run lint` → 0 errors.

In the browser: scroll through on desktop and confirm the rail advances smoothly and releases the page at the end. Then enable "Emulate CSS prefers-reduced-motion" in DevTools Rendering and confirm the section becomes a normal horizontal scroller with no pinning.

---

## Task 10: Gallery Mosaic and Lightbox

**Files:**
- Create: `src/components/Home/gallery/GalleryMosaic.jsx`, `Lightbox.jsx`
- Create: `src/components/Home/shared/useLockBodyScroll.js`
- Test: `test/component/GalleryMosaic.test.jsx`, `test/component/Lightbox.test.jsx`

**Interfaces:**
- Consumes: `Picture`, `MOSAIC_IMAGES`, `getImage`, `Reveal`, `SectionHeader`
- Produces: `GalleryMosaic` default export; `Lightbox` with props `{ images, index, onClose, onNavigate }` where `images` is an array of names and `index` is a number.

- [ ] **Step 1: Write the failing tests**

`test/component/Lightbox.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import Lightbox from '@/components/Home/gallery/Lightbox';

const IMAGES = ['neon-trio-joy', 'worship-lead', 'congregation-wide'];

const setup = (index = 1) => {
  const onClose = jest.fn();
  const onNavigate = jest.fn();
  render(
    <Lightbox images={IMAGES} index={index} onClose={onClose} onNavigate={onNavigate} />
  );
  return { onClose, onNavigate };
};

describe('Lightbox', () => {
  test('is an accessible modal dialog', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('shows the image at the given index', () => {
    setup(1);
    expect(
      screen.getByAltText(/worship leader singing into a microphone/i)
    ).toBeInTheDocument();
  });

  test('Escape closes it', async () => {
    const { onClose } = setup();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('arrow keys navigate', async () => {
    const { onNavigate } = setup(1);
    await userEvent.keyboard('{ArrowRight}');
    expect(onNavigate).toHaveBeenCalledWith(2);

    await userEvent.keyboard('{ArrowLeft}');
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  test('navigation wraps at both ends', async () => {
    const { onNavigate } = setup(IMAGES.length - 1);
    await userEvent.keyboard('{ArrowRight}');
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  test('moves focus into the dialog on open', () => {
    setup();
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  test('the close control has an accessible name', () => {
    setup();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('locks background scroll while open and restores it on unmount', () => {
    const { unmount } = render(
      <Lightbox images={IMAGES} index={0} onClose={() => {}} onNavigate={() => {}} />
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
```

`test/component/GalleryMosaic.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import GalleryMosaic from '@/components/Home/gallery/GalleryMosaic';
import { MOSAIC_IMAGES } from '@/components/Home/shared/homeImages';

describe('GalleryMosaic', () => {
  test('renders every mosaic image', () => {
    const { container } = render(<GalleryMosaic />);
    expect(container.querySelectorAll('picture')).toHaveLength(MOSAIC_IMAGES.length);
  });

  test('each tile is a button with an accessible name', () => {
    render(<GalleryMosaic />);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(MOSAIC_IMAGES.length);
    tiles.forEach((t) => expect(t.getAttribute('aria-label').length).toBeGreaterThan(10));
  });

  test('no lightbox is open initially', () => {
    render(<GalleryMosaic />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('clicking a tile opens the lightbox on that image', async () => {
    render(<GalleryMosaic />);
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('Escape closes the lightbox and returns focus to the tile', async () => {
    render(<GalleryMosaic />);
    const tile = screen.getAllByRole('button')[2];
    await userEvent.click(tile);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(tile).toHaveFocus();
  });

  test('a tile opens via the keyboard', async () => {
    render(<GalleryMosaic />);
    const tile = screen.getAllByRole('button')[1];
    tile.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them to confirm they fail** — modules not found.

- [ ] **Step 3: Implement `useLockBodyScroll.js`**

```js
import { useEffect } from 'react';

/** Locks background scroll while a modal is mounted, restoring the previous value. */
export const useLockBodyScroll = () => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
};

export default useLockBodyScroll;
```

- [ ] **Step 4: Implement `Lightbox.jsx`**

Requirements the tests pin down, plus the focus trap:

- Root is `role="dialog" aria-modal="true"` with `aria-label` from the current image's alt text.
- On mount, move focus to the close button. Keep a ref to `document.activeElement` before mounting so `GalleryMosaic` can restore it.
- One `keydown` listener on `document`: `Escape` → `onClose()`; `ArrowRight` → `onNavigate((index + 1) % images.length)`; `ArrowLeft` → `onNavigate((index - 1 + images.length) % images.length)`.
- Trap Tab: on `Tab`/`Shift+Tab`, if focus would leave the dialog's focusable set, wrap it. Query focusables with `dialogRef.current.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')`.
- Call `useLockBodyScroll()`.
- Render `<Picture name={images[index]} sizes="100vw" />`.
- Backdrop click closes; clicks inside the figure do not (`stopPropagation`).
- Close button's accessible name matches `/close/i`.

- [ ] **Step 5: Implement `GalleryMosaic.jsx`**

- CSS multi-column masonry: `columns-2 md:columns-3 lg:columns-4 gap-3`, each tile `break-inside-avoid mb-3`.
- Each tile is a real `<button>` with `aria-label={getImage(name).alt}`, wrapped in `Reveal` with `delay={i * 0.08}`.
- `sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"`.
- Track `openIndex` state (`null` when closed) and a `triggersRef` array of tile refs. On close, `triggersRef.current[openIndex]?.focus()` — this is what makes the focus-restoration test pass.
- Header: `<SectionHeader tone="dark" eyebrow="Gallery" titleLead="Moments from" titleAccent="the Family" />`.

- [ ] **Step 6: Run the tests to confirm they pass** — 14 tests across both files.

- [ ] **Step 7: Gate**

`npm test` → 80 passed. `npm run lint` → 0 errors.

---

## Task 11: Events section

This is the largest task. It replaces `SanctuaryHub.jsx` (1,799 lines) with focused files, drops the attendance flow migrated in Task 6, and adds the upcoming-events grid.

**Files:**
- Create: `src/components/Home/events/EventsSection.jsx`, `FeaturedEvent.jsx`, `EventCard.jsx`, `EventsGrid.jsx`, `EventSkeletons.jsx`, `eventFormat.js`
- Test: `test/component/EventsSection.test.jsx`, `test/component/eventFormat.test.js`
- Reference: `src/components/Home/SanctuaryHub.jsx:1411-1723`

**Interfaces:**
- Consumes: `useClosestEvent`, `useEvents`, `useAuthStore`, `SectionHeader`, `Reveal`
- Produces:
  - `EventsSection` default export, no props. Renders `<section id="events">`.
  - `eventFormat.js` — `fmtTime24(t)`, `fmtDateRange(event)`, `buildShareText(event)` re-exported from `@/utils/helper`

- [ ] **Step 1: Write the failing tests**

`test/component/eventFormat.test.js`:

```jsx
import { fmtTime24, fmtDateRange } from '@/components/Home/events/eventFormat';

describe('fmtTime24', () => {
  test('trims seconds from an HH:MM:SS time', () => {
    expect(fmtTime24('09:30:00')).toBe('09:30');
  });

  test('passes an HH:MM time through', () => {
    expect(fmtTime24('14:05')).toBe('14:05');
  });

  test('returns an empty string for missing input', () => {
    expect(fmtTime24(null)).toBe('');
    expect(fmtTime24(undefined)).toBe('');
    expect(fmtTime24('')).toBe('');
  });
});

describe('fmtDateRange', () => {
  test('returns the single date when there is no end date', () => {
    expect(fmtDateRange({ date: 'March 1, 2026', end_date: null })).toBe('March 1, 2026');
  });

  test('joins start and end when they differ', () => {
    const out = fmtDateRange({ date: 'March 1, 2026', end_date: '2026-03-03' });
    expect(out).toMatch(/March 1, 2026/);
    expect(out).toMatch(/–/);
  });

  test('collapses to one date when the end date matches the start', () => {
    expect(fmtDateRange({ date: 'March 1, 2026', end_date: '2026-03-01' })).toBe(
      'March 1, 2026'
    );
  });
});
```

`test/component/EventsSection.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import EventsSection from '@/components/Home/events/EventsSection';

let closest = {};
let list = {};
let auth = { isAuthenticated: false, user: null };

jest.mock('@/queries/events.query', () => ({
  useClosestEvent: () => closest,
  useEvents: () => list,
}));

jest.mock('@/store/auth.store', () => ({
  useAuthStore: () => auth,
}));

jest.mock('@/queries/service.query', () => ({
  useCoreAppData: () => ({ data: { birthday_list: [], anniversary_list: [] } }),
}));

const EVENT = {
  id: 1,
  title: 'Apostolic Congress',
  date: 'March 1, 2026',
  end_date: null,
  start_time: '09:00:00',
  end_time: '12:00:00',
  location: 'Bodija, Ibadan',
  description: 'A gathering of the whole family.',
  image: 'https://example.test/poster.jpg',
  status: 'upcoming',
  has_streaming: false,
  is_registration_open: false,
};

describe('EventsSection', () => {
  beforeEach(() => {
    auth = { isAuthenticated: false, user: null };
    closest = { data: { data: EVENT }, isLoading: false, isError: false };
    list = { data: { data: [] }, isLoading: false, isError: false };
  });

  test('keeps the #events anchor the header nav scrolls to', () => {
    const { container } = render(<EventsSection />);
    expect(container.querySelector('section#events')).toBeInTheDocument();
  });

  test('renders the featured event', () => {
    render(<EventsSection />);
    expect(screen.getByText('Apostolic Congress')).toBeInTheDocument();
    expect(screen.getByText(/Bodija, Ibadan/)).toBeInTheDocument();
  });

  test('shows a skeleton while the featured event loads', () => {
    closest = { data: undefined, isLoading: true, isError: false };
    render(<EventsSection />);
    expect(screen.getByTestId('featured-skeleton')).toBeInTheDocument();
  });

  test('shows an error state when the featured request fails', () => {
    closest = { data: undefined, isLoading: false, isError: true };
    render(<EventsSection />);
    expect(screen.getByTestId('featured-error')).toBeInTheDocument();
  });

  test('shows an empty state when nothing is scheduled', () => {
    closest = { data: { data: null }, isLoading: false, isError: false };
    list = { data: { data: [] }, isLoading: false, isError: false };
    render(<EventsSection />);
    expect(screen.getByTestId('featured-empty')).toBeInTheDocument();
  });

  test('excludes the featured event from the upcoming grid', () => {
    list = {
      data: { data: [EVENT, { ...EVENT, id: 2, title: 'Second Event' }] },
      isLoading: false,
      isError: false,
    };
    render(<EventsSection />);
    expect(screen.getByText('Second Event')).toBeInTheDocument();
    expect(screen.getAllByText('Apostolic Congress')).toHaveLength(1);
  });

  test('hides the view-all link from guests', () => {
    render(<EventsSection />);
    expect(screen.queryByRole('link', { name: /all events/i })).not.toBeInTheDocument();
  });

  test('shows the view-all link to signed-in members', () => {
    auth = { isAuthenticated: true, user: { id: 1 } };
    render(<EventsSection />);
    expect(screen.getByRole('link', { name: /all events/i })).toHaveAttribute(
      'href',
      '/dashboard/events'
    );
  });

  test('does not render celebrations for guests', () => {
    render(<EventsSection />);
    expect(screen.queryByTestId('celebrations')).not.toBeInTheDocument();
  });

  test('renders no attendance clock-in control', () => {
    auth = { isAuthenticated: true, user: { id: 1 } };
    render(<EventsSection />);
    expect(screen.queryByRole('button', { name: /clock in/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them to confirm they fail** — modules not found.

- [ ] **Step 3: Implement `eventFormat.js`**

```js
/** "09:30:00" → "09:30". Empty string for missing input, so callers can concatenate safely. */
export const fmtTime24 = (t) => {
  if (!t) return '';
  const [h, m] = String(t).split(':');
  return h && m ? `${h}:${m}` : String(t);
};

/** Collapses a start/end pair to a single string, omitting a redundant end date. */
export const fmtDateRange = (event) => {
  if (!event?.end_date) return event?.date ?? '';

  const end = new Date(event.end_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return end && end !== event.date ? `${event.date} – ${end}` : event.date;
};
```

- [ ] **Step 4: Implement the card, grid and skeletons**

`EventCard.jsx` — port `EventCardInner` from `SanctuaryHub.jsx:1411-1640`, keeping:
- the portrait/landscape detection via `onLoad` (`naturalHeight > naturalWidth` → taller box, `object-contain`, blurred backdrop)
- the `imgError` fallback
- status pill, time pill, title, date, location, description
- streaming / audio / registration action links
- the share button (`doShare` from the original, using `buildShareText` and `fetchEventImageFile` from `@/utils/helper`)

These use remote URLs, so they stay `<img>`, not `Picture`. Add `loading="lazy"` and `decoding="async"`. Give the card a `compact` prop: `false` for the featured treatment, `true` for grid tiles.

`EventsGrid.jsx` — maps `EventCard compact` over the filtered list, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

`EventSkeletons.jsx` — `FeaturedSkeleton` (`data-testid="featured-skeleton"`) matching the featured card's geometry, and `GridSkeleton` rendering three tile skeletons.

- [ ] **Step 5: Implement `EventsSection.jsx`**

```jsx
const { data: closestData, isLoading: featuredLoading, isError: featuredError } = useClosestEvent();
const { data: listData, isLoading: listLoading, isError: listError } = useEvents({ per_page: 6 });
const { isAuthenticated } = useAuthStore();

const featured = closestData?.data ?? null;

const upcoming = useMemo(
  () => (listData?.data ?? []).filter((e) => e.id !== featured?.id),
  [listData, featured?.id]
);
```

Branch order for the featured slot — `isLoading` → `featured-skeleton`; `isError` → `featured-error`; `!featured` → `featured-empty`; else the card.

The view-all link renders only when `isAuthenticated`, as `<Link to="/dashboard/events">All Events</Link>` passed into `SectionHeader`'s `action` prop.

Section shell: `<section id="events" className={...SECTION_SPACING} style={{ backgroundColor: PAGE_BG }}>` with `<AnimatedBackground withBaseBg />`.

Celebrations are added in Task 12 — leave a clearly marked mount point.

**Do not** import `useMarkAttendance`, `useTodaysService`, or `useSearchParams` here. **Do not** port the ~200 lines of commented-out `EventCardInner` (`SanctuaryHub.jsx:1418-1640` region) — it is dead.

- [ ] **Step 6: Run the tests to confirm they pass** — 16 tests across both files (6 + 10).

- [ ] **Step 7: Gate**

`npm test` → 96 passed. `npm run lint` → 0 errors.

---

## Task 12: Celebrations, ported

**Files:**
- Create: `src/components/Home/events/celebrations/CelebrationsSection.jsx`, `BirthdayCard.jsx`, `AnniversaryCard.jsx`, `SendMessageModal.jsx`
- Modify: `src/components/Home/events/EventsSection.jsx`
- Test: `test/component/Celebrations.test.jsx`
- Reference: `src/components/Home/SanctuaryHub.jsx:188-650`

**Interfaces:**
- Consumes: `useCoreAppData`, `useSendMessage`, `useAuthStore`, `ConfettiShower`, `Avatar`, `Modal`
- Produces: `CelebrationsSection` with props `{ birthdayList, anniversaryList }`. Renders nothing when both are empty.

- [ ] **Step 1: Write the failing test**

```jsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import CelebrationsSection from '@/components/Home/events/celebrations/CelebrationsSection';

jest.mock('@/queries/message.query', () => ({
  useSendMessage: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

const PERSON = { id: 1, first_name: 'Ada', last_name: 'Obi', date_of_birth: '1990-09-04' };

describe('CelebrationsSection', () => {
  test('renders nothing when there is nothing to celebrate', () => {
    const { container } = render(
      <CelebrationsSection birthdayList={[]} anniversaryList={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders a birthday card when there are birthdays', () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    expect(screen.getByTestId('celebrations')).toBeInTheDocument();
    expect(screen.getByText(/Ada/)).toBeInTheDocument();
  });

  test('renders only the birthdays tab when there are no anniversaries', () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    expect(screen.queryByRole('tab', { name: /anniversar/i })).not.toBeInTheDocument();
  });

  test('opens the message modal from a card', async () => {
    render(<CelebrationsSection birthdayList={[PERSON]} anniversaryList={[]} />);
    await userEvent.click(screen.getByRole('button', { name: /message/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails** — module not found.

- [ ] **Step 3: Port**

Copy `SendMessageModal` (lines 188-242), `BirthdayCard` (243-319), `AnniversaryCard` (320-407), `CelebTab` (408-446), `ScrollTrack` (447-475) and `CelebrationsSection` (476-650) into the new files, preserving behaviour exactly. `ANN_TYPE_CFG` moves alongside `AnniversaryCard`.

Changes while porting:
- Props become `{ birthdayList, anniversaryList }`; the component derives `hasBirthdays` / `hasAnniversaries` itself and returns `null` when both are false.
- Add `data-testid="celebrations"` to the root.
- Tab buttons get `role="tab"`, the panel `role="tabpanel"`, and `aria-selected` on the active tab.
- The per-card message trigger is a `<button>` whose accessible name contains "message".
- Strip `data-aos`; use `Reveal`.
- Keep the `hub-*` CSS classes — they still exist in `index.css` and are still used here.

- [ ] **Step 4: Mount in `EventsSection`**

```jsx
const { data: coreData } = useCoreAppData();
const { birthday_list = [], anniversary_list = [] } = coreData || {};
const hasCelebrations =
  birthday_list.length > 0 || anniversary_list.some((p) => p.anniversaries?.length);

{isAuthenticated && hasCelebrations && <ConfettiShower duration={15} />}
{isAuthenticated && (
  <CelebrationsSection birthdayList={birthday_list} anniversaryList={anniversary_list} />
)}
```

`useCoreAppData` is already gated on `isAuthenticated` internally (`src/queries/service.query.js:19-20`), so guests fire no request.

- [ ] **Step 5: Run the test to confirm it passes** — 4 tests.

- [ ] **Step 6: Gate**

`npm test` → 100 passed. `npm run lint` → 0 errors.

---

## Task 13: Face of the Week

**Files:**
- Create: `src/components/Home/shared/facesOfTheWeek.js`, `src/components/Home/face/FaceOfTheWeek.jsx`
- Test: `test/component/facesOfTheWeek.test.js`, `test/component/FaceOfTheWeek.test.jsx`

**Interfaces:**
- Consumes: `Picture`, `FACE_IMAGES`, `SectionHeader`, `Reveal`
- Produces:
  - `FACES` — array of `{ image, name, unit, joined, story, scripture }`
  - `isoWeek(date)` → number
  - `getFaceOfTheWeek(date)` → one entry, or `null` when `FACES` is empty
  - `FaceOfTheWeek` default export, no props

- [ ] **Step 1: Write the failing tests**

`test/component/facesOfTheWeek.test.js`:

```jsx
import { FACES, isoWeek, getFaceOfTheWeek } from '@/components/Home/shared/facesOfTheWeek';
import manifest from '@/components/Home/shared/imageManifest.json';

describe('isoWeek', () => {
  // ISO 8601 reference dates. If one of these fails, check the date against an
  // ISO week calculator before changing the implementation — the maths is standard.
  test('2026-01-01 (Thursday) is week 1', () => {
    expect(isoWeek(new Date(2026, 0, 1))).toBe(1);
  });

  test('2021-01-04 (Monday) is week 1', () => {
    expect(isoWeek(new Date(2021, 0, 4))).toBe(1);
  });

  test('2021-01-03 (Sunday) belongs to the previous year, week 53', () => {
    expect(isoWeek(new Date(2021, 0, 3))).toBe(53);
  });

  test('always returns a positive integer', () => {
    for (let d = 1; d <= 28; d += 1) {
      const w = isoWeek(new Date(2026, 5, d));
      expect(Number.isInteger(w)).toBe(true);
      expect(w).toBeGreaterThan(0);
    }
  });
});

describe('getFaceOfTheWeek', () => {
  test('returns an entry', () => {
    expect(getFaceOfTheWeek(new Date(2026, 8, 4))).not.toBeNull();
  });

  test('is stable within the same week', () => {
    const monday = getFaceOfTheWeek(new Date(2026, 8, 7));
    const friday = getFaceOfTheWeek(new Date(2026, 8, 11));
    expect(monday).toBe(friday);
  });

  test('advances between consecutive weeks', () => {
    const a = getFaceOfTheWeek(new Date(2026, 8, 7));
    const b = getFaceOfTheWeek(new Date(2026, 8, 14));
    expect(a).not.toBe(b);
  });
});

describe('FACES data', () => {
  test('every entry points at an image that exists', () => {
    FACES.forEach((f) => expect(manifest[f.image]).toBeTruthy());
  });

  test('every entry has all required fields', () => {
    FACES.forEach((f) => {
      ['image', 'name', 'unit', 'joined', 'story', 'scripture'].forEach((key) => {
        expect(typeof f[key]).toBe('string');
        expect(f[key].length).toBeGreaterThan(0);
      });
    });
  });

  test('unfilled personal details are explicitly marked TODO, never invented', () => {
    FACES.forEach((f) => {
      const filled = !f.name.startsWith('TODO');
      if (!filled) {
        expect(f.name).toMatch(/^TODO/);
        expect(f.unit).toMatch(/^TODO/);
        expect(f.story).toMatch(/^TODO/);
      }
    });
  });
});
```

`test/component/FaceOfTheWeek.test.jsx`:

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import FaceOfTheWeek from '@/components/Home/face/FaceOfTheWeek';

describe('FaceOfTheWeek', () => {
  test('renders a portrait and a name heading', () => {
    const { container } = render(<FaceOfTheWeek />);
    expect(container.querySelector('picture')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  test('the portrait carries descriptive alt text', () => {
    const { container } = render(<FaceOfTheWeek />);
    const img = container.querySelector('img');
    expect(img.getAttribute('alt').length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Run them to confirm they fail** — modules not found.

- [ ] **Step 3: Implement `facesOfTheWeek.js`**

The `TODO` strings are deliberate. **Do not replace them with plausible-looking names** — these are photographs of real, identifiable people and the user is supplying the real details.

```js
import { FACE_IMAGES } from './homeImages';

/**
 * Face of the Week.
 *
 * The photographs are of real church members. Every field below marked TODO is
 * waiting on the real detail from the church — do not invent a name, a unit, or a
 * story to fill a gap. A visible TODO is correct; a plausible fabrication is not.
 *
 * Rotation is derived from the ISO week number, so this advances every Monday
 * without a deploy.
 */
export const FACES = FACE_IMAGES.map((image) => ({
  image,
  name: 'TODO: member name',
  unit: 'TODO: unit or role',
  joined: 'TODO: year joined',
  story: 'TODO: one sentence about them, in their own words if possible',
  scripture: 'TODO: their favourite scripture',
}));

/** ISO 8601 week number. Weeks start Monday; week 1 contains the first Thursday. */
export const isoWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;      // Sunday counts as 7, not 0
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // shift to the week's Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export const getFaceOfTheWeek = (date = new Date()) =>
  FACES.length ? FACES[isoWeek(date) % FACES.length] : null;
```

- [ ] **Step 4: Implement `FaceOfTheWeek.jsx`**

- Return `null` when `getFaceOfTheWeek()` is `null`.
- Two-column layout at `lg`: portrait left, details right. Stacked on mobile.
- Portrait is `<Picture name={face.image} sizes="(max-width: 1023px) 100vw, 45vw" />` in a `3/4` frame.
- Name is an `<h3>`; unit, joined, story and scripture below it.
- Header: `<SectionHeader tone="dark" eyebrow="Face of the Week" titleLead="Meet" titleAccent="the Family" />`.
- Wrap the panels in `Reveal`.
- Because `Picture` supplies the alt text from the manifest, the portrait is described even while the name is a TODO.

- [ ] **Step 5: Run the tests to confirm they pass** — 12 tests.

- [ ] **Step 6: Gate**

`npm test` → 112 passed. `npm run lint` → 0 errors.

---

## Task 14: MediaHub refresh

Spec §6.7 — "light touch". Data flow, filters, `useVideos`, `useAwardPoints` and the YouTube modal are untouched.

**Files:**
- Create: `src/components/Home/media/MediaHub.jsx`, `VideoCard.jsx`, `FilterRow.jsx`, `MediaSkeletons.jsx`
- Move: `src/components/Home/YoutubeModal.jsx` → `src/components/Home/media/YoutubeModal.jsx`
- Test: `test/component/MediaHub.test.jsx`
- Reference: `src/components/Home/MediaHub.jsx`

**Interfaces:**
- Consumes: `useVideos`, `useAwardPoints`, `useModal`, `SectionHeader`
- Produces: `MediaHub` with props `{ isAuthenticated, user }`. Renders `<section id="media">`.

- [ ] **Step 1: Write the failing test**

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import MediaHub from '@/components/Home/media/MediaHub';

let videos = {};

jest.mock('@/queries/media.query', () => ({ useVideos: () => videos }));
jest.mock('@/queries/user.query', () => ({ useAwardPoints: () => ({ mutate: jest.fn() }) }));

const VIDEO = {
  id: 'abc123',
  title: 'Sunday Service — March 2026',
  publishedAt: '2026-03-01T10:00:00Z',
  thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
};

describe('MediaHub', () => {
  beforeEach(() => {
    videos = { data: [VIDEO], isLoading: false, isError: false };
  });

  test('keeps the #media anchor the header nav scrolls to', () => {
    const { container } = render(<MediaHub isAuthenticated={false} user={null} />);
    expect(container.querySelector('section#media')).toBeInTheDocument();
  });

  test('renders a video card', () => {
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByText(/Sunday Service/)).toBeInTheDocument();
  });

  test('shows skeletons while loading', () => {
    videos = { data: undefined, isLoading: true, isError: false };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getAllByTestId('video-skeleton').length).toBeGreaterThan(0);
  });

  test('shows an error state when the request fails', () => {
    videos = { data: undefined, isLoading: false, isError: true };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByTestId('media-error')).toBeInTheDocument();
  });

  test('shows an empty state when there are no videos', () => {
    videos = { data: [], isLoading: false, isError: false };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByTestId('media-empty')).toBeInTheDocument();
  });

  test('each video is reachable as a button with an accessible name', () => {
    render(<MediaHub isAuthenticated={false} user={null} />);
    const play = screen.getByRole('button', { name: /Sunday Service/i });
    expect(play).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails** — module not found.

- [ ] **Step 3: Port and refresh**

Split the existing `MediaHub.jsx` at its component boundaries. Keep `getCategory`, `formatDate`, `CATEGORY_META`, the brand SVG icons, the filter state and the pagination (`INITIAL_COUNT` 4, `PAGE_SIZE` 4) exactly as they are.

Visual changes only:
- Thumbnails go to a full 16:9 with `object-cover`; card padding tightens.
- A play affordance appears on `group-hover` **and** `group-focus-within`, so keyboard users see it too.
- The filter row becomes a single horizontally-scrollable line using the existing `.mh-filter-scroll` class.
- Replace the local `SectionHeader` with the shared one (`tone="dark"`).
- Each video tile becomes a real `<button aria-label={video.title}>`.
- Add the three missing states: `data-testid="video-skeleton"` on each skeleton, `media-error`, `media-empty`.
- YouTube thumbnails are remote, so they stay `<img loading="lazy" decoding="async">` with explicit `width`/`height` (1280×720) to hold the box.

Update the import in `HomePage.jsx` to the new path. Delete the old flat `MediaHub.jsx` and `YoutubeModal.jsx` once the new ones work.

- [ ] **Step 4: Run the test to confirm it passes** — 6 tests.

- [ ] **Step 5: Gate**

`npm test` → 118 passed. `npm run lint` → 0 errors.

---

## Task 15: QuickActions sharpened

**Files:**
- Create: `src/components/Home/quick-actions/QuickActionsSection.jsx`, `ActionCard.jsx`, `QuoteStrip.jsx`
- Modify: `src/utils/constant.js`
- Test: `test/component/QuickActionsSection.test.jsx`
- Reference: `src/components/Home/QuickActionsSection.jsx`

**Interfaces:**
- Consumes: `QUICK_ACTION_LINKS`, `QUICK_ACTION_IMAGES`, `Picture`, `SectionHeader`
- Produces: `QuickActionsSection` default export, no props

- [ ] **Step 1: Write the failing test**

```jsx
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import QuickActionsSection from '@/components/Home/quick-actions/QuickActionsSection';

describe('QuickActionsSection', () => {
  test('renders all three action cards as links', () => {
    render(<QuickActionsSection />);
    expect(screen.getByRole('link', { name: /ask anything/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /prayer request/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /testimony/i })).toBeInTheDocument();
  });

  test('each card links to its form tab', () => {
    render(<QuickActionsSection />);
    expect(screen.getByRole('link', { name: /ask anything/i })).toHaveAttribute(
      'href',
      '/forms?tab=question'
    );
  });

  test('card headers use photographs from the new set', () => {
    const { container } = render(<QuickActionsSection />);
    expect(container.querySelectorAll('picture')).toHaveLength(3);
    container.querySelectorAll('source').forEach((s) => {
      expect(s.getAttribute('srcset')).toMatch(/\/images\/home\//);
      expect(s.getAttribute('srcset')).not.toMatch(/\/images\/forms\//);
    });
  });

  test('card header images are decorative, so they do not double-announce the card', () => {
    const { container } = render(<QuickActionsSection />);
    container.querySelectorAll('picture img').forEach((img) => {
      expect(img).toHaveAttribute('alt', '');
      expect(img).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('renders the scripture quote strip', () => {
    render(<QuickActionsSection />);
    expect(screen.getByText(/John 14:13/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails** — module not found.

- [ ] **Step 3: Repoint the constant**

In `src/utils/constant.js`, change `QUICK_ACTION_LINKS` so `src` names a manifest key rather than a path:

```js
export const QUICK_ACTION_LINKS = [
  { to: '/forms?tab=question', image: 'magenta-trio-men', alt: 'question', external: true },
  { to: '/forms?tab=prayer', image: 'word-ministration', alt: 'prayer', external: true },
  { to: '/forms?tab=testimony', image: 'magenta-women-joy', alt: 'testimony', external: true },
];
```

Check for other consumers first: `grep -rn "QUICK_ACTION_LINKS" src`. At the time of writing, `src/components/Home/QuickActionsSection.jsx` is the only one — if that has changed, update every call site in this same task.

- [ ] **Step 4: Port and sharpen**

Keep `CARD_META`, the three-card grid, the numbering, the icons and `QuoteStrip` exactly as they are. Replace the invisible 12%-opacity "ghost image" with a real card header:

- A `16/9` header band at the top of each card holding `<Picture name={link.image} alt="" sizes="(max-width: 767px) 100vw, 33vw" />`.
- Over it, a duotone wash in the card's accent colour (`rgba(${colorRGB}, 0.45)`, `mix-blend-mode: multiply`) and a bottom-up scrim so the icon and label stay legible.
- The image scales to `1.04` on `group-hover` — transform only.
- `alt=""` because the card's own link text already names it; a described photo here would double-announce.

Strip `data-aos`; use `Reveal`. Replace the exported local `SectionHeader` with the shared one (`tone="light"`) — and delete the local export, since Task 5 replaced its only consumers.

- [ ] **Step 5: Run the test to confirm it passes** — 5 tests.

- [ ] **Step 6: Gate**

`npm test` → 123 passed. `npm run lint` → 0 errors.

---

## Task 16: Assemble the page

**Files:**
- Modify: `src/components/Home/HomePage.jsx`
- Delete: the eight flat files in `src/components/Home/`
- Test: `test/component/HomePage.test.jsx`

**Interfaces:**
- Consumes: every section from Tasks 7-15
- Produces: `HomePage` default export; `shouldRedirectToDashboard` named export (from Task 6)

- [ ] **Step 1: Write the failing test**

```jsx
import { render } from '../test-utils';
import HomePage from '@/components/Home/HomePage';

jest.mock('@/store/auth.store', () => ({
  useAuthStore: () => ({ isAuthenticated: false, user: null }),
}));

jest.mock('@/queries/events.query', () => ({
  useClosestEvent: () => ({ data: { data: null }, isLoading: false, isError: false }),
  useEvents: () => ({ data: { data: [] }, isLoading: false, isError: false }),
}));

jest.mock('@/queries/service.query', () => ({
  useCoreAppData: () => ({ data: { birthday_list: [], anniversary_list: [] } }),
}));

jest.mock('@/queries/media.query', () => ({
  useVideos: () => ({ data: [], isLoading: false, isError: false }),
}));

jest.mock('@/queries/user.query', () => ({
  useAwardPoints: () => ({ mutate: jest.fn() }),
}));

describe('HomePage', () => {
  test('renders every anchor the header nav scrolls to', () => {
    const { container } = render(<HomePage />);
    ['#hero', '#about', '#events', '#media'].forEach((id) => {
      expect(container.querySelector(`section${id}`)).toBeInTheDocument();
    });
  });

  test('renders exactly one level-1 heading', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  test('sections appear in the specified order', () => {
    const { container } = render(<HomePage />);
    const ids = [...container.querySelectorAll('section[id]')].map((s) => s.id);
    expect(ids.indexOf('hero')).toBeLessThan(ids.indexOf('about'));
    expect(ids.indexOf('about')).toBeLessThan(ids.indexOf('events'));
    expect(ids.indexOf('events')).toBeLessThan(ids.indexOf('media'));
  });

  test('no image is loaded from a deleted legacy folder', () => {
    const { container } = render(<HomePage />);
    container.querySelectorAll('img, source').forEach((el) => {
      const url = el.getAttribute('src') || el.getAttribute('srcset') || '';
      expect(url).not.toMatch(/images\/gallery\/|images\/home\/(hero|about)\//);
    });
  });

  test('exactly one image on the page is prioritised', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll('img[loading="eager"]')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails** — old imports still resolve to flat files.

- [ ] **Step 3: Rewrite `HomePage.jsx`**

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

import HeroSection from '@/components/Home/hero/HeroSection';
import AboutSection from '@/components/Home/about/AboutSection';
import GalleryRail from '@/components/Home/gallery/GalleryRail';
import EventsSection from '@/components/Home/events/EventsSection';
import GalleryMosaic from '@/components/Home/gallery/GalleryMosaic';
import FaceOfTheWeek from '@/components/Home/face/FaceOfTheWeek';
import MediaHub from '@/components/Home/media/MediaHub';
import QuickActionsSection from '@/components/Home/quick-actions/QuickActionsSection';

const VALID_SOURCES = new Set(['onsite', 'online']);

export const shouldRedirectToDashboard = (search) => {
  const source = new URLSearchParams(search).get('source');
  return VALID_SOURCES.has(source) ? `/dashboard?source=${source}` : null;
};

const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const redirectTo = shouldRedirectToDashboard(location.search);
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <main className="w-full">
      <HeroSection />
      <AboutSection />
      <GalleryRail />
      <EventsSection />
      <GalleryMosaic />
      <FaceOfTheWeek />
      <MediaHub isAuthenticated={isAuthenticated} user={user} />
      <QuickActionsSection />
    </main>
  );
};

export default HomePage;
```

- [ ] **Step 4: Delete the replaced flat files**

```bash
git rm src/components/Home/HeroSection.jsx \
       src/components/Home/AboutSection.jsx \
       src/components/Home/Gallery.jsx \
       src/components/Home/GallerySection.jsx \
       src/components/Home/SanctuaryHub.jsx \
       src/components/Home/MediaHub.jsx \
       src/components/Home/QuickActionsSection.jsx \
       src/components/Home/YoutubeModal.jsx
```

Before deleting, confirm nothing outside `Home/` imports them:

```bash
grep -rn "Home/SanctuaryHub\|Home/HeroSection\|Home/Gallery\|Home/MediaHub\|Home/QuickActionsSection\|Home/YoutubeModal\|Home/AboutSection" src
```

Expected: no results, or only the new files' own paths. `src/components/dashboard/QuickActionsSection.jsx` is a **different, unrelated file** — do not delete it.

- [ ] **Step 5: Run the test to confirm it passes** — 5 tests.

- [ ] **Step 6: Gate**

`npm test` → 128 passed. `npm run lint` → 0 errors. `npm run build` → succeeds.

Record the new `HomePage` chunk size and compare to the 490.22 kB baseline.

---

## Task 17: Cleanup

**Files:**
- Delete: 34 orphaned images
- Modify: `src/index.css`
- Modify: comment blocks across `src/components/Home/**`

- [ ] **Step 1: Prove each image is orphaned before deleting**

```bash
for f in hero1 hero2 hero3 hero4 hero5 hero6 hero7; do
  echo "== $f: $(grep -rl "$f" src --include=*.jsx --include=*.js | wc -l) refs"
done
grep -rn "images/home/about\|images/gallery/\|forms/prayer\.png\|forms/questions\.png\|forms/testimony\.png\|user/avatar" src --include=*.jsx --include=*.js
```

Expected: zero references for all of them. **If any reference survives, stop and report** — something was missed in an earlier task.

- [ ] **Step 2: Delete**

```bash
git rm -r public/images/home/hero public/images/home/about
git rm public/images/home/about1.jpg public/images/home/about2.jpg public/images/home/about3.jpg \
       public/images/home/about4.jpg public/images/home/about5.jpg public/images/home/about6.jpg
git rm -r public/images/gallery
git rm public/images/forms/prayer.png public/images/forms/questions.png public/images/forms/testimony.png
git rm public/images/user/avatar.jpeg
```

**Do not delete** `public/images/forms/prayer2.png`, `question2.png` or `testimony2.png` — their removal was not approved, even though Task 15 orphaned them.

**Do not delete** the generated `public/images/home/*-{480,768,1200,1600}.{avif,webp,jpg}` files. The two `git rm -r` commands above target only the `hero/` and `about/` subdirectories.

- [ ] **Step 3: Remove dead CSS**

For each `about-*` and `hub-*` class and keyframe in `src/index.css`, check for a live consumer:

```bash
for c in about-glitch-in about-glitch-out about-pb-fill about-img-entering about-img-leaving \
         hub-ripple hub-glow hub-scale-in hub-tab-in hub-fade-in hub-scroll hub-ripple-ring \
         ev-card hub-celeb-btn hub-lottie-wrap hub-service-body hub-event-card-shell \
         mh-shimmer mh-glow mh-filter-scroll glow-pulse; do
  n=$(grep -rl "$c" src --include=*.jsx --include=*.js | wc -l)
  echo "$c: $n"
done
```

Delete only the rules whose count is 0. `hub-service-body` and `hub-lottie-wrap` belonged to the removed `ServiceRail` and are the likely candidates — but let the grep decide, and re-check anything you delete against `src/components/dashboard/` too, since Task 6 moved code there.

- [ ] **Step 4: Trim the inline comments**

Per spec §D9, this is the whole of the "docs" work. Across `src/components/Home/**`:

- Delete ASCII-banner separator comments (`// ─── Foo ───────────`) that only restate the identifier below them.
- Delete stale rationale describing code that no longer exists — for example the multi-paragraph "ghost image technique" note, now that Task 15 replaced that technique.
- Delete numbered `FIX 1:` style annotations referring to bugs fixed in past commits.
- **Keep** comments explaining a non-obvious *why*: the parallax layer grouping, the reduced-motion rationale in `Reveal`, the open-redirect note in `shouldRedirectToDashboard`, the TODO warning in `facesOfTheWeek.js`, and the `withoutEnlargement` note in the sharp script.

The test: would a maintainer be worse off without this sentence? If not, delete it.

- [ ] **Step 5: Gate**

`npm test` → 128 passed. `npm run lint` → 0 errors. `npm run build` → succeeds with no 404s.

---

## Task 18: Full verification sweep

No new code. This task exists so the final report is evidence, not assertion.

- [ ] **Step 1: Automated checks**

```bash
npm run lint
npm test
npm run build
```

Record: error count (must be 0), warning count (compare to 118 — must not increase), test count, `HomePage` chunk size (compare to 490.22 kB / 119.56 kB gzip).

- [ ] **Step 2: Breakpoint pass**

`npm run dev`, then at 375 / 768 / 1024 / 1440 px confirm for every section: no horizontal overflow, no overlapping text, images fill their frames without distortion, the hero mosaic reflows correctly, the gallery rail switches modes at 768 px.

- [ ] **Step 3: Reduced-motion pass**

DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Reload. Confirm: no parallax, no scroll-jacking in the rail, reveals are fades only, the page is fully readable and navigable.

- [ ] **Step 4: Keyboard pass**

Tab from the top. Confirm: focus is always visible, order follows the visual layout, the mosaic tiles are reachable and open with Enter, the lightbox traps focus, Escape closes it and returns focus to the tile that opened it, the rail brings focused frames into view.

- [ ] **Step 5: Console and network pass**

Confirm zero console errors, zero React warnings (especially key warnings and `useLayoutEffect` SSR warnings), and zero 404s in Network. Filter Network by `Img` and confirm AVIF is being served, not JPEG.

- [ ] **Step 6: Auth pass**

Signed out: no celebrations, no "All Events" link, no requests to `/services/core-data`. Signed in: celebrations render if there are any this month, the "All Events" link appears, the dashboard clock-in card works.

- [ ] **Step 7: QR flow re-check**

Re-run the five checks from Task 6 Step 7 against the finished page.

- [ ] **Step 8: Report**

State what changed, what was verified and how, and — explicitly — anything you could not verify (a live service to clock into, a month with real birthdays, a device you do not have). Do not imply coverage you did not achieve.

---

## Deferred to the user

These are deliberate, not oversights:

1. **Face of the Week content.** Five entries ship with `TODO` fields. The user supplies real names, units, joined years, stories and scriptures. Until then the section renders with visible placeholders.
2. **Commits.** Nothing in this plan commits. The user reviews and commits.
3. **`public/images/forms/*2.png`.** Orphaned by Task 15 but retained — deletion was not approved.
4. **`neon-five-women-lowres.jpg` and `magenta-pastor-trio-duplicate.jpg`.** Retained on disk, referenced nowhere.
5. **`BasicTable.jsx`.** References 16 non-existent `user-NN.jpg` files. Pre-existing, out of scope, flagged only.
