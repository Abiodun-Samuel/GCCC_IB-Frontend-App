import { Link } from "react-router-dom";


/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_RGB = "9,152,213";

export const AuthCard = ({ eyebrow, title, tagline, backSlot, children }) => {
    return (
        <div
            className="w-full max-w-md mx-auto"
            data-aos="fade-up"
            data-aos-duration="500"
        >
            <div
                className="
                    relative overflow-hidden
                    rounded-2xl
                    border border-slate-200 dark:border-slate-700/50
                    bg-white dark:bg-slate-900/60
                    shadow-[0_8px_48px_rgba(0,0,0,0.08)] dark:shadow-none
                "
            >
                {/* ── Corner accent blobs (brand, not purple) ──────── */}
                <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, rgba(${B_RGB},0.12) 0%, transparent 70%)`,
                    }}
                />
                <div
                    className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, rgba(${B_RGB},0.08) 0%, transparent 70%)`,
                    }}
                />

                {/* ── Panel header ─────────────────────────────────── */}
                <div
                    className="
                        relative px-8 pt-8 pb-7
                        border-b border-slate-100 dark:border-slate-700/50
                        bg-slate-50/80 dark:bg-slate-800/50
                        text-center
                    "
                >
                    {/* Back button slot — top-left absolute */}
                    {backSlot && (
                        <div className="absolute left-6 top-6">
                            {backSlot}
                        </div>
                    )}

                    {/* Logo */}
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center mb-5
                            transition-opacity hover:opacity-80"
                    >
                        <img
                            width={52}
                            src="/images/logo/gccc.png"
                            alt="GCCC"
                            className="object-contain"
                        />
                    </Link>

                    {/* Eyebrow */}
                    {eyebrow && (
                        <div className="flex items-center justify-center gap-2 mb-2.5">
                            <span
                                className="block w-5 h-[2px] rounded-full"
                                style={{ background: `rgba(${B_RGB},0.40)` }}
                            />
                            <span
                                className="text-[10px] font-black uppercase tracking-[0.22em]"
                                style={{ color: B }}
                            >
                                {eyebrow}
                            </span>
                            <span
                                className="block w-5 h-[2px] rounded-full"
                                style={{ background: `rgba(${B_RGB},0.40)` }}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-2xl font-bold tracking-tight
                        text-slate-900 dark:text-white leading-snug">
                        {title}
                    </h1>

                    {/* Tagline */}
                    {tagline && (
                        <p className="mt-2 text-[14px] leading-relaxed
                            text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            {tagline}
                        </p>
                    )}

                    {/* Ornamental rule */}
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <div
                            className="h-px w-12 rounded-full"
                            style={{
                                background: `linear-gradient(90deg, transparent, rgba(${B_RGB},0.25))`,
                            }}
                        />
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: B }}
                        />
                        <div
                            className="h-px w-12 rounded-full"
                            style={{
                                background: `linear-gradient(270deg, transparent, rgba(${B_RGB},0.25))`,
                            }}
                        />
                    </div>
                </div>

                {/* ── Form body ────────────────────────────────────── */}
                <div className="relative px-8 py-7">
                    {children}
                </div>
            </div>
        </div>
    );
};