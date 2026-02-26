import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

// ─── Constants outside component — never re-created ───────────────────────────
const SPACING = {
    navbarHeight: 'h-20',
    topPadding: 'h-10',
    sectionGap: 'h-8 sm:h-10 lg:h-12',
    elementGap: 'h-6 sm:h-8 lg:h-10',
    compactGap: 'h-5 sm:h-6 lg:h-7',
    tinyGap: 'h-4 sm:h-5 lg:h-6',
    imagesPadding: 'h-14 sm:h-16 lg:h-18',
    bottomPadding: 'pb-16 sm:pb-10 lg:pb-5',
};

const ALL_IMAGES = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    url: `/images/home/hero/hero${i + 1}.jpg`,
    alt: `Church image ${i + 1}`,
}));

const SELECTED_IMAGES = ALL_IMAGES.slice(0, 7);

const CARD_TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };
const HOVER_TRANSITION = { duration: 0.2 };

// ─── Shared card sub-components ───────────────────────────────────────────────
const CardOverlay = memo(() => (
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 group-hover:from-black/30 transition-colors duration-200" />
));
CardOverlay.displayName = 'CardOverlay';

const CardCornerAccents = memo(() => (
    <>
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </>
));
CardCornerAccents.displayName = 'CardCornerAccents';

// ─── useBreakpoint ─────────────────────────────────────────────────────────────
const MQ_MOBILE = '(max-width: 639px)';
const MQ_TABLET = '(min-width: 640px) and (max-width: 1023px)';

function useBreakpoint() {
    const [bp, setBp] = useState(() => ({
        isMobile: typeof window !== 'undefined' && window.matchMedia(MQ_MOBILE).matches,
        isTablet: typeof window !== 'undefined' && window.matchMedia(MQ_TABLET).matches,
    }));

    useEffect(() => {
        const mqMobile = window.matchMedia(MQ_MOBILE);
        const mqTablet = window.matchMedia(MQ_TABLET);
        const handler = () => setBp({ isMobile: mqMobile.matches, isTablet: mqTablet.matches });
        mqMobile.addEventListener('change', handler);
        mqTablet.addEventListener('change', handler);
        return () => {
            mqMobile.removeEventListener('change', handler);
            mqTablet.removeEventListener('change', handler);
        };
    }, []);

    return bp;
}

// ─── Desktop Card ─────────────────────────────────────────────────────────────
const DesktopCard = memo(({ image, index, total, isSpread }) => {
    const centerIndex = Math.floor(total / 2);
    const offset = index - centerIndex;
    const isCenterCard = offset === 0;

    const spread = useMemo(() => {
        if (!isSpread) return { x: 0, y: 0, rotate: 0, zIndex: total - index };
        return {
            x: offset * 190,
            y: -(Math.abs(offset) ** 2) * 8,
            rotate: offset * 3,
            zIndex: total - Math.abs(offset),
        };
    }, [isSpread, offset, total, index]);

    return (
        <motion.div
            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
            animate={{ x: spread.x, y: spread.y, rotate: spread.rotate, scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08, rotate: 0, y: spread.y - 15, zIndex: 100, transition: HOVER_TRANSITION }}
            transition={{ ...CARD_TRANSITION, delay: 1 + index * 0.08 }}
            style={{ zIndex: spread.zIndex }}
            className="absolute cursor-pointer group"
        >
            <div className="absolute -inset-1 bg-gradient-to-b from-[#0998d5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
                className={`relative overflow-hidden shadow border-4 border-white dark:border-gray-800 ${isCenterCard ? 'ring-2 ring-[#0998d5]/50' : 'ring-1 ring-white/80'}`}
                style={{ width: 260, height: 310 }}
            >
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
                <CardOverlay />
                <CardCornerAccents />
            </div>
        </motion.div>
    );
});
DesktopCard.displayName = 'DesktopCard';

// ─── Tablet Card ──────────────────────────────────────────────────────────────
const TabletCard = memo(({ image, index, total, isSpread }) => {
    const centerIndex = Math.floor(total / 2);
    const offset = index - centerIndex;
    const isCenterCard = offset === 0;

    const spread = useMemo(() => {
        if (!isSpread) return { x: 0, y: 0, rotate: 0, zIndex: total - index };
        return {
            x: offset * 105,
            y: 0,
            rotate: offset * 2.5,
            zIndex: total - Math.abs(offset),
        };
    }, [isSpread, offset, total, index]);

    return (
        <motion.div
            initial={{ x: 0, y: 0, rotate: 0, scale: 0.9, opacity: 0 }}
            animate={{ x: spread.x, y: spread.y, rotate: spread.rotate, scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 100, transition: HOVER_TRANSITION }}
            transition={{ ...CARD_TRANSITION, delay: 1 + index * 0.08 }}
            style={{ zIndex: spread.zIndex }}
            className="absolute cursor-pointer group"
        >
            <div className="absolute -inset-1 bg-gradient-to-b from-[#0998d5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
                className={`relative overflow-hidden shadow border-4 border-white dark:border-gray-800 ${isCenterCard ? 'ring-2 ring-[#0998d5]/50' : 'ring-1 ring-white/80'}`}
                style={{ width: 190, height: 260 }}
            >
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
                <CardOverlay />
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </motion.div>
    );
});
TabletCard.displayName = 'TabletCard';

// ─── Mobile Masonry ───────────────────────────────────────────────────────────
const MOBILE_OVERLAY = (
    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
);

const MobileImage = memo(({ image, delay, className, style }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        whileTap={{ scale: 0.95 }}
        className={`relative overflow-hidden shadow ring-1 ring-white/80 ${className}`}
        style={style}
    >
        <img src={image.url} alt={image.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        {MOBILE_OVERLAY}
    </motion.div>
));
MobileImage.displayName = 'MobileImage';

const MobileMasonry = memo(() => (
    <div className="w-full max-w-lg mx-auto px-4">
        <div className="grid grid-cols-3 gap-3">
            <MobileImage image={SELECTED_IMAGES[0]} delay={1} className="col-span-2 row-span-2" style={{ height: 280 }} />
            <MobileImage image={SELECTED_IMAGES[1]} delay={1.08} className="col-span-1" style={{ height: 136 }} />
            <MobileImage image={SELECTED_IMAGES[2]} delay={1.16} className="col-span-1" style={{ height: 136 }} />
            <MobileImage image={SELECTED_IMAGES[3]} delay={1.24} className="col-span-1" style={{ height: 136 }} />
            <MobileImage image={SELECTED_IMAGES[4]} delay={1.32} className="col-span-1" style={{ height: 136 }} />
            <MobileImage image={SELECTED_IMAGES[5]} delay={1.40} className="col-span-1" style={{ height: 136 }} />
            <MobileImage image={SELECTED_IMAGES[6]} delay={1.50} className="col-span-3" style={{ height: 120 }} />
        </div>
    </div>
));
MobileMasonry.displayName = 'MobileMasonry';

// ─── Hero Background ──────────────────────────────────────────────────────────
const HeroBackground = memo(() => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-cyan-50/30 to-white dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-gray-900" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,rgba(59,130,246,0.06)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.8) 1.5px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(59,130,246,0.5) 1.5px,transparent 1.5px)', backgroundSize: '80px 80px' }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(59,130,246,0.4) 12px,rgba(59,130,246,0.4) 14px)' }} />
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/12 via-cyan-400/6 to-transparent" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-500/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white dark:from-gray-900 via-white/98 dark:via-gray-900/98 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-gray-900" />
    </div>
));
HeroBackground.displayName = 'HeroBackground';

// ─── Motion variants ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay },
});

const fadeDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 },
};

// ─── Main Component ────────────────────────────────────────────────────────────
const HeroSection = () => {
    const [isSpread, setIsSpread] = useState(false);
    const { isMobile, isTablet } = useBreakpoint();
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => setIsSpread(true), 600);
        return () => clearTimeout(timerRef.current);
    }, []);

    const isDesktop = !isMobile && !isTablet;

    return (
        <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-900">

            <HeroBackground />

            <div className="container mx-auto px-2">
                <div className="relative z-10 flex flex-col min-h-screen lg:h-screen lg:min-h-0">

                    {/* <div className={SPACING.navbarHeight} /> */}
                    <div className={SPACING.topPadding} />

                    {/* Badge */}
                    <motion.div {...fadeDown} className="text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-[#0998d5]/30 dark:border-[#0998d5]/40 shadow">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-[#0998d5] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 bg-[#0998d5]" />
                            </div>
                            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#0998d5]">
                                Glory Centre Community Church
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#0998d5]" />
                        </div>
                    </motion.div>

                    <div className={SPACING.elementGap} />

                    {/* Heading */}
                    <motion.h1
                        {...fadeUp(0.4)}
                        className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight"
                    >
                        <span className="block text-gray-900 dark:text-white">Where God Meets With</span>
                        <span className="block mt-1 text-[#0998d5]">His People</span>
                    </motion.h1>

                    <div className={SPACING.compactGap} />

                    {/* Description */}
                    <motion.p
                        {...fadeUp(0.6)}
                        className="text-center text-base sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto px-4"
                    >
                        Join our vibrant community of believers rooted and growing in the{' '}
                        <span className="font-semibold text-[#0998d5]">Grace and Knowledge of God</span>.
                    </motion.p>

                    <div className={SPACING.elementGap} />

                    {/* CTA */}
                    <motion.div {...fadeUp(0.8)} className="text-center">
                        <Link
                            to="/#contact"
                            onClick={e => {
                                // If already on the home page, smooth-scroll instead of navigating
                                const el = document.getElementById('contact');
                                if (el) {
                                    e.preventDefault();
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    window.history.pushState(null, '', '/#contact');
                                }
                            }}
                            className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 lg:py-3.5 bg-[#0998d5] text-white font-semibold text-sm sm:text-base lg:text-sm shadow hover:bg-[#0886bd] transition-colors duration-200"
                        >
                            <span>Join Our Community</span>
                            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    <div className={SPACING.imagesPadding} />

                    {/* Images */}
                    <div className={`flex-1 flex items-center justify-center ${SPACING.bottomPadding}`}>

                        {/* Desktop */}
                        {isDesktop && (
                            <div className="relative w-full">
                                <div className="relative h-[320px] lg:h-[300px] flex items-end justify-center">
                                    {SELECTED_IMAGES.map((image, index) => (
                                        <DesktopCard
                                            key={image.id}
                                            image={image}
                                            index={index}
                                            total={SELECTED_IMAGES.length}
                                            isSpread={isSpread}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tablet */}
                        {isTablet && (
                            <div className="relative w-full">
                                <div className="relative h-[280px] flex items-center justify-center">
                                    {SELECTED_IMAGES.map((image, index) => (
                                        <TabletCard
                                            key={image.id}
                                            image={image}
                                            index={index}
                                            total={SELECTED_IMAGES.length}
                                            isSpread={isSpread}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Mobile */}
                        {isMobile && isSpread && <MobileMasonry />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;