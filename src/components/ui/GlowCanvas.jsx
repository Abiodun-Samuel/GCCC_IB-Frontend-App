import { memo } from "react";

// ─── Keyframes injected once ──────────────────────────────────────────────────
const STYLES = `
  @keyframes gc-blob-slow {
    0%,100% { transform: translate(0,0) scale(1); opacity:1; }
    33%      { transform: translate(20px,-30px) scale(1.05); opacity:.9; }
    66%      { transform: translate(-15px,20px) scale(.97); opacity:1; }
  }
  @keyframes gc-blob-slower {
    0%,100% { transform: translate(0,0) scale(1); opacity:1; }
    50%      { transform: translate(-25px,25px) scale(1.08); opacity:.88; }
  }
  @keyframes gc-blob-medium {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(18px,-22px) scale(1.06); }
  }
  @keyframes gc-float {
    0%,100% { transform: translateY(0);   opacity:.35; }
    50%      { transform: translateY(-14px); opacity:.65; }
  }
  @keyframes gc-shimmer {
    0%,100% { opacity:.3; }
    50%      { opacity:.75; }
  }
  .gc-blob-slow   { animation: gc-blob-slow   18s ease-in-out infinite; }
  .gc-blob-slower { animation: gc-blob-slower  22s ease-in-out infinite; animation-delay:3s; }
  .gc-blob-medium { animation: gc-blob-medium  15s ease-in-out infinite; animation-delay:2s; }
  .gc-shimmer     { animation: gc-shimmer       4s ease-in-out infinite; }
`;

// Particle delay map — avoids inline style string concatenation
const PARTICLE_DELAYS = ["0s", "2s", "4s", "1s", "3s", "5s", "1.5s", "3.5s", "2.5s", "4.5s", "0.5s", "5.5s"];

const PARTICLE_POSITIONS = [
    "top-[15%] left-[10%]",
    "top-[30%] right-[20%]",
    "bottom-[20%] left-[30%]",
    "top-[60%] right-[15%]",
    "top-[45%] left-[20%]",
    "bottom-[35%] right-[25%]",
    "top-[75%] left-[40%]",
    "bottom-[50%] right-[35%]",
    "top-[50%] left-[5%]",
    "bottom-[60%] right-[8%]",
    "top-[35%] left-[45%]",
    "bottom-[25%] right-[40%]",
];

// ─── Sub-components (memo — never re-render) ──────────────────────────────────
const Blobs = memo(() => (
    <>
        {/* Top-left blob */}
        <div
            className="gc-blob-slow absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(9,152,213,0.25) 0%, rgba(14,170,228,0.15) 40%, rgba(5,130,185,0.18) 100%)" }}
        />
        {/* Bottom-right blob */}
        <div
            className="gc-blob-slower absolute bottom-[-15%] right-[10%] w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(5,122,170,0.22) 0%, rgba(9,152,213,0.14) 45%, rgba(3,100,148,0.16) 100%)" }}
        />
        {/* Mid-left blob */}
        <div
            className="gc-blob-medium absolute top-[40%] left-[-15%] w-[450px] h-[450px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(14,170,228,0.18) 0%, rgba(9,152,213,0.12) 50%, rgba(5,122,170,0.14) 100%)" }}
        />
        {/* Subtle base overlay */}
        <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(9,152,213,0.07) 0%, transparent 50%, rgba(5,130,185,0.06) 100%)" }}
        />
    </>
));
Blobs.displayName = "GlowCanvas.Blobs";

const Particles = memo(() => (
    <>
        {PARTICLE_POSITIONS.map((pos, i) => (
            <div
                key={i}
                className={`absolute ${pos} w-2 h-2 rounded-full`}
                style={{
                    background: "rgba(9,152,213,0.55)",
                    animation: `gc-float 6s ease-in-out infinite`,
                    animationDelay: PARTICLE_DELAYS[i],
                    willChange: "transform, opacity",
                }}
            />
        ))}
    </>
));
Particles.displayName = "GlowCanvas.Particles";

const Grid = memo(() => (
    <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 0 10 L 80 10 M 0 20 L 80 20 M 0 30 L 80 30 M 0 40 L 80 40 M 0 50 L 80 50 M 0 60 L 80 60 M 0 70 L 80 70 M 10 0 L 10 80 M 20 0 L 20 80 M 30 0 L 30 80 M 40 0 L 40 80 M 50 0 L 50 80 M 60 0 L 60 80 M 70 0 L 70 80' fill='none' stroke='white' stroke-width='0.6'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
        }}
    />
));
Grid.displayName = "GlowCanvas.Grid";

// ─── GlowCanvas ───────────────────────────────────────────────────────────────
/**
 * GlowCanvas
 *
 * Animated section wrapper with #0998d5-family blobs, floating particles,
 * a subtle grid, top/bottom white fades, and a shimmer accent line.
 *
 * All background layers are absolutely positioned inside the component —
 * safe to compose across any section or page without affecting scroll or layout.
 *
 * Usage:
 *   <GlowCanvas className="min-h-screen">
 *     <YourContent />
 *   </GlowCanvas>
 */
const GlowCanvas = memo(({ children, className = "" }) => (
    <div className={`relative overflow-hidden bg-[#052d42] dark:bg-gray-950 ${className}`}>

        {/* Keyframes — injected once, scoped to this mount */}
        <style>{STYLES}</style>

        {/* ── Background canvas (absolute, non-interactive) ────────────── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <Blobs />
            <Particles />
            <Grid />
        </div>

        {/* ── Top fade (absolute, section-relative) ────────────────────── */}
        <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
            aria-hidden="true"
            style={{ background: "linear-gradient(to bottom, rgba(5,45,66,1) 0%, rgba(5,45,66,0) 100%)" }}
        />
        <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10 hidden dark:block"
            aria-hidden="true"
            style={{ background: "linear-gradient(to bottom, rgba(3,7,18,1) 0%, rgba(3,7,18,0) 100%)" }}
        />

        {/* ── Bottom fade (absolute, section-relative) ─────────────────── */}
        <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(5,45,66,1) 0%, rgba(5,45,66,0) 100%)" }}
        />
        <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10 hidden dark:block"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(3,7,18,1) 0%, rgba(3,7,18,0) 100%)" }}
        />

        {/* ── Top shimmer accent line ───────────────────────────────────── */}
        <div
            className="gc-shimmer absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
            aria-hidden="true"
            style={{ background: "linear-gradient(to right, transparent, rgba(9,152,213,0.6), transparent)" }}
        />

        {/* ── Corner accents ────────────────────────────────────────────── */}
        <div
            className="absolute top-0 left-0 w-36 h-36 pointer-events-none z-10 rounded-br-full"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse at top left, rgba(9,152,213,0.14), transparent 70%)" }}
        />
        <div
            className="absolute top-0 right-0 w-36 h-36 pointer-events-none z-10 rounded-bl-full"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse at top right, rgba(5,130,185,0.12), transparent 70%)" }}
        />

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="relative z-20">
            {children}
        </div>
    </div>
));

GlowCanvas.displayName = "GlowCanvas";
export default GlowCanvas;