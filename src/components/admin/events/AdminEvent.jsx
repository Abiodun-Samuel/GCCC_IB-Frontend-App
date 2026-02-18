import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useAdminRegistrations } from "@/queries/registration.query"; // adjust to your hooks path

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded bg-gray-200 dark:bg-gray-700/60 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
    <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
  </div>
);

const StatCardSkeleton = () => (
  <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-3">
      <Shimmer className="h-3 w-24" />
      <Shimmer className="h-9 w-9 rounded-xl" />
    </div>
    <Shimmer className="h-8 w-16 mb-2" />
    <Shimmer className="h-3 w-32" />
  </div>
);

const RowSkeleton = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800/60">
    <td className="px-4 py-3.5"><Shimmer className="h-4 w-6" /></td>
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Shimmer className="h-9 w-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Shimmer className="h-3.5 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3.5 hidden sm:table-cell"><Shimmer className="h-3.5 w-40" /></td>
    <td className="px-4 py-3.5 hidden md:table-cell"><Shimmer className="h-3.5 w-28" /></td>
    <td className="px-4 py-3.5 hidden lg:table-cell"><Shimmer className="h-3.5 w-28" /></td>
    <td className="px-4 py-3.5"><Shimmer className="h-6 w-20 rounded-full" /></td>
    <td className="px-4 py-3.5 hidden xl:table-cell"><Shimmer className="h-3.5 w-24" /></td>
    <td className="px-4 py-3.5"><Shimmer className="h-8 w-8 rounded-lg" /></td>
  </tr>
);

const TableSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-3 w-16" />
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800" />
    </div>
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
        <Shimmer className="h-9 w-64 rounded-xl" />
        <div className="flex gap-2">
          <Shimmer className="h-9 w-28 rounded-xl" />
          <Shimmer className="h-9 w-9 rounded-xl" />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Shimmer className="h-3 w-full max-w-[70px]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const avatarColors = [
  "from-[#119bd6] to-[#0d8ac0]",
  "from-[#eb2225] to-[#d41e21]",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-pink-500 to-pink-700",
];

const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#119bd6]/30 dark:hover:border-[#119bd6]/30 hover:shadow-lg hover:shadow-[#119bd6]/5 transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.8} />
      </div>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
    {sub && <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
  </div>
);

// ─── Capacity Bar ──────────────────────────────────────────────────────────────
const CapacityBar = ({ registered, max }) => {
  const pct = Math.round((registered / max) * 100);
  const color =
    pct >= 90 ? "from-[#eb2225] to-[#d41e21]" :
      pct >= 70 ? "from-amber-500 to-amber-600" :
        "from-[#119bd6] to-[#0d8ac0]";

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.8} /> Capacity
        </p>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {registered} / {max} slots filled
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">{pct}% capacity reached</p>
    </div>
  );
};

// ─── Filter Dropdown ───────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { key: "all", label: "All Registrations" },
  { key: "attending", label: "Attending" },
  { key: "not_attending", label: "Not Attending" },
];

const FilterDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const current = FILTER_OPTIONS.find((o) => o.key === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#119bd6]/40 transition-all duration-200"
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={1.8} />
        {current?.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/60 dark:shadow-black/40 z-20 overflow-hidden">
            {FILTER_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                  ${value === key
                    ? "bg-[#119bd6]/10 text-[#119bd6] font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
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
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminEvent({ onDelete }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ── Fetch data via hook ─────────────────────────────────────────────────────
  const { data: response, isLoading, refetch } = useAdminRegistrations();

  // ── Derive values from response ─────────────────────────────────────────────
  const {
    total_registered = 0,
    max_capacity = 54,
    available_slots = 54,
    registrations = [],
  } = response?.data ?? {};

  // ── Client-side filter + search (no API calls) ──────────────────────────────
  const filtered = registrations.filter((reg) => {
    const term = search.trim().toLowerCase();
    const matchSearch =
      !term ||
      reg.full_name.toLowerCase().includes(term) ||
      reg.email.toLowerCase().includes(term) ||
      reg.phone_number.includes(term);

    const matchFilter =
      filter === "all" ||
      (filter === "attending" && reg.attending) ||
      (filter === "not_attending" && !reg.attending);

    return matchSearch && matchFilter;
  });

  const attendingCount = registrations.filter((r) => r.attending).length;
  const notAttendingCount = registrations.filter((r) => !r.attending).length;

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-5">

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          value={total_registered}
          icon={Users}
          iconBg="bg-[#119bd6]/10 dark:bg-[#119bd6]/15"
          iconColor="text-[#119bd6]"
          sub={`${available_slots} slots remaining`}
        />
        <StatCard
          label="Attending"
          value={attendingCount}
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 dark:bg-emerald-500/15"
          iconColor="text-emerald-500"
          sub="Confirmed attendees"
        />
        <StatCard
          label="Not Attending"
          value={notAttendingCount}
          icon={XCircle}
          iconBg="bg-[#eb2225]/10 dark:bg-[#eb2225]/15"
          iconColor="text-[#eb2225]"
          sub="Declined invitations"
        />
        <StatCard
          label="Max Capacity"
          value={max_capacity}
          icon={Users}
          iconBg="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-500 dark:text-gray-400"
          sub="Total allowed seats"
        />
      </div>

      {/* ── Capacity Bar ──────────────────────────────────────────────── */}
      <CapacityBar registered={total_registered} max={max_capacity} />

      {/* ── Table Card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          {/* Search — purely client-side */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#119bd6]/40 focus:border-[#119bd6]/60 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter — purely client-side */}
            <FilterDropdown value={filter} onChange={setFilter} />

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              title="Refresh"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-[#119bd6]/40 hover:text-[#119bd6] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Result count */}
        <div className="px-5 py-2.5 bg-gray-50/60 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span>
            {" "}of{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{total_registered}</span>{" "}
            registrations
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30">
                {[
                  { label: "#", cls: "w-12" },
                  { label: "Registrant", cls: "min-w-[180px]" },
                  { label: "Email", cls: "hidden sm:table-cell min-w-[180px]" },
                  { label: "Phone", cls: "hidden md:table-cell" },
                  { label: "WhatsApp", cls: "hidden lg:table-cell" },
                  { label: "Status", cls: "" },
                  { label: "Registered", cls: "hidden xl:table-cell" },
                  { label: "", cls: "w-12" },
                ].map(({ label, cls }) => (
                  <th
                    key={label || "action"}
                    className={`px-4 py-3 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-10 h-10 text-gray-200 dark:text-gray-700" strokeWidth={1} />
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        No registrations found
                      </p>
                      {(search || filter !== "all") && (
                        <button
                          onClick={() => { setSearch(""); setFilter("all"); }}
                          className="text-xs text-[#119bd6] hover:underline mt-1"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    className="group hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-150"
                  >
                    {/* Index */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-gray-300 dark:text-gray-600">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Registrant */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(reg.id)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                        >
                          {getInitials(reg.full_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {reg.full_name}
                          </p>
                          {reg.title && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{reg.title}</p>
                          )}
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
                        <span className="truncate max-w-[180px]">{reg.email}</span>
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
                          href={`https://wa.me/${reg.whatsapp_number.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors duration-150 group/link"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-600 group-hover/link:text-emerald-500 transition-colors" strokeWidth={1.8} />
                          {reg.whatsapp_number}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {reg.attending ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eb2225]/5 dark:bg-[#eb2225]/10 text-[#eb2225] border border-[#eb2225]/15 dark:border-[#eb2225]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eb2225] shrink-0" />
                          Not Going
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                        {formatDate(reg.created_at)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(reg)}
                          title="Delete registration"
                          className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-[#eb2225] hover:bg-[#eb2225]/8 dark:hover:bg-[#eb2225]/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {total_registered} total · {attendingCount} attending · {notAttendingCount} not going
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">Max {max_capacity} seats</p>
        </div>
      </div>
    </div>
  );
}