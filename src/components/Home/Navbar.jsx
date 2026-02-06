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
    FileText,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/queries/auth.query';
import Avatar from '@/components/ui/Avatar';
import RoleBadge from '@/components/userProfile/RoleBadge';

const Navbar = ({ scrolled }) => {
    const { isAuthenticated, user, isAdmin, isLeader } = useAuthStore();
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const dropdownRef = useRef(null);
    const mobileUserDropdownRef = useRef(null);

    // StarsBadge component
    const StarsBadge = ({ totalStars }) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-400/25">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {totalStars || 0}
            </span>
        </div>
    );

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(event.target)) {
                setMobileUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            setMobileUserMenuOpen(false);
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
    }, []);

    // Public navigation items - all as links with href or to
    const publicNavItems = useMemo(() => [
        { label: 'Home', icon: Home, href: '#hero' },
        { label: 'About', icon: Users, href: '#about' },
        { label: 'Events', icon: Calendar, href: '#events' },
        { label: 'Forms', icon: FileText, to: '/forms' },
        { label: 'Contact', icon: Mail, href: '#contact' },
    ], []);

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
    const toggleMobileUserMenu = useCallback(() => setMobileUserMenuOpen(prev => !prev), []);
    const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);

    return (
        <>
            {/* Overlay for mobile menus */}
            <AnimatePresence>
                {(mobileMenuOpen || mobileUserMenuOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileUserMenuOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Main Navbar */}
            <motion.nav
                initial={{ y: 0 }}
                animate={{
                    y: scrolled ? -2 : 0,
                    boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout - Three columns */}
                    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 items-center h-20">

                        {/* Left: Logo with Time permanently underneath */}
                        <div className="flex flex-col">
                            <Link to="/" className="block group">
                                {/* Light mode logo */}
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-black.png"
                                    alt="GCCC Logo"
                                    className="h-14 w-auto object-contain transition-all duration-300 dark:hidden"
                                />
                                {/* Dark mode logo */}
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-white.png"
                                    alt="GCCC Logo"
                                    className="h-14 w-auto object-contain transition-all duration-300 hidden dark:block"
                                />
                            </Link>
                            {/* Time Display - Permanently under logo */}
                            <div className="mt-1 flex items-center gap-1.5 group cursor-default">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                >
                                    <Clock className="w-3 h-3 text-[#0998d5] dark:text-[#0998d5] group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200" />
                                </motion.div>
                                <span className="text-xs font-mono font-medium tabular-nums text-[#0998d5] dark:text-[#0998d5] group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Center: Navigation Items - All as Links */}
                        <nav className="flex items-center justify-center gap-2">
                            {publicNavItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="relative cursor-pointer"
                                    whileHover="hover"
                                >
                                    <Link
                                        to={item.to || item.href}
                                        onClick={(e) => {
                                            if (item.href && item.href.startsWith('#')) {
                                                e.preventDefault();
                                                const id = item.href.substring(1);
                                                scrollToSection(id);
                                            }
                                        }}
                                        className="relative z-10 px-5 py-2.5 font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-600 transition-colors duration-200 flex items-center gap-2.5"
                                    >
                                        <motion.div
                                            variants={{
                                                hover: { rotate: 360, scale: 1.1 }
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon className="w-4 h-4 transition-colors duration-200" />
                                        </motion.div>
                                        <span>{item.label}</span>
                                    </Link>
                                    {/* Animated underline */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 pointer-events-none"
                                        variants={{
                                            hover: { scaleX: 1 }
                                        }}
                                        initial={{ scaleX: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    {/* Hover background */}
                                    <motion.div
                                        className="absolute inset-0 bg-red-600/5 pointer-events-none"
                                        variants={{
                                            hover: { opacity: 1 }
                                        }}
                                        initial={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                            ))}
                        </nav>

                        {/* Right: Auth */}
                        <div className="flex items-center justify-end">
                            {isAuthenticated ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    className="relative"
                                    ref={dropdownRef}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
                                    >
                                        <Avatar size="xs" name={user?.initials} src={user?.avatar} />
                                        <span className="text-sm font-medium">{user?.first_name}</span>
                                        <motion.div
                                            animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Desktop Dropdown Menu */}
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                                            >
                                                {/* User Info */}
                                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#0998d5]/10 to-transparent">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 mb-2 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <RoleBadge showIcon />
                                                        <StarsBadge totalStars={user?.total_stars} />
                                                    </div>
                                                </div>

                                                {/* Nav Links */}
                                                <div className="p-2">
                                                    {authNavItems.filter(item => item.show).map((item) => (
                                                        <motion.div
                                                            key={item.to}
                                                            whileHover={{ x: 4 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Link
                                                                to={item.to}
                                                                onClick={() => setDropdownOpen(false)}
                                                                className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                                                            >
                                                                <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-150" />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                                    <motion.button
                                                        whileHover={{ x: 4 }}
                                                        transition={{ duration: 0.2 }}
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/login"
                                        className="relative flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all duration-200 overflow-hidden group"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-white"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.5 }}
                                            style={{ opacity: 0.1 }}
                                        />
                                        <LogIn className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Sign In</span>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex lg:hidden items-center justify-between h-20">

                        {/* Logo with Time permanently underneath */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="block group">
                                {/* Light mode logo */}
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-black.png"
                                    alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain transition-all duration-300 dark:hidden"
                                />
                                {/* Dark mode logo */}
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-white.png"
                                    alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain transition-all duration-300 hidden dark:block"
                                />
                            </Link>
                            {/* Time Display - Permanently under logo with hover */}
                            <div className="mt-1 flex items-center gap-1.5 group cursor-default">
                                <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200" />
                                <span className="text-xs font-mono font-medium tabular-nums text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Mobile Buttons: User Menu (if authenticated) + Main Menu */}
                        <div className="flex items-center gap-2">

                            {/* Mobile User Menu Button - Only for authenticated users */}
                            {isAuthenticated && (
                                <div className="relative" ref={mobileUserDropdownRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleMobileUserMenu}
                                        className="h-9 flex items-center gap-2 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                                    >
                                        <Avatar size="xs" name={user?.initials} src={user?.avatar} />
                                        <motion.div
                                            animate={{ rotate: mobileUserMenuOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Mobile User Dropdown */}
                                    <AnimatePresence>
                                        {mobileUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                                            >
                                                {/* User Info */}
                                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#0998d5]/10 to-transparent">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 mb-2 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <RoleBadge showIcon />
                                                        <StarsBadge totalStars={user?.total_stars} />
                                                    </div>
                                                </div>

                                                {/* Nav Links */}
                                                <div className="p-2">
                                                    {authNavItems.filter(item => item.show).map((item) => (
                                                        <Link
                                                            key={item.to}
                                                            to={item.to}
                                                            onClick={() => setMobileUserMenuOpen(false)}
                                                            className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                                                        >
                                                            <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-150" />
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                                    <button
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-50"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Mobile Main Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMobileMenu}
                                className="h-9 w-9 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                            >
                                <AnimatePresence mode="wait">
                                    {mobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Main Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                        >
                            <div className="container mx-auto px-4 sm:px-6 py-4 space-y-1">

                                {/* Public Nav Items */}
                                {publicNavItems.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            to={item.to || item.href}
                                            onClick={(e) => {
                                                if (item.href && item.href.startsWith('#')) {
                                                    e.preventDefault();
                                                    const id = item.href.substring(1);
                                                    scrollToSection(id);
                                                }
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-150"
                                        >
                                            <motion.div
                                                variants={{
                                                    hover: { rotate: 360, scale: 1.1 }
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200" />
                                            </motion.div>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Sign In for Non-Authenticated Users */}
                                {!isAuthenticated && (
                                    <>
                                        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
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
            </motion.nav>
        </>
    );
};

export default Navbar;