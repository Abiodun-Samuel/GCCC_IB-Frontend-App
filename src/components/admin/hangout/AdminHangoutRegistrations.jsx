// ─── AdminHangoutRegistrations.jsx ───────────────────────────────────────────
// GCCC Hangout 2026 registrations: totals, filters, sorting, export.
// Route: /dashboard/admin/hangout
// ─────────────────────────────────────────────────────────────────────────────

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    ArrowDown, ArrowUp, ArrowUpDown, Download, ExternalLink, Gamepad2, HandCoins, Loader2,
    Mail, MessageCircle, Phone, RefreshCw, Search, Users, WifiOff, X,
} from 'lucide-react';
import Paginator from '@/components/common/Paginator';
import { useHangoutRegistrations } from '@/queries/hangout.query';
import { HangoutService } from '@/services/hangout.service';
import { Toast } from '@/lib/toastify';
import { formatNaira } from '@/components/hangout/money';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const BRAND = '#119bd6';
const PER_PAGE_OPTIONS = [10, 20, 50, 100];
const SUPPORT_OPTIONS = [
    { value: '', label: 'All registrations' },
    { value: 'with', label: 'Pledged support' },
    { value: 'without', label: 'No pledge' },
];
// Text sorts A→Z first; dates and amounts newest/highest first.
const DEFAULT_DIRECTION = { full_name: 'asc', email: 'asc', game: 'asc', support_amount: 'desc', created_at: 'desc', updated_at: 'desc' };

const SELECT_CLS = `px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
    text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#119bd6]/40 focus:border-[#119bd6]/60`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const getInitials = (name = '') => name.split(/\s+/).slice(0, 2).map((n) => n[0] ?? '').join('').toUpperCase();

const fmtDateTime = (iso) => (iso
    ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—');

const useDebounced = (value, delay) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

/* ─── Small pieces ───────────────────────────────────────────────────────── */

const Shimmer = ({ className = '', style }) => (
    <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700/60 ${className}`} style={style} />
);

const StatCard = memo(({ label, value, sub, icon: Icon, tint }) => (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon className="w-4 h-4" strokeWidth={1.8} />
            </div>
        </div>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight tabular-nums">{value}</p>
        {sub && <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
));
StatCard.displayName = 'Hangout.StatCard';

const SortHeader = ({ field, label, sort, onSort, className = '' }) => {
    const active = sort.field === field;
    const Icon = !active ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown;
    return (
        <th
            scope="col"
            aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            className={`px-4 py-3 text-left ${className}`}
        >
            <button
                type="button"
                onClick={() => onSort(field)}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors
                    ${active ? 'text-[#119bd6]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                {label}
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
        </th>
    );
};

const TH = ({ children, className = '' }) => (
    <th scope="col" className={`px-4 py-3 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

const SkeletonRows = () => Array.from({ length: 6 }, (_, i) => (
    <tr key={i} className="border-b border-gray-100 dark:border-gray-800/60">
        <td className="px-4 py-3.5"><Shimmer className="h-4 w-6" /></td>
        <td className="px-4 py-3.5"><div className="flex items-center gap-3"><Shimmer className="h-9 w-9 rounded-full" /><Shimmer className="h-4 w-32" /></div></td>
        {[160, 110, 110, 90, 70, 110, 110].map((w, j) => (
            <td key={j} className="px-4 py-3.5"><Shimmer className="h-4" style={{ width: w }} /></td>
        ))}
    </tr>
));

/* ─── Row ────────────────────────────────────────────────────────────────── */

const RegistrationRow = memo(({ reg, number }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
        <td className="px-4 py-3.5 text-xs font-semibold text-gray-300 dark:text-gray-600 tabular-nums">{String(number).padStart(2, '0')}</td>
        <td className="px-4 py-3.5">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#119bd6] to-[#0d6f9c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitials(reg.full_name)}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{reg.full_name}</p>
            </div>
        </td>
        <td className="px-4 py-3.5">
            <a href={`mailto:${reg.email}`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#119bd6]">
                <Mail className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600" strokeWidth={1.8} />
                {reg.email}
            </a>
        </td>
        <td className="px-4 py-3.5">
            <a href={`tel:${reg.phone_number}`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#119bd6] whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600" strokeWidth={1.8} />
                {reg.phone_number}
            </a>
        </td>
        <td className="px-4 py-3.5">
            {reg.whatsapp_number ? (
                <a
                    href={`https://wa.me/${reg.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 whitespace-nowrap"
                >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600" strokeWidth={1.8} />
                    {reg.whatsapp_number}
                </a>
            ) : <span className="text-xs text-gray-300 dark:text-gray-600">—</span>}
        </td>
        <td className="px-4 py-3.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-[#119bd6]/10 text-[#0d7fb0] dark:text-[#5cc4f0] border border-[#119bd6]/20">
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                {reg.game}
            </span>
        </td>
        <td className="px-4 py-3.5 text-sm font-semibold tabular-nums whitespace-nowrap">
            {reg.support_amount !== null
                ? <span className="text-emerald-700 dark:text-emerald-400">{formatNaira(reg.support_amount)}</span>
                : <span className="text-xs font-normal text-gray-300 dark:text-gray-600">—</span>}
        </td>
        <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtDateTime(reg.created_at)}</td>
        <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {reg.updated_at && reg.updated_at !== reg.created_at ? fmtDateTime(reg.updated_at) : '—'}
        </td>
    </tr>
));
RegistrationRow.displayName = 'Hangout.RegistrationRow';

/* ─── Root ───────────────────────────────────────────────────────────────── */

export default function AdminHangoutRegistrations() {
    const [search, setSearch] = useState('');
    const [game, setGame] = useState('');
    const [support, setSupport] = useState('');
    const [sort, setSort] = useState({ field: 'created_at', direction: 'desc' });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [exporting, setExporting] = useState(false);

    const debouncedSearch = useDebounced(search.trim(), 350);
    // A new search starts from the first page.
    useEffect(() => setPage(1), [debouncedSearch]);

    const filters = useMemo(() => ({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(game && { game }),
        ...(support && { support }),
        sort: sort.field,
        direction: sort.direction,
    }), [debouncedSearch, game, support, sort]);
    const params = useMemo(() => ({ ...filters, page, per_page: perPage }), [filters, page, perPage]);

    const { data, isLoading, isFetching, isError, refetch } = useHangoutRegistrations(params);
    const payload = data?.data;
    const registrations = payload?.registrations ?? [];
    const meta = payload?.meta;
    const summary = payload?.summary;

    const hasFilters = !!(search || game || support);
    const clearFilters = useCallback(() => { setSearch(''); setGame(''); setSupport(''); setPage(1); }, []);
    const chooseGame = useCallback((value) => { setGame(value); setPage(1); }, []);

    const onSort = useCallback((field) => {
        setSort((current) => (current.field === field
            ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
            : { field, direction: DEFAULT_DIRECTION[field] ?? 'asc' }));
        setPage(1);
    }, []);

    const exportCsv = useCallback(async () => {
        setExporting(true);
        try {
            const blob = await HangoutService.exportRegistrations(filters);
            downloadBlob(blob, `gccc-hangout-2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
        } catch {
            Toast.error("Couldn't export the registrations. Try again.");
        } finally {
            setExporting(false);
        }
    }, [filters]);

    const paginatorObj = useMemo(() => (meta ? {
        links: meta.links ?? [], current_page: meta.current_page, from: meta.from, to: meta.to, total: meta.total,
    } : null), [meta]);

    if (isError && !payload) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <WifiOff className="w-7 h-7 text-red-400" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Couldn't load hangout registrations</p>
                    <p className="text-sm text-gray-400 mt-0.5">Check your connection and try again</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-85"
                    style={{ background: BRAND }}
                >
                    <RefreshCw className="w-4 h-4" /> Try again
                </button>
            </div>
        );
    }

    const games = summary?.by_game ?? [];

    return (
        <div className="space-y-5">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-center gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">GCCC Hangout 2026</h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Saturday 28 November 2026 · Agodi Gardens, Ibadan</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <a
                        href="/hangout" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#119bd6]/40 hover:text-[#119bd6]"
                    >
                        <ExternalLink className="w-4 h-4" strokeWidth={1.8} /> View page
                    </a>
                    <button
                        onClick={() => refetch()}
                        title="Refresh"
                        aria-label="Refresh"
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-[#119bd6]/40 hover:text-[#119bd6]"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} strokeWidth={1.8} />
                    </button>
                </div>
            </div>

            {/* ── Totals ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading || !summary ? Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <Shimmer className="h-3 w-24 mb-4" /><Shimmer className="h-8 w-20" />
                    </div>
                )) : (
                    <>
                        <StatCard label="Registered" value={summary.total.toLocaleString('en-GB')} sub="People signed up" icon={Users} tint="bg-[#119bd6]/10 text-[#119bd6]" />
                        <StatCard label="Support pledged" value={formatNaira(summary.total_pledged)} sub="Total of all pledges" icon={HandCoins} tint="bg-emerald-500/10 text-emerald-500" />
                        <StatCard label="Pledges" value={summary.pledges.toLocaleString('en-GB')} sub={`${summary.total - summary.pledges} without a pledge`} icon={HandCoins} tint="bg-amber-500/10 text-amber-500" />
                        <StatCard
                            label="Registration"
                            value={summary.registration_open ? 'Open' : 'Closed'}
                            sub={summary.registration_open ? 'Taking registrations' : 'No longer taking registrations'}
                            icon={Gamepad2}
                            tint={summary.registration_open ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}
                        />
                    </>
                )}
            </div>

            {/* ── Per game ── */}
            {games.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                        <Gamepad2 className="w-3.5 h-3.5" strokeWidth={1.8} /> Registrations per game
                    </p>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {games.map(({ game: name, count }) => (
                            <li key={name}>
                                <button
                                    type="button"
                                    onClick={() => chooseGame(game === name ? '' : name)}
                                    aria-pressed={game === name}
                                    title={game === name ? 'Show all games' : `Show ${name} registrations`}
                                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors
                                        ${game === name
                                            ? 'border-[#119bd6] bg-[#119bd6]/10'
                                            : 'border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-[#119bd6]/40'}`}
                                >
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{name}</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{count}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Table ── */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={1.8} />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email or phone…"
                            aria-label="Search registrations"
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#119bd6]/40 focus:border-[#119bd6]/60"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select aria-label="Filter by game" value={game} onChange={(e) => chooseGame(e.target.value)} className={SELECT_CLS}>
                            <option value="">All games</option>
                            {games.map(({ game: name }) => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <select aria-label="Filter by support" value={support} onChange={(e) => { setSupport(e.target.value); setPage(1); }} className={SELECT_CLS}>
                            {SUPPORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <select aria-label="Rows per page" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className={SELECT_CLS}>
                            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n} per page</option>)}
                        </select>
                        <button
                            onClick={exportCsv}
                            disabled={exporting || !meta?.total}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#119bd6]/40 hover:text-[#119bd6] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" strokeWidth={1.8} />}
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-gray-50/60 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
                        {meta
                            ? <>Showing <b className="text-gray-700 dark:text-gray-300">{meta.from ?? 0}–{meta.to ?? 0}</b> of <b className="text-gray-700 dark:text-gray-300">{meta.total}</b>{hasFilters ? ' matching' : ''} registrations</>
                            : 'Loading registrations…'}
                    </p>
                    {hasFilters && (
                        <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: BRAND }}>
                            <X className="w-3 h-3" /> Clear filters
                        </button>
                    )}
                </div>

                <div className={`overflow-x-auto transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30">
                                <TH className="w-12">#</TH>
                                <SortHeader field="full_name" label="Name" sort={sort} onSort={onSort} />
                                <SortHeader field="email" label="Email" sort={sort} onSort={onSort} />
                                <TH>Phone</TH>
                                <TH>WhatsApp</TH>
                                <SortHeader field="game" label="Game" sort={sort} onSort={onSort} />
                                <SortHeader field="support_amount" label="Support" sort={sort} onSort={onSort} />
                                <SortHeader field="created_at" label="Registered" sort={sort} onSort={onSort} />
                                <SortHeader field="updated_at" label="Updated" sort={sort} onSort={onSort} />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <SkeletonRows /> : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2.5">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                {hasFilters ? 'No registrations match your filters' : 'No one has registered yet'}
                                            </p>
                                            {hasFilters && (
                                                <button onClick={clearFilters} className="text-xs font-medium hover:underline" style={{ color: BRAND }}>Clear filters</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : registrations.map((reg, index) => (
                                <RegistrationRow key={reg.id} reg={reg} number={(meta?.from ?? 1) + index} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {paginatorObj && meta.last_page > 1 && (
                    <div className="px-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20">
                        <Paginator paginationData={paginatorObj} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
