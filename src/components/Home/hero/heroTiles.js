import { HERO_IMAGES } from '@/components/Home/shared/homeImages';

/**
 * The wall.
 *
 * Ten photographs are placed around a rectangle of negative space, and the
 * headline lives inside that hole. Nothing slides and nothing rotates through:
 * the whole composition is on screen at once, and the interest comes from the
 * frames being genuinely different shapes rather than one frame repeated.
 *
 * One DOM, three tiers:
 *
 *  - Below `sm` the grid is six columns and five photographs flow in source
 *    order, each holding its own aspect ratio. The copy is the first row.
 *  - From `sm` the grid is twelve columns and all ten appear, paired into rows
 *    that add up to twelve and whose members are close enough in height that
 *    the row does not have to stretch anything far.
 *  - At `lg` the grid becomes twelve columns by five rows at a fixed height and
 *    every tile is pinned to an explicit cell. The copy takes columns 4-9 of
 *    rows 2-4 — the hole.
 *
 * The `lg` placements below tile the grid exactly, with no cell uncovered and
 * none claimed twice, so the wall cannot develop a gap. HeroSection.test.jsx
 * counts the cells rather than trusting this comment.
 *
 * `depth` is how far a tile travels as the wall leans toward the pointer. Tiles
 * that share an edge share a depth — the two flanks move as one plane and each
 * band moves as one — because neighbours displaced by different amounts pull
 * their shared edge apart. The two values are kept close together for the same
 * reason: the widest gap between them is 6, so a 10px gutter never breathes by
 * more than 3px. HeroSection.test.jsx holds that bound.
 *
 * Placement classes are written out in full rather than assembled from parts.
 * Tailwind finds classes by scanning source text, so a class built at runtime
 * (`lg:col-start-${n}`) never gets generated and the tile lands wherever the
 * grid's auto-placement happens to put it.
 */
const LAYOUT = {
  'magenta-trio-smile': {
    flow: 'col-span-6 aspect-[3/2] sm:col-span-6',
    place: 'lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-3',
    sizes: '(max-width: 639px) 94vw, (max-width: 1023px) 48vw, 24vw',
    from: 'left',
    delay: 0.3,
    depth: 15,
    focus: 'center 34%',
    drift: true,
  },
  'neon-couple-portrait': {
    flow: 'col-span-3 aspect-[3/4] sm:col-span-3',
    place: 'lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-6',
    sizes: '(max-width: 639px) 46vw, 24vw',
    from: 'left',
    delay: 0.38,
    depth: 15,
    focus: 'center 28%',
    drift: true,
  },
  'neon-black-tee-portrait': {
    flow: 'col-span-3 aspect-[3/4] sm:col-span-3',
    place: 'lg:col-start-9 lg:col-end-10 lg:row-start-1 lg:row-end-2',
    sizes: '(max-width: 639px) 46vw, (max-width: 1023px) 24vw, 9vw',
    from: 'top',
    delay: 0.58,
    depth: 9,
    focus: 'center 26%',
  },
  'neon-celebrate': {
    flow: 'col-span-6 aspect-[3/2] sm:col-span-6',
    place: 'lg:col-start-7 lg:col-end-9 lg:row-start-1 lg:row-end-2',
    sizes: '(max-width: 639px) 94vw, (max-width: 1023px) 48vw, 16vw',
    from: 'top',
    delay: 0.52,
    depth: 9,
    focus: 'center 34%',
  },
  'magenta-youth-group': {
    flow: 'col-span-6 aspect-[5/2] sm:col-span-6 sm:aspect-[3/2]',
    place: 'lg:col-start-4 lg:col-end-7 lg:row-start-1 lg:row-end-2',
    sizes: '(max-width: 639px) 94vw, (max-width: 1023px) 48vw, 24vw',
    from: 'top',
    delay: 0.46,
    depth: 9,
    focus: 'center 38%',
  },
  'neon-sisters-portrait': {
    flow: 'hidden aspect-[3/4] sm:block sm:col-span-3',
    place: 'lg:col-start-4 lg:col-end-5 lg:row-start-5 lg:row-end-6',
    sizes: '(max-width: 1023px) 24vw, 9vw',
    from: 'bottom',
    delay: 0.58,
    depth: 9,
    focus: 'center 24%',
  },
  'neon-duo-portrait': {
    flow: 'hidden aspect-[3/4] sm:block sm:col-span-3',
    place: 'lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-4',
    sizes: '24vw',
    from: 'right',
    delay: 0.3,
    depth: 15,
    focus: 'center 28%',
    drift: true,
  },
  'magenta-children': {
    flow: 'hidden aspect-[3/2] sm:block sm:col-span-6',
    place: 'lg:col-start-8 lg:col-end-10 lg:row-start-5 lg:row-end-6',
    sizes: '(max-width: 1023px) 48vw, 16vw',
    from: 'bottom',
    delay: 0.52,
    depth: 9,
    focus: 'center 40%',
  },
  'magenta-pastor-trio': {
    flow: 'hidden aspect-[3/2] sm:block sm:col-span-8',
    place: 'lg:col-start-5 lg:col-end-8 lg:row-start-5 lg:row-end-6',
    sizes: '(max-width: 1023px) 64vw, 24vw',
    from: 'bottom',
    delay: 0.46,
    depth: 9,
    focus: 'center 40%',
  },
  'congregation-full': {
    flow: 'hidden aspect-[3/4] sm:block sm:col-span-4',
    place: 'lg:col-start-10 lg:col-end-13 lg:row-start-4 lg:row-end-6',
    sizes: '(max-width: 1023px) 32vw, 24vw',
    from: 'right',
    delay: 0.38,
    depth: 15,
    focus: 'center 30%',
    drift: true,
  },
};

// The copy block is a grid child like any tile, so the hole in the wall is a
// real cell rather than an absolutely positioned overlay guessing at a gap.
export const COPY_PLACE =
  'col-span-6 sm:col-span-12 lg:col-start-4 lg:col-end-10 lg:row-start-2 lg:row-end-5';

/**
 * One image is fetched eagerly and preloaded in index.html. It is the tallest
 * tile that is visible at every breakpoint, which makes it the likeliest
 * largest-contentful paint.
 */
export const LCP_IMAGE = 'neon-couple-portrait';

export const HERO_TILES = HERO_IMAGES.map((name) => {
  const cfg = LAYOUT[name];
  if (!cfg) {
    throw new Error(
      `[heroTiles] "${name}" is in HERO_IMAGES but has no cell. Add it to LAYOUT or remove it from HERO_IMAGES.`
    );
  }
  return { name, priority: name === LCP_IMAGE, ...cfg };
});

export default HERO_TILES;
