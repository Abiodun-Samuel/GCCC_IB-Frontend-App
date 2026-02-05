import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Calendar,
    Users,
    Mail,
    LogIn,
    User,
    LayoutDashboard,
    ChevronDown,
    Menu,
    X,
    Clock,
    Star,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/queries/auth.query';
import Avatar from '@/components/ui/Avatar';

const Navbar = ({ scrolled }) => {
    const { isAuthenticated, user, isAdmin, isLeader } = useAuthStore();
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const dropdownRef = useRef(null);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownOpen]);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setDropdownOpen(false);
            setMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout]);

    const scrollToSection = useCallback((id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setMobileMenuOpen(false);
    }, []);

    // Public navigation items - memoized
    const publicNavItems = useMemo(() => [
        { label: 'Home', icon: Home, action: () => scrollToSection('hero') },
        { label: 'About', icon: Users, action: () => scrollToSection('about') },
        { label: 'Events', icon: Calendar, action: () => scrollToSection('events') },
        { label: 'Forms', icon: FileText, to: '/forms' },
        { label: 'Contact', icon: Mail, action: () => scrollToSection('contact') },
    ], [scrollToSection]);

    // Authenticated navigation items - memoized
    const authNavItems = useMemo(() => [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', show: true },
        { label: 'Profile', icon: User, to: '/dashboard/profile', show: true },
        { label: 'Admin', icon: Users, to: '/dashboard/admin', show: isAdmin },
        { label: 'Leader', icon: Star, to: '/dashboard/leaders', show: isLeader },
    ], [isAdmin, isLeader]);

    const formatTime = useCallback((date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }, []);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
    const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);

    return (
        <>
            {/* Overlay for mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={toggleMobileMenu}
                    />
                )}
            </AnimatePresence>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <img
                                src="/images/logo/logo-white.png"
                                alt="GCCC Logo"
                                className="h-12 md:h-14 w-auto object-contain drop-shadow"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">

                            {/* Public Nav Items */}
                            <div className="flex items-center gap-1">
                                {publicNavItems.map((item) => {
                                    if (item.to) {
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="group relative px-4 py-2 font-medium text-sm text-white/90 hover:text-white transition-colors duration-200"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <item.icon className="w-4 h-4" />
                                                    {item.label}
                                                </span>
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={item.action}
                                            className="group relative px-4 py-2 font-medium text-sm text-white/90 hover:text-white transition-colors duration-200"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </span>
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Display */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-sm">
                                <Clock className="w-4 h-4 text-white/80" />
                                <span className="text-sm font-mono font-medium text-white/90 tabular-nums">
                                    {formatTime(currentTime)}
                                </span>
                            </div>

                            {/* Auth Section */}
                            {isAuthenticated ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200"
                                    >
                                        <Avatar size="xs" name={user?.initials} src={user?.avatar} />
                                        <span className="text-sm font-medium">{user?.first_name}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow border border-gray-200/50 dark:border-white/10 overflow-hidden"
                                            >
                                                {/* User Info */}
                                                <div className="p-4 border-b border-gray-200/50 dark:border-white/10 bg-gradient-to-br from-[#0998d5]/10 to-transparent">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                                                        {user?.email}
                                                    </p>
                                                    {user?.total_stars > 0 && (
                                                        <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-amber-500/20 border border-amber-400/30 w-fit">
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                                                                {user?.total_stars}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Nav Links */}
                                                <div className="p-2">
                                                    {authNavItems.filter(item => item.show).map((item) => (
                                                        <Link
                                                            key={item.to}
                                                            to={item.to}
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                                                        >
                                                            <item.icon className="w-4 h-4" />
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-gray-200/50 dark:border-white/10">
                                                    <button
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50"
                                                    >
                                                        <LogIn className="w-4 h-4" />
                                                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0998d5] text-white font-semibold text-sm hover:bg-[#0886bd] transition-colors duration-200"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white transition-colors duration-200"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-white/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
                        >
                            <div className="container mx-auto px-4 sm:px-6 py-4 space-y-1">

                                {/* Time Display Mobile */}
                                <div className="flex items-center justify-between py-2 px-4 bg-gray-100 dark:bg-gray-800/50 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#0998d5]" />
                                        <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                                            {formatTime(currentTime)}
                                        </span>
                                    </div>
                                </div>

                                {/* Public Nav Items */}
                                {publicNavItems.map((item) => {
                                    if (item.to) {
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                onClick={toggleMobileMenu}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        );
                                    }
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={item.action}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}

                                {/* Auth Section Mobile */}
                                {isAuthenticated ? (
                                    <>
                                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                                        <div className="px-4 py-3 bg-gradient-to-br from-[#0998d5]/10 to-transparent">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {user?.full_name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {authNavItems.filter(item => item.show).map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={toggleMobileMenu}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ))}

                                        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                                        <Link
                                            to="/login"
                                            onClick={toggleMobileMenu}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0998d5] text-white font-semibold hover:bg-[#0886bd] transition-colors duration-200"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;