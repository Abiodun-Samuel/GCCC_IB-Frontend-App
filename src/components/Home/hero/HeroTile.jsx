import { memo } from 'react';
import { motion, useTransform } from 'framer-motion';
import Picture from '@/components/Home/shared/Picture';
import { EASE_OUT } from '@/components/Home/shared/motion';

// Each frame is uncovered from the edge of the wall it sits on, so the
// composition assembles inward rather than all nine popping at once.
const CLIP_FROM = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
};
const CLIP_OPEN = 'inset(0% 0% 0% 0%)';

/**
 * One photograph in the wall.
 *
 * `lg:aspect-auto` is not decoration. Below `lg` the tile carries its own
 * aspect ratio because the grid rows are automatic; at `lg` the row height is
 * the authority and a leftover aspect ratio would fight it, leaving the frame
 * short of its cell.
 */
const HeroTile = ({ tile, index, pointerX, pointerY, reduced, parallax, dim, onHover }) => {
  // A single pair of pointer values drives all ten tiles. Depth varies per tile
  // so the outer frames travel further than the inner ones and the wall reads
  // as having thickness — but only on the layout composed for it. See
  // HeroSection's usePointerCapability for why this is off everywhere else.
  const depth = parallax ? tile.depth : 0;
  const x = useTransform(pointerX, (v) => v * depth);
  const y = useTransform(pointerY, (v) => v * depth * 0.55);

  return (
    <motion.div
      className={`${tile.flow} ${tile.place} lg:aspect-auto lg:h-full`}
      // No transform at all when the lean is off, rather than a transform that
      // happens to resolve to zero: a translate on ten stacked tiles is ten
      // chances for a sub-pixel seam along edges that are meant to be flush.
      style={parallax ? { x, y } : undefined}
      initial={{ clipPath: CLIP_FROM[tile.from], opacity: reduced ? 0 : 1 }}
      animate={{ clipPath: CLIP_OPEN, opacity: 1 }}
      transition={{
        duration: reduced ? 0.3 : 1.05,
        delay: reduced ? 0 : tile.delay,
        ease: EASE_OUT,
      }}
    >
      <motion.div
        className="group/tile relative h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
        animate={{ opacity: dim ? 0.38 : 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Ken burns on the four large frames only. On the small ones the same
            drift is invisible and still costs a composited layer every frame.
            It scales the photograph inside the frame, never the frame. */}
        <motion.div
          className="h-full w-full"
          animate={tile.drift && !reduced ? { scale: [1, 1.07, 1] } : undefined}
          transition={
            tile.drift && !reduced
              ? { duration: 26, repeat: Infinity, ease: 'easeInOut', delay: tile.delay * 4 }
              : undefined
          }
        >
          <Picture
            name={tile.name}
            sizes={tile.sizes}
            priority={tile.priority}
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/tile:scale-[1.06]"
            imgStyle={{ objectPosition: tile.focus }}
          />
        </motion.div>

        {/* At rest the photograph carries a faint cool wash so ten of them read
            as one surface; hover clears it and the frame returns to full
            colour. Tailwind compiles group-hover inside @media (hover: hover),
            so both of these are inert on a touch screen. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#0b3f5c]/[0.07] transition-opacity duration-500 group-hover/tile:opacity-0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
        />
      </motion.div>
    </motion.div>
  );
};

export default memo(HeroTile);
