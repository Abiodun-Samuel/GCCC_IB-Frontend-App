import { render, setMatchMediaReducedMotion } from '../test-utils';
import GalleryRail from '@/components/Home/gallery/GalleryRail';
import { RAIL_IMAGES } from '@/components/Home/shared/homeImages';

describe('GalleryRail', () => {
  afterEach(() => setMatchMediaReducedMotion(false));

  test('renders every rail image at least once', () => {
    const { container } = render(<GalleryRail />);
    const srcs = [...container.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    RAIL_IMAGES.forEach((name) => {
      expect(srcs.some((s) => s.includes(name))).toBe(true);
    });
  });

  test('the section is labelled for screen readers', () => {
    const { container } = render(<GalleryRail />);
    expect(container.querySelector('section')).toHaveAttribute('aria-label');
  });

  test('uses a light background, not the dark page ground', () => {
    const { container } = render(<GalleryRail />);
    const section = container.querySelector('section');
    expect(section.className).toMatch(/bg-gray-50/);
    expect(section.getAttribute('style') || '').not.toMatch(/#020c16/);
  });

  test('every frame carries descriptive alt text', () => {
    const { container } = render(<GalleryRail />);
    container.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('alt').length).toBeGreaterThan(10);
    });
  });

  test('renders all images under reduced motion too', () => {
    setMatchMediaReducedMotion(true);
    const { container } = render(<GalleryRail />);
    const srcs = [...container.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    RAIL_IMAGES.forEach((name) => {
      expect(srcs.some((s) => s.includes(name))).toBe(true);
    });
  });

  test('has no fixed pixel section height, so it cannot leave an empty screen', () => {
    const { container } = render(<GalleryRail />);
    const style = container.querySelector('section').getAttribute('style') || '';
    expect(style).not.toMatch(/height/);
  });
});
