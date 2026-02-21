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
import { useLogout, useMe } from '@/queries/auth.query';
import Avatar from '@/components/ui/Avatar';
import RoleBadge from '@/components/userProfile/RoleBadge';
import { useScrollState } from '@/hooks/useScrollState';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

// Brand blue: #0998d5
// hover bg   → rgba(9,152,213,0.07)
// hover border → rgba(9,152,213,0.45)
// glow ring  → rgba(9,152,213,0.14)

const Header = () => {
    useMe();
    const { scrolled } = useScrollState();
    const { isAuthenticated, user, isAdmin, isLeader } = useAuthStore();
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const dropdownRef = useRef(null);
    const mobileUserDropdownRef = useRef(null);

    const StarsBadge = ({ totalStars }) => (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm
            bg-amber-500/10 border border-amber-400/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {totalStars || 0}
            </span>
        </div>
    );

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
            if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(e.target))
                setMobileUserMenuOpen(false);
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
        } catch (e) { console.error('Logout failed:', e); }
    }, [logout]);

    const scrollToSection = useCallback((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
        });
    }, []);

    const publicNavItems = useMemo(() => [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'About', icon: Users, href: '#about' },
        { label: 'Events', icon: Calendar, href: '#events' },
        { label: 'Forms', icon: FileText, to: '/forms' },
        { label: 'Contact', icon: Mail, href: '#contact' },
    ], []);

    const authNavItems = useMemo(() => [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', show: true },
        { label: 'Profile', icon: User, to: '/dashboard/profile', show: true },
        { label: 'Admin', icon: Users, to: '/dashboard/admin', show: isAdmin },
        { label: 'Leader', icon: Star, to: '/dashboard/leaders', show: isLeader },
    ], [isAdmin, isLeader]);

    const formatTime = useCallback((date) =>
        date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        }), []);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen(p => !p), []);
    const toggleMobileUserMenu = useCallback(() => setMobileUserMenuOpen(p => !p), []);
    const toggleDropdown = useCallback(() => setDropdownOpen(p => !p), []);

    /* ─── Shared style tokens ──────────────────────────────────────────── */

    // Nav link hover — blue wash
    const navLinkCls = `
        relative z-10 px-4 py-2.5 font-medium text-sm
        text-gray-600 dark:text-gray-400
        hover:text-[#0998d5] dark:hover:text-[#0998d5]
        transition-colors duration-200
        flex items-center gap-2.5
    `;

    // Dropdown row hover — blue wash
    const dropdownRowCls = `
        group flex items-center gap-3 px-4 py-2.5 text-sm
        text-gray-600 dark:text-gray-300
        hover:text-[#0998d5] dark:hover:text-[#0998d5]
        hover:[background:rgba(9,152,213,0.06)] dark:hover:[background:rgba(9,152,213,0.09)]
        transition-all duration-150
    `;

    // Dropdown icon
    const dropdownIconCls = `
        w-4 h-4 text-gray-400 dark:text-gray-500
        group-hover:text-[#0998d5] dark:group-hover:text-[#0998d5]
        transition-colors duration-150
    `;

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {(mobileMenuOpen || mobileUserMenuOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => { setMobileMenuOpen(false); setMobileUserMenuOpen(false); }}
                    />
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: 0 }}
                animate={{
                    y: scrolled ? -2 : 0,
                    boxShadow: scrolled
                        ? '0 4px 24px -4px rgba(0,0,0,0.08)'
                        : '0 1px 3px 0 rgba(0,0,0,0.06)'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 z-50
                    bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
                    border-b border-gray-200 dark:border-gray-800"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Desktop ─────────────────────────────────────────── */}
                    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 items-center h-20">

                        {/* Left: Logo + Clock */}
                        <div className="flex flex-col">
                            <Link to="/" className="block group w-fit">
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-black.png"
                                    alt="GCCC Logo"
                                    className="h-14 w-auto object-contain dark:hidden"
                                />
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-white.png"
                                    alt="GCCC Logo"
                                    className="h-14 w-auto object-contain hidden dark:block"
                                />
                            </Link>
                            <div className="mt-1 flex items-center gap-1.5 cursor-default w-fit group">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                >
                                    <Clock className="w-3 h-3 text-[#0998d5]" />
                                </motion.div>
                                <span className="text-xs font-mono font-medium tabular-nums text-[#0998d5]">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Center: Nav */}
                        <nav className="flex items-center justify-center gap-1">
                            {publicNavItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="relative"
                                    whileHover="hover"
                                >
                                    <Link
                                        to={item.to || item.href}
                                        onClick={(e) => {
                                            if (item.href?.startsWith('#')) {
                                                e.preventDefault();
                                                scrollToSection(item.href.substring(1));
                                            }
                                        }}
                                        className={navLinkCls}
                                    >
                                        <motion.div
                                            variants={{ hover: { rotate: 15, scale: 1.15 } }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <item.icon strokeWidth={1.6} className="w-4 h-4" />
                                        </motion.div>
                                        <span>{item.label}</span>
                                    </Link>

                                    {/* Blue underline */}
                                    <motion.span
                                        aria-hidden
                                        className="absolute bottom-0 left-3 right-3 h-px bg-[#0998d5] pointer-events-none"
                                        variants={{ hover: { scaleX: 1, opacity: 1 } }}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />

                                    {/* Blue bg wash */}
                                    <motion.span
                                        aria-hidden
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: 'rgba(9,152,213,0)' }}
                                        variants={{ hover: { background: 'rgba(9,152,213,0.06)' } }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>
                            ))}
                        </nav>

                        {/* Right: Theme + Auth */}
                        <div className="flex items-center justify-end gap-3">
                            <ThemeToggleButton className='h-11 w-11' />

                            {isAuthenticated ? (
                                <div className="relative" ref={dropdownRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-2.5 px-3 py-2
                                            border border-gray-200 dark:border-gray-700
                                            bg-gray-50 dark:bg-gray-800
                                            text-gray-700 dark:text-gray-200
                                            hover:border-[#0998d5]/45
                                            hover:[background:rgba(9,152,213,0.05)]
                                            hover:text-[#0998d5] dark:hover:text-[#0998d5]
                                            transition-all duration-200 rounded-sm"
                                    >
                                        <Avatar size="xs" name={user?.initials} src={user?.avatar} />
                                        <span className="text-sm font-medium">{user?.first_name}</span>
                                        <motion.div
                                            animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ChevronDown strokeWidth={1.75} className="w-3.5 h-3.5 text-gray-400" />
                                        </motion.div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                                className="absolute right-0 mt-2 w-64
                                                    bg-white dark:bg-gray-800
                                                    border border-gray-200 dark:border-gray-700
                                                    shadow-xl shadow-black/8 dark:shadow-black/25
                                                    rounded-sm overflow-hidden"
                                            >
                                                {/* User info */}
                                                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700
                                                    bg-gradient-to-br from-[#0998d5]/8 to-transparent">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2.5 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <RoleBadge showIcon />
                                                        <StarsBadge totalStars={user?.total_stars} />
                                                    </div>
                                                </div>

                                                {/* Links */}
                                                <div className="py-1">
                                                    {authNavItems.filter(i => i.show).map((item) => (
                                                        <motion.div key={item.to} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                                                            <Link
                                                                to={item.to}
                                                                onClick={() => setDropdownOpen(false)}
                                                                className={dropdownRowCls}
                                                            >
                                                                <item.icon strokeWidth={1.6} className={dropdownIconCls} />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Logout */}
                                                <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                                                    <motion.button
                                                        whileHover={{ x: 3 }}
                                                        transition={{ duration: 0.15 }}
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className="w-full group flex items-center gap-3 px-4 py-2.5 text-sm
                                                            text-red-500 dark:text-red-400
                                                            hover:bg-red-50 dark:hover:bg-red-900/15
                                                            transition-colors duration-150 disabled:opacity-40"
                                                    >
                                                        <LogOut strokeWidth={1.6} className="w-4 h-4" />
                                                        <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link
                                        to="/login"
                                        className="relative flex items-center gap-2 px-5 py-2.5
                                            bg-[#0998d5] hover:bg-[#0884b8]
                                            text-white font-semibold text-sm
                                            transition-colors duration-200 overflow-hidden group"
                                    >
                                        {/* Shine sweep */}
                                        <motion.span
                                            aria-hidden
                                            className="absolute inset-0 bg-white/10 -skew-x-12 -translate-x-full"
                                            whileHover={{ translateX: '200%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <LogIn strokeWidth={1.75} className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Sign In</span>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* ── Mobile ──────────────────────────────────────────── */}
                    <div className="flex lg:hidden items-center justify-between h-20">

                        {/* Logo + Clock */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="block w-fit">
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-black.png"
                                    alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain dark:hidden"
                                />
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.2 }}
                                    src="/images/logo/logo-white.png"
                                    alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain hidden dark:block"
                                />
                            </Link>
                            <div className="mt-1 flex items-center gap-1.5 cursor-default">
                                <Clock className="w-3 h-3 text-[#0998d5]" />
                                <span className="text-xs font-mono font-medium tabular-nums text-[#0998d5]">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Mobile controls */}
                        <div className="flex items-center gap-2">
                            {/* Theme toggle — always visible */}
                            <ThemeToggleButton className='h-9 w-9' />

                            {/* User avatar dropdown */}
                            {isAuthenticated && (
                                <div className="relative" ref={mobileUserDropdownRef}>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleMobileUserMenu}
                                        className="h-9 flex items-center gap-2 px-2.5
                                            border border-gray-200 dark:border-gray-700
                                            bg-gray-50 dark:bg-gray-800
                                            hover:border-[#0998d5]/45
                                            hover:[background:rgba(9,152,213,0.05)]
                                            transition-all duration-200"
                                    >
                                        <Avatar size="2xs" name={user?.initials} src={user?.avatar} />
                                        <motion.div
                                            animate={{ rotate: mobileUserMenuOpen ? 180 : 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ChevronDown strokeWidth={1.75} className="w-3.5 h-3.5 text-gray-400" />
                                        </motion.div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {mobileUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                                className="absolute right-0 mt-2 w-64
                                                    bg-white dark:bg-gray-800
                                                    border border-gray-200 dark:border-gray-700
                                                    shadow-xl shadow-black/8 dark:shadow-black/25
                                                    rounded-sm overflow-hidden z-50"
                                            >
                                                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700
                                                    bg-gradient-to-br from-[#0998d5]/8 to-transparent">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2.5 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <RoleBadge showIcon />
                                                        <StarsBadge totalStars={user?.total_stars} />
                                                    </div>
                                                </div>

                                                <div className="py-1">
                                                    {authNavItems.filter(i => i.show).map((item) => (
                                                        <Link
                                                            key={item.to}
                                                            to={item.to}
                                                            onClick={() => setMobileUserMenuOpen(false)}
                                                            className={dropdownRowCls}
                                                        >
                                                            <item.icon strokeWidth={1.6} className={dropdownIconCls} />
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={handleLogout}
                                                        disabled={isLoggingOut}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                                            text-red-500 dark:text-red-400
                                                            hover:bg-red-50 dark:hover:bg-red-900/15
                                                            transition-colors duration-150 disabled:opacity-40"
                                                    >
                                                        <LogOut strokeWidth={1.6} className="w-4 h-4" />
                                                        <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMobileMenu}
                                className="h-9 w-9 flex items-center justify-center
                                    border border-gray-200 dark:border-gray-700
                                    bg-gray-50 dark:bg-gray-800
                                    text-gray-500 dark:text-gray-400
                                    hover:border-[#0998d5]/45
                                    hover:[background:rgba(9,152,213,0.05)]
                                    hover:text-[#0998d5]
                                    transition-all duration-200"
                            >
                                <AnimatePresence mode="wait">
                                    {mobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <X strokeWidth={1.75} className="w-5 h-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <Menu strokeWidth={1.75} className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="lg:hidden border-t border-gray-200 dark:border-gray-800
                                bg-white dark:bg-gray-900"
                        >
                            <div className="container mx-auto px-4 sm:px-6 py-3 space-y-0.5">
                                {publicNavItems.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25, delay: i * 0.04 }}
                                    >
                                        <Link
                                            to={item.to || item.href}
                                            onClick={(e) => {
                                                if (item.href?.startsWith('#')) {
                                                    e.preventDefault();
                                                    scrollToSection(item.href.substring(1));
                                                }
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium
                                                text-gray-600 dark:text-gray-300
                                                hover:text-[#0998d5] dark:hover:text-[#0998d5]
                                                hover:[background:rgba(9,152,213,0.06)]
                                                transition-all duration-150 rounded-sm"
                                        >
                                            <item.icon strokeWidth={1.6} className="w-4 h-4 flex-shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {!isAuthenticated && (
                                    <>
                                        <div className="pt-3 pb-1 border-t border-gray-100 dark:border-gray-800" />
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 px-5 py-3
                                                bg-[#0998d5] hover:bg-[#0884b8]
                                                text-white font-semibold text-sm
                                                transition-colors duration-200"
                                        >
                                            <LogIn strokeWidth={1.75} className="w-4 h-4" />
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

export default Header;