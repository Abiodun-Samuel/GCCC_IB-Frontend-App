import React, {
    useState, useRef, useEffect,
    useCallback, useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTION_SPACING_BOTTOM } from '@/utils/constant';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const BRAND = '#0998d5';
const BRAND_DARK = '#076fa3';
const LETTERS = ['G', 'C', 'C', 'C', 'I', 'B'];
const PILL_GAP = 10; // px between pills

const IMAGE_POOL = [
    '/images/gallery/gallery1.jpg',
    '/images/gallery/gallery2.jpg',
    '/images/gallery/gallery3.jpg',
    '/images/gallery/gallery4.jpg',
    '/images/gallery/gallery5.jpg',
    '/images/gallery/gallery6.jpg',
];

/* ─────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────── */

/** Fisher-Yates partial shuffle — pick n unique items */
function pickN(arr, n) {
    const copy = [...arr];
    for (let i = 0; i < Math.min(n, copy.length); i++) {
        const j = i + Math.floor(Math.random() * (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
}

/**
 * Compute pixel widths for all tiles.
 * Active tile gets `activeW`; remaining tiles share the leftover evenly.
 * When nothing is active every tile gets an equal share.
 */
function computeWidths(containerW, count, gap, activeIdx, activeW) {
    const available = containerW - gap * (count - 1);

    if (activeIdx === null) {
        const equal = available / count;
        return Array(count).fill(equal);
    }

    const siblingW = Math.max((available - activeW) / (count - 1), 8);
    return Array.from({ length: count }, (_, i) =>
        i === activeIdx ? activeW : siblingW
    );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATION CONFIG
───────────────────────────────────────────────────────────── */

const WIDTH_SPRING = { type: 'spring', stiffness: 280, damping: 40, mass: 1 };
const EASE_STD = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };
const EASE_SLOW = { duration: 0.6, ease: [0.4, 0, 0.2, 1] };

/* ─────────────────────────────────────────────────────────────
   CORNER BRACKETS
───────────────────────────────────────────────────────────── */

const BRACKETS = [
    { pos: 'tl', style: { top: 12, left: 12 } },
    { pos: 'tr', style: { top: 12, right: 12 } },
    { pos: 'bl', style: { bottom: 12, left: 12 } },
    { pos: 'br', style: { bottom: 12, right: 12 } },
];

const BRACKET_BORDERS = {
    tl: { borderTop: `1.5px solid ${BRAND}`, borderLeft: `1.5px solid ${BRAND}` },
    tr: { borderTop: `1.5px solid ${BRAND}`, borderRight: `1.5px solid ${BRAND}` },
    bl: { borderBottom: `1.5px solid ${BRAND}`, borderLeft: `1.5px solid ${BRAND}` },
    br: { borderBottom: `1.5px solid ${BRAND}`, borderRight: `1.5px solid ${BRAND}` },
};

function CornerBrackets() {
    return (
        <>
            {BRACKETS.map(({ pos, style }, i) => (
                <motion.div
                    key={pos}
                    style={{
                        position: 'absolute',
                        width: 18, height: 18,
                        pointerEvents: 'none',
                        zIndex: 10,
                        ...style,
                        ...BRACKET_BORDERS[pos],
                    }}
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.1 }}
                    transition={{
                        duration: 0.16,
                        ease: [0.2, 1, 0.4, 1],
                        delay: i * 0.04,
                    }}
                />
            ))}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   LETTER BADGE
───────────────────────────────────────────────────────────── */

function LetterBadge({ letter, isActive, entranceDelay, fontSize }) {
    return (
        <motion.div
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: 'spring', stiffness: 200, damping: 26,
                delay: entranceDelay,
            }}
            style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: 20,
                zIndex: 10,
                pointerEvents: 'none',
            }}
        >
            {/* Accent rule */}
            <motion.div
                animate={{
                    width: isActive ? 28 : 10,
                    opacity: isActive ? 1 : 0.55,
                    backgroundColor: isActive ? BRAND : 'rgba(255,255,255,0.7)',
                }}
                transition={EASE_STD}
                style={{ height: 2, borderRadius: 2, marginBottom: 7 }}
            />

            {/* Letter */}
            <motion.span
                animate={{
                    scale: isActive ? 1.18 : 1,
                    textShadow: isActive
                        ? `0 0 24px ${BRAND}, 0 0 48px rgba(9,152,213,0.45), 0 2px 8px rgba(0,0,0,0.4)`
                        : '0 1px 12px rgba(0,0,0,0.55)',
                }}
                transition={EASE_STD}
                style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize,
                    lineHeight: 1,
                    letterSpacing: '0.07em',
                    color: '#fff',
                    display: 'block',
                    transformOrigin: 'center bottom',
                }}
            >
                {letter}
            </motion.span>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   PILL TILE — desktop & tablet row layout
   borderRadius is ALWAYS 9999px — only width animates.
───────────────────────────────────────────────────────────── */

const PillTile = React.memo(function PillTile({
    tile, targetWidth, height, isActive, isDimmed, onEnter, onLeave,
}) {
    return (
        <motion.div
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            animate={{
                width: targetWidth,
                opacity: isDimmed ? 0.52 : 1,
            }}
            transition={{
                width: WIDTH_SPRING,
                opacity: EASE_STD,
            }}
            style={{
                height,
                borderRadius: 9999,   // ← locked, never changes
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                willChange: 'width',
                boxShadow: isActive
                    ? `0 20px 56px rgba(9,152,213,0.2), 0 8px 24px rgba(0,0,0,0.14)`
                    : '0 4px 18px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.35s ease',
            }}
        >
            {/* Image */}
            <motion.img
                src={tile.src}
                alt={`${tile.letter} gallery image`}
                loading="lazy"
                draggable={false}
                animate={{ scale: isActive ? 1.09 : 1 }}
                transition={EASE_SLOW}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    pointerEvents: 'none', userSelect: 'none',
                    willChange: 'transform',
                }}
            />

            {/* Bottom gradient for letter legibility */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: `linear-gradient(
                    to top,
                    rgba(0,0,0,0.75) 0%,
                    rgba(0,0,0,0.28) 30%,
                    transparent      58%
                )`,
            }} />

            {/* Brand accent line — slides in from left on active */}
            <motion.div
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={EASE_STD}
                style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, zIndex: 8, pointerEvents: 'none',
                    background: `linear-gradient(90deg, transparent, ${BRAND} 35%, ${BRAND_DARK})`,
                    transformOrigin: 'left',
                }}
            />

            <AnimatePresence>
                {isActive && <CornerBrackets />}
            </AnimatePresence>

            <LetterBadge
                letter={tile.letter}
                isActive={isActive}
                entranceDelay={tile.index * 0.06}
                fontSize="clamp(1.75rem, 2.8vw, 2.5rem)"
            />
        </motion.div>
    );
});

/* ─────────────────────────────────────────────────────────────
   MOBILE CARD — 2-col grid, tap-to-activate
   Full pill shape; no width change — scale + glow instead.
───────────────────────────────────────────────────────────── */

const MobileCard = React.memo(function MobileCard({
    tile, height, isActive, isDimmed, onToggle,
}) {
    return (
        <motion.div
            onClick={onToggle}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isDimmed ? 0.48 : 1,
                y: 0,
                scale: isActive ? 1.025 : 1,
            }}
            transition={{
                opacity: { duration: 0.4, delay: tile.index * 0.07 },
                y: { type: 'spring', stiffness: 220, damping: 28, delay: tile.index * 0.07 },
                scale: EASE_STD,
            }}
            style={{
                height,
                borderRadius: 9999,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                willChange: 'transform',
                zIndex: isActive ? 2 : 1,
                boxShadow: isActive
                    ? `0 16px 44px rgba(9,152,213,0.22), 0 6px 18px rgba(0,0,0,0.14)`
                    : '0 4px 14px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.35s ease',
            }}
        >
            {/* Image */}
            <motion.img
                src={tile.src}
                alt={`${tile.letter} gallery image`}
                loading="lazy"
                draggable={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={EASE_SLOW}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    pointerEvents: 'none', userSelect: 'none',
                }}
            />

            {/* Gradient */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: `linear-gradient(
                    to top,
                    rgba(0,0,0,0.75) 0%,
                    rgba(0,0,0,0.25) 30%,
                    transparent      58%
                )`,
            }} />

            {/* Brand line */}
            <motion.div
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={EASE_STD}
                style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, zIndex: 8, pointerEvents: 'none',
                    background: `linear-gradient(90deg, transparent, ${BRAND} 35%, ${BRAND_DARK})`,
                    transformOrigin: 'left',
                }}
            />

            <AnimatePresence>
                {isActive && <CornerBrackets />}
            </AnimatePresence>

            <LetterBadge
                letter={tile.letter}
                isActive={isActive}
                entranceDelay={tile.index * 0.07}
                fontSize="clamp(1.6rem, 6.5vw, 2.1rem)"
            />
        </motion.div>
    );
});

/* ─────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────── */

export default function GCCCIBGallery() {
    const sectionRef = useRef(null);

    /* ── Load Cormorant Garamond once ── */
    useEffect(() => {
        const FONT_ID = 'gcccib-cormorant';
        if (document.getElementById(FONT_ID)) return;
        const link = document.createElement('link');
        link.id = FONT_ID;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap';
        document.head.appendChild(link);
    }, []);

    /* ── 6 random tiles, stable per mount ── */
    const [tiles] = useState(() =>
        pickN(IMAGE_POOL, 6).map((src, i) => ({
            id: `gccc-${i}`,
            src,
            letter: LETTERS[i],
            index: i,
        }))
    );

    const [activeId, setActiveId] = useState(null);

    /* ── Container width via ResizeObserver on the inner div ── */
    const innerRef = useRef(null);
    const [cW, setCW] = useState(0);

    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setCW(entry.contentRect.width));
        ro.observe(el);
        setCW(el.offsetWidth);
        return () => ro.disconnect();
    }, []);

    /* ── Breakpoints ── */
    const isRow = cW >= 640;   // desktop + tablet → single pill row
    const isMobile = cW > 0 && cW < 640;

    /* ── Tile height (fixed, width is what animates) ── */
    const tileH = useMemo(() => {
        if (cW >= 1280) return 540;
        if (cW >= 1024) return 500;
        if (cW >= 768) return 440;
        if (cW >= 640) return 380;
        return 230; // mobile card height
    }, [cW]);

    /*
     * Active expanded width:
     * Just 3× the default resting width — feels natural, not too wide.
     * Capped at 38% of container so all 5 siblings stay legible.
     */
    const defaultW = useMemo(
        () => (cW - PILL_GAP * (tiles.length - 1)) / tiles.length,
        [cW, tiles.length]
    );
    const activeW = useMemo(
        () => Math.min(defaultW * 3, cW * 0.38),
        [defaultW, cW]
    );

    const activeIdx = useMemo(
        () => activeId ? tiles.findIndex(t => t.id === activeId) : null,
        [activeId, tiles]
    );

    const widths = useMemo(
        () => computeWidths(cW, tiles.length, PILL_GAP, activeIdx, activeW),
        [cW, tiles.length, activeIdx, activeW]
    );

    /* ── Stable handlers ── */
    const handleEnter = useCallback((id) => setActiveId(id), []);
    const handleLeave = useCallback(() => setActiveId(null), []);
    const handleToggle = useCallback((id) =>
        setActiveId(prev => prev === id ? null : id), []);

    /* ─────────────────────────────────────────────────────────
       RENDER — the outer shell matches the pattern the user
       provided; ref goes on the inner container so ResizeObserver
       tracks the actual available content width.
    ──────────────────────────────────────────────────────────── */
    return (
        <section
            ref={sectionRef}
            className={`relative w-full bg-white dark:bg-gray-950 overflow-hidden ${SECTION_SPACING_BOTTOM}`}
            aria-label="GCCCIB Gallery"
        >
            <div
                ref={innerRef}
                className="relative z-10 py-5 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
            >

                {/* ── ROW: desktop + tablet (≥ 640px) ── */}
                {isRow && cW > 0 && (
                    <div style={{ display: 'flex', gap: PILL_GAP, height: tileH, alignItems: 'stretch' }}>
                        {tiles.map((tile, i) => (
                            <PillTile
                                key={tile.id}
                                tile={tile}
                                targetWidth={widths[i]}
                                height={tileH}
                                isActive={activeId === tile.id}
                                isDimmed={activeId !== null && activeId !== tile.id}
                                onEnter={() => handleEnter(tile.id)}
                                onLeave={handleLeave}
                            />
                        ))}
                    </div>
                )}

                {/* ── GRID: mobile (< 640px) ── */}
                {isMobile && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {tiles.map(tile => (
                            <MobileCard
                                key={tile.id}
                                tile={tile}
                                height={tileH}
                                isActive={activeId === tile.id}
                                isDimmed={activeId !== null && activeId !== tile.id}
                                onToggle={() => handleToggle(tile.id)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}