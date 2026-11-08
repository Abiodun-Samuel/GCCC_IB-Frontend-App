import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import HeroCopy from './HeroCopy';
import HeroTile from './HeroTile';
import { HERO_TILES } from './heroTiles';

// Fine paper grain. Inline so it costs no request and cannot 404.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const POINTER_SPRING = { stiffness: 55, damping: 18, mass: 0.7 };

/**
 * The ground the wall stands on.
 *
 * It is white, because the section below this one is white. Every tint here is
 * concentrated behind the hole in the wall — where the headline sits and where
 * the background is actually visible — and clears to pure white by the bottom
 * edge, so there is no seam where the hero ends and About begins.
 */
const HeroBackdrop = memo(() => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-white dark:bg-gray-950" />

    {/* Brand glow behind the portal, so the headline reads off a lit surface
        rather than off flat paper. The white core goes on top of the tint: with
        the tint alone the hole in the wall read as grey rather than as light. */}
    <div
      className="absolute left-1/2 top-[42%] h-[720px] w-[1180px] -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(9,152,213,0.18) 0%, rgba(9,152,213,0.07) 44%, transparent 72%)',
        filter: 'blur(28px)',
      }}
    />
    <div
      className="absolute left-1/2 top-[44%] h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 46%, transparent 76%)',
      }}
    />

    {/* Warm bloom along the top, picking up the amber neon in the photographs. */}
    <div
      className="absolute inset-x-0 top-0 h-[40%]"
      style={{
        background:
          'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,196,122,0.26) 0%, rgba(255,214,163,0.09) 46%, transparent 74%)',
      }}
    />

    {/* Cool counterweights, kept off-canvas so only their falloff shows. */}
    <div
      className="absolute -left-56 top-[18%] h-[620px] w-[620px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(9,152,213,0.16) 0%, transparent 68%)',
        filter: 'blur(90px)',
      }}
    />
    <div
      className="absolute -right-56 top-[8%] h-[580px] w-[580px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(56,160,205,0.14) 0%, transparent 68%)',
        filter: 'blur(90px)',
      }}
    />

    {/* Architectural grid, masked to the portal so it reads as a surface behind
        the photographs rather than as a texture over the whole page. */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(11,63,92,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,63,92,0.07) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage:
          'radial-gradient(ellipse 64% 56% at 50% 44%, #000 18%, rgba(0,0,0,0.35) 58%, transparent 84%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 64% 56% at 50% 44%, #000 18%, rgba(0,0,0,0.35) 58%, transparent 84%)',
      }}
    />

    <div
      className="absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen"
      style={{ backgroundImage: GRAIN }}
    />

    {/* The join. Everything above clears to the exact colour AboutSection
        starts on, so the two sections read as one continuous surface. */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
  </div>
));
HeroBackdrop.displayName = 'Hero.Backdrop';

/**
 * What this device and this layout can actually support.
 *
 * `wide` is the portal layout at lg. `hoverCapable` is a real mouse.
 *
 * Neither is a nicety. A tap on a touch screen fires a synthetic mousemove, and
 * no mouseleave follows it, so the wall would lean once and stay leaning — every
 * tile displaced by its own depth, permanently. Below lg the tiles sit edge to
 * edge in a stacked mosaic, where displacing each one by a different amount is
 * not parallax, it is misalignment: measured on a 500px capture, the tiles' left
 * edges went from a uniform 12px to 17, 18, 23 and 24px, and the 8px gaps
 * closed to 5.
 *
 * This is the same rule the mosaic already follows. Motion that moves neighbours
 * by different amounts belongs only where they do not share an edge.
 */
const WIDE_QUERY = '(min-width: 1024px)';
const FINE_QUERY = '(hover: hover) and (pointer: fine)';

const readCapability = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return { wide: false, hoverCapable: false };
  }
  return {
    wide: window.matchMedia(WIDE_QUERY).matches,
    hoverCapable: window.matchMedia(FINE_QUERY).matches,
  };
};

const usePointerCapability = () => {
  // Read on the first render, not in an effect. Turning the lean on afterwards
  // means handing framer-motion a `style` prop that appears out of nowhere on an
  // update, and it does not pick the transform up — the lean would be silently
  // dead on desktop while every test still passed.
  const [caps, setCaps] = useState(readCapability);

  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY);
    const fine = window.matchMedia(FINE_QUERY);
    const update = () => setCaps(readCapability());
    // Catches a resize between the first render and this effect.
    update();
    wide.addEventListener('change', update);
    fine.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      fine.removeEventListener('change', update);
    };
  }, []);

  return caps;
};

/**
 * Hero.
 *
 * Ten photographs form a wall with a rectangle of negative space in the middle,
 * and the headline lives in that space. There is nothing to slide through and
 * nothing to wait for — the whole composition is present on first paint.
 *
 * Movement comes from four places, none of which changes the layout: the frames
 * uncover from the outside in, the four largest drift slowly, the wall leans
 * toward the pointer with per-frame depth, and the whole thing dissolves into
 * white as the page scrolls into About.
 *
 * The last two are desktop-only, and deliberately so — see usePointerCapability.
 * The lean displaces each tile differently, which only reads as depth in the
 * portal layout; and the dissolve only lands on a hero that is roughly one
 * viewport tall. On a phone the wall is a tall stack, so fading it out would
 * dim photographs that are still on screen.
 *
 * The site header is fixed and renders its own h-20 spacer, so top padding here
 * stays small; stacking a large one on top of that spacer is what previously
 * pushed the composition below the fold.
 */
const HeroSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const { wide, hoverCapable } = usePointerCapability();

  const parallax = wide && hoverCapable && !reduced;
  const dissolving = wide && !reduced;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, POINTER_SPRING);
  const pointerY = useSpring(rawY, POINTER_SPRING);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const dissolve = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.12]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!parallax) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      // Normalised to -0.5..0.5, so a tile's `depth` is its full travel in px
      // from one edge of the section to the other.
      rawX.set((event.clientX - rect.left) / rect.width - 0.5);
      rawY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY, parallax]
  );

  const handlePointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(null);
  }, [rawX, rawY]);

  const handleScrollToContact = useCallback(
    (event) => {
      const el = document.getElementById('contact');
      if (!el) return;
      event.preventDefault();
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', '/#contact');
    },
    [reduced]
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative w-full overflow-hidden bg-white pt-4 pb-16 sm:pb-20 lg:pt-6 lg:pb-14 dark:bg-gray-950"
    >
      <HeroBackdrop />

      <motion.div
        className="relative z-10 px-3 sm:px-4"
        style={dissolving ? { opacity: dissolve, y: lift } : undefined}
      >
        <div
          className="grid grid-cols-6 gap-2 sm:gap-2.5 lg:h-[calc(100svh-11rem)] lg:max-h-[54rem] lg:min-h-[34rem] lg:grid-cols-12 lg:grid-rows-5"
        >
          <HeroCopy reduced={reduced} onScrollToContact={handleScrollToContact} />

          {HERO_TILES.map((tile, index) => (
            <HeroTile
              key={tile.name}
              tile={tile}
              pointerX={pointerX}
              pointerY={pointerY}
              reduced={reduced}
              parallax={parallax}
              index={index}
              // Gated on a real mouse: a tap sets `hovered` and nothing ever
              // clears it, which would leave nine tiles dimmed for good.
              dim={hoverCapable && hovered !== null && hovered !== index}
              onHover={setHovered}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(HeroSection);
