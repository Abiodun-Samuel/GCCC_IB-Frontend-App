/**
 * AnimatedBackground.jsx
 *
 * A composable section-level animated background layer that:
 *  - Sits absolute inside a position:relative parent section
 *  - Uses the deep-space dark canvas (#020c16) from the Footer
 *  - Replaces purple/pink particles with brand-blue (#0998d5) and
 *    complementary teal/cyan/sky shades
 *  - Adds a deterministic star field (no random() — SSR safe)
 *  - Adds slow-breathing gradient blobs in brand palette
 *  - Adds a subtle grid overlay
 *  - Respects prefers-reduced-motion
 *  - Zero runtime JS for the animations — pure CSS keyframes
 *  - Fully tree-shakeable: import only what you need
 *
 * Usage:
 *   <section className="relative overflow-hidden">
 *     <AnimatedBackground />
 *     <div className="relative z-10">...content...</div>
 *   </section>
 */

import { memo, useMemo } from 'react';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
export const PAGE_BG = '#020c16';
export const BRAND = '#0998d5';
export const BRAND_RGB = '9,152,213';

// Complementary palette (analogous blues + warm accent)
const TEAL = '#07c4b8';   // teal complement
const SKY = '#38bdf8';   // lighter sky
const CYAN = '#06b6d4';   // cyan
const COBALT = '#1d4ed8';   // deep blue anchor
const AMBER = '#f59e0b';   // warm accent (one star class only, used sparingly)

/* ─── Deterministic star field (70 stars, sin/cos seeded — no Math.random) ─── */
const STARS = Array.from({ length: 70 }, (_, i) => {
    const s = Math.sin(i * 7.31);
    const c = Math.cos(i * 5.13);
    return {
        id: i,
        size: s > 0.80 ? 2.2 : s > 0.65 ? 1.4 : 0.9,
        top: ((Math.sin(i * 3.71) * 0.5 + 0.5) * 100).toFixed(3),
        left: ((c * 0.5 + 0.5) * 100).toFixed(3),
        opacity: (Math.abs(Math.sin(i * 2.93)) * 0.50 + 0.06).toFixed(3),
        dur: (2.8 + Math.abs(Math.sin(i * 1.37)) * 5).toFixed(2),
        delay: (Math.abs(Math.cos(i * 4.71)) * 7).toFixed(2),
        // Give ~15% of stars a faint teal tint for depth
        tint: i % 7 === 0 ? TEAL : i % 11 === 0 ? SKY : '#ffffff',
    };
});

/* ─── Particles (22 positioned dots) ────────────────────────────────────────── */
/*  Using brand blues + teals only — no purple/pink                             */
const PARTICLES = [
    // [top%, left%, color, delay, size-class]
    ['12%', '9%', BRAND, '0s', 'w-2 h-2'],
    ['28%', '82%', TEAL, '2s', 'w-1.5 h-1.5'],
    ['68%', '18%', SKY, '4s', 'w-2 h-2'],
    ['55%', '88%', CYAN, '1s', 'w-1.5 h-1.5'],
    ['40%', '48%', BRAND, '3s', 'w-1 h-1'],
    ['82%', '72%', TEAL, '5s', 'w-2 h-2'],
    ['22%', '62%', SKY, '1.5s', 'w-1 h-1'],
    ['75%', '33%', CYAN, '3.5s', 'w-1.5 h-1.5'],
    ['48%', '4%', BRAND, '2.5s', 'w-1.5 h-1.5'],
    ['62%', '92%', SKY, '4.5s', 'w-1 h-1'],
    ['33%', '25%', TEAL, '0.5s', 'w-2 h-2'],
    ['90%', '50%', BRAND, '5.5s', 'w-1 h-1'],
    ['8%', '50%', CYAN, '6s', 'w-1.5 h-1.5'],
    ['50%', '70%', SKY, '2.8s', 'w-1 h-1'],
    ['18%', '38%', BRAND, '1.2s', 'w-1 h-1'],
    ['78%', '10%', TEAL, '3.8s', 'w-1.5 h-1.5'],
    ['35%', '96%', CYAN, '0.8s', 'w-1 h-1'],
    ['92%', '28%', SKY, '4.2s', 'w-2 h-2'],
    ['60%', '58%', BRAND, '6.5s', 'w-1 h-1'],
    ['15%', '75%', TEAL, '1.8s', 'w-1.5 h-1.5'],
    ['44%', '15%', SKY, '5.2s', 'w-1 h-1'],
    ['70%', '44%', CYAN, '2.2s', 'w-1 h-1'],
];

/* ─── Gradient blobs ─────────────────────────────────────────────────────────── */
const BLOBS = [
    {
        // Top-left: brand blue
        style: {
            top: '-8%', left: '10%',
            width: 560, height: 560,
            background: `radial-gradient(ellipse, rgba(${BRAND_RGB},0.18) 0%, transparent 70%)`,
            animationName: 'bg-blob-slow',
            animationDuration: '20s',
        },
    },
    {
        // Bottom-right: teal
        style: {
            bottom: '-12%', right: '6%',
            width: 640, height: 640,
            background: `radial-gradient(ellipse, rgba(7,196,184,0.13) 0%, transparent 68%)`,
            animationName: 'bg-blob-slower',
            animationDuration: '25s',
            animationDelay: '3s',
        },
    },
    {
        // Mid-left: sky / cobalt
        style: {
            top: '38%', left: '-12%',
            width: 480, height: 480,
            background: `radial-gradient(ellipse, rgba(29,78,216,0.14) 0%, rgba(${BRAND_RGB},0.06) 55%, transparent 72%)`,
            animationName: 'bg-blob-medium',
            animationDuration: '18s',
            animationDelay: '1.5s',
        },
    },
    {
        // Upper-right: cyan secondary
        style: {
            top: '5%', right: '-8%',
            width: 400, height: 400,
            background: `radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 66%)`,
            animationName: 'bg-blob-slow',
            animationDuration: '22s',
            animationDelay: '6s',
        },
    },
    {
        // Centre: very subtle brand glow to keep depth
        style: {
            top: '40%', left: '30%',
            width: 700, height: 300,
            background: `radial-gradient(ellipse, rgba(${BRAND_RGB},0.05) 0%, transparent 70%)`,
            animationName: 'bg-blob-medium',
            animationDuration: '30s',
            animationDelay: '4s',
        },
    },
];

/* ─── CSS (injected once) ─────────────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes bg-twinkle {
    from { opacity: 0.04; transform: scale(0.9); }
    to   { opacity: 0.70; transform: scale(1.05); }
  }
  @keyframes bg-float {
    0%, 100% { transform: translateY(0px)   opacity: 0.55; }
    50%       { transform: translateY(-14px); opacity: 0.85; }
  }
  @keyframes bg-blob-slow {
    0%, 100% { transform: translate(0,0)    scale(1); }
    33%      { transform: translate(22px,-28px) scale(1.06); }
    66%      { transform: translate(-16px,18px) scale(0.97); }
  }
  @keyframes bg-blob-slower {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-26px,24px) scale(1.09); }
  }
  @keyframes bg-blob-medium {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(18px,-20px) scale(1.05); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bg-anim-star,
    .bg-anim-particle,
    .bg-anim-blob {
      animation: none !important;
    }
  }
`;

let _injected = false;
const injectKeyframes = () => {
    if (_injected || typeof document === 'undefined') return;
    const el = document.createElement('style');
    el.id = 'animated-bg-keyframes';
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    _injected = true;
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const StarField = memo(() => (
    <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{ contain: 'strict' }}
    >
        {STARS.map((s) => (
            <div
                key={s.id}
                className="absolute rounded-full bg-anim-star"
                style={{
                    width: s.size,
                    height: s.size,
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    opacity: s.opacity,
                    backgroundColor: s.tint,
                    animation: `bg-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
                    willChange: 'opacity, transform',
                }}
            />
        ))}
    </div>
));
StarField.displayName = 'AnimatedBackground.StarField';

const GradientBlobs = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {BLOBS.map((blob, i) => (
            <div
                key={i}
                className="absolute rounded-full blur-[130px] bg-anim-blob"
                style={{
                    ...blob.style,
                    animationFillMode: 'both',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    willChange: 'transform',
                }}
            />
        ))}
        {/* Subtle overall brand tint — very low opacity */}
        <div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.04) 0%, transparent 50%, rgba(7,196,184,0.03) 100%)`,
            }}
        />
    </div>
));
GradientBlobs.displayName = 'AnimatedBackground.GradientBlobs';

const FloatingParticles = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLES.map(([top, left, color, delay, sizeClass], i) => (
            <div
                key={i}
                className={`absolute ${sizeClass} rounded-full bg-anim-particle`}
                style={{
                    top,
                    left,
                    backgroundColor: color,
                    opacity: 0.55,
                    boxShadow: `0 0 6px 1px ${color}55`,
                    animation: `bg-float 6s ease-in-out ${delay} infinite`,
                    willChange: 'transform, opacity',
                }}
            />
        ))}
    </div>
));
FloatingParticles.displayName = 'AnimatedBackground.FloatingParticles';

const GridOverlay = memo(() => (
    <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cdefs%3E%3Cpattern id='g' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 10h80M0 20h80M0 30h80M0 40h80M0 50h80M0 60h80M0 70h80M10 0v80M20 0v80M30 0v80M40 0v80M50 0v80M60 0v80M70 0v80' fill='none' stroke='%230998d5' stroke-width='0.4' stroke-opacity='0.07'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
            opacity: 1,
        }}
    />
));
GridOverlay.displayName = 'AnimatedBackground.GridOverlay';

const VignetteOverlay = memo(() => (
    <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,12,22,0.55) 100%)',
        }}
    />
));
VignetteOverlay.displayName = 'AnimatedBackground.VignetteOverlay';

/* ─── Root ───────────────────────────────────────────────────────────────── */

/**
 * AnimatedBackground
 *
 * Place inside any `position: relative; overflow: hidden` section.
 * Wrap your content in a `relative z-10` div so it sits above the layers.
 *
 * Props:
 *  showStars     {boolean} – star field on/off (default true)
 *  showParticles {boolean} – floating dots on/off (default true)
 *  showGrid      {boolean} – grid overlay on/off (default true)
 *  withBaseBg    {boolean} – paint PAGE_BG as the base fill (default true)
 *                            set false when the parent section already has a bg
 *  className     {string}  – extra classes for the outer div
 */
const AnimatedBackground = memo(({
    showStars = true,
    showParticles = true,
    showGrid = true,
    withBaseBg = true,
    className = '',
}) => {
    useMemo(injectKeyframes, []);

    return (
        <div
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{
                zIndex: 0,
                ...(withBaseBg && { backgroundColor: PAGE_BG }),
            }}
            aria-hidden="true"
        >
            {/* Layer order (back → front):
          1. optional base colour
          2. gradient blobs
          3. star field
          4. floating particles
          5. grid overlay
          6. vignette
      */}
            <GradientBlobs />
            {showStars && <StarField />}
            {showParticles && <FloatingParticles />}
            {showGrid && <GridOverlay />}
            <VignetteOverlay />
        </div>
    );
});

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;

/**
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 * The parent section MUST have `position: relative` and `overflow: hidden`.
 * Wrap all content in a `relative z-10` container so it renders above the layers.
 *
 * // Basic — section paints its own background:
 * <section className="relative overflow-hidden" style={{ background: PAGE_BG }}>
 *   <AnimatedBackground withBaseBg={false} />
 *   <div className="relative z-10">...content...</div>
 * </section>
 *
 * // Let the component own the background colour:
 * <section className="relative overflow-hidden">
 *   <AnimatedBackground />
 *   <div className="relative z-10">...content...</div>
 * </section>
 *
 * // Light section — only the grid + particles, no dark fill:
 * <section className="relative overflow-hidden bg-white">
 *   <AnimatedBackground withBaseBg={false} showStars={false} />
 *   <div className="relative z-10">...content...</div>
 * </section>
 *
 * // Minimal — blobs only:
 * <AnimatedBackground showStars={false} showParticles={false} showGrid={false} />
 *
 * // Shared design tokens:
 * import { BRAND, BRAND_RGB, PAGE_BG } from '@/components/AnimatedBackground';
 */