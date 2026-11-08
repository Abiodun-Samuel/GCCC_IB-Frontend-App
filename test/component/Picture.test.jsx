import { render, screen } from '@testing-library/react';
import Picture from '@/components/Home/shared/Picture';

describe('Picture', () => {
  test('renders avif and webp sources plus a jpg fallback', () => {
    const { container } = render(<Picture name="neon-trio-joy" sizes="100vw" />);

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
    const { container } = render(<Picture name="worship-lead" sizes="100vw" alt="" />);
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
