import { useRef, memo, useState, useEffect, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, Users, Crown, MapPin, Camera } from 'lucide-react';
import { SECTION_SPACING } from '@/utils/constant';
import GallerySection from '@/components/Home/GallerySection';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Explicit hex values guarantee the primary blue renders regardless of
// whether Tailwind JIT has purged the custom colour token from the CSS.

const C = {
    primary: '#119bd6',
    primaryDim: 'rgba(17,155,214,0.12)',
    primaryBorder: 'rgba(17,155,214,0.22)',
    primaryGlow: 'rgba(17,155,214,0.35)',
    primaryGhost: 'rgba(17,155,214,0.055)',
    primaryStroke: 'rgba(17,155,214,0.07)',
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const VALUES = [
    {
        id: 'love',
        icon: Heart,
        title: 'Love',
        body: "Extending Christ's love to every person, no conditions.",
        isDefault: false,
    },
    {
        id: 'family',
        icon: Users,
        title: 'Family',
        body: 'Close-knit believers carrying one another through every season.',
        isDefault: true,
    },
    {
        id: 'kingdom',
        icon: Crown,
        title: 'Kingdom',
        body: 'Kingdom culture practiced in every space we occupy.',
        isDefault: false,
    },
];

const ABOUT_IMAGES = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    src: `/images/home/about/about${i + 1}.jpg`,
    alt: `GCCC Ibadan Community — photo ${i + 1}`,
}));

const SLIDE_INTERVAL = 1000; // ms — faster per request

// ─── Utilities ────────────────────────────────────────────────────────────────

const fisherYates = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1];

const V = {
    stagger: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    rise: { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } },
    fromLeft: { hidden: { opacity: 0, x: -56 }, visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } } },
    fromRight: { hidden: { opacity: 0, x: 56 }, visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } } },
    ghost: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1.6, ease: EASE, delay: 0.15 } } },
    cardRise: { hidden: { opacity: 0, y: 28, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } } },
    slideIn: {
        hidden: { opacity: 0, scale: 1.05 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
        exit: { opacity: 0, scale: 0.97, transition: { duration: 0.5, ease: EASE } },
    },
    floatIn: {
        hidden: { opacity: 0, y: 18, x: 18 },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: EASE, delay: 0.6 } },
    },
    frameIn: {
        hidden: { opacity: 0, scale: 0.94 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: EASE, delay: 0.3 } },
    },
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────

const SectionLabel = memo(({ inView }) => (
    <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={V.rise}
        className="flex items-center gap-3 mb-10 sm:mb-12"
    >
        <motion.div
            style={{ height: 1, backgroundColor: C.primary }}
            initial={{ width: 0 }}
            animate={inView ? { width: 32 } : { width: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        />
        <span
            className="text-[11px] font-bold tracking-[0.25em] uppercase select-none"
            style={{ color: C.primary }}
        >
            Who We Are
        </span>
    </motion.div>
));
SectionLabel.displayName = 'About.SectionLabel';

// ─── ProgressBar ─────────────────────────────────────────────────────────────

const ProgressBar = memo(({ current }) => (
    <div className="absolute top-0 left-0 right-0 z-20 h-[2px] bg-white/10">
        <motion.div
            key={`pb-${current}`}
            className="h-full origin-left"
            style={{ backgroundColor: C.primary }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
        />
    </div>
));
ProgressBar.displayName = 'About.ProgressBar';

// ─── ThumbnailStrip ───────────────────────────────────────────────────────────

const THUMB_COUNT = 5;

const ThumbnailStrip = memo(({ images, current, onSelect }) => {
    const half = Math.floor(THUMB_COUNT / 2);
    const start = Math.min(
        Math.max(0, current - half),
        Math.max(0, images.length - THUMB_COUNT),
    );
    const slice = images.slice(start, start + THUMB_COUNT);

    return (
        <div
            className="absolute bottom-0 left-0 right-0 z-20 flex gap-1 px-2 pb-2 pt-6"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)' }}
        >
            {slice.map((img) => {
                const realIdx = images.indexOf(img);
                const isActive = realIdx === current;
                return (
                    <button
                        key={img.id}
                        onClick={() => onSelect(realIdx)}
                        aria-label={img.alt}
                        className="relative flex-1 overflow-hidden focus-visible:outline-none transition-all duration-300"
                        style={{ height: isActive ? 48 : 32, opacity: isActive ? 1 : 0.5 }}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                        {isActive && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ boxShadow: `inset 0 0 0 1.5px ${C.primary}` }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
});
ThumbnailStrip.displayName = 'About.ThumbnailStrip';

// ─── SlideCounter ────────────────────────────────────────────────────────────

const SlideCounter = memo(({ current, total }) => (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <div
            className="flex items-center gap-1.5 px-2 py-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
        >
            <Camera className="w-3 h-3 text-white/60" strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-widest text-white/80 tabular-nums select-none font-mono">
                {String(current + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
            </span>
        </div>
    </div>
));
SlideCounter.displayName = 'About.SlideCounter';

// ─── LocationBadge ───────────────────────────────────────────────────────────

const LocationBadge = memo(() => (
    <div
        className="absolute bottom-16 left-3 z-20 flex items-center gap-1.5 px-2 py-1"
        style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
    >
        <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: C.primary }} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-700">
            Bodija · Ibadan
        </span>
    </div>
));
LocationBadge.displayName = 'About.LocationBadge';

// ─── CornerBracket ────────────────────────────────────────────────────────────
// Decorative L-shaped corner brackets that sit proud of the image frame.

const BRACKET_SIZE = 24;
const BRACKET_LINE = 2;
const BRACKET_OFFSET = Math.round(BRACKET_SIZE * 0.35);

const CornerBracket = memo(({ corner, inView }) => {
    const isTop = corner.startsWith('t');
    const isLeft = corner.endsWith('l');

    return (
        <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={V.frameIn}
            className="absolute z-30 pointer-events-none"
            style={{
                width: BRACKET_SIZE,
                height: BRACKET_SIZE,
                top: isTop ? -BRACKET_OFFSET : 'auto',
                bottom: !isTop ? -BRACKET_OFFSET : 'auto',
                left: isLeft ? -BRACKET_OFFSET : 'auto',
                right: !isLeft ? -BRACKET_OFFSET : 'auto',
            }}
        >
            {/* Horizontal arm */}
            <div style={{
                position: 'absolute',
                backgroundColor: C.primary,
                width: BRACKET_SIZE,
                height: BRACKET_LINE,
                top: isTop ? 0 : BRACKET_SIZE - BRACKET_LINE,
                left: 0,
            }} />
            {/* Vertical arm */}
            <div style={{
                position: 'absolute',
                backgroundColor: C.primary,
                width: BRACKET_LINE,
                height: BRACKET_SIZE,
                left: isLeft ? 0 : BRACKET_SIZE - BRACKET_LINE,
                top: 0,
            }} />
        </motion.div>
    );
});
CornerBracket.displayName = 'About.CornerBracket';

// ─── FloatBadge ──────────────────────────────────────────────────────────────

const FloatBadge = memo(({ inView }) => (
    <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={V.floatIn}
        className="absolute -bottom-5 -right-5 z-30 bg-white dark:bg-gray-900 flex items-stretch"
        style={{
            boxShadow: `0 8px 32px rgba(0,0,0,0.13), 0 0 0 1px ${C.primaryBorder}`,
        }}
    >
        {/* Left accent stripe */}
        <div style={{ width: 3, backgroundColor: C.primary }} />
    </motion.div>
));
FloatBadge.displayName = 'About.FloatBadge';

// ─── ImagePanel ───────────────────────────────────────────────────────────────

const ImagePanel = memo(({ inView }) => {
    const panelRef = useRef(null);
    const images = useMemo(() => fisherYates(ABOUT_IMAGES), []);
    const [current, setCurrent] = useState(0);

    const { scrollYProgress } = useScroll({ target: panelRef, offset: ['start end', 'end start'] });
    const wrapY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

    // Auto-advance
    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), SLIDE_INTERVAL);
        return () => clearInterval(id);
    }, [inView, images.length]);

    // Prefetch next
    useEffect(() => {
        const next = images[(current + 1) % images.length];
        const link = Object.assign(document.createElement('link'), {
            rel: 'prefetch', as: 'image', href: next.src,
        });
        document.head.appendChild(link);
        return () => link.remove();
    }, [current, images]);

    return (
        <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={V.fromLeft}
            style={{ y: wrapY }}
            // Extra space at right + bottom so the offset frame and float badge are visible
            className="relative pb-6 pr-6"
        >
            {/* ── Offset background frame ──────────────────────────────────── */}
            <motion.div
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={V.frameIn}
                className="absolute"
                style={{
                    inset: 0,
                    bottom: '1.5rem',
                    right: '1.5rem',
                    transform: 'translate(10px, 10px)',
                    border: `1.5px solid ${C.primary}`,
                    opacity: 0.3,
                    pointerEvents: 'none',
                }}
            />

            {/* ── Inner image frame (clip + aspect ratio) ──────────────────── */}
            <div
                ref={panelRef}
                className="relative aspect-[4/3] overflow-visible"
            >
                {/* Corner brackets */}
                <CornerBracket corner="tl" inView={inView} />
                <CornerBracket corner="tr" inView={inView} />
                <CornerBracket corner="bl" inView={inView} />
                <CornerBracket corner="br" inView={inView} />

                {/* Clipped slide area */}
                <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={images[current].id}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={V.slideIn}
                            className="absolute inset-0"
                        >
                            <img
                                src={images[current].src}
                                alt={images[current].alt}
                                loading={current === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-10" />

                    <ProgressBar current={current} />
                    <SlideCounter current={current} total={images.length} />
                    <LocationBadge />
                    <ThumbnailStrip images={images} current={current} onSelect={setCurrent} />
                </div>
            </div>

            {/* Floating stats badge */}
            <FloatBadge inView={inView} />
        </motion.div>
    );
});
ImagePanel.displayName = 'About.ImagePanel';

// ─── GhostWatermark ───────────────────────────────────────────────────────────

const GhostWatermark = memo(({ inView }) => (
    <motion.div
        aria-hidden="true"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={V.ghost}
        className="pointer-events-none select-none absolute bottom-16 left-0 right-0 overflow-hidden"
    >
        <svg
            viewBox="0 0 800 160"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="50%" y="88%"
                textAnchor="middle"
                dominantBaseline="auto"
                fontFamily="'Arial Black','Impact',sans-serif"
                fontWeight="900"
                fontSize="170"
                letterSpacing="-4"
                fill={C.primaryGhost}
                stroke={C.primaryStroke}
                strokeWidth="0.4"
            >
                GCCC IB
            </text>
        </svg>
    </motion.div>
));
GhostWatermark.displayName = 'About.GhostWatermark';

// ─── TextPanel ────────────────────────────────────────────────────────────────

const TextPanel = memo(({ inView }) => (
    <div className="relative overflow-hidden">
        <GhostWatermark inView={inView} />

        <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={V.stagger}
            className="relative z-10 flex flex-col gap-6"
        >
            <motion.h2
                variants={V.fromRight}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight text-gray-900 dark:text-white"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                Where{' '}
                <span style={{ color: C.primary }}>Love</span>,{' '}
                <span style={{ color: C.primary }}>Family</span>{' '}
                &amp;{' '}
                <span style={{ color: C.primary }}>Kingdom</span>{' '}
                converge.
            </motion.h2>

            <motion.p variants={V.rise} className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                GCCC Ibadan is a growing community of close-knit believers in Bodija,
                extending the frontiers of the Kingdom on all sides.
            </motion.p>

            <motion.p variants={V.rise} className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We do the Word, yield to the Spirit and practice the Culture of God's
                Kingdom — with a deep desire to regularly experience and manifest the
                Glory of God.
            </motion.p>

            <motion.div
                variants={V.rise}
                className="pl-4"
                style={{ borderLeft: `2px solid ${C.primary}` }}
            >
                <p className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Georgia', serif" }}>
                    The plan is to take our generation for Jesus.
                </p>
            </motion.div>
        </motion.div>
    </div>
));
TextPanel.displayName = 'About.TextPanel';

// ─── ValueCard ────────────────────────────────────────────────────────────────

const ValueCard = memo(({ icon: Icon, title, body, isDefault, index }) => {
    const ref = useRef(null);
    const cardIn = useInView(ref, { once: true, margin: '-40px' });
    const [hovered, setHovered] = useState(false);

    const active = isDefault || hovered;

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={cardIn ? 'visible' : 'hidden'}
            variants={V.cardRise}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            onHoverStart={() => !isDefault && setHovered(true)}
            onHoverEnd={() => !isDefault && setHovered(false)}
            className="relative flex flex-col gap-5 p-6 cursor-default overflow-hidden
                       transition-colors duration-300 shadow
                       bg-gray-50 dark:bg-gray-900/70"
            style={active ? { backgroundColor: C.primary } : undefined}
        >
            {/* ── Icon row + index number ──────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div
                    className="w-10 h-10 flex items-center justify-center transition-colors duration-300"
                    style={{
                        backgroundColor: active ? 'rgba(255,255,255,0.18)' : C.primaryDim,
                    }}
                >
                    <Icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: active ? '#fff' : C.primary }}
                        strokeWidth={1.8}
                    />
                </div>

                <span
                    className="text-[11px] font-black tracking-widest tabular-nums select-none transition-colors duration-300"
                    style={{
                        color: active
                            ? 'rgba(255,255,255,0.30)'
                            : 'rgba(17,155,214,0.28)',
                    }}
                >
                    0{index + 1}
                </span>
            </div>

            {/* ── Copy ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
                <h4
                    className="text-base font-bold leading-snug transition-colors duration-300"
                    style={{ color: active ? '#fff' : undefined }}
                >
                    <span className={active ? '' : 'text-gray-900 dark:text-white'}>
                        {title}
                    </span>
                </h4>
                <p
                    className="text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: active ? 'rgba(255,255,255,0.72)' : undefined }}
                >
                    <span className={active ? '' : 'text-gray-500 dark:text-gray-400'}>
                        {body}
                    </span>
                </p>
            </div>

            {/* ── Bottom accent bar ────────────────────────────────────────── */}
            <div
                className="mt-auto h-[2px] origin-left transition-all duration-500"
                style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.32)' : C.primary,
                    opacity: active ? 1 : 0.2,
                    transform: active ? 'scaleX(1)' : 'scaleX(0.2)',
                }}
            />
        </motion.div>
    );
});
ValueCard.displayName = 'About.ValueCard';

// ─── ValuesGrid ───────────────────────────────────────────────────────────────

const ValuesGrid = memo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VALUES.map((v, i) => (
            <ValueCard key={v.id} {...v} index={i} />
        ))}
    </div>
));
ValuesGrid.displayName = 'About.ValuesGrid';

// ─── Root ─────────────────────────────────────────────────────────────────────

const AboutSection = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-80px' });

    return (
        <section
            ref={sectionRef}
            id="about"
            className={`relative w-full bg-white dark:bg-gray-950 overflow-hidden ${SECTION_SPACING}`}
        >
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionLabel inView={inView} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-14 sm:mb-16">
                    <ImagePanel inView={inView} />
                    <TextPanel inView={inView} />
                </div>

                <ValuesGrid />
            </div>

            <GallerySection />
        </section>
    );
};

export default memo(AboutSection);