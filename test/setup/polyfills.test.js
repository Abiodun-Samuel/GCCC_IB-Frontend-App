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
