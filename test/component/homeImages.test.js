import manifest from '@/components/Home/shared/imageManifest.json';
import {
  getImage,
  ALT_TEXT,
  HERO_IMAGES,
  ABOUT_IMAGES,
  RAIL_IMAGES,
  MOSAIC_IMAGES,
} from '@/components/Home/shared/homeImages';

const GROUPS = {
  HERO_IMAGES,
  ABOUT_IMAGES,
  RAIL_IMAGES,
  MOSAIC_IMAGES,
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
    Object.entries(ALT_TEXT).forEach(([, alt]) => {
      expect(alt).not.toMatch(/^(image|photo|church image)\s*\d*$/i);
      expect(alt.trim().length).toBeGreaterThan(10);
    });
  });

  test('group sizes match the spec', () => {
    expect(HERO_IMAGES).toHaveLength(10);
    expect(ABOUT_IMAGES).toHaveLength(12);
    expect(RAIL_IMAGES).toHaveLength(11);
    expect(MOSAIC_IMAGES).toHaveLength(9);
  });

  test('the low-res and duplicate images are never used in any group', () => {
    const used = new Set(Object.values(GROUPS).flat());
    UNUSED.forEach((name) => expect(used.has(name)).toBe(false));
  });

  test('no photograph is repeated across a section join', () => {
    // Hero sits directly above About, and the mosaic directly below the events
    // list that follows the rail. A face shown twice across either join reads
    // as a mistake rather than as a motif.
    expect(HERO_IMAGES.filter((n) => ABOUT_IMAGES.includes(n))).toEqual([]);
    expect(HERO_IMAGES.filter((n) => RAIL_IMAGES.includes(n))).toEqual([]);
    expect(HERO_IMAGES.filter((n) => MOSAIC_IMAGES.includes(n))).toEqual([]);
  });

  test('every usable image appears in at least one group', () => {
    const used = new Set(Object.values(GROUPS).flat());
    const orphans = Object.keys(manifest).filter(
      (name) => !used.has(name) && !UNUSED.includes(name)
    );
    expect(orphans).toEqual([]);
  });
});
