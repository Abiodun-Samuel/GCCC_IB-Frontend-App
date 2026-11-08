/**
 * Frame shapes, by column and position.
 *
 * Every column holds the SAME multiset of aspect ratios in a different order, so
 * all columns come out exactly the same height while no two read alike.
 *
 * Letting the photographs set their own heights is what left the grid ragged:
 * the two tall portraits happened to land in the same column, making it 66%
 * taller than its neighbour. Fixing the frame shapes by POSITION means the grid
 * stays aligned no matter which image lands where, or how the set is reordered
 * later.
 */
export const PATTERNS = {
  3: [
    ['3 / 4', '3 / 2', '1 / 1'],
    ['3 / 2', '1 / 1', '3 / 4'],
    ['1 / 1', '3 / 4', '3 / 2'],
  ],
  2: [
    ['3 / 4', '3 / 2', '1 / 1', '3 / 2'],
    ['3 / 2', '1 / 1', '3 / 2', '3 / 4'],
  ],
  1: [['3 / 2', '3 / 4', '1 / 1', '3 / 2', '3 / 4', '1 / 1', '3 / 2', '3 / 4', '1 / 1']],
};

/** Relative rendered height of a frame at a fixed column width. */
export const ratioHeight = (ratio) => {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
  return h / w;
};

/**
 * Deals images round-robin into the column shapes, so the index badges read
 * across the grid rather than down it.
 *
 * Images beyond the pattern capacity are dropped rather than appended without a
 * frame — at two columns that is one photograph, which is what keeps both
 * columns even.
 */
export const toColumns = (items, count) => {
  const pattern = PATTERNS[count] ?? PATTERNS[3];
  const capacity = pattern.reduce((n, col) => n + col.length, 0);

  const cols = pattern.map(() => []);

  items.slice(0, capacity).forEach((item, i) => {
    const c = i % count;
    if (cols[c].length < pattern[c].length) {
      cols[c].push({ item, index: i, ratio: pattern[c][cols[c].length] });
    }
  });

  return cols;
};
