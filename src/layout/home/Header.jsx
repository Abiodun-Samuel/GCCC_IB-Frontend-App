import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, Calendar, Users, LogIn, User, LayoutDashboard,
    ChevronDown, Menu, X, Clock, Star, FileText, LogOut, Video,
    MapPin,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useLogout, useMe } from '@/queries/auth.query';
import Avatar from '@/components/ui/Avatar';
import RoleBadge from '@/components/userProfile/RoleBadge';
import { useScrollState } from '@/hooks/useScrollState';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { EventIcon } from '@/icons';

// ─── Shared style tokens ──────────────────────────────────────────────────────

const NAV_LINK_CLS = `
    relative z-10 px-4 py-2.5 font-medium text-sm
    text-gray-600 dark:text-gray-400
    hover:text-[#0998d5] dark:hover:text-[#0998d5]
    transition-colors duration-200
    flex items-center gap-2.5
`;

const DROPDOWN_ROW_CLS = `
    group flex items-center gap-3 px-4 py-2.5 text-sm
    text-gray-600 dark:text-gray-300
    hover:text-[#0998d5] dark:hover:text-[#0998d5]
    hover:[background:rgba(9,152,213,0.06)] dark:hover:[background:rgba(9,152,213,0.09)]
    hover:translate-x-[3px]
    transition-all duration-150
`;

const DROPDOWN_ICON_CLS = `
    w-4 h-4 text-gray-400 dark:text-gray-500
    group-hover:text-[#0998d5] dark:group-hover:text-[#0998d5]
    transition-colors duration-150
`;

// ─── StarsBadge ───────────────────────────────────────────────────────────────

const StarsBadge = ({ totalStars }) => (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-400/20">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {totalStars || 0}
        </span>
    </div>
);

// ─── Header ───────────────────────────────────────────────────────────────────

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

    // ── Clock ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ── Click-outside ─────────────────────────────────────────────────────────
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

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            setMobileUserMenuOpen(false);
        } catch (e) { console.error('Logout failed:', e); }
    }, [logout]);

    const scrollToSection = useCallback((id, delay = 0) => {
        const run = () => {
            const el = document.getElementById(id);
            if (!el) return;
            window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        };
        delay > 0 ? setTimeout(run, delay) : run();
    }, []);

    const formatTime = useCallback((date) =>
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        []);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen(p => !p), []);
    const toggleMobileUserMenu = useCallback(() => setMobileUserMenuOpen(p => !p), []);
    const toggleDropdown = useCallback(() => setDropdownOpen(p => !p), []);

    // ── Nav config ────────────────────────────────────────────────────────────
    const publicNavItems = useMemo(() => [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'About', icon: Users, href: '#about' },
        { label: 'Events', icon: Calendar, href: '#events' },
        { label: 'Media', icon: Video, href: '#media' },
        { label: 'Contact', icon: MapPin, href: '#contact' },
        { label: 'Forms', icon: FileText, to: '/forms' },
    ], []);

    const authNavItems = useMemo(() => [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', show: true },
        { label: 'Profile', icon: User, to: '/dashboard/profile', show: true },
        { label: 'Events', icon: EventIcon, to: '/dashboard/events', show: true },
        { label: 'Admin', icon: Users, to: '/dashboard/admin', show: isAdmin },
        { label: 'Leader', icon: Star, to: '/dashboard/leaders', show: isLeader },
    ], [isAdmin, isLeader]);

    // ── Desktop nav item ──────────────────────────────────────────────────────
    const renderDesktopNavItem = (item, i) => {
        const isHash = item.href?.startsWith('#');

        const inner = (
            <>
                <span className="inline-block transition-transform duration-200 group-hover:rotate-[15deg] group-hover:scale-[1.15]">
                    <item.icon strokeWidth={1.6} className="w-4 h-4" />
                </span>
                <span>{item.label}</span>
                <span
                    aria-hidden
                    className="absolute bottom-0 left-3 right-3 h-px bg-[#0998d5] pointer-events-none origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                />
                <span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none [background:rgba(9,152,213,0)] group-hover:[background:rgba(9,152,213,0.06)] transition-[background] duration-200"
                />
            </>
        );

        const staggerStyle = { animation: `hdr-fade-down 0.3s ease ${i * 0.05}s both` };

        if (isHash) {
            return (
                <div key={item.label} className="relative group" style={staggerStyle}>
                    <a href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href.slice(1)); }} className={NAV_LINK_CLS}>
                        {inner}
                    </a>
                </div>
            );
        }

        return (
            <div key={item.label} className="relative group" style={staggerStyle}>
                <Link to={item.to || item.href} className={NAV_LINK_CLS}>{inner}</Link>
            </div>
        );
    };

    // ── Mobile nav item ───────────────────────────────────────────────────────
    const renderMobileNavItem = (item) => {
        const isHash = item.href?.startsWith('#');
        const cls = `flex items-center gap-3 px-4 py-3 text-sm font-medium
            text-gray-600 dark:text-gray-300
            hover:text-[#0998d5] dark:hover:text-[#0998d5]
            hover:[background:rgba(9,152,213,0.06)]
            transition-all duration-150 rounded-sm`;

        const children = (
            <>
                <item.icon strokeWidth={1.6} className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
            </>
        );

        if (isHash) {
            return (
                <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        scrollToSection(item.href.slice(1), 280);
                    }}
                    className={cls}
                >
                    {children}
                </a>
            );
        }

        return (
            <Link key={item.label} to={item.to || item.href} onClick={() => setMobileMenuOpen(false)} className={cls}>
                {children}
            </Link>
        );
    };

    // ── Dropdown CSS ──────────────────────────────────────────────────────────
    const dropdownCls = (open) => `
        absolute right-0 mt-2 w-64
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-xl shadow-black/8 dark:shadow-black/25
        rounded-sm overflow-hidden
        transition-all duration-[180ms] ease-[cubic-bezier(.4,0,.2,1)]
        ${open
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-2 scale-[0.97] pointer-events-none'}
    `;

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200
                    ${(mobileMenuOpen || mobileUserMenuOpen) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => { setMobileMenuOpen(false); setMobileUserMenuOpen(false); }}
            />

            {/* Nav bar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50
                    bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
                    border-b border-gray-200 dark:border-gray-800
                    transition-shadow duration-300
                    ${scrolled ? 'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]' : 'shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]'}`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Desktop ── */}
                    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 items-center h-20">

                        {/* Left: Logo + Clock */}
                        <div className="flex flex-col">
                            <Link to="/" className="block group w-fit">
                                <img src="/images/logo/logo-black.png" alt="GCCC Logo"
                                    className="h-14 w-auto object-contain dark:hidden transition-transform duration-200 group-hover:scale-[1.04]" />
                                <img src="/images/logo/logo-white.png" alt="GCCC Logo"
                                    className="h-14 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-[1.04]" />
                            </Link>
                            <div className="mt-1 flex items-center gap-1.5 cursor-default w-fit">
                                <Clock className="w-3 h-3 text-[#0998d5]" style={{ animation: 'hdr-spin 60s linear infinite' }} />
                                <span className="text-xs font-mono font-medium tabular-nums text-[#0998d5]">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Center: Nav */}
                        <nav className="flex items-center justify-center gap-1">
                            {publicNavItems.map((item, i) => renderDesktopNavItem(item, i))}
                        </nav>

                        {/* Right: Theme + Auth */}
                        <div className="flex items-center justify-end gap-3">
                            <ThemeToggleButton className="h-11 w-11" />

                            {isAuthenticated ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-2.5 px-3 py-2
                                            border border-gray-200 dark:border-gray-700
                                            bg-gray-50 dark:bg-gray-800
                                            text-gray-700 dark:text-gray-200
                                            hover:border-[#0998d5]/45
                                            hover:[background:rgba(9,152,213,0.05)]
                                            hover:text-[#0998d5] dark:hover:text-[#0998d5]
                                            hover:scale-[1.01] active:scale-[0.98]
                                            transition-all duration-200 rounded-sm"
                                    >
                                        <Avatar size="xs" name={user?.initials} src={user?.avatar} />
                                        <span className="text-sm font-medium">{user?.first_name}</span>
                                        <ChevronDown
                                            strokeWidth={1.75}
                                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-[250ms] ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </button>

                                    <div className={dropdownCls(dropdownOpen)}>
                                        <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-[#0998d5]/8 to-transparent">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.full_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2.5 truncate">{user?.email}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <RoleBadge showIcon />
                                                <StarsBadge totalStars={user?.total_stars} />
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            {authNavItems.filter(i => i.show).map((item) => (
                                                <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} className={DROPDOWN_ROW_CLS}>
                                                    <item.icon strokeWidth={1.6} className={DROPDOWN_ICON_CLS} />
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
                                                    hover:translate-x-[3px]
                                                    transition-all duration-150 disabled:opacity-40"
                                            >
                                                <LogOut strokeWidth={1.6} className="w-4 h-4" />
                                                <span>{isLoggingOut ? 'Logging out…' : 'Logout'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    style={{ animation: 'hdr-fade-down 0.3s ease 0.3s both' }}
                                    className="relative flex items-center gap-2 px-5 py-2.5
                                        bg-[#0998d5] hover:bg-[#0884b8]
                                        text-white font-semibold text-sm
                                        transition-colors duration-200 overflow-hidden
                                        group active:scale-[0.97]"
                                >
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 bg-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-500 pointer-events-none"
                                    />
                                    <LogIn strokeWidth={1.75} className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Sign In</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* ── Mobile ── */}
                    <div className="flex lg:hidden items-center justify-between h-20">

                        {/* Logo + Clock */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="block w-fit group">
                                <img src="/images/logo/logo-black.png" alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain dark:hidden transition-transform duration-200 group-hover:scale-[1.04]" />
                                <img src="/images/logo/logo-white.png" alt="GCCC Logo"
                                    className="h-12 md:h-14 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-[1.04]" />
                            </Link>
                            <div className="mt-1 flex items-center gap-1.5 cursor-default">
                                <Clock className="w-3 h-3 text-[#0998d5]" style={{ animation: 'hdr-spin 60s linear infinite' }} />
                                <span className="text-xs font-mono font-medium tabular-nums text-[#0998d5]">
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <ThemeToggleButton className="h-9 w-9" />

                            {isAuthenticated && (
                                <div className="relative" ref={mobileUserDropdownRef}>
                                    <button
                                        onClick={toggleMobileUserMenu}
                                        className="h-9 flex items-center gap-2 px-2.5
                                            border border-gray-200 dark:border-gray-700
                                            bg-gray-50 dark:bg-gray-800
                                            hover:border-[#0998d5]/45
                                            hover:[background:rgba(9,152,213,0.05)]
                                            active:scale-[0.95]
                                            transition-all duration-200"
                                    >
                                        <Avatar size="2xs" name={user?.initials} src={user?.avatar} />
                                        <ChevronDown
                                            strokeWidth={1.75}
                                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-[250ms] ${mobileUserMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </button>

                                    <div className={`${dropdownCls(mobileUserMenuOpen)} z-50`}>
                                        <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-[#0998d5]/8 to-transparent">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.full_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2.5 truncate">{user?.email}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <RoleBadge showIcon />
                                                <StarsBadge totalStars={user?.total_stars} />
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            {authNavItems.filter(i => i.show).map((item) => (
                                                <Link key={item.to} to={item.to} onClick={() => setMobileUserMenuOpen(false)} className={DROPDOWN_ROW_CLS}>
                                                    <item.icon strokeWidth={1.6} className={DROPDOWN_ICON_CLS} />
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
                                    </div>
                                </div>
                            )}

                            {/* Hamburger */}
                            <button
                                onClick={toggleMobileMenu}
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                                className="relative h-9 w-9 flex items-center justify-center
                                    border border-gray-200 dark:border-gray-700
                                    bg-gray-50 dark:bg-gray-800
                                    text-gray-500 dark:text-gray-400
                                    hover:border-[#0998d5]/45
                                    hover:[background:rgba(9,152,213,0.05)]
                                    hover:text-[#0998d5]
                                    active:scale-[0.95]
                                    transition-all duration-200"
                            >
                                <X
                                    strokeWidth={1.75}
                                    className={`w-5 h-5 absolute transition-all duration-[180ms] ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}
                                />
                                <Menu
                                    strokeWidth={1.75}
                                    className={`w-5 h-5 absolute transition-all duration-[180ms] ${mobileMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile drawer */}
                <div
                    className={`lg:hidden border-t border-gray-200 dark:border-gray-800
                        bg-white dark:bg-gray-900 overflow-hidden
                        transition-all duration-[250ms] ease-in-out
                        ${mobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="container mx-auto px-4 sm:px-6 py-3 space-y-0.5">
                        {publicNavItems.map((item) => renderMobileNavItem(item))}
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
                </div>
            </nav>

            {/* ── Spacer: compensates for fixed nav height ── */}
            <div className="h-20" aria-hidden="true" />
        </>
    );
};

export default Header;