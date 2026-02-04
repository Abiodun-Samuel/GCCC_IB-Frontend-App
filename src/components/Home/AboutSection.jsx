import { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Sparkles } from 'lucide-react';

const values = [
    { icon: Heart, title: 'Love', description: "We demonstrate God's unconditional love to all people" },
    { icon: Users, title: 'Community', description: 'Building strong relationships through fellowship and unity' },
    { icon: BookOpen, title: 'Truth', description: "Grounded in biblical teaching and the Word of God" },
    { icon: Sparkles, title: 'Excellence', description: 'Pursuing excellence in worship and service' },
];

const stats = [
    { number: '1000+', label: 'Active Members' },
    { number: '15+', label: 'Ministries' },
    { number: '20+', label: 'Years of Impact' },
];

const AboutSection = memo(() => (
    <section id="about" className="relative py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                {/* Left Content */}
                <motion.div data-aos="fade-right" className="space-y-6">
                    <span className="inline-block px-5 py-2 bg-coral-50 dark:bg-coral-900/20 text-coral-700 dark:text-coral-400 text-sm font-semibold">
                        About Us
                    </span>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        A Church That
                        <span className="block mt-2 text-coral-600 dark:text-coral-400">
                            Feels Like Home
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Glory Centre Community Church is a vibrant, Spirit-filled church where the Glory and Power of God find expression through community.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        In Community is where the Glory and Power of God find expression. Join this vibrant community of believers that are rooted and growing in the Grace and Knowledge of God.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 pt-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-coral-600 dark:text-coral-400 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Image Grid */}
                <motion.div data-aos="fade-left" className="relative">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', offset: '' },
                            { url: 'https://images.unsplash.com/photo-1517096851-6a40c02c0835?w=800&q=80', offset: 'mt-8' },
                            { url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80', offset: '-mt-8' },
                            { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80', offset: '' },
                        ].map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className={`relative h-64 md:h-80 overflow-hidden group ${image.offset}`}
                            >
                                <img
                                    src={image.url}
                                    alt={`Church life ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Core Values */}
            <motion.div data-aos="fade-up">
                <div className="text-center mb-12">
                    <span className="inline-block px-5 py-2 bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-400 text-sm font-semibold mb-4">
                        Our Foundation
                    </span>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                        Core Values
                    </h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -8 }}
                            className="p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="inline-flex p-4 bg-coral-50 dark:bg-coral-900/20 mb-6">
                                <value.icon className="text-coral-600 dark:text-coral-400" size={28} />
                            </div>

                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {value.title}
                            </h4>

                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
));

AboutSection.displayName = 'AboutSection';

export default AboutSection;