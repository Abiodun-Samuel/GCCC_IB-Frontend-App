// ─── AdminEventRegistration.jsx ───────────────────────────────────────────────
// Event registration management page
// Route: events/:eventId/registration
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, CheckCircle2, XCircle, Phone, Mail, MessageCircle,
    Calendar, Search, Filter, Trash2, RefreshCw, ChevronDown,
    ArrowLeft, Radio, Video, MapPin, Clock, Wifi, WifiOff,
    TrendingUp, ExternalLink, Download,
} from 'lucide-react';
import { useEvent } from '@/queries/events.query';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — consistent with existing admin palette
───────────────────────────────────────────────────────────────────────────── */
const BRAND = '#119bd6';
const BRAND_DIM = 'rgba(17,155,214,0.10)';
const DANGER = '#eb2225';
const SUCCESS = '#10b981';

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const AVATAR_GRADIENTS = [
    'from-[#119bd6] to-[#0d8ac0]',
    'from-[#eb2225] to-[#d41e21]',
    'from-violet-500 to-violet-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-500 to-amber-700',
    'from-pink-500 to-pink-700',
];
const avatarGradient = (id) => AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];

const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/* ─────────────────────────────────────────────────────────────────────────────
   CSV EXPORT
───────────────────────────────────────────────────────────────────────────── */
const CSV_COLUMNS = [
    { header: '#', key: (r, i) => i + 1 },
    { header: 'Full Name', key: r => r.full_name },
    { header: 'Title', key: r => r.title ?? '' },
    { header: 'Email', key: r => r.email },
    { header: 'Phone', key: r => r.phone_number },
    { header: 'WhatsApp', key: r => r.whatsapp_number ?? '' },
    { header: 'Attending', key: r => r.attending ? 'Yes' : 'No' },
    { header: 'Registered On', key: r => fmtDate(r.created_at) },
];

const escapeCell = (val) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const exportToCSV = (rows, eventTitle = 'registrations') => {
    const header = CSV_COLUMNS.map(c => c.header).join(',');
    const body = rows.map((r, i) =>
        CSV_COLUMNS.map(c => escapeCell(c.key(r, i))).join(',')
    );
    const csv = [header, ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `${eventTitle.replace(/\s+/g, '_').toLowerCase()}_registrations.csv`,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

/* ─────────────────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────────────────── */
const Shimmer = ({ className = '' }) => (
    <div className={`relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700/60 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
);

const SkeletonRow = memo(() => (
    <tr className="border-b border-gray-100 dark:border-gray-800/60">
        <td className="px-4 py-3.5"><Shimmer className="h-4 w-6" /></td>
        <td className="px-4 py-3.5">
            <div className="flex items-center gap-3">
                <Shimmer className="h-9 w-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1"><Shimmer className="h-3.5 w-32" /><Shimmer className="h-3 w-24" /></div>
            </div>
        </td>
        <td className="px-4 py-3.5 hidden sm:table-cell"><Shimmer className="h-3.5 w-40" /></td>
        <td className="px-4 py-3.5 hidden md:table-cell"><Shimmer className="h-3.5 w-28" /></td>
        <td className="px-4 py-3.5 hidden lg:table-cell"><Shimmer className="h-3.5 w-28" /></td>
        <td className="px-4 py-3.5"><Shimmer className="h-6 w-20 rounded-full" /></td>
        <td className="px-4 py-3.5 hidden xl:table-cell"><Shimmer className="h-3.5 w-24" /></td>
        <td className="px-4 py-3.5"><Shimmer className="h-8 w-8 rounded-lg" /></td>
    </tr>
));
SkeletonRow.displayName = 'Reg.SkeletonRow';

const PageSkeleton = memo(() => (
    <div className="space-y-5 animate-pulse">
        {/* Back + header */}
        <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-9 rounded-xl" />
            <div className="space-y-1.5"><Shimmer className="h-5 w-52" /><Shimmer className="h-3.5 w-32" /></div>
        </div>
        {/* Event banner */}
        <Shimmer className="h-28 w-full rounded-2xl" />
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3"><Shimmer className="h-3 w-24" /><Shimmer className="h-9 w-9 rounded-xl" /></div>
                    <Shimmer className="h-8 w-16 mb-2" /><Shimmer className="h-3 w-32" />
                </div>
            ))}
        </div>
        {/* Table */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <Shimmer className="h-9 w-64 rounded-xl" />
                <div className="flex gap-2"><Shimmer className="h-9 w-28 rounded-xl" /><Shimmer className="h-9 w-9 rounded-xl" /></div>
            </div>
            <table className="w-full">
                <thead><tr className="border-b border-gray-100 dark:border-gray-800">{Array.from({ length: 8 }).map((_, i) => <th key={i} className="px-4 py-3"><Shimmer className="h-3 w-16" /></th>)}</tr></thead>
                <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
            </table>
        </div>
    </div>
));
PageSkeleton.displayName = 'Reg.PageSkeleton';

/* ─────────────────────────────────────────────────────────────────────────────
   ERROR STATE
───────────────────────────────────────────────────────────────────────────── */
const ErrorState = memo(({ onRetry }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <WifiOff className="w-7 h-7 text-red-400" strokeWidth={1.5} />
        </div>
        <div className="text-center">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Failed to load registrations</p>
            <p className="text-sm text-gray-400 mt-0.5">Check your connection and try again</p>
        </div>
        <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: BRAND }}
        >
            <RefreshCw className="w-4 h-4" /> Retry
        </button>
    </div>
));
ErrorState.displayName = 'Reg.ErrorState';

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT BANNER — shows key event info above the table
───────────────────────────────────────────────────────────────────────────── */
const EventBanner = memo(({ event }) => {
    const STATUS_PILL = {
        upcoming: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        ongoing: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        past: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    };

    return (
        <div className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* Accent top bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${BRAND}, #0d8ac0)` }} />

            <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Event image */}
                {event.image && (
                    <div className="shrink-0 w-full sm:w-24 h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Event details */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight flex-1">{event.title}</h2>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_PILL[event.status] ?? STATUS_PILL.past}`}>
                            {event.status}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {event.date && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                                {event.date}
                            </span>
                        )}
                        {event.time && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                                {event.time}
                            </span>
                        )}
                        {event.location && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                                {event.location}
                            </span>
                        )}
                    </div>

                    {/* Streaming links */}
                    {event.has_streaming && (
                        <div className="flex gap-2 mt-3">
                            {event.video_streaming_link && (
                                <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:opacity-80 transition-opacity">
                                    <Video className="w-3 h-3" strokeWidth={2} /> Video Stream <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                            )}
                            {event.audio_streaming_link && (
                                <a href={event.audio_streaming_link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:opacity-80 transition-opacity">
                                    <Radio className="w-3 h-3" strokeWidth={2} /> Audio Stream <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
EventBanner.displayName = 'Reg.EventBanner';

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────────────── */
const StatCard = memo(({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#119bd6]/30 hover:shadow-lg hover:shadow-[#119bd6]/5 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.8} />
            </div>
        </div>
        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight tabular-nums">{value}</p>
        {sub && <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
));
StatCard.displayName = 'Reg.StatCard';

/* ─────────────────────────────────────────────────────────────────────────────
   ATTENDANCE BAR
───────────────────────────────────────────────────────────────────────────── */
const AttendanceBar = memo(({ attending, total }) => {
    const pct = total > 0 ? Math.round((attending / total) * 100) : 0;
    const barColor = pct >= 70 ? 'from-emerald-500 to-emerald-600' : pct >= 40 ? `from-[${BRAND}] to-[#0d8ac0]` : 'from-amber-500 to-amber-600';

    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.8} /> Attendance Rate
                </p>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {attending} of {total} attending
                </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">{pct}% confirmed attendance</p>
        </div>
    );
});
AttendanceBar.displayName = 'Reg.AttendanceBar';

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
const FILTER_OPTIONS = [
    { key: 'all', label: 'All Registrations' },
    { key: 'attending', label: 'Attending' },
    { key: 'not_attending', label: 'Not Attending' },
];

const FilterDropdown = memo(({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const current = FILTER_OPTIONS.find(o => o.key === value);

    const handleSelect = useCallback((key) => {
        onChange(key);
        setOpen(false);
    }, [onChange]);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#119bd6]/40 transition-all duration-200 whitespace-nowrap"
            >
                <Filter className="w-3.5 h-3.5" strokeWidth={1.8} />
                {current?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/60 dark:shadow-black/40 z-20 overflow-hidden">
                        {FILTER_OPTIONS.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => handleSelect(key)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                    ${value === key
                                        ? 'bg-[#119bd6]/10 text-[#119bd6] font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});
FilterDropdown.displayName = 'Reg.FilterDropdown';

/* ─────────────────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────────────────── */
const EmptyState = memo(({ hasFilters, onClear }) => (
    <tr>
        <td colSpan={8} className="px-4 py-16 text-center">
            <div className="flex flex-col items-center gap-2.5">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {hasFilters ? 'No registrations match your filters' : 'No registrations yet'}
                </p>
                {hasFilters && (
                    <button onClick={onClear} className="text-xs font-medium mt-0.5 hover:underline" style={{ color: BRAND }}>
                        Clear filters
                    </button>
                )}
            </div>
        </td>
    </tr>
));
EmptyState.displayName = 'Reg.EmptyState';

/* ─────────────────────────────────────────────────────────────────────────────
   TABLE HEADER CELL
───────────────────────────────────────────────────────────────────────────── */
const TH = ({ children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

/* ─────────────────────────────────────────────────────────────────────────────
   REGISTRATION ROW
───────────────────────────────────────────────────────────────────────────── */
const RegistrationRow = memo(({ reg, index, onDelete }) => (
    <tr className="group border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-150">

        {/* Index */}
        <td className="px-4 py-3.5">
            <span className="text-xs font-semibold text-gray-300 dark:text-gray-600 tabular-nums">
                {String(index + 1).padStart(2, '0')}
            </span>
        </td>

        {/* Registrant */}
        <td className="px-4 py-3.5">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(reg.id)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                    {getInitials(reg.full_name)}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{reg.full_name}</p>
                    {reg.title && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{reg.title}</p>}
                </div>
            </div>
        </td>

        {/* Email */}
        <td className="px-4 py-3.5 hidden sm:table-cell">
            <a
                href={`mailto:${reg.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#119bd6] transition-colors duration-150 group/link"
            >
                <Mail className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600 group-hover/link:text-[#119bd6] transition-colors" strokeWidth={1.8} />
                <span className="truncate max-w-[160px]">{reg.email}</span>
            </a>
        </td>

        {/* Phone */}
        <td className="px-4 py-3.5 hidden md:table-cell">
            <a
                href={`tel:${reg.phone_number}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#119bd6] transition-colors duration-150 group/link"
            >
                <Phone className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600 group-hover/link:text-[#119bd6] transition-colors" strokeWidth={1.8} />
                {reg.phone_number}
            </a>
        </td>

        {/* WhatsApp */}
        <td className="px-4 py-3.5 hidden lg:table-cell">
            {reg.whatsapp_number ? (
                <a
                    href={`https://wa.me/${reg.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors duration-150 group/link"
                >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600 group-hover/link:text-emerald-500 transition-colors" strokeWidth={1.8} />
                    {reg.whatsapp_number}
                </a>
            ) : (
                <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
            )}
        </td>

        {/* Attendance status */}
        <td className="px-4 py-3.5">
            {reg.attending ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    Attending
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Not Going
                </span>
            )}
        </td>

        {/* Registered date */}
        <td className="px-4 py-3.5 hidden xl:table-cell">
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                {fmtDate(reg.created_at)}
            </div>
        </td>

        {/* Delete */}
        <td className="px-4 py-3.5">
            {onDelete && (
                <button
                    onClick={() => onDelete(reg)}
                    title="Delete registration"
                    className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                </button>
            )}
        </td>
    </tr>
));
RegistrationRow.displayName = 'Reg.RegistrationRow';

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminEventRegistration({ onDelete }) {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    /* ── Data ─────────────────────────────────────────────────────────────── */
    const { data: response, isLoading, isError, refetch } = useEvent(eventId);

    /* ── Derive values from actual API shape ─────────────────────────────── */
    const event = response?.data ?? null;
    const registrations = event?.registrations ?? [];

    const stats = useMemo(() => {
        const attending = registrations.filter(r => r.attending).length;
        return {
            total: registrations.length,
            attending,
            notAttending: registrations.length - attending,
        };
    }, [registrations]);

    /* ── Client-side filter + search ─────────────────────────────────────── */
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return registrations.filter(reg => {
            const matchSearch = !term
                || reg.full_name.toLowerCase().includes(term)
                || reg.email.toLowerCase().includes(term)
                || reg.phone_number.includes(term);

            const matchFilter
                = filter === 'all'
                || (filter === 'attending' && reg.attending)
                || (filter === 'not_attending' && !reg.attending);

            return matchSearch && matchFilter;
        });
    }, [registrations, search, filter]);

    const hasFilters = !!(search || filter !== 'all');
    const clearFilters = useCallback(() => { setSearch(''); setFilter('all'); }, []);

    /* ── Early returns ───────────────────────────────────────────────────── */
    if (isLoading) return <PageSkeleton />;
    if (isError || !event) return <ErrorState onRetry={refetch} />;

    /* ── Render ──────────────────────────────────────────────────────────── */
    return (
        <div className="space-y-5">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    title="Back to events"
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-[#119bd6]/40 hover:text-[#119bd6] transition-all duration-200 shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Registrations</h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                        Event #{eventId} · {stats.total} registered
                    </p>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={() => refetch()}
                        title="Refresh"
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-[#119bd6]/40 hover:text-[#119bd6] transition-all duration-200"
                    >
                        <RefreshCw className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                </div>
            </div>

            {/* ── Event Banner ─────────────────────────────────────────────── */}
            <EventBanner event={event} />

            {/* ── Stat Cards ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    label="Total Registered"
                    value={stats.total}
                    icon={Users}
                    iconBg="bg-[#119bd6]/10 dark:bg-[#119bd6]/15"
                    iconColor="text-[#119bd6]"
                    sub={`${stats.attending} confirmed`}
                />
                <StatCard
                    label="Attending"
                    value={stats.attending}
                    icon={CheckCircle2}
                    iconBg="bg-emerald-500/10 dark:bg-emerald-500/15"
                    iconColor="text-emerald-500"
                    sub="Will be present"
                />
                <StatCard
                    label="Not Attending"
                    value={stats.notAttending}
                    icon={XCircle}
                    iconBg="bg-red-500/10 dark:bg-red-500/15"
                    iconColor="text-red-500"
                    sub="Declined"
                />
            </div>

            {/* ── Attendance Rate Bar ───────────────────────────────────────── */}
            {stats.total > 0 && (
                <AttendanceBar attending={stats.attending} total={stats.total} />
            )}

            {/* ── Table Card ───────────────────────────────────────────────── */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={1.8} />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#119bd6]/40 focus:border-[#119bd6]/60 transition-all duration-200"
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <FilterDropdown value={filter} onChange={setFilter} />
                        <button
                            onClick={() => exportToCSV(filtered, event.title)}
                            title="Download as CSV"
                            disabled={filtered.length === 0}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#119bd6]/40 hover:text-[#119bd6] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                        >
                            <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Result count bar */}
                <div className="px-5 py-2.5 bg-gray-50/60 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Showing{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span>
                        {' '}of{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{stats.total}</span>{' '}
                        registrations
                        {hasFilters && (
                            <button onClick={clearFilters} className="ml-2 underline hover:no-underline" style={{ color: BRAND }}>
                                clear filters
                            </button>
                        )}
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px]">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30">
                                <TH className="w-12">#</TH>
                                <TH className="min-w-[180px]">Registrant</TH>
                                <TH className="hidden sm:table-cell min-w-[180px]">Email</TH>
                                <TH className="hidden md:table-cell">Phone</TH>
                                <TH className="hidden lg:table-cell">WhatsApp</TH>
                                <TH>Status</TH>
                                <TH className="hidden xl:table-cell">Registered</TH>
                                <TH className="w-12" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                            {filtered.length === 0 ? (
                                <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
                            ) : (
                                filtered.map((reg, idx) => (
                                    <RegistrationRow
                                        key={reg.id}
                                        reg={reg}
                                        index={idx}
                                        onDelete={onDelete}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {stats.total} total · {stats.attending} attending · {stats.notAttending} not going
                    </p>
                    {event.is_registration_open ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <Wifi className="w-3.5 h-3.5" strokeWidth={2} /> Registration open
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
                            <WifiOff className="w-3.5 h-3.5" strokeWidth={2} /> Registration closed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}