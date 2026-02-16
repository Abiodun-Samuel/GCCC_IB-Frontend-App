import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Crown } from 'lucide-react';

const AboutSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const scaleInVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const slideInFromLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative w-full bg-white dark:bg-gray-900 py-20 lg:py-24 my-10 md:my-16 lg:my-20 overflow-hidden"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                {/* Layer 1: Big Image and Text - Mobile: Text First, Desktop: Image First */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Right Side - Text Content (Mobile First) */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="flex flex-col justify-center h-full space-y-6 lg:order-2 order-1"
                    >
                        <motion.p
                            variants={fadeUpVariants}
                            className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed"
                        >
                            If you are thinking about{' '}
                            <span className="text-[#0998d5] inline-block hover:scale-110 transition-transform duration-300">
                                Love, Family
                            </span>{' '}
                            and{' '}
                            <span className="text-[#0998d5] inline-block hover:scale-110 transition-transform duration-300">
                                Kingdom
                            </span>{' '}
                            then it is Glory Centre Community Church you are thinking about.
                        </motion.p>

                        <motion.div
                            variants={containerVariants}
                            className="space-y-5"
                        >
                            <motion.p
                                variants={fadeUpVariants}
                                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                                GCCC Ibadan is a growing community of close-knit believers in Bodija, extending the frontiers of the Kingdom on all sides.
                            </motion.p>

                            <motion.p
                                variants={fadeUpVariants}
                                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                                With a deep desire to regularly experience and manifest the Glory of God, we do the Word, we yield to the Spirit and practice the Culture of God's kingdom.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            variants={scaleInVariants}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0998d5]/10 to-[#0998d5]/5 dark:from-[#0998d5]/20 dark:to-[#0998d5]/10 border-l-4 border-[#0998d5] cursor-default"
                        >
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                The plan is to take our generation for Jesus!
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Left Side - Image */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={slideInFromLeft}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                        className="relative overflow-hidden shadow group lg:order-1 order-2"
                    >
                        <div className="aspect-[4/3] relative">
                            <motion.img
                                src="/images/home/image (5).jpg"
                                alt="Church Community"
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30 transition-all duration-500" />

                            {/* Decorative corner accent */}
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute top-0 right-0 w-20 h-20 bg-[#0998d5]/20 backdrop-blur-sm"
                                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                            />
                        </div>
                    </motion.div>

                </div>

                {/* Layer 2: Three Core Value Boxes */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {[
                        {
                            icon: Heart,
                            title: "Love",
                            desc: "Rooted and growing in the Grace and Knowledge of God, we extend Christ's love to every person.",
                            color: "#0998d5"
                        },
                        {
                            icon: Users,
                            title: "Family",
                            desc: "A vibrant community where believers connect, grow, and support one another through life's journey.",
                            color: "#0998d5"
                        },
                        {
                            icon: Crown,
                            title: "Kingdom",
                            desc: "Living out Kingdom culture in every space, transforming lives through the power of God's presence.",
                            color: "#0998d5"
                        }
                    ].map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeUpVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 5px 5px rgba(9, 152, 213, 0.15)",
                                    transition: { duration: 0.3 }
                                }}
                                className="group bg-white dark:bg-gray-800 p-6 shadow hover:shadow-sm transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Animated background gradient */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0998d5]/5 to-transparent"
                                />

                                <div className="relative z-10">
                                    <div className="flex items-start gap-4 mb-4">
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="p-3 bg-[#0998d5]/10 dark:bg-[#0998d5]/20 rounded-lg"
                                        >
                                            <Icon className="w-6 h-6 text-[#0998d5]" />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
                                            {value.title}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {value.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Layer 3: Four Images */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                >
                    {[
                        { src: "/images/home/image (10).jpg", alt: "Worship" },
                        { src: "/images/home/image (15).jpg", alt: "Prayer" },
                        { src: "/images/home/image (20).jpg", alt: "Fellowship" },
                        { src: "/images/home/image (25).jpg", alt: "Community" }
                    ].map((image, index) => (
                        <motion.div
                            key={index}
                            variants={scaleInVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                            className="relative overflow-hidden shadow group aspect-[4/3] rounded-lg"
                        >
                            <motion.img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.15, rotate: 2 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-t from-[#0998d5]/60 via-[#0998d5]/20 to-transparent flex items-end justify-center pb-6"
                            >
                                <span className="text-white font-semibold text-lg tracking-wide">
                                    {image.alt}
                                </span>
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-transparent transition-all duration-500" />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default AboutSection;