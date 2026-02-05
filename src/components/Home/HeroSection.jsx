import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GcccHeroSection = () => {
    const [isSpread, setIsSpread] = useState(false);

    // Church images - 7 images, all same size
    const images = [
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
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSpread(true);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Calculate card position - all same size, upward arc
    const getCardPosition = (index, total) => {
        if (!isSpread) {
            return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: total - index };
        }

        const centerIndex = Math.floor(total / 2);
        const offset = index - centerIndex;

        // Horizontal spacing
        const xOffset = offset * 200;

        // Subtle upward arc
        const distanceFromCenter = Math.abs(offset);
        const yOffset = -distanceFromCenter * distanceFromCenter * 10;

        // Gentle rotation
        const rotation = offset * 5;

        return {
            x: xOffset,
            y: yOffset,
            rotate: rotation,
            scale: 1, // All same size
            zIndex: total - Math.abs(offset),
        };
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-white">

            {/* Sophisticated Background with Christian Symbolism */}
            <div className="absolute inset-0 pointer-events-none">

                {/* Base soft gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-purple-50/40" />

                {/* Radial gradient spotlights */}
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
                <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(147,197,253,0.06)_0%,transparent_60%)]" />

                {/* Christian Faith Symbols - More Visible with Blend */}

                {/* Cross symbol - top left */}
                <div className="absolute top-[15%] left-[10%] opacity-[0.08] mix-blend-multiply">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60 20V100M30 60H90" stroke="rgb(59, 130, 246)" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Cross symbol - bottom right */}
                <div className="absolute bottom-[20%] right-[8%] opacity-[0.1] mix-blend-multiply rotate-12">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 15V85M20 50H80" stroke="rgb(168, 85, 247)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Dove symbol - top right */}
                <div className="absolute top-[25%] right-[12%] opacity-[0.09] mix-blend-multiply">
                    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M70 45C75 40 85 35 95 40C100 42 102 48 100 53C98 58 90 60 85 58L70 65L55 58C50 60 42 58 40 53C38 48 40 42 45 40C55 35 65 40 70 45Z" fill="rgb(59, 130, 246)" />
                        <ellipse cx="70" cy="70" rx="15" ry="25" fill="rgb(59, 130, 246)" />
                        <path d="M70 95L75 100L80 95" stroke="rgb(59, 130, 246)" strokeWidth="3" />
                    </svg>
                </div>

                {/* Fish (Ichthys) symbol - bottom left */}
                <div className="absolute bottom-[25%] left-[15%] opacity-[0.09] mix-blend-multiply -rotate-12">
                    <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 40C10 25 30 10 50 10C70 10 90 15 110 20C125 23 140 30 150 40C140 50 125 57 110 60C90 65 70 70 50 70C30 70 10 55 10 40Z" stroke="rgb(168, 85, 247)" strokeWidth="3" fill="none" />
                        <circle cx="50" cy="35" r="3" fill="rgb(168, 85, 247)" />
                        <path d="M150 40L155 35L160 40L155 45Z" fill="rgb(168, 85, 247)" />
                    </svg>
                </div>

                {/* Alpha and Omega - center sides */}
                <div className="absolute top-[50%] left-[5%] opacity-[0.07] mix-blend-multiply">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <text x="50" y="60" fontSize="60" fontWeight="bold" textAnchor="middle" fill="rgb(59, 130, 246)" fontFamily="Georgia, serif">α</text>
                    </svg>
                </div>

                <div className="absolute top-[50%] right-[5%] opacity-[0.07] mix-blend-multiply">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <text x="50" y="60" fontSize="60" fontWeight="bold" textAnchor="middle" fill="rgb(168, 85, 247)" fontFamily="Georgia, serif">Ω</text>
                    </svg>
                </div>

                {/* Heart symbols (love/agape) - scattered */}
                <div className="absolute top-[70%] left-[20%] opacity-[0.08] mix-blend-multiply">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 65C40 65 15 50 15 32C15 20 22 15 28 15C34 15 40 20 40 20C40 20 46 15 52 15C58 15 65 20 65 32C65 50 40 65 40 65Z" fill="rgb(59, 130, 246)" />
                    </svg>
                </div>

                <div className="absolute top-[35%] right-[18%] opacity-[0.08] mix-blend-multiply rotate-45">
                    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35 57C35 57 13 45 13 29C13 19 19 15 24 15C29 15 35 19 35 19C35 19 41 15 46 15C51 15 57 19 57 29C57 45 35 57 35 57Z" fill="rgb(168, 85, 247)" />
                    </svg>
                </div>

                {/* Additional crosses for balance - smaller */}
                <div className="absolute top-[40%] left-[25%] opacity-[0.06] mix-blend-multiply rotate-45">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10V50M10 30H50" stroke="rgb(147, 197, 253)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="absolute top-[60%] right-[30%] opacity-[0.06] mix-blend-multiply -rotate-12">
                    <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5 8V47M8 27.5H47" stroke="rgb(196, 181, 253)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Subtle corner accents */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-transparent rounded-br-full" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-400/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/4 to-transparent rounded-tr-full" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-300/4 to-transparent rounded-tl-full" />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
            </div>

            {/* Main Content - Perfectly Centered */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col items-center justify-center h-full py-12">

                    {/* Church Name & Main Heading */}
                    <div className="text-center space-y-5 mb-10 max-w-4xl">

                        {/* Church Name Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-full border border-blue-200/60 shadow-sm">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                </div>
                                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-blue-600">
                                    Glory Centre Community Church
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
                        >
                            <span className="block text-gray-900">
                                Where God Meets
                            </span>
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                With His People
                            </span>
                        </motion.h1>
                    </div>

                    {/* Card Spreading Images - Larger Size */}
                    <div className="relative w-full mb-10 flex-shrink-0">
                        <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] flex items-end justify-center">
                            {images.map((image, index) => {
                                const position = getCardPosition(index, images.length);
                                const centerIndex = Math.floor(images.length / 2);
                                const isCenterCard = index === centerIndex;

                                return (
                                    <motion.div
                                        key={image.id}
                                        initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
                                        animate={{
                                            x: position.x,
                                            y: position.y,
                                            rotate: position.rotate,
                                            scale: position.scale,
                                        }}
                                        transition={{
                                            duration: 0.7,
                                            delay: 0.6 + index * 0.08,
                                            ease: [0.34, 1.56, 0.64, 1],
                                        }}
                                        style={{
                                            zIndex: position.zIndex,
                                        }}
                                        className="absolute"
                                    >
                                        {/* Card - All Same Size */}
                                        <div
                                            className={`relative rounded-2xl overflow-hidden shadow-2xl ${isCenterCard
                                                    ? 'ring-4 ring-blue-400/30'
                                                    : 'ring-2 ring-white'
                                                }`}
                                            style={{
                                                width: '240px',
                                                height: '340px',
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description & CTA - Compact */}
                    <div className="text-center space-y-6 max-w-2xl">

                        {/* Reduced Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.6 }}
                            className="text-base sm:text-lg text-gray-700 leading-relaxed"
                        >
                            Join our vibrant community of believers rooted and growing in the Grace and Knowledge of God.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                <span className="flex items-center justify-center gap-2">
                                    Join Our Community
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold text-base rounded-full border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-300">
                                Learn More
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GcccHeroSection;