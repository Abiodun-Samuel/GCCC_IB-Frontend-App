import { memo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useReducedMotion } from 'framer-motion';

import { BRAND } from '@/components/common/AnimatedBackground';
import Reveal from '@/components/Home/shared/Reveal';
import Picture from '@/components/Home/shared/Picture';
import { RAIL_IMAGES, getImage } from '@/components/Home/shared/homeImages';

const IMAGES = RAIL_IMAGES.map(getImage);

// Two ribbons travelling in opposite directions. The counter-motion is what makes
// the band read as a single moving surface rather than two independent sliders.
const ROW_ONE = IMAGES.slice(0, 6);
const ROW_TWO = IMAGES.slice(6);

const RAIL_SIZES = '(max-width: 767px) 60vw, 30vw';

/**
 * One frame. Height is fixed per row and width follows the true aspect ratio, so
 * portraits and landscapes alternate naturally and nothing is cropped to a
 * uniform box.
 */
const Frame = memo(({ image, dimmed, onEnter, onLeave }) => {
  const ratio = image.width / image.height;

  return (
    <figure
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative mx-1.5 h-[190px] shrink-0 overflow-hidden rounded-sm bg-gray-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:h-[240px] lg:h-[300px]"
      style={{
        width: `calc(var(--rail-h) * ${ratio})`,
        opacity: dimmed ? 0.42 : 1,
        transform: dimmed ? 'scale(0.97)' : 'scale(1)',
      }}
    >
      <Picture
        name={image.name}
        sizes={RAIL_SIZES}
        className="block h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
      />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/75 to-transparent p-4 opacity-0 transition-[opacity,transform] duration-400 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <p className="line-clamp-2 text-[11px] leading-snug text-white/90">{image.alt}</p>
      </figcaption>
    </figure>
  );
});
Frame.displayName = 'Rail.Frame';

const Ribbon = memo(({ images, direction, speed, play, hovered, setHovered, rowKey }) => (
  <Marquee
    direction={direction}
    speed={speed}
    play={play}
    pauseOnHover
    gradient={false}
    autoFill
    className="[--rail-h:190px] sm:[--rail-h:240px] lg:[--rail-h:300px]"
  >
    {images.map((image, i) => {
      const id = `${rowKey}-${image.name}-${i}`;
      return (
        <Frame
          key={id}
          image={image}
          dimmed={hovered !== null && hovered !== id}
          onEnter={() => setHovered(id)}
          onLeave={() => setHovered(null)}
        />
      );
    })}
  </Marquee>
));
Ribbon.displayName = 'Rail.Ribbon';

/**
 * The Rail — a continuously drifting band of photographs.
 *
 * Deliberately NOT scroll-linked. The previous version pinned a sticky viewport
 * and mapped page scroll onto translateX, which left a tall empty section
 * whenever the measured travel distance did not match the section height. A
 * self-driving marquee has no such coupling: there is nothing to mis-measure and
 * no empty screen is possible.
 *
 * Under prefers-reduced-motion the ribbons stop and become plain horizontal
 * scrollers, still fully browsable by touch and keyboard.
 */
const GalleryRail = () => {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  return (
    <section
      id="gallery"
      aria-label="Photographs from the life of the church"
      className="relative w-full overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-28 dark:bg-gray-950"
    >
      {/* Warm wash — the photographs are amber and magenta, so a neutral grey
          ground makes them read as cold. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,183,77,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(9,152,213,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="container relative z-10 mx-auto mb-12 px-4 sm:mb-14">
        <Reveal className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-0.5 w-5 shrink-0 rounded-full" style={{ background: BRAND }} />
            <span
              className="text-[10px] font-black uppercase tracking-[0.24em]"
              style={{ color: BRAND }}
            >
              In Motion
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            A Year Together,{' '}
            <span style={{ color: BRAND }}>Frame by Frame</span>
          </h2>
        </Reveal>
      </div>

      {/* Full-bleed: the ribbons run edge to edge, outside the container. */}
      <div
        className={
          reduced ? 'flex flex-col gap-3 overflow-x-auto pb-2' : 'flex flex-col gap-3'
        }
      >
        <Ribbon
          rowKey="a"
          images={ROW_ONE}
          direction="left"
          speed={34}
          play={!reduced}
          hovered={hovered}
          setHovered={setHovered}
        />
        <Ribbon
          rowKey="b"
          images={ROW_TWO}
          direction="right"
          speed={26}
          play={!reduced}
          hovered={hovered}
          setHovered={setHovered}
        />
      </div>
    </section>
  );
};

export default memo(GalleryRail);
