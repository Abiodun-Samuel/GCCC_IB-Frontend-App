import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTION_SPACING_BOTTOM } from '@/utils/constant';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const BRAND = '#0998d5';
const BRAND_DARK = '#076fa3';
const LETTERS = ['G', 'C', 'C', 'C', 'I', 'B'];
const TILE_GAP = 6;

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

function pickN(arr, n) {
    const copy = [...arr];
    for (let i = 0; i < Math.min(n, copy.length); i++) {
        const j = i + Math.floor(Math.random() * (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
}

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

const WIDTH_SPRING = { type: 'spring', stiffness: 240, damping: 38, mass: 1.1 };
const EASE_STD = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };
const EASE_SLOW = { duration: 0.55, ease: [0.4, 0, 0.2, 1] };
const EASE_ENTER = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

/* ─────────────────────────────────────────────────────────────
   CORNER BRACKETS
───────────────────────────────────────────────────────────── */

const BRACKETS = [
    { pos: 'tl', style: { top: 14, left: 14 } },
    { pos: 'tr', style: { top: 14, right: 14 } },
    { pos: 'bl', style: { bottom: 14, left: 14 } },
    { pos: 'br', style: { bottom: 14, right: 14 } },
];

const BRACKET_BORDERS = {
    tl: { borderTop: `1px solid rgba(9,152,213,0.90)`, borderLeft: `1px solid rgba(9,152,213,0.90)` },
    tr: { borderTop: `1px solid rgba(9,152,213,0.90)`, borderRight: `1px solid rgba(9,152,213,0.90)` },
    bl: { borderBottom: `1px solid rgba(9,152,213,0.90)`, borderLeft: `1px solid rgba(9,152,213,0.90)` },
    br: { borderBottom: `1px solid rgba(9,152,213,0.90)`, borderRight: `1px solid rgba(9,152,213,0.90)` },
};

function CornerBrackets() {
    return (
        <>
            {BRACKETS.map(({ pos, style }, i) => (
                <motion.div
                    key={pos}
                    style={{
                        position: 'absolute',
                        width: 20, height: 20,
                        pointerEvents: 'none',
                        zIndex: 10,
                        ...style,
                        ...BRACKET_BORDERS[pos],
                    }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.18, ease: [0.2, 1, 0.4, 1], delay: i * 0.03 }}
                />
            ))}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   INDEX BADGE
───────────────────────────────────────────────────────────── */

function IndexBadge({ index, isActive }) {
    return (
        <motion.div
            animate={{ opacity: isActive ? 0 : 0.32 }}
            transition={EASE_STD}
            style={{
                position: 'absolute',
                top: 16, right: 18,
                zIndex: 10,
                pointerEvents: 'none',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: '#fff',
                lineHeight: 1,
            }}
        >
            {String(index + 1).padStart(2, '0')}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   LETTER BADGE
───────────────────────────────────────────────────────────── */

function LetterBadge({ letter, isActive, entranceDelay, fontSize }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 190, damping: 24, delay: entranceDelay }}
            style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: 22,
                zIndex: 10,
                pointerEvents: 'none',
            }}
        >
            <motion.div
                animate={{
                    width: isActive ? 32 : 12,
                    opacity: isActive ? 1 : 0.50,
                    backgroundColor: isActive ? BRAND : 'rgba(255,255,255,0.65)',
                }}
                transition={EASE_STD}
                style={{ height: 1.5, borderRadius: 1, marginBottom: 8 }}
            />
            <motion.span
                animate={{
                    scale: isActive ? 1.16 : 1,
                    textShadow: isActive
                        ? `0 0 28px ${BRAND}, 0 0 56px rgba(9,152,213,0.40), 0 2px 10px rgba(0,0,0,0.50)`
                        : '0 1px 14px rgba(0,0,0,0.60)',
                }}
                transition={EASE_STD}
                style={{
                    fontWeight: 700,
                    fontSize,
                    lineHeight: 1,
                    letterSpacing: '0.06em',
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
   SCANLINE TEXTURE
───────────────────────────────────────────────────────────── */

function ScanlineOverlay({ isActive }) {
    return (
        <motion.div
            animate={{ opacity: isActive ? 0 : 0.18 }}
            transition={EASE_STD}
            style={{
                position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.55) 3px, rgba(0,0,0,0.55) 4px)',
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────
   RECT TILE
───────────────────────────────────────────────────────────── */

const RectTile = React.memo(function RectTile({
    tile, targetWidth, height, isActive, isDimmed, onEnter, onLeave,
}) {
    return (
        <motion.div
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            animate={{
                width: targetWidth,
                opacity: isDimmed ? 0.46 : 1,
            }}
            transition={{
                width: WIDTH_SPRING,
                opacity: EASE_STD,
            }}
            style={{
                height,
                borderRadius: 10,
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',  // correct: clips only within this tile
                cursor: 'pointer',
                willChange: 'width',
            }}
        >
            {/* ── Image ─────────────────────────────────────────────────
                FIX 1: objectPosition 'center 20%'
                When a narrow tile expands, object-fit:cover silently
                reframes the crop around the centre point. If a face or
                focal detail sits in the upper half the top slides out of
                the viewport entirely. Anchoring at 20% from the top keeps
                the subject in frame across the full width range.
            ──────────────────────────────────────────────────────────── */}
            <motion.img
                src={tile.src}
                alt={`${tile.letter} gallery`}
                loading="lazy"
                draggable={false}
                animate={{ scale: isActive ? 1.07 : 1.0 }}
                transition={EASE_SLOW}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',  // ← FIX 1
                    display: 'block',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    willChange: 'transform',
                    transformOrigin: 'center center',
                }}
            />

            {/* Gradient scrim */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: `linear-gradient(
                    to top,
                    rgba(${isActive ? '2,12,22' : '0,0,0'},0.80) 0%,
                    rgba(0,0,0,0.20) 35%,
                    transparent 60%
                )`,
                transition: 'background 0.38s ease',
            }} />

            <ScanlineOverlay isActive={isActive} />

            {/* Left edge accent */}
            <motion.div
                animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={EASE_STD}
                style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: 2.5, zIndex: 8, pointerEvents: 'none',
                    background: `linear-gradient(180deg, transparent 0%, ${BRAND} 25%, ${BRAND} 75%, transparent 100%)`,
                    transformOrigin: 'top',
                }}
            />

            {/* Bottom rule */}
            <motion.div
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={{ ...EASE_STD, delay: isActive ? 0.06 : 0 }}
                style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 2, zIndex: 8, pointerEvents: 'none',
                    background: `linear-gradient(90deg, ${BRAND} 0%, ${BRAND_DARK} 60%, transparent 100%)`,
                    transformOrigin: 'left',
                }}
            />

            {/* Top edge line */}
            <motion.div
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 0.40 : 0 }}
                transition={{ ...EASE_STD, delay: isActive ? 0.06 : 0 }}
                style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 1, zIndex: 8, pointerEvents: 'none',
                    background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK} 60%, transparent 100%)`,
                    transformOrigin: 'left',
                }}
            />

            <AnimatePresence>
                {isActive && <CornerBrackets />}
            </AnimatePresence>

            <IndexBadge index={tile.index} isActive={isActive} />

            <LetterBadge
                letter={tile.letter}
                isActive={isActive}
                entranceDelay={tile.index * 0.055}
                fontSize="clamp(1.8rem, 2.6vw, 2.4rem)"
            />
        </motion.div>
    );
});

/* ─────────────────────────────────────────────────────────────
   MOBILE CARD
───────────────────────────────────────────────────────────── */

const MobileCard = React.memo(function MobileCard({
    tile, isActive, isDimmed, onToggle,
}) {
    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: '133.33%' }}>
            <motion.div
                onClick={onToggle}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isDimmed ? 0.42 : 1, y: 0 }}
                transition={{
                    opacity: { duration: 0.36, delay: tile.index * 0.06 },
                    y: EASE_ENTER,
                }}
                style={{
                    position: 'absolute', inset: 0,
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    zIndex: isActive ? 2 : 1,
                    boxShadow: isActive
                        ? `0 14px 44px rgba(9,152,213,0.22), 0 6px 20px rgba(0,0,0,0.16), inset 0 0 0 1px rgba(9,152,213,0.22)`
                        : `0 3px 14px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(0,0,0,0.07)`,
                    transition: 'box-shadow 0.32s ease',
                }}
            >
                <motion.img
                    src={tile.src}
                    alt={`${tile.letter} gallery`}
                    loading="lazy"
                    draggable={false}
                    animate={{ scale: isActive ? 1.06 : 1.0 }}
                    transition={EASE_SLOW}
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%',  // ← FIX 1 (mobile)
                        display: 'block',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        transformOrigin: 'center center',
                    }}
                />

                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                    background: `linear-gradient(to top, rgba(2,12,22,0.80) 0%, rgba(0,0,0,0.16) 40%, transparent 65%)`,
                }} />

                <ScanlineOverlay isActive={isActive} />

                <motion.div
                    animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={EASE_STD}
                    style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: 2.5, zIndex: 8, pointerEvents: 'none',
                        background: `linear-gradient(180deg, transparent 0%, ${BRAND} 25%, ${BRAND} 75%, transparent 100%)`,
                        transformOrigin: 'top',
                    }}
                />

                <motion.div
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ ...EASE_STD, delay: isActive ? 0.06 : 0 }}
                    style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 2, zIndex: 8, pointerEvents: 'none',
                        background: `linear-gradient(90deg, ${BRAND} 0%, ${BRAND_DARK} 60%, transparent 100%)`,
                        transformOrigin: 'left',
                    }}
                />

                <AnimatePresence>
                    {isActive && <CornerBrackets />}
                </AnimatePresence>

                <IndexBadge index={tile.index} isActive={isActive} />

                <LetterBadge
                    letter={tile.letter}
                    isActive={isActive}
                    entranceDelay={tile.index * 0.06}
                    fontSize="clamp(1.6rem, 7vw, 2.1rem)"
                />
            </motion.div>
        </div>
    );
});

/* ─────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────── */

export default function GCCCIBGallery() {
    const sectionRef = useRef(null);

    const [tiles] = useState(() =>
        pickN(IMAGE_POOL, 6).map((src, i) => ({
            id: `gccc-${i}`,
            src,
            letter: LETTERS[i],
            index: i,
        }))
    );

    const [activeId, setActiveId] = useState(null);

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

    const isRow = cW >= 640;
    const isMobile = cW > 0 && cW < 640;

    const tileH = useMemo(() => {
        if (cW >= 1280) return 560;
        if (cW >= 1024) return 520;
        if (cW >= 768) return 460;
        if (cW >= 640) return 400;
        return 185;
    }, [cW]);

    const defaultW = useMemo(
        () => (cW - TILE_GAP * (tiles.length - 1)) / tiles.length,
        [cW, tiles.length]
    );

    const activeW = useMemo(
        () => Math.min(defaultW * 3.2, cW * 0.40),
        [defaultW, cW]
    );

    const activeIdx = useMemo(
        () => (activeId ? tiles.findIndex(t => t.id === activeId) : null),
        [activeId, tiles]
    );

    const widths = useMemo(
        () => computeWidths(cW, tiles.length, TILE_GAP, activeIdx, activeW),
        [cW, tiles.length, activeIdx, activeW]
    );

    const handleEnter = useCallback((id) => setActiveId(id), []);
    const handleLeave = useCallback(() => setActiveId(null), []);
    const handleToggle = useCallback(
        (id) => setActiveId(prev => prev === id ? null : id),
        []
    );

    return (
        <section
            ref={sectionRef}
            className={`relative w-full ${SECTION_SPACING_BOTTOM}`}
            aria-label="GCCCIB Gallery"
        >
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    top: '10%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%', height: '70%',
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse, rgba(9,152,213,0.04) 0%, transparent 68%)`,
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div
                ref={innerRef}
                className="relative z-10 py-6 container mx-auto px-2"
            >
                {isRow && cW > 0 && (
                    <div style={{ display: 'flex', gap: TILE_GAP, height: tileH, alignItems: 'stretch' }}>
                        {tiles.map((tile, i) => (
                            <RectTile
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

                {isMobile && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {tiles.map(tile => (
                            <MobileCard
                                key={tile.id}
                                tile={tile}
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