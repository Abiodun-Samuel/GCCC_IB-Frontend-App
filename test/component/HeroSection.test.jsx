import { readFileSync } from 'node:fs';
import { fireEvent, screen } from '@testing-library/react';
import { render, setMatchMediaQueries, setMatchMediaReducedMotion } from '../test-utils';
import HeroSection from '@/components/Home/hero/HeroSection';
import { COPY_PLACE, HERO_TILES, LCP_IMAGE } from '@/components/Home/hero/heroTiles';
import { ABOUT_IMAGES, HERO_IMAGES } from '@/components/Home/shared/homeImages';

// Only the tiles carry lg:aspect-auto, so this picks the ten photo frames and
// never the copy cell, which shares the lg:col-start-* shape.
const tilesOf = (container) => [...container.querySelectorAll('div[class*="lg:aspect-auto"]')];

describe('HeroSection', () => {
  afterEach(() => {
    setMatchMediaReducedMotion(false);
    setMatchMediaQueries([]);
  });

  test('renders a single level-1 heading with real spaces between the words', () => {
    render(<HeroSection />);
    const h1 = screen.getByRole('heading', { level: 1 });
    // Asserts the raw text, not a whitespace-normalised copy: a normalised
    // assertion passes even when the words have run together in the DOM.
    expect(h1.textContent).toContain('Where God Meets');
    expect(h1.textContent).toContain('With His People');
  });

  test('keeps the #hero anchor', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('section#hero')).toBeInTheDocument();
  });

  test('renders every photograph in the wall', () => {
    const { container } = render(<HeroSection />);
    expect(HERO_IMAGES).toHaveLength(10);
    expect(container.querySelectorAll('picture')).toHaveLength(HERO_IMAGES.length);
  });

  test('keeps top padding small, since the fixed header already spaces the page', () => {
    const { container } = render(<HeroSection />);
    const classes = container.querySelector('section#hero').className.split(' ');
    const topPad = classes
      .filter((c) => c.startsWith('pt-'))
      .map((c) => Number(c.slice(3)))
      .filter((n) => !Number.isNaN(n));
    expect(topPad.length).toBeGreaterThan(0);
    expect(Math.max(...topPad)).toBeLessThanOrEqual(12);
  });

  test('the badge and both buttons are borderless', () => {
    const { container } = render(<HeroSection />);
    const chrome = [
      ...container.querySelectorAll('a'),
      container.querySelector('[data-testid="hero-badge"]'),
    ].filter(Boolean);
    expect(chrome.length).toBeGreaterThan(0);
    chrome.forEach((el) => {
      expect(el.className).not.toMatch(/(^|\s)border($|\s)/);
      expect(el.className).not.toMatch(/(^|\s)border-\d/);
    });
  });

  test('exactly one image is prioritised, and it is the one index.html preloads', () => {
    const { container } = render(<HeroSection />);
    const eager = container.querySelectorAll('img[loading="eager"]');
    expect(eager).toHaveLength(1);
    expect(eager[0]).toHaveAttribute('fetchpriority', 'high');
    expect(eager[0].getAttribute('src')).toContain(LCP_IMAGE);
  });

  test('every hero image carries descriptive alt text', () => {
    const { container } = render(<HeroSection />);
    const imgs = [...container.querySelectorAll('img')];
    expect(imgs).toHaveLength(HERO_IMAGES.length);
    imgs.forEach((img) => {
      expect(img.getAttribute('alt').length).toBeGreaterThan(10);
    });
  });

  test('the headline is not inside a fixed-height or clipping box', () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section#hero');
    // Stops at the section. The section itself clips on purpose — it contains
    // the blurred backdrop and the pointer parallax, and it is an order of
    // magnitude larger than the headline. Everything between it and the h1 is
    // sized by its content, so the copy cannot be cropped at any width.
    let node = container.querySelector('h1').parentElement;
    while (node && node !== section) {
      expect(node.style?.height ?? '').not.toMatch(/px|vh/);
      expect(node.className).not.toMatch(/(^|\s)overflow-hidden($|\s)/);
      node = node.parentElement;
    }
    expect(node).toBe(section);
  });

  test('renders the primary call to action as a link', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: /join our community/i })).toBeInTheDocument();
  });

  test('a pointer move cannot pull the stacked tiles out of line', () => {
    // Below lg the tiles sit edge to edge, so any per-tile displacement is
    // misalignment. A tap on a touch screen fires a synthetic mousemove with no
    // mouseleave to undo it, which is exactly how this regressed: every frame
    // ended up offset by its own parallax depth and stayed there.
    //
    // The assertion is that the tiles are not transform-driven AT ALL here, not
    // that the offsets happen to be zero. jsdom reports a zero-sized rect, so a
    // test that only compared offsets would pass even with the gate removed —
    // the handler would bail before writing anything.
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section#hero');
    section.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1440, height: 800 });

    fireEvent.mouseMove(section, { clientX: 1400, clientY: 700 });

    const tiles = tilesOf(container);
    expect(tiles).toHaveLength(HERO_IMAGES.length);
    tiles.forEach((tile) => {
      expect(tile.getAttribute('style') ?? '').not.toMatch(/transform/);
    });
  });

  test('a tap does not leave the wall dimmed on a touch screen', () => {
    // onMouseEnter fires on tap; onMouseLeave never does. Without a real mouse
    // the neighbours must stay at full opacity regardless.
    const { container } = render(<HeroSection />);
    const tiles = tilesOf(container);

    fireEvent.mouseEnter(tiles[0].firstElementChild);

    tiles.forEach((tile) => {
      const opacity = tile.firstElementChild.style.opacity;
      expect(opacity === '' || opacity === '1').toBe(true);
    });
  });

  test('the wall does lean once there is a real mouse on the wide layout', () => {
    // The other half of the pair. Without this, deleting the lean outright would
    // satisfy the alignment test above and quietly remove the effect.
    setMatchMediaQueries(['min-width: 1024px', 'hover: hover']);
    const { container } = render(<HeroSection />);

    tilesOf(container).forEach((tile) => {
      expect(tile.getAttribute('style') ?? '').toMatch(/transform/);
    });
  });

  test('still renders fully under reduced motion', () => {
    setMatchMediaReducedMotion(true);
    const { container } = render(<HeroSection />);
    expect(container.querySelectorAll('picture')).toHaveLength(HERO_IMAGES.length);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});

describe('hero wall layout', () => {
  const COLUMNS = 12;
  const ROWS = 5;

  // Placement lives in Tailwind class strings, so the test reads what the
  // browser reads rather than a parallel description of it.
  const parse = (classes) => {
    const at = (key) => {
      const found = classes.match(new RegExp(`lg:${key}-(\\d+)(?:\\s|$)`));
      return found ? Number(found[1]) : null;
    };
    return {
      colStart: at('col-start'),
      colEnd: at('col-end'),
      rowStart: at('row-start'),
      rowEnd: at('row-end'),
    };
  };

  const placements = [
    { name: 'copy', ...parse(COPY_PLACE) },
    ...HERO_TILES.map((t) => ({ name: t.name, ...parse(t.place) })),
  ];

  test('every tile declares a complete cell', () => {
    placements.forEach((p) => {
      expect(p.colStart).toBeGreaterThanOrEqual(1);
      expect(p.rowStart).toBeGreaterThanOrEqual(1);
      expect(p.colEnd).toBeGreaterThan(p.colStart);
      expect(p.rowEnd).toBeGreaterThan(p.rowStart);
      expect(p.colEnd).toBeLessThanOrEqual(COLUMNS + 1);
      expect(p.rowEnd).toBeLessThanOrEqual(ROWS + 1);
    });
  });

  test('the wall tiles the grid exactly: no gap, no overlap', () => {
    // A gap shows as a hole in the composition; an overlap hides a photograph
    // behind another. Both are invisible in a unit test unless counted.
    const cells = new Map();
    placements.forEach((p) => {
      for (let row = p.rowStart; row < p.rowEnd; row += 1) {
        for (let col = p.colStart; col < p.colEnd; col += 1) {
          const key = `${row}:${col}`;
          cells.set(key, [...(cells.get(key) ?? []), p.name]);
        }
      }
    });

    const uncovered = [];
    const doubled = [];
    for (let row = 1; row <= ROWS; row += 1) {
      for (let col = 1; col <= COLUMNS; col += 1) {
        const owners = cells.get(`${row}:${col}`) ?? [];
        if (owners.length === 0) uncovered.push(`${row}:${col}`);
        if (owners.length > 1) doubled.push(`${row}:${col} -> ${owners.join(' + ')}`);
      }
    }

    expect(uncovered).toEqual([]);
    expect(doubled).toEqual([]);
    expect(cells.size).toBe(ROWS * COLUMNS);
  });

  test('the headline cell is surrounded by photographs on all four sides', () => {
    const copy = placements.find((p) => p.name === 'copy');
    expect(copy.rowStart).toBeGreaterThan(1);
    expect(copy.rowEnd).toBeLessThan(ROWS + 1);
    expect(copy.colStart).toBeGreaterThan(1);
    expect(copy.colEnd).toBeLessThan(COLUMNS + 1);
  });

  test('tiles that share an edge share a parallax depth', () => {
    // Two neighbours displaced by different amounts pull their shared edge
    // apart. Grouping by depth keeps each flank and each band rigid.
    const depthOf = (name) => HERO_TILES.find((t) => t.name === name).depth;
    const groups = [
      ['magenta-trio-smile', 'neon-couple-portrait'],
      ['neon-duo-portrait', 'congregation-full'],
      ['magenta-youth-group', 'neon-celebrate', 'neon-black-tee-portrait'],
      ['neon-sisters-portrait', 'magenta-pastor-trio', 'magenta-children'],
    ];
    groups.forEach((group) => {
      expect(new Set(group.map(depthOf)).size).toBe(1);
    });
  });

  test('the lean cannot make a gutter breathe by more than a third of itself', () => {
    // Pointer travel is normalised to -0.5..0.5, so two tiles at different
    // depths change their separation by half the difference. The gutter is 10px
    // at lg; anything approaching that would read as the grid coming apart.
    const depths = HERO_TILES.map((t) => t.depth);
    const spread = (Math.max(...depths) - Math.min(...depths)) / 2;
    expect(spread).toBeLessThanOrEqual(10 / 3);
  });

  test('the hero and about sections share no photograph', () => {
    // They sit back to back. The same face twice across the join reads as a bug.
    const shared = HERO_IMAGES.filter((name) => ABOUT_IMAGES.includes(name));
    expect(shared).toEqual([]);
  });

  test('index.html preloads the prioritised tile at the width it will be used', () => {
    const html = readFileSync('index.html', 'utf8');
    const tile = HERO_TILES.find((t) => t.name === LCP_IMAGE);

    expect(tile).toBeDefined();
    expect(tile.priority).toBe(true);
    expect(HERO_TILES.filter((t) => t.priority)).toHaveLength(1);
    expect(html).toContain(`/images/home/${LCP_IMAGE}-480.avif`);
    // A mismatched `imagesizes` makes the browser preload one width and then
    // fetch a second copy at another — worse than not preloading at all.
    expect(html).toContain(`imagesizes="${tile.sizes}"`);
  });
});
