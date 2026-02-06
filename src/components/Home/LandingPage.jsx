import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// Import components
import Navbar from './Navbar';
import HeroSection from './HeroSection';

const LandingPage = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Optimized scroll handler with useCallback
    const handleScroll = useCallback(() => {
        const scrollPosition = window.pageYOffset;
        setScrolled(scrollPosition > 50);
        setShowBackToTop(scrollPosition > 500);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900">
            {/* Navbar - With scroll state */}
            <Navbar scrolled={scrolled} />

            {/* Main Content */}
            <main className="w-full">
                {/* Hero Section */}
                <HeroSection />

                {/* About Section Placeholder */}
                <section id="about" className="relative min-h-screen w-full bg-white dark:bg-gray-900 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                About <span className="text-[#0998d5]">GCCC</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Learn more about our church, mission, and values.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Events Section Placeholder */}
                <section id="events" className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-800 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Upcoming <span className="text-[#0998d5]">Events</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Join us for worship, fellowship, and community events.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section Placeholder */}
                <section id="contact" className="relative min-h-screen w-full bg-white dark:bg-gray-900 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Get in <span className="text-[#0998d5]">Touch</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                We'd love to hear from you. Reach out to us today.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-4 bg-[#0998d5] hover:bg-[#0886bd] text-white shadow transition-colors duration-200 group"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-1" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;