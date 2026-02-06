import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

// Centralized spacing configuration for consistency
const SPACING = {
    navbarHeight: 'h-20',
    topPadding: 'h-16 sm:h-20 lg:h-20',        // After navbar
    sectionGap: 'h-8 sm:h-10 lg:h-12',         // Between major sections
    elementGap: 'h-6 sm:h-8 lg:h-10',          // Between elements
    compactGap: 'h-5 sm:h-6 lg:h-7',           // Between closely related items
    tinyGap: 'h-4 sm:h-5 lg:h-6',              // For subtle spacing
    imagesPadding: 'h-14 sm:h-16 lg:h-18',     // Before images
    bottomPadding: 'pb-16 sm:pb-10 lg:pb-5',  // Images container bottom
};

const GcccHeroSection = () => {
    const [isSpread, setIsSpread] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Memoized images array
    const images = useMemo(() => [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=500&h=600&fit=crop',
            alt: 'Church community',
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=500&h=600&fit=crop',
            alt: 'Worship gathering',
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=600&fit=crop',
            alt: 'Fellowship',
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&h=600&fit=crop',
            alt: 'Prayer meeting',
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=600&fit=crop',
            alt: 'Community service',
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop',
            alt: 'Youth group',
        },
        {
            id: 7,
            url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop',
            alt: 'Celebration',
        },
    ], []);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        const timer = setTimeout(() => {
            setIsSpread(true);
        }, 600);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Optimized position calculator - Desktop
    const getDesktopCardPosition = useCallback((index, total) => {
        if (!isSpread) {
            return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: total - index };
        }

        const centerIndex = Math.floor(total / 2);
        const offset = index - centerIndex;
        const xOffset = offset * 190;
        const distanceFromCenter = Math.abs(offset);
        const yOffset = -distanceFromCenter * distanceFromCenter * 8;
        const rotation = offset * 3;

        return {
            x: xOffset,
            y: yOffset,
            rotate: rotation,
            scale: 1,
            zIndex: total - Math.abs(offset),
        };
    }, [isSpread]);

    // Optimized position calculator - Tablet
    const getTabletCardPosition = useCallback((index, total) => {
        if (!isSpread) {
            return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: total - index };
        }

        const centerIndex = Math.floor(total / 2);
        const offset = index - centerIndex;
        const xOffset = offset * 105;
        const rotation = offset * 2.5;

        return {
            x: xOffset,
            y: 0,
            rotate: rotation,
            scale: 1,
            zIndex: total - Math.abs(offset),
        };
    }, [isSpread]);

    return (
        <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-900">

            {/* Beautiful Background - Full Width with Blurred Image and Perfect White Fade */}
            <div className="absolute inset-0 pointer-events-none">

                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-cyan-50/30 to-white dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-gray-900" />

                {/* Accent gradients */}
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-3xl" />
                <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,rgba(59,130,246,0.06)_40%,transparent_70%)] blur-3xl" />

                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.8) 1.5px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1.5px, transparent 1.5px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Diagonal lines */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(59, 130, 246, 0.4) 12px, rgba(59, 130, 246, 0.4) 14px)',
                    }}
                />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/12 via-cyan-400/6 to-transparent" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-500/10 to-transparent" />

                {/* Top edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent" />

                {/* Multi-layer white fade for seamless blend */}
                <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white dark:from-gray-900 via-white/98 dark:via-gray-900/98 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-gray-900" />
            </div>

            {/* Main Content - Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 flex flex-col min-h-screen lg:h-screen lg:min-h-0">

                    {/* Navbar Height Spacer */}
                    <div className={SPACING.navbarHeight} />

                    {/* Top Padding - Increased breathing room */}
                    <div className={SPACING.topPadding} />

                    {/* Church Name Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-[#0998d5]/30 dark:border-[#0998d5]/40 shadow group">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-[#0998d5] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 bg-[#0998d5]" />
                            </div>
                            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#0998d5] dark:text-[#0998d5]">
                                Glory Centre Community Church
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#0998d5]" />
                        </div>
                    </motion.div>

                    {/* Spacing after badge */}
                    <div className={SPACING.elementGap} />

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight"
                    >
                        <span className="block text-gray-900 dark:text-white">
                            Where God Meets With
                        </span>
                        <span className="block mt-1 text-[#0998d5] dark:text-[#0998d5]">
                            His People
                        </span>
                    </motion.h1>

                    {/* Spacing after heading */}
                    <div className={SPACING.compactGap} />

                    {/* Description Text */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-center text-base sm:text-base md:text-lg lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto px-4"
                    >
                        Join our vibrant community of believers rooted and growing in the{' '}
                        <span className="font-semibold text-[#0998d5] dark:text-[#0998d5]">Grace and Knowledge of God</span>.
                    </motion.p>

                    {/* Spacing after description */}
                    <div className={SPACING.elementGap} />

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-center"
                    >
                        <button className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 lg:py-3.5 bg-[#0998d5] text-white font-semibold text-sm sm:text-base lg:text-sm shadow hover:bg-[#0886bd] transition-colors duration-200">
                            <span>Join Our Community</span>
                            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </motion.div>

                    {/* Spacing before images - Generous gap */}
                    <div className={SPACING.imagesPadding} />

                    {/* Images Section */}
                    <div className={`flex-1 flex items-center justify-center ${SPACING.bottomPadding}`}>

                        {/* DESKTOP: Card Spreading */}
                        {!isMobile && !isTablet && (
                            <div className="relative w-full">
                                <div className="relative h-[320px] lg:h-[300px] flex items-end justify-center">
                                    {images.map((image, index) => {
                                        const position = getDesktopCardPosition(index, images.length);
                                        const centerIndex = Math.floor(images.length / 2);
                                        const isCenterCard = index === centerIndex;

                                        return (
                                            <motion.div
                                                key={image.id}
                                                initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
                                                animate={{
                                                    x: position.x,
                                                    y: position.y,
                                                    rotate: position.rotate,
                                                    scale: position.scale,
                                                    opacity: 1
                                                }}
                                                whileHover={{
                                                    scale: 1.08,
                                                    rotate: 0,
                                                    y: position.y - 15,
                                                    zIndex: 100,
                                                    transition: { duration: 0.2 }
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    delay: 1 + index * 0.08,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                style={{ zIndex: position.zIndex }}
                                                className="absolute cursor-pointer group"
                                            >
                                                {/* Decorative outer glow */}
                                                <div className="absolute -inset-1 bg-gradient-to-b from-[#0998d5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div
                                                    className={`relative overflow-hidden shadow ${isCenterCard ? 'ring-2 ring-[#0998d5]/50' : 'ring-1 ring-white/80'} border-4 border-white dark:border-gray-800`}
                                                    style={{
                                                        width: '260px',
                                                        height: '310px',
                                                    }}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 group-hover:from-black/30 transition-colors duration-200" />

                                                    {/* Decorative corner accent */}
                                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TABLET: Overlapping Row */}
                        {isTablet && (
                            <div className="relative w-full">
                                <div className="relative h-[280px] flex items-center justify-center">
                                    {images.map((image, index) => {
                                        const position = getTabletCardPosition(index, images.length);
                                        const centerIndex = Math.floor(images.length / 2);
                                        const isCenterCard = index === centerIndex;

                                        return (
                                            <motion.div
                                                key={image.id}
                                                initial={{ x: 0, y: 0, rotate: 0, scale: 0.9, opacity: 0 }}
                                                animate={{
                                                    x: position.x,
                                                    y: position.y,
                                                    rotate: position.rotate,
                                                    scale: 1,
                                                    opacity: 1
                                                }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 0,
                                                    zIndex: 100,
                                                    transition: { duration: 0.2 }
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    delay: 1 + index * 0.08,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                style={{ zIndex: position.zIndex }}
                                                className="absolute cursor-pointer group"
                                            >
                                                <div className="absolute -inset-1 bg-gradient-to-b from-[#0998d5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div
                                                    className={`relative overflow-hidden shadow ${isCenterCard ? 'ring-2 ring-[#0998d5]/50' : 'ring-1 ring-white/80'} border-3 border-white dark:border-gray-800`}
                                                    style={{
                                                        width: '190px',
                                                        height: '260px',
                                                    }}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 group-hover:from-black/30 transition-colors duration-200" />

                                                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-[#0998d5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* MOBILE: Masonry Grid */}
                        {isMobile && isSpread && (
                            <div className="w-full max-w-lg mx-auto px-4">
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Large featured image */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="col-span-2 row-span-2 relative overflow-hidden shadow ring-1 ring-white/80"
                                    >
                                        <img src={images[0].url} alt={images[0].alt} className="w-full h-full object-cover" style={{ height: '280px' }} loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
                                    </motion.div>

                                    {/* Side images */}
                                    {[1, 2].map((idx, i) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 1 + (i + 1) * 0.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="col-span-1 relative overflow-hidden shadow ring-1 ring-white/80"
                                            style={{ height: '136px' }}
                                        >
                                            <img src={images[idx].url} alt={images[idx].alt} className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
                                        </motion.div>
                                    ))}

                                    {/* Bottom row */}
                                    {[3, 4, 5].map((idx, i) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 1 + (i + 3) * 0.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="col-span-1 relative overflow-hidden shadow ring-1 ring-white/80"
                                            style={{ height: '136px' }}
                                        >
                                            <img src={images[idx].url} alt={images[idx].alt} className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
                                        </motion.div>
                                    ))}

                                    {/* Wide bottom image */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: 1.5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="col-span-3 relative overflow-hidden shadow ring-1 ring-white/80"
                                        style={{ height: '120px' }}
                                    >
                                        <img src={images[6].url} alt={images[6].alt} className="w-full h-full object-cover" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default GcccHeroSection;