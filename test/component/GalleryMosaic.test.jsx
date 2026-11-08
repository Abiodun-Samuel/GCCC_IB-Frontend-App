import { screen, waitFor } from '@testing-library/react';
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

    // AnimatePresence keeps the dialog mounted through its exit animation, so
    // wait for the unmount rather than asserting on the same tick.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
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

describe('mosaic column layout', () => {
  const { PATTERNS, ratioHeight, toColumns } = jest.requireActual(
    '@/components/Home/gallery/mosaicLayout'
  );

  const columnHeight = (ratios) => ratios.reduce((sum, r) => sum + ratioHeight(r), 0);

  test.each([1, 2, 3])('at %i columns every column is the same height', (count) => {
    const heights = PATTERNS[count].map(columnHeight);
    heights.forEach((h) => expect(h).toBeCloseTo(heights[0], 6));
  });

  test('each column carries the same multiset of frame shapes', () => {
    Object.values(PATTERNS).forEach((pattern) => {
      const sorted = pattern.map((col) => [...col].sort().join('|'));
      sorted.forEach((s) => expect(s).toBe(sorted[0]));
    });
  });

  test('frame shape comes from position, not from the photograph', () => {
    const tall = { name: 'a', width: 1440, height: 1919 };
    const wide = { name: 'b', width: 1440, height: 960 };

    // Same slot, wildly different source images -> identical frame.
    const withTallFirst = toColumns([tall, wide, wide, wide, wide, wide, wide, wide, wide], 3);
    const withWideFirst = toColumns([wide, wide, wide, wide, wide, wide, wide, wide, wide], 3);

    expect(withTallFirst[0][0].ratio).toBe(withWideFirst[0][0].ratio);
  });

  test('no column is left short of its pattern', () => {
    [1, 2, 3].forEach((count) => {
      const items = Array.from({ length: 9 }, (_, i) => ({ name: `img-${i}` }));
      const cols = toColumns(items, count);
      cols.forEach((col, ci) => expect(col).toHaveLength(PATTERNS[count][ci].length));
    });
  });
});
