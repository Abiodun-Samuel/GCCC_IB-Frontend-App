import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { BRAND } from '@/components/common/AnimatedBackground';
import { SECTION_SPACING } from '@/utils/constant';
import Picture from '@/components/Home/shared/Picture';
import Reveal from '@/components/Home/shared/Reveal';
import { MOSAIC_IMAGES, getImage } from '@/components/Home/shared/homeImages';
import { toColumns } from './mosaicLayout';
import Lightbox from './Lightbox';

const IMAGES = MOSAIC_IMAGES.map(getImage);
const MOSAIC_SIZES = '(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 31vw';

const useColumnCount = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const mqSm = window.matchMedia('(max-width: 639px)');
    const mqMd = window.matchMedia('(min-width: 640px) and (max-width: 1023px)');
    const update = () => setCount(mqSm.matches ? 1 : mqMd.matches ? 2 : 3);
    update();
    mqSm.addEventListener('change', update);
    mqMd.addEventListener('change', update);
    return () => {
      mqSm.removeEventListener('change', update);
      mqMd.removeEventListener('change', update);
    };
  }, []);

  return count;
};

const Tile = memo(({ image, index, ratio, order, show, reduced, onOpen, registerRef }) => (
  <motion.div
    initial={{ opacity: 0, y: reduced ? 0 : 22 }}
    animate={show ? { opacity: 1, y: 0 } : undefined}
    transition={{
      duration: reduced ? 0.22 : 0.6,
      delay: reduced ? 0 : order * 0.06,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    <button
      type="button"
      ref={registerRef}
      onClick={() => onOpen(index)}
      aria-label={image.alt}
      className="group relative block w-full overflow-hidden bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0998d5] dark:bg-gray-900"
      style={{ aspectRatio: ratio }}
    >
      <Picture
        name={image.name}
        alt=""
        sizes={MOSAIC_SIZES}
        className="block h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
        imgStyle={{ objectPosition: 'center 32%' }}
      />

      {/* Scrim only on hover — at rest the photograph is untouched. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-4 -translate-y-2 text-[11px] font-black tabular-nums tracking-widest text-white opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-3 p-4 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <span className="line-clamp-2 text-[11px] leading-snug text-white/90">{image.alt}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <ArrowUpRight size={14} className="text-white" />
        </span>
      </span>
    </button>
  </motion.div>
));
Tile.displayName = 'Mosaic.Tile';

/**
 * The Mosaic.
 *
 * Columns are equal height by construction (see mosaicLayout) and stay locked to
 * each other:
 *
 *  - ONE reveal trigger for the whole grid, not one per tile. Per-tile observers
 *    let some tiles land while their neighbours were still hidden, so columns
 *    filled to different depths and the grid read as broken.
 *  - No per-column parallax drift. Offsetting each column by a different amount
 *    is, by definition, misalignment; it fought the equal-height work rather
 *    than adding to it.
 *
 * The interest comes from the varied frame shapes and the hover treatment.
 */
const GalleryMosaic = () => {
  const gridRef = useRef(null);
  const reduced = useReducedMotion();
  const columnCount = useColumnCount();

  // Single trigger. `amount: 0.1` fires as soon as a tenth of the grid is on
  // screen, so the stagger plays as the section arrives rather than after it.
  const show = useInView(gridRef, { once: true, amount: 0.1 });

  const [openIndex, setOpenIndex] = useState(null);
  const triggersRef = useRef([]);

  const registerRef = useCallback((index, el) => {
    triggersRef.current[index] = el;
  }, []);

  const handleOpen = useCallback((index) => setOpenIndex(index), []);
  const handleNavigate = useCallback((index) => setOpenIndex(index), []);

  // Return focus to the tile that opened the viewer, or keyboard users are
  // dropped back at the top of the document.
  const handleClose = useCallback(() => {
    const returnTo = triggersRef.current[openIndex];
    setOpenIndex(null);
    returnTo?.focus();
  }, [openIndex]);

  const columns = toColumns(IMAGES, columnCount);
  const shown = columns.reduce((n, c) => n + c.length, 0);

  return (
    <section
      aria-label="Church photo gallery"
      className={`relative w-full overflow-hidden bg-white ${SECTION_SPACING} dark:bg-gray-950`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 15% 10%, rgba(255,183,77,0.12) 0%, transparent 62%), radial-gradient(ellipse 55% 45% at 90% 85%, rgba(9,152,213,0.09) 0%, transparent 62%)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-14 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-0.5 w-5 shrink-0 rounded-full" style={{ background: BRAND }} />
              <span
                className="text-[10px] font-black uppercase tracking-[0.24em]"
                style={{ color: BRAND }}
              >
                In Pictures
              </span>
            </div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
              Every Face, <span style={{ color: BRAND }}>Every Story</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex items-center gap-4">
            <span className="text-[11px] font-black tabular-nums tracking-widest text-gray-400">
              {String(shown).padStart(2, '0')} PHOTOGRAPHS
            </span>
            <span className="hidden h-px w-16 bg-gray-200 sm:block dark:bg-gray-800" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Select any to enlarge</span>
          </Reveal>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {columns.map((entries, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {entries.map(({ item, index, ratio }, i) => (
                <Tile
                  key={item.name}
                  image={item}
                  index={index}
                  ratio={ratio}
                  // Stagger reads across the grid, not down one column.
                  order={i * columnCount + ci}
                  show={show}
                  reduced={reduced}
                  onOpen={handleOpen}
                  registerRef={(el) => registerRef(index, el)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={MOSAIC_IMAGES}
            index={openIndex}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(GalleryMosaic);
