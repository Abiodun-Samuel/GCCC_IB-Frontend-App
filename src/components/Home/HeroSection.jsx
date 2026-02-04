import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Calendar, MapPin, ArrowRight } from 'lucide-react';

const heroImages = [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
    'https://images.unsplash.com/photo-1517096851-6a40c02c0835?w=1920&q=80',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=80',
];

const HeroSection = memo(() => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { scrollY } = useScroll();

    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const y = useTransform(scrollY, [0, 400], [0, 100]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleNavClick = (href) => {
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Images */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${heroImages[currentImageIndex]})`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-coral-900/20 via-transparent to-ocean-900/20" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
                style={{ opacity, y }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-8"
                >
                    {/* Tagline */}
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm md:text-base font-medium"
                    >
                        Where God Meets With His People
                    </motion.span>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                        >
                            Welcome to
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-coral-400 to-ocean-400 bg-clip-text text-transparent leading-tight">
                                Glory Centre
                            </h1>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                        >
                            Community Church
                        </motion.h1>
                    </div>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.3 }}
                        className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
                    >
                        Join this vibrant community of believers that are rooted and growing in the Grace and Knowledge of God
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    >
                        <motion.button
                            onClick={() => handleNavClick('#services')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-coral-600 hover:bg-coral-700 text-white font-semibold transition-all duration-300 flex items-center gap-2"
                        >
                            <span>Join Our Service</span>
                            <ArrowRight size={20} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        >
                            <Play size={20} className="fill-white" />
                            <span>Watch Live</span>
                        </motion.button>
                    </motion.div>

                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.7 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-12"
                    >
                        <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
                            <div className="p-3 bg-coral-600/20">
                                <Calendar className="text-coral-300" size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-white/60 text-xs md:text-sm mb-1">Sunday Service</p>
                                <p className="text-white font-semibold text-sm md:text-base">9:00 AM - 11:30 AM</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
                            <div className="p-3 bg-ocean-600/20">
                                <MapPin className="text-ocean-300" size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-white/60 text-xs md:text-sm mb-1">Location</p>
                                <p className="text-white font-semibold text-sm md:text-base">Iyana Bodija, Ibadan</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Image Indicators */}
            <div className="absolute bottom-24 md:bottom-32 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1 transition-all duration-500 ${index === currentImageIndex
                                ? 'w-8 md:w-12 bg-white'
                                : 'w-1 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 flex justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 h-3 bg-white/50"
                        />
                    </div>
                    <p className="text-white/60 text-xs tracking-wider">SCROLL</p>
                </motion.div>
            </motion.div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;