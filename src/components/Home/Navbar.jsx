import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Ministries', href: '#ministries' },
    { name: 'Events', href: '#events' },
    { name: 'Testimonies', href: '#testimonies' },
    { name: 'Contact', href: '#contact' },
];

const Navbar = memo(({ scrolled }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', ...navLinks.map(link => link.href.substring(1))];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const handleNavClick = (href) => {
        setMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? 'bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm shadow-sm'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <motion.button
                            onClick={() => handleNavClick('#home')}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center"
                        >
                            {scrolled ? (
                                <img src="/logo-black.png" alt="GCCC Logo" className="h-12 w-auto" />
                            ) : (
                                <img src="/logo-white.png" alt="GCCC Logo" className="h-12 w-auto" />
                            )}
                        </motion.button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link, index) => (
                                <motion.button
                                    key={link.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    onClick={() => handleNavClick(link.href)}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${activeSection === link.href.substring(1)
                                            ? scrolled
                                                ? 'text-coral-600 dark:text-coral-400'
                                                : 'text-white'
                                            : scrolled
                                                ? 'text-gray-700 dark:text-gray-300 hover:text-coral-600 dark:hover:text-coral-400'
                                                : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    {activeSection === link.href.substring(1) && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className={`absolute bottom-0 left-2 right-2 h-0.5 ${scrolled ? 'bg-coral-600 dark:bg-coral-400' : 'bg-white'
                                                }`}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3"
                        >
                            <button className="hidden lg:flex px-6 py-2.5 bg-coral-600 hover:bg-coral-700 text-white font-medium transition-all duration-300">
                                Visit Us
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`lg:hidden p-2.5 transition-all duration-300 ${scrolled
                                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        : 'hover:bg-white/10 text-white'
                                    }`}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-40 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 space-y-2">
                                {navLinks.map((link, index) => (
                                    <motion.button
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        onClick={() => handleNavClick(link.href)}
                                        className={`w-full text-left px-5 py-4 font-semibold transition-all duration-300 ${activeSection === link.href.substring(1)
                                                ? 'bg-coral-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {link.name}
                                    </motion.button>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-4"
                                >
                                    <button className="w-full px-6 py-4 bg-coral-600 hover:bg-coral-700 text-white font-semibold transition-all duration-300">
                                        Visit Us
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;