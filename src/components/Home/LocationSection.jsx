import {
    memo, useRef, useEffect, useState, useCallback, Suspense, lazy, useMemo,
} from 'react';
import {
    motion, useInView, useMotionValue, useTransform, useSpring,
} from 'framer-motion';
import { MapPin, Navigation, Phone, Mail, ExternalLink, Globe } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   SHARED TOKENS
───────────────────────────────────────────────────────────────────────*/
export const PAGE_BG = '#020c16';
export const BRAND = '#0998d5';
export const BRAND_RGB = '9,152,213';
const BRAND_DARK = '#0777a8';

/* Deterministic star field — 120 stars, exported for Footer to slice [60..] */
export const SHARED_STARS = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    size: Math.sin(i * 7.31) > 0.82 ? 2 : 1,
    top: ((Math.sin(i * 3.71) * 0.5 + 0.5) * 100).toFixed(3),
    left: ((Math.cos(i * 5.13) * 0.5 + 0.5) * 100).toFixed(3),
    opacity: (Math.abs(Math.sin(i * 2.93)) * 0.45 + 0.07).toFixed(3),
    dur: (2.5 + Math.abs(Math.sin(i * 1.37)) * 5).toFixed(2),
    delay: (Math.abs(Math.cos(i * 4.71)) * 6).toFixed(2),
}));

/* ─────────────────────── Utility: detect touch device ──────────────*/
const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ─────────────────────────── Live 3D Globe ──────────────────────────*/
const GlobeGL = lazy(() => import('react-globe.gl'));

const IBADAN_LAT = 7.44;
const IBADAN_LNG = 3.89;

/* Stable data references — defined outside component to avoid re-creation */
const PIN_DATA = [{ lat: IBADAN_LAT, lng: IBADAN_LNG, label: 'Glory Centre Community Church', size: 0.55, color: BRAND }];
const RING_DATA = [{ lat: IBADAN_LAT, lng: IBADAN_LNG, maxR: 4, propagationSpeed: 1.6, repeatPeriod: 850 }];
const RING_COLOR_FN = () => BRAND;
const POINT_ALTITUDE = 0.02;

const LiveGlobe = memo(() => {
    const wrapRef = useRef(null);
    const globeRef = useRef(null);
    const [size, setSize] = useState(500);
    const [ready, setReady] = useState(false);

    /* Responsive sizing — debounced via ResizeObserver */
    useEffect(() => {
        let raf;
        const measure = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (wrapRef.current) setSize(wrapRef.current.offsetWidth);
            });
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (wrapRef.current) ro.observe(wrapRef.current);
        return () => { ro.disconnect(); cancelAnimationFrame(raf); };
    }, []);

    /* Point camera at Ibadan once globe is ready */
    useEffect(() => {
        if (!ready || !globeRef.current) return;
        globeRef.current.pointOfView({ lat: IBADAN_LAT, lng: IBADAN_LNG, altitude: 2.1 }, 1400);
    }, [ready]);

    /* Single callback ref — avoids duplicate-ref warning */
    const setGlobeRef = useCallback(el => {
        globeRef.current = el;
        if (!el) return;
        const ctrl = el.controls();
        ctrl.autoRotate = true;
        ctrl.autoRotateSpeed = 0.55;
        ctrl.enableZoom = false;
        ctrl.enablePan = false;
    }, []);

    const handleReady = useCallback(() => setReady(true), []);

    return (
        <div
            ref={wrapRef}
            className="w-full aspect-square mx-auto relative"
            style={{
                maxWidth: 'min(650px, 100%)',
                /* GPU hint for the floating animation */
                willChange: 'transform',
                contain: 'layout style',
            }}
        >
            {/* Spinner while WebGL initialises */}
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center z-10" aria-label="Loading globe">
                    {''}
                    <div
                        className="w-10 h-10 rounded-full border-2 border-white/10 animate-spin"
                        style={{ borderTopColor: BRAND }}
                    />
                </div>
            )}

            <Suspense fallback={null}>
                <GlobeGL
                    ref={setGlobeRef}
                    width={size}
                    height={size}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    atmosphereColor={BRAND}
                    atmosphereAltitude={0.20}
                    pointsData={PIN_DATA}
                    pointAltitude={POINT_ALTITUDE}
                    pointRadius="size"
                    pointColor="color"
                    pointLabel="label"
                    ringsData={RING_DATA}
                    ringColor={RING_COLOR_FN}
                    ringMaxRadius="maxR"
                    ringPropagationSpeed="propagationSpeed"
                    ringRepeatPeriod="repeatPeriod"
                    enablePointerInteraction
                    animateIn={false}
                    onGlobeReady={handleReady}
                />
            </Suspense>

            {/* Ibadan badge */}
            {ready && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.55 }}
                    className="absolute bottom-[14%] right-[6%] flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none"
                    style={{
                        background: 'rgba(2,12,24,0.90)',
                        border: `1px solid rgba(${BRAND_RGB},0.30)`,
                    }}
                    aria-hidden="true"
                >
                    <span
                        className="w-2 h-2 rounded-full animate-pulse shrink-0"
                        style={{ background: BRAND, boxShadow: `0 0 8px ${BRAND}` }}
                    />
                    <span className="text-white/80 text-xs font-medium whitespace-nowrap">Ibadan, Nigeria</span>
                </motion.div>
            )}
        </div>
    );
});
LiveGlobe.displayName = 'LiveGlobe';

/* ──────────────────────── Contact Card ─────────────────────────────*/
const BASE_CARD_STYLE = { borderColor: `rgba(${BRAND_RGB},0.14)`, background: `rgba(${BRAND_RGB},0.04)` };
const HOVER_CARD_STYLE = { borderColor: `rgba(${BRAND_RGB},0.35)`, background: `rgba(${BRAND_RGB},0.09)` };

const ContactCard = memo(({ icon: Icon, label, value, link, delay }) => {
    const inner = (
        <div
            className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300"
            style={BASE_CARD_STYLE}
            onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_CARD_STYLE)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, BASE_CARD_STYLE)}
        >
            <div
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                style={{
                    background: `rgba(${BRAND_RGB},0.15)`,
                    border: `1px solid rgba(${BRAND_RGB},0.26)`,
                }}
            >
                <Icon size={18} style={{ color: BRAND }} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-white/30 mb-0.5 font-medium">{label}</p>
                <p className="text-white/80 font-semibold text-sm truncate group-hover:text-white transition-colors">
                    {value}
                </p>
            </div>

            {link && (
                <ExternalLink
                    size={14}
                    className="shrink-0 text-white/20 group-hover:text-white/55 transition-colors"
                    aria-hidden="true"
                />
            )}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {link
                ? <a href={link} className="block" aria-label={`${label}: ${value}`}>{inner}</a>
                : inner
            }
        </motion.div>
    );
});
ContactCard.displayName = 'ContactCard';

/* ─────────────────────── Stars layer ───────────────────────────────*/
/* Extracted to avoid re-rendering the full star list on parent state changes */
const StarField = memo(({ stars }) => (
    <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{ contain: 'strict' }}
    >
        {stars.map(s => (
            <div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                    width: s.size,
                    height: s.size,
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    opacity: s.opacity,
                    animation: `loc-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
                }}
            />
        ))}
    </div>
));
StarField.displayName = 'StarField';

/* ─────────────────────── Main Section ─────────────────────────────*/
const churchAddress = '13 Ayo Oluwole Street, Bodija Akintola Road, adjacent Raian Pharmacy, Iyana Bodija, Ibadan';

const MAP_EMBED_URL =
    `https://maps.google.com/maps?q=${IBADAN_LAT},${IBADAN_LNG}` +
    `&z=17&hl=en&output=embed`;

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(churchAddress)}`;

const contactInfo = [
    { icon: Phone, label: 'Phone', value: '08063176234', link: 'tel:08063176234' },
    { icon: Mail, label: 'Email', value: 'admin@gcccibadan.org', link: 'mailto:admin@gcccibadan.org' },
];

/* Slice is stable — compute once outside component */
const SECTION_STARS = SHARED_STARS.slice(0, 60);

export const LocationSection = memo(() => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
    const rafRef = useRef(null);
    const isTouch = useMemo(() => isTouchDevice(), []);

    /* Motion values for subtle 3D tilt — skipped entirely on touch devices */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 80, damping: 28 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), { stiffness: 80, damping: 28 });

    /* RAF-throttled mouse handler — skipped on touch */
    const handleMouseMove = useCallback(e => {
        if (isTouch) return;
        if (rafRef.current) return;              // already scheduled
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const rect = sectionRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
        });
    }, [isTouch, mouseX, mouseY]);

    /* Reset tilt on mouse leave */
    const handleMouseLeave = useCallback(() => {
        if (isTouch) return;
        mouseX.set(0);
        mouseY.set(0);
    }, [isTouch, mouseX, mouseY]);

    /* Cleanup RAF on unmount */
    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    /* Inline box-shadow toggle helpers */
    const handleDirectionsEnter = useCallback(e => {
        e.currentTarget.style.boxShadow = `0 0 50px rgba(${BRAND_RGB},0.52)`;
    }, []);
    const handleDirectionsLeave = useCallback(e => {
        e.currentTarget.style.boxShadow = `0 0 28px rgba(${BRAND_RGB},0.28)`;
    }, []);

    return (
        <section
            id="contact"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden"
            style={{ background: PAGE_BG }}
        >
            <style>{`
                @keyframes loc-twinkle {
                    from { opacity: 0.04; }
                    to   { opacity: 0.55; }
                }
                @keyframes loc-float {
                    0%, 100% { transform: translateY(0);   }
                    50%      { transform: translateY(-8px); }
                }
                .loc-float {
                    animation: loc-float 7s ease-in-out infinite;
                    will-change: transform;
                }
                /* Respect reduced-motion preference */
                @media (prefers-reduced-motion: reduce) {
                    .loc-float,
                    [style*="animate-spin"],
                    [style*="animate-pulse"] {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* Stars */}
            <StarField stars={SECTION_STARS} />

            {/* Ambient glow blobs */}
            <div
                aria-hidden="true"
                className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
                style={{ background: `rgba(${BRAND_RGB},0.07)` }}
            />
            <div
                aria-hidden="true"
                className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
                style={{ background: `rgba(${BRAND_RGB},0.05)` }}
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-10 sm:mb-16"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 sm:mb-6"
                        style={{
                            border: `1px solid rgba(${BRAND_RGB},0.25)`,
                            background: `rgba(${BRAND_RGB},0.09)`,
                        }}
                    >
                        <Globe size={12} style={{ color: BRAND }} aria-hidden="true" />
                        <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: BRAND }}
                        >
                            Visit Us
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-4 sm:mb-5 tracking-tight">
                        Find Your{' '}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, ${BRAND} 0%, #8de4ff 50%, ${BRAND} 100%)`,
                            }}
                        >
                            Way Home
                        </span>
                    </h2>

                    <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
                        We would love to welcome you. Come and experience God&apos;s presence with us,
                        there is always a place for you here.
                    </p>
                </motion.div>

                {/* ── Two-column grid ── */}
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

                    {/* Globe — hidden below sm to keep mobile lightweight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        /* Tilt disabled on touch devices */
                        style={isTouch ? { transformPerspective: 1000 } : { rotateX, rotateY, transformPerspective: 1000 }}
                        className="relative flex flex-col items-center sm:flex"
                    >
                        <div className="relative loc-float w-full">
                            <div
                                className="absolute inset-[10%] rounded-full blur-[80px] pointer-events-none"
                                style={{ background: `rgba(${BRAND_RGB},0.12)` }}
                                aria-hidden="true"
                            />
                            <LiveGlobe />
                        </div>
                        <div
                            className="w-2/3 h-4 rounded-full blur-2xl -mt-2 pointer-events-none"
                            style={{ background: `rgba(${BRAND_RGB},0.18)` }}
                            aria-hidden="true"
                        />
                    </motion.div>

                    {/* Info panel */}
                    <div className="space-y-3 sm:space-y-4">

                        {/* Address card */}
                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                            className="p-4 sm:p-6 rounded-2xl"
                            style={{
                                border: `1px solid rgba(${BRAND_RGB},0.20)`,
                                background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.09) 0%, rgba(${BRAND_RGB},0.02) 100%)`,
                            }}
                        >
                            <div className="flex gap-3 sm:gap-4">
                                <div
                                    className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: `rgba(${BRAND_RGB},0.16)`,
                                        border: `1px solid rgba(${BRAND_RGB},0.28)`,
                                    }}
                                >
                                    <MapPin size={18} style={{ color: BRAND }} aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1 font-medium">
                                        Our Location
                                    </p>
                                    <p className="text-white/80 font-semibold text-sm leading-relaxed">
                                        {churchAddress}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact cards */}
                        <div className="space-y-3">
                            {contactInfo.map((info, i) => (
                                <ContactCard key={info.label} {...info} delay={0.35 + i * 0.1} />
                            ))}
                        </div>

                        {/* Map embed */}
                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ border: `1px solid rgba(${BRAND_RGB},0.16)` }}
                        >
                            <div className="relative h-44 sm:h-56">
                                <iframe
                                    title="GCCC Ibadan Church Location Map"
                                    src={MAP_EMBED_URL}
                                    width="100%"
                                    height="100%"
                                    style={{
                                        border: 0,
                                        filter: 'invert(90%) hue-rotate(175deg) saturate(0.80) brightness(0.72)',
                                        position: 'absolute',
                                        inset: 0,
                                    }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </motion.div>

                        {/* Directions CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
                        >
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Get directions to Glory Centre Community Church"
                                className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-bold text-white text-sm tracking-wide transition-all duration-300 touch-manipulation"
                                style={{
                                    background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                                    boxShadow: `0 0 28px rgba(${BRAND_RGB},0.28)`,
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                                onMouseEnter={handleDirectionsEnter}
                                onMouseLeave={handleDirectionsLeave}
                            >
                                <Navigation
                                    size={17}
                                    className="group-hover:rotate-12 transition-transform duration-300"
                                    aria-hidden="true"
                                />
                                Get Directions
                                <ExternalLink size={13} className="opacity-60" aria-hidden="true" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
});

LocationSection.displayName = 'LocationSection';
export default LocationSection;