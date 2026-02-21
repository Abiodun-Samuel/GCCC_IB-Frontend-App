import {
    memo, useRef, useCallback, useState, useEffect, useLayoutEffect, Suspense, lazy, useMemo,
} from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, Navigation, Phone, Mail, ExternalLink, Globe, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────── TOKENS ──────────────────────────────*/
export const PAGE_BG = '#020c16';
export const BRAND = '#0998d5';
export const BRAND_RGB = '9,152,213';
const BRAND_DARK = '#0777a8';

/* ─────────────────────── Deterministic star field ────────────────────*/
export const SHARED_STARS = Array.from({ length: 140 }, (_, i) => ({
    id: i,
    size: Math.sin(i * 7.31) > 0.80 ? 2.5 : Math.sin(i * 3.11) > 0.65 ? 1.5 : 1,
    top: ((Math.sin(i * 3.71) * 0.5 + 0.5) * 100).toFixed(3),
    left: ((Math.cos(i * 5.13) * 0.5 + 0.5) * 100).toFixed(3),
    opacity: (Math.abs(Math.sin(i * 2.93)) * 0.50 + 0.05).toFixed(3),
    dur: (2.5 + Math.abs(Math.sin(i * 1.37)) * 5).toFixed(2),
    delay: (Math.abs(Math.cos(i * 4.71)) * 6).toFixed(2),
}));

/* ─────────────────────── Touch-device detection ──────────────────────*/
const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ══════════════════════════════════════════════════════════════════════
   RESPONSIVE SIZE HOOK
   Measures the wrapper synchronously on mount (useLayoutEffect) to
   prevent the 420 → real-width flash on mobile, then tracks changes
   via ResizeObserver with a RAF-debounce for performance.
   Returns 0 until the first measurement so the globe never renders
   at a wrong size.
   ══════════════════════════════════════════════════════════════════════*/
function useContainerSize(ref) {
    const [size, setSize] = useState(0);
    const rafRef = useRef(null);

    // Synchronous first measure — prevents layout flash
    useLayoutEffect(() => {
        if (ref.current) {
            setSize(ref.current.offsetWidth);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setSize(el.offsetWidth);
            });
        };

        const ro = new ResizeObserver(measure);
        ro.observe(el);

        return () => {
            ro.disconnect();
            cancelAnimationFrame(rafRef.current);
        };
    }, [ref]);

    return size;
}

/* ══════════════════════════════════════════════════════════════════════
   GLOBE
   ══════════════════════════════════════════════════════════════════════*/
const GlobeGL = lazy(() => import('react-globe.gl'));

const IBADAN_LAT = 7.44;
const IBADAN_LNG = 3.89;

const PIN_DATA = [{ lat: IBADAN_LAT, lng: IBADAN_LNG, label: 'Glory Centre Community Church', size: 0.55, color: BRAND }];
const RING_DATA = [{ lat: IBADAN_LAT, lng: IBADAN_LNG, maxR: 4, propagationSpeed: 1.6, repeatPeriod: 850 }];
const RING_COLOR_FN = () => BRAND;
const POINT_ALTITUDE = 0.02;

const LiveGlobe = memo(() => {
    const wrapRef = useRef(null);
    const globeRef = useRef(null);
    const size = useContainerSize(wrapRef);
    const [ready, setReady] = useState(false);

    // Focus camera on Ibadan once GL is ready
    useEffect(() => {
        if (!ready || !globeRef.current) return;
        globeRef.current.pointOfView({ lat: IBADAN_LAT, lng: IBADAN_LNG, altitude: 2.1 }, 1400);
    }, [ready]);

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
            className="relative w-full"
            style={{
                aspectRatio: '1 / 1',
                maxWidth: 'min(560px, 100%)',
                margin: '0 auto',
                willChange: 'transform',
                contain: 'layout style',
            }}
        >
            {/* Spinner — shown while size is unknown OR globe is loading */}
            {(!ready || size === 0) && (
                <div className="absolute inset-0 flex items-center justify-center z-10" aria-label="Loading globe">{''}
                    <div
                        className="w-10 h-10 rounded-full border-2 border-white/10 animate-spin"
                        style={{ borderTopColor: BRAND }}
                    />
                </div>
            )}

            {/* Only mount GlobeGL once we have a real pixel measurement */}
            {size > 0 && (
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
            )}

            {/* Ibadan badge — bottom-right of globe */}
            {ready && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.55 }}
                    className="absolute bottom-[12%] right-[4%] flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none"
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

/* ══════════════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════*/

const BASE_CARD = { borderColor: `rgba(${BRAND_RGB},0.14)`, background: `rgba(${BRAND_RGB},0.04)` };
const HOVER_CARD = { borderColor: `rgba(${BRAND_RGB},0.35)`, background: `rgba(${BRAND_RGB},0.09)` };

const ContactCard = memo(({ icon: Icon, label, value, link, delay }) => {
    const inner = (
        <div
            className="group flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all duration-300"
            style={BASE_CARD}
            onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_CARD)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, BASE_CARD)}
        >
            <div
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `rgba(${BRAND_RGB},0.15)`, border: `1px solid rgba(${BRAND_RGB},0.26)` }}
            >
                <Icon size={17} style={{ color: BRAND }} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5 font-semibold">{label}</p>
                <p className="text-white/80 font-semibold text-sm truncate group-hover:text-white transition-colors">{value}</p>
            </div>
            {link && <ExternalLink size={13} className="shrink-0 text-white/20 group-hover:text-white/55 transition-colors" aria-hidden />}
        </div>
    );
    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {link ? <a href={link} className="block" aria-label={`${label}: ${value}`}>{inner}</a> : inner}
        </motion.div>
    );
});
ContactCard.displayName = 'ContactCard';

const StarLayer = memo(({ stars, animName }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden style={{ contain: 'strict' }}>
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
                    animation: `${animName} ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
                }}
            />
        ))}
    </div>
));
StarLayer.displayName = 'StarLayer';

const TikTok = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════════════*/
const CHURCH_ADDRESS = 'GCCC Ibadan, 13 Ayo Oluwole Street, Bodija Akintola Road, Bodija, adjacent Raian Pharmacy, Iyana Bodija, Ibadan 200284, Oyo';

const MAP_EMBED_URL = `https://maps.google.com/maps?q=${IBADAN_LAT},${IBADAN_LNG}&z=17&hl=en&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CHURCH_ADDRESS)}`;
const MAPS_LINK = DIRECTIONS_URL;

const CONTACT_INFO = [
    { icon: Phone, label: 'Phone', value: '08063176234', link: 'tel:08063176234' },
    { icon: Mail, label: 'Email', value: 'admin@gcccibadan.org', link: 'mailto:admin@gcccibadan.org' },
];

const SOCIAL_LINKS = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1K8ura74Dc/', label: 'Facebook', hoverBg: '#1877f2' },
    { icon: Instagram, href: 'https://www.instagram.com/gcccibadan?igsh=YmhydmdsemN2M3Mx', label: 'Instagram', hoverBg: '#dd2a7b' },
    { icon: TikTok, href: 'https://www.tiktok.com/@gcccibadan?_r=1&_t=ZS-93jXPQ30QnU', label: 'TikTok', hoverBg: '#010101' },
    { icon: Youtube, href: 'https://www.youtube.com/@GcccIbadan', label: 'YouTube', hoverBg: '#ff0000' },
];

const QUICK_LINKS = [
    { name: 'About Us', href: '#about', isHash: true },
    { name: 'Our Services', href: '#services', isHash: true },
    { name: 'Forms', href: '/forms', isHash: false },
    { name: 'Contact', href: '#contact', isHash: true },
];

const ICON_BASE = { background: `rgba(${BRAND_RGB},0.11)`, border: `1px solid rgba(${BRAND_RGB},0.18)` };
const ICON_HOVER = { background: BRAND, border: `1px solid ${BRAND}` };

/* ══════════════════════════════════════════════════════════════════════
   MAIN FOOTER
   ══════════════════════════════════════════════════════════════════════*/
const Footer = () => {
    const year = new Date().getFullYear();
    const sectionRef = useRef(null);
    const rafRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
    const isTouch = useMemo(() => isTouchDevice(), []);

    /* 3D tilt — pointer only */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 80, damping: 28 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), { stiffness: 80, damping: 28 });

    const handleMouseMove = useCallback(e => {
        if (isTouch || rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const rect = sectionRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
        });
    }, [isTouch, mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        if (isTouch) return;
        mouseX.set(0); mouseY.set(0);
    }, [isTouch, mouseX, mouseY]);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const onDirEnter = useCallback(e => { e.currentTarget.style.boxShadow = `0 0 52px rgba(${BRAND_RGB},0.55)`; }, []);
    const onDirLeave = useCallback(e => { e.currentTarget.style.boxShadow = `0 0 28px rgba(${BRAND_RGB},0.28)`; }, []);

    const handleHash = (e, href) => {
        e.preventDefault();
        document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
    };

    const locStars = SHARED_STARS.slice(0, 70);
    const ftStars = SHARED_STARS.slice(70);

    return (
        <footer
            id="contact"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden"
            style={{ background: PAGE_BG }}
        >
            <style>{`
                @keyframes ft-twinkle {
                    from { opacity: 0.03; }
                    to   { opacity: 0.58; }
                }
                @keyframes ft-float {
                    0%, 100% { transform: translateY(0);    }
                    50%      { transform: translateY(-9px); }
                }
                .ft-float { animation: ft-float 7.5s ease-in-out infinite; will-change: transform; }
                @media (prefers-reduced-motion: reduce) {
                    .ft-float,
                    [class*="animate-spin"],
                    [class*="animate-pulse"] { animation: none !important; }
                }
            `}</style>

            {/* ════════ LOCATION SECTION ════════ */}
            <div className="relative">
                <StarLayer stars={locStars} animName="ft-twinkle" />

                <div aria-hidden className="absolute top-1/3 -left-48 w-[560px] h-[560px] rounded-full blur-[150px] pointer-events-none"
                    style={{ background: `rgba(${BRAND_RGB},0.07)` }} />
                <div aria-hidden className="absolute bottom-0 -right-40 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
                    style={{ background: `rgba(${BRAND_RGB},0.05)` }} />

                <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center mb-10 sm:mb-16"
                    >
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                            style={{ border: `1px solid rgba(${BRAND_RGB},0.25)`, background: `rgba(${BRAND_RGB},0.09)` }}
                        >
                            <Globe size={11} style={{ color: BRAND }} aria-hidden />
                            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: BRAND }}>
                                Visit Us
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none mb-4 tracking-tight">
                            Find Your{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: `linear-gradient(90deg, ${BRAND} 0%, #8de4ff 50%, ${BRAND} 100%)` }}
                            >
                                Way Home
                            </span>
                        </h2>

                        <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
                            We would love to welcome you. Come and experience God&apos;s presence with us —
                            there is always a place for you here.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

                        {/* Globe column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                            style={isTouch ? { transformPerspective: 1000 } : { rotateX, rotateY, transformPerspective: 1000 }}
                            className="flex flex-col items-center order-first lg:order-none"
                        >
                            <div className="ft-float relative w-full">
                                <div
                                    aria-hidden
                                    className="absolute inset-[8%] rounded-full blur-[90px] pointer-events-none"
                                    style={{ background: `rgba(${BRAND_RGB},0.13)` }}
                                />
                                <LiveGlobe />
                            </div>
                            <div
                                aria-hidden
                                className="w-3/5 h-5 rounded-full blur-2xl -mt-3 pointer-events-none"
                                style={{ background: `rgba(${BRAND_RGB},0.20)` }}
                            />
                        </motion.div>

                        {/* Info panel */}
                        <div className="space-y-3 sm:space-y-4">

                            <motion.div
                                initial={{ opacity: 0, x: 28 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                                className="p-4 sm:p-5 rounded-2xl"
                                style={{
                                    border: `1px solid rgba(${BRAND_RGB},0.20)`,
                                    background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.09) 0%, rgba(${BRAND_RGB},0.02) 100%)`,
                                }}
                            >
                                <div className="flex gap-3 sm:gap-4">
                                    <div
                                        className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                                        style={{ background: `rgba(${BRAND_RGB},0.16)`, border: `1px solid rgba(${BRAND_RGB},0.28)` }}
                                    >
                                        <MapPin size={18} style={{ color: BRAND }} aria-hidden />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-semibold">Our Location</p>
                                        <p className="text-white/80 font-semibold text-sm leading-relaxed">{CHURCH_ADDRESS}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="space-y-3">
                                {CONTACT_INFO.map((info, i) => (
                                    <ContactCard key={info.label} {...info} delay={0.32 + i * 0.1} />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 28 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
                                className="rounded-2xl overflow-hidden"
                                style={{ border: `1px solid rgba(${BRAND_RGB},0.16)` }}
                            >
                                <div className="relative h-44 sm:h-52">
                                    <iframe
                                        title="GCCC Ibadan Church Location"
                                        src={MAP_EMBED_URL}
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            filter: 'invert(90%) hue-rotate(175deg) saturate(0.80) brightness(0.70)',
                                            position: 'absolute',
                                            inset: 0,
                                        }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 28 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.64 }}
                            >
                                <a
                                    href={DIRECTIONS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Get directions to Glory Centre Community Church"
                                    className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-bold text-white text-sm tracking-wide transition-all duration-300 touch-manipulation"
                                    style={{
                                        background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                                        boxShadow: `0 0 28px rgba(${BRAND_RGB},0.28)`,
                                        WebkitTapHighlightColor: 'transparent',
                                    }}
                                    onMouseEnter={onDirEnter}
                                    onMouseLeave={onDirLeave}
                                >
                                    <Navigation
                                        size={16}
                                        className="group-hover:rotate-12 transition-transform duration-300"
                                        aria-hidden
                                    />
                                    Get Directions
                                    <ExternalLink size={13} className="opacity-55" aria-hidden />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════ FOOTER LINKS ════════ */}
            <div className="relative">
                <StarLayer stars={ftStars} animName="ft-twinkle" />

                <div aria-hidden className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none -translate-y-1/3 translate-x-1/3"
                    style={{ background: `rgba(${BRAND_RGB},0.06)` }} />
                <div aria-hidden className="absolute bottom-0 left-0 w-[340px] h-[340px] rounded-full blur-[110px] pointer-events-none translate-y-1/3 -translate-x-1/4"
                    style={{ background: `rgba(${BRAND_RGB},0.05)` }} />

                <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-14 pb-16 lg:pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">

                        {/* Brand + social */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-5 space-y-6"
                        >
                            <div className="space-y-3">
                                <Link to="/" className="inline-block">
                                    <img src="/images/logo/logo-white.png" alt="Glory Centre Community Church" className="h-14 w-auto" />
                                </Link>
                                <p className="text-sm leading-relaxed text-white/35 max-w-xs">
                                    GCCCIBADAN is a growing community of close-knit believers in Bodija and environs,
                                    extending the frontiers of the Kingdom on all sides.
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold mb-3"
                                    style={{ color: `rgba(${BRAND_RGB},0.48)` }}>
                                    Find us online
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {SOCIAL_LINKS.map(s => {
                                        const Icon = s.icon;
                                        return (
                                            <motion.a
                                                key={s.label}
                                                href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={s.label}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.94 }}
                                                className="p-2.5 rounded-xl text-white/40 hover:text-white transition-colors duration-300"
                                                style={{ background: `rgba(${BRAND_RGB},0.08)`, border: `1px solid rgba(${BRAND_RGB},0.14)` }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = s.hoverBg;
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                    e.currentTarget.style.color = '#fff';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = `rgba(${BRAND_RGB},0.08)`;
                                                    e.currentTarget.style.borderColor = `rgba(${BRAND_RGB},0.14)`;
                                                }}
                                            >
                                                <Icon className="w-[18px] h-[18px]" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Pages */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-3 space-y-5"
                        >
                            <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Pages</h4>
                            <ul className="space-y-3">
                                {QUICK_LINKS.map(link => (
                                    <li key={link.name}>
                                        {link.isHash ? (
                                            <a
                                                href={link.href}
                                                onClick={e => handleHash(e, link.href)}
                                                className="group inline-flex items-center gap-2 text-sm text-white/38 hover:text-white transition-all duration-300"
                                            >
                                                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" style={{ color: BRAND }} />
                                                <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                                            </a>
                                        ) : (
                                            <Link
                                                to={link.href}
                                                className="group inline-flex items-center gap-2 text-sm text-white/38 hover:text-white transition-all duration-300"
                                            >
                                                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" style={{ color: BRAND }} />
                                                <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Reach Out */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="sm:col-span-2 lg:col-span-4 space-y-5"
                        >
                            <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Reach Out</h4>
                            <div className="space-y-1">
                                {[
                                    { href: 'tel:+2348063176234', icon: Phone, text: '0806 317 6234' },
                                    { href: 'mailto:admin@gcccibadan.org', icon: Mail, text: 'admin@gcccibadan.org' },
                                ].map(({ href, icon: Icon, text }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className="group flex items-center gap-3.5 text-sm text-white/38 hover:text-white transition-all duration-300 p-2.5 rounded-xl"
                                        onMouseEnter={e => { e.currentTarget.style.background = `rgba(${BRAND_RGB},0.07)`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div
                                            className="p-2 rounded-lg shrink-0 transition-all duration-300"
                                            style={ICON_BASE}
                                            ref={el => {
                                                if (!el) return;
                                                const a = el.closest('a');
                                                a.addEventListener('mouseenter', () => Object.assign(el.style, ICON_HOVER));
                                                a.addEventListener('mouseleave', () => Object.assign(el.style, ICON_BASE));
                                            }}
                                        >
                                            <Icon size={14} />
                                        </div>
                                        <span className="font-medium">{text}</span>
                                    </a>
                                ))}

                                <a
                                    href={MAPS_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-3.5 text-sm text-white/38 hover:text-white transition-all duration-300 p-2.5 rounded-xl"
                                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${BRAND_RGB},0.07)`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div
                                        className="p-2 rounded-lg shrink-0 mt-0.5 transition-all duration-300"
                                        style={ICON_BASE}
                                        ref={el => {
                                            if (!el) return;
                                            const a = el.closest('a');
                                            a.addEventListener('mouseenter', () => Object.assign(el.style, ICON_HOVER));
                                            a.addEventListener('mouseleave', () => Object.assign(el.style, ICON_BASE));
                                        }}
                                    >
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <span className="font-medium block leading-relaxed">{CHURCH_ADDRESS}</span>
                                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold" style={{ color: BRAND }}>
                                            Open in Maps <ExternalLink size={10} />
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Copyright strip */}
                    <div
                        className="py-6"
                        style={{ borderTop: `1px solid rgba(${BRAND_RGB},0.07)` }}
                    >
                        <p className="text-xs text-white/18 text-center">
                            © {year} Glory Centre Community Church · All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;