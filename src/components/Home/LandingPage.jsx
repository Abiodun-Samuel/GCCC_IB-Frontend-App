import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// Import components
import HeroSection from './HeroSection';
import AboutSection from '@/components/Home/AboutSection';
import Footer from '@/components/Home/Footer';
import Header from './Header';

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
            {/* Navbar */}
            <Header scrolled={scrolled} />

            {/* Main Content */}
            <main className="w-full">
                {/* Hero Section */}
                <HeroSection />
                {/* About Section */}
                <AboutSection />

            </main>

            <Footer />

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