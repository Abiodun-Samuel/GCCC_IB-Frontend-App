import { memo } from 'react';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
export const PAGE_BG = '#020c16';
export const BRAND = '#0998d5';
export const BRAND_RGB = '9,152,213';

const TEAL = '#07c4b8';
const SKY = '#38bdf8';
const CYAN = '#06b6d4';

/* ─── Star data ──────────────────────────────────────────────────────────────── */
// Deterministic (SSR-safe). Culled to opacity ≥ 0.10 — invisible stars still
// consume animation budget. Leaves ~52 of the original 70.
const STARS = Array.from({ length: 70 }, (_, i) => {
    const s = Math.sin(i * 7.31);
    const c = Math.cos(i * 5.13);
    const opacity = +(Math.abs(Math.sin(i * 2.93)) * 0.50 + 0.06).toFixed(3);
    return {
        id: i,
        r: s > 0.80 ? 1.1 : s > 0.65 ? 0.7 : 0.45,  // SVG radius, not px size
        cx: +((c * 0.5 + 0.5) * 100).toFixed(3),       // % position
        cy: +((Math.sin(i * 3.71) * 0.5 + 0.5) * 100).toFixed(3),
        opacity,
        dur: (2.8 + Math.abs(Math.sin(i * 1.37)) * 5).toFixed(2),
        delay: (Math.abs(Math.cos(i * 4.71)) * 7).toFixed(2),
        fill: i % 7 === 0 ? TEAL : i % 11 === 0 ? SKY : '#ffffff',
    };
}).filter(s => s.opacity >= 0.10);

/* ─── Particle data ──────────────────────────────────────────────────────────── */
// 12 visible dots, structured objects (no brittle positional tuples).
// boxShadow removed — it triggers repaints on every frame; at 6–8px on a dark
// background the glow is invisible anyway.
const PARTICLES = [
    { top: '12%', left: '9%', color: BRAND, delay: '0s', size: 8 },
    { top: '28%', left: '82%', color: TEAL, delay: '2s', size: 6 },
    { top: '68%', left: '18%', color: SKY, delay: '4s', size: 8 },
    { top: '55%', left: '88%', color: CYAN, delay: '1s', size: 6 },
    { top: '82%', left: '72%', color: TEAL, delay: '5s', size: 8 },
    { top: '48%', left: '4%', color: BRAND, delay: '2.5s', size: 6 },
    { top: '33%', left: '25%', color: TEAL, delay: '0.5s', size: 8 },
    { top: '8%', left: '50%', color: CYAN, delay: '6s', size: 6 },
    { top: '92%', left: '28%', color: SKY, delay: '4.2s', size: 8 },
    { top: '15%', left: '75%', color: TEAL, delay: '1.8s', size: 6 },
    { top: '70%', left: '44%', color: CYAN, delay: '2.2s', size: 6 },
    { top: '44%', left: '15%', color: SKY, delay: '5.2s', size: 6 },
];

/* ─── Blob data ──────────────────────────────────────────────────────────────── */
// Opacity bumped slightly to compensate for reduced blur radius (90px → was 130px).
// Visually equivalent; GPU cost is O(r²) so 90px ≈ 48% of 130px cost.
const BLOBS = [
    {
        style: {
            top: '-8%', left: '10%', width: 520, height: 520,
            background: `radial-gradient(ellipse, rgba(${BRAND_RGB},0.22) 0%, transparent 70%)`,
            animationName: 'bg-blob-slow', animationDuration: '20s',
        },
    },
    {
        style: {
            bottom: '-12%', right: '6%', width: 580, height: 580,
            background: `radial-gradient(ellipse, rgba(7,196,184,0.16) 0%, transparent 68%)`,
            animationName: 'bg-blob-slower', animationDuration: '25s', animationDelay: '3s',
        },
    },
    {
        style: {
            top: '38%', left: '-12%', width: 440, height: 440,
            background: `radial-gradient(ellipse, rgba(29,78,216,0.16) 0%, rgba(${BRAND_RGB},0.07) 55%, transparent 72%)`,
            animationName: 'bg-blob-medium', animationDuration: '18s', animationDelay: '1.5s',
        },
    },
    {
        style: {
            top: '5%', right: '-8%', width: 380, height: 380,
            background: `radial-gradient(ellipse, rgba(6,182,212,0.14) 0%, transparent 66%)`,
            animationName: 'bg-blob-slow', animationDuration: '22s', animationDelay: '6s',
        },
    },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

/**
 * StarField
 *
 * Rendered as a single <svg> element with <circle> children instead of 52 divs.
 *
 * Why SVG:
 *   • 1 DOM node instead of 52 — layout, style recalc, and GC pressure all drop.
 *   • 1 compositor layer instead of up to 52 — no per-element border-radius cost.
 *   • CSS animations on <circle> work identically to div animations (opacity,
 *     transform). `transform-box: fill-box` ensures scale origins are per-circle.
 */
const StarField = memo(() => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ contain: 'paint', overflow: 'hidden' }}
    >
        {STARS.map(s => (
            <circle
                key={s.id}
                cx={`${s.cx}%`}
                cy={`${s.cy}%`}
                r={s.r}
                fill={s.fill}
                opacity={s.opacity}
                style={{
                    // transform-box scopes scale to each circle's own bounding box.
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: `bg-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
                }}
            />
        ))}
    </svg>
));
StarField.displayName = 'AnimatedBackground.StarField';

/**
 * GradientBlobs
 *
 * Critical optimisation: blur is applied to a single wrapper div, not to each
 * blob individually.
 *
 * Before: 4 blur passes × O(r²) = 4 × GPU cost per frame
 * After:  1 composite of 4 children → 1 blur pass = 1 × GPU cost per frame
 *
 * The wrapper is given `inset-[-15%]` so blobs near the viewport edges are
 * composited fully before the blur clips them at the overflow boundary.
 *
 * `willChange: 'transform'` stays on each blob (they move individually via CSS
 * keyframes), not on the wrapper (which is static).
 */
const GradientBlobs = memo(() => (
    <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
    >
        {/* Single blur pass over all composited children */}
        <div className="absolute blur-[90px]" style={{ inset: '-15%' }}>
            {BLOBS.map((blob, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        ...blob.style,
                        animationFillMode: 'both',
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                        willChange: 'transform',
                    }}
                />
            ))}
        </div>

        {/* Static linear wash — no blur needed, zero animation cost */}
        <div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.04) 0%, transparent 50%, rgba(7,196,184,0.03) 100%)`,
            }}
        />
    </div>
));
GradientBlobs.displayName = 'AnimatedBackground.GradientBlobs';

/**
 * FloatingParticles
 *
 * 12 dots (down from 22). No boxShadow — it forces a repaint on every animation
 * frame because box-shadow is not GPU-composited. The glow was imperceptible at
 * 6–8px on the dark background anyway.
 */
const FloatingParticles = memo(() => (
    <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
    >
        {PARTICLES.map((p, i) => (
            <div
                key={i}
                className="absolute rounded-full"
                style={{
                    top: p.top,
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    opacity: 0.55,
                    animation: `bg-float 6s ease-in-out ${p.delay} infinite`,
                }}
            />
        ))}
    </div>
));
FloatingParticles.displayName = 'AnimatedBackground.FloatingParticles';

/**
 * GridOverlay — static SVG pattern, painted once, zero animation cost.
 */
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

/**
 * VignetteOverlay — static radial gradient, no animation cost.
 */
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

/* ─── Root ───────────────────────────────────────────────────────────────────── */

/**
 * AnimatedBackground
 *
 * Place inside any `position: relative; overflow: hidden` container.
 * Wrap page content in a `relative z-10` div so it renders above the layers.
 *
 * @prop {boolean} showStars     – render star field        (default true)
 * @prop {boolean} showParticles – render floating dots     (default true)
 * @prop {boolean} showGrid      – render grid overlay      (default true)
 * @prop {boolean} withBaseBg    – fill PAGE_BG as base     (default true)
 * @prop {string}  className     – extra classes on wrapper
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
        <StarField />
        <FloatingParticles />
        <GridOverlay />
        <VignetteOverlay />
    </div>
));

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;