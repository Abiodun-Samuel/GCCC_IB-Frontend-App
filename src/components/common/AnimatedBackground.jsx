import { memo } from 'react';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
export const PAGE_BG = '#020c16';
export const BRAND = '#0998d5';
export const BRAND_RGB = '9,152,213';

const TEAL = '#07c4b8';
const SKY = '#38bdf8';
const CYAN = '#06b6d4';

/* ─── Deterministic star field (no Math.random — SSR safe) ──────────────────── */
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
        tint: i % 7 === 0 ? TEAL : i % 11 === 0 ? SKY : '#ffffff',
    };
});

/* ─── Particles ──────────────────────────────────────────────────────────────── */
const PARTICLES = [
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
        style: {
            top: '-8%', left: '10%', width: 560, height: 560,
            background: `radial-gradient(ellipse, rgba(${BRAND_RGB},0.18) 0%, transparent 70%)`,
            animationName: 'bg-blob-slow', animationDuration: '20s',
        },
    },
    {
        style: {
            bottom: '-12%', right: '6%', width: 640, height: 640,
            background: `radial-gradient(ellipse, rgba(7,196,184,0.13) 0%, transparent 68%)`,
            animationName: 'bg-blob-slower', animationDuration: '25s', animationDelay: '3s',
        },
    },
    {
        style: {
            top: '38%', left: '-12%', width: 480, height: 480,
            background: `radial-gradient(ellipse, rgba(29,78,216,0.14) 0%, rgba(${BRAND_RGB},0.06) 55%, transparent 72%)`,
            animationName: 'bg-blob-medium', animationDuration: '18s', animationDelay: '1.5s',
        },
    },
    {
        style: {
            top: '5%', right: '-8%', width: 400, height: 400,
            background: `radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 66%)`,
            animationName: 'bg-blob-slow', animationDuration: '22s', animationDelay: '6s',
        },
    },
    {
        style: {
            top: '40%', left: '30%', width: 700, height: 300,
            background: `radial-gradient(ellipse, rgba(${BRAND_RGB},0.05) 0%, transparent 70%)`,
            animationName: 'bg-blob-medium', animationDuration: '30s', animationDelay: '4s',
        },
    },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

const StarField = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ contain: 'strict' }}>
        {STARS.map((s) => (
            <div
                key={s.id}
                className="absolute rounded-full bg-anim-star"
                style={{
                    width: s.size, height: s.size,
                    top: `${s.top}%`, left: `${s.left}%`,
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
        <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.04) 0%, transparent 50%, rgba(7,196,184,0.03) 100%)` }}
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
                    top, left,
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
        }}
    />
));
GridOverlay.displayName = 'AnimatedBackground.GridOverlay';

const VignetteOverlay = memo(() => (
    <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,12,22,0.55) 100%)' }}
    />
));
VignetteOverlay.displayName = 'AnimatedBackground.VignetteOverlay';

/* ─── Root ───────────────────────────────────────────────────────────────────── */

/**
 * AnimatedBackground
 *
 * Place inside any `position: relative; overflow: hidden` section.
 * Wrap content in a `relative z-10` div so it sits above the layers.
 *
 * Props:
 *  showStars     {boolean} – star field (default true)
 *  showParticles {boolean} – floating dots (default true)
 *  showGrid      {boolean} – grid overlay (default true)
 *  withBaseBg    {boolean} – paint PAGE_BG as base fill (default true)
 *  className     {string}  – extra classes on the outer div
 */
const AnimatedBackground = memo(({
    showStars = true,
    showParticles = true,
    showGrid = true,
    withBaseBg = true,
    className = '',
}) => (
    <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        style={{ zIndex: 0, ...(withBaseBg && { backgroundColor: PAGE_BG }) }}
        aria-hidden="true"
    >
        <GradientBlobs />
        {showStars && <StarField />}
        {showParticles && <FloatingParticles />}
        {showGrid && <GridOverlay />}
        <VignetteOverlay />
    </div>
));

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;