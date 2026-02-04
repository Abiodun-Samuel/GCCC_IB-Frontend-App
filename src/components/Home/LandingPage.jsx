import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import all sections
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from '@/components/Home/ServicesSection';
import MinistriesSection from '@/components/Home/MinistriesSection';
import EventsSection from '@/components/Home/EventsSection';
import LocationSection from '@/components/Home/LocationSection';
import CTASection from '@/components/Home/CTASection';
import { TestimonySection } from '@/components/Home/TestimonySection';
import Footer from '@/components/Home/Footer';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100,
            delay: 50,
        });

        AOS.refresh();

        // Handle scroll for navbar
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900">
            {/* Navbar */}
            <Navbar scrolled={scrolled} />

            {/* Main Content */}
            <main className="w-full">
                <HeroSection />
                <AboutSection />
                <ServicesSection />
                <MinistriesSection />
                <TestimonySection />
                <EventsSection />
                <LocationSection />
                <CTASection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Back to Top Button */}
            <BackToTopButton />
        </div>
    );
};

// Back to Top Button Component
const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-coral-600 hover:bg-coral-700 text-white transition-all duration-300 hover:scale-110"
                    aria-label="Back to top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </>
    );
};

export default LandingPage;