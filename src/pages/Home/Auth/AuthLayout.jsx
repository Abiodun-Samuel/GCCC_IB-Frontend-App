import { Link } from "react-router-dom";
import { Shield, Users } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Brand tokens — deep ocean system
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_DD = "#055a82";
const B_RGB = "9,152,213";

/* ─────────────────────────────────────────────────────────────
   CSS injected once — grain texture + float animations
────────────────────────────────────────────────────────────── */
const PANEL_STYLES = `
    @keyframes al-float-a {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33%       { transform: translate(18px, -14px) scale(1.04); }
        66%       { transform: translate(-10px, 10px) scale(0.97); }
    }
    @keyframes al-float-b {
        0%, 100% { transform: translate(0, 0) scale(1); }
        40%       { transform: translate(-20px, 12px) scale(1.06); }
        70%       { transform: translate(12px, -8px) scale(0.96); }
    }
    @keyframes al-float-c {
        0%, 100% { transform: translate(0, 0); }
        50%       { transform: translate(8px, -20px); }
    }
    @keyframes al-pulse-ring {
        0%   { transform: scale(0.9); opacity: 0.6; }
        50%  { transform: scale(1.08); opacity: 0.25; }
        100% { transform: scale(0.9); opacity: 0.6; }
    }
    .al-blob-a { animation: al-float-a 18s ease-in-out infinite; }
    .al-blob-b { animation: al-float-b 22s ease-in-out infinite; }
    .al-blob-c { animation: al-float-c 14s ease-in-out infinite; }
    .al-ring   { animation: al-pulse-ring 5s ease-in-out infinite; }

    /* Noise grain overlay */
    .al-grain::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        opacity: 0.04;
        pointer-events: none;
        border-radius: inherit;
    }

    /* Dot grid pattern */
    .al-dotgrid {
        background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
        background-size: 28px 28px;
    }

    /* Mobile brand bar */
    .al-mobile-bar {
        background: linear-gradient(135deg, ${B_D} 0%, ${B_DD} 100%);
    }

    /* Right panel side accent */
    .al-side-accent::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, ${B} 0%, ${B_D} 60%, transparent 100%);
        border-radius: 0 2px 2px 0;
    }
`;

/* ─────────────────────────────────────────────────────────────
   Community stat — single identity chip
────────────────────────────────────────────────────────────── */
const STAT = { icon: Users, label: "Love, Family and Kingdom" };

/* ─────────────────────────────────────────────────────────────
   Left Brand Panel
────────────────────────────────────────────────────────────── */
const BrandPanel = () => (
    <div
        className="
            al-grain relative hidden lg:flex flex-col
             top-0
            overflow-hidden
        "
        style={{
            background: `linear-gradient(158deg, ${B_D} 0%, ${B_DD} 45%, #033d5c 75%, #022840 100%)`,
        }}
    >
        {/* Dot-grid texture layer */}
        <div className="al-dotgrid absolute inset-0 pointer-events-none" />

        {/* ── Floating depth blobs ──────────────────────────── */}
        <div
            className="al-blob-a absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${B_RGB},0.28) 0%, transparent 65%)` }}
        />
        <div
            className="al-blob-b absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${B_RGB},0.18) 0%, transparent 60%)` }}
        />
        <div
            className="al-blob-c absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)` }}
        />

        {/* ── Ring behind logo ─────────────────────────────── */}
        <div
            className="al-ring absolute top-16 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
            style={{ border: "1.5px solid rgba(255,255,255,0.16)" }}
        />

        {/* ── Main content ─────────────────────────────────── */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">

            {/* Logo + name */}
            <div
                className="flex flex-col items-center gap-4"
                data-aos="fade-down"
                data-aos-duration="600"
            >
                <Link to="/" className="transition-opacity hover:opacity-85">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                        style={{
                            background: "rgba(255,255,255,0.10)",
                            border: "1.5px solid rgba(255,255,255,0.20)",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        <img
                            src="/images/logo/gccc.png"
                            alt="GCCC"
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                </Link>
                <div className="text-center">
                    <p
                        className="text-[10px] font-black uppercase tracking-[0.28em]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                        Glory Centre
                    </p>
                    <h2 className="text-base font-bold text-white leading-tight">
                        Community Church
                    </h2>
                </div>
            </div>

            {/* ── Scripture centrepiece ─────────────────────── */}
            <div
                className="flex-1 flex flex-col items-center justify-center text-center py-5"
                data-aos="fade-up"
                data-aos-delay="120"
                data-aos-duration="700"
            >
                {/* Decorative large quote mark */}
                <div
                    className="text-[48px] font-black leading-none select-none mb-0.5 -mt-1"
                    style={{ color: "rgba(255,255,255,0.10)", lineHeight: 1 }}
                >
                    "
                </div>

                {/* Verse text */}
                <blockquote
                    className="text-lg sm:text-xl font-bold text-white leading-relaxed max-w-xs"
                    style={{
                        textShadow: "0 2px 24px rgba(0,0,0,0.18)",
                        letterSpacing: "-0.01em",
                    }}
                >
                    For where two or three gather in my name, there am I with them.
                </blockquote>

                {/* Attribution */}
                <div
                    className="mt-5 flex items-center gap-5"
                    data-aos="fade-up"
                    data-aos-delay="240"
                    data-aos-duration="500"
                >
                    <div
                        className="h-px w-8 rounded-full"
                        style={{ background: "rgba(255,255,255,0.28)" }}
                    />
                    <span
                        className="text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{ color: "rgba(255,255,255,0.50)" }}
                    >
                        Matthew 18:20
                    </span>
                    <div
                        className="h-px w-8 rounded-full"
                        style={{ background: "rgba(255,255,255,0.28)" }}
                    />
                </div>

                {/* Tagline below verse */}
                <p
                    className="mt-5 text-[13px] leading-relaxed max-w-[260px]"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    data-aos="fade-up"
                    data-aos-delay="300"
                    data-aos-duration="500"
                >
                    Propagating and normalizing Kingdom Culture
                    in our closely-knit community of believers.
                </p>
            </div>

            {/* ── Single stat chip ───────────────────────── */}
            <div
                className="mb-6"
                data-aos="fade-up"
                data-aos-delay="360"
                data-aos-duration="550"
            >
                <div
                    className="inline-flex w-full items-center gap-3 p-5 rounded-xl"
                    style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                    >
                        <STAT.icon size={13} className="text-white" />
                    </div>
                    <span className="text-[13px] font-semibold text-white/80 whitespace-nowrap">
                        {STAT.label}
                    </span>
                </div>
            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <div
                className="flex items-center justify-between pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                    © {new Date().getFullYear()} GCCC Ibadan
                </span>
                <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                    <Shield size={10} />
                    <span className="text-[11px]">Secured</span>
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   Mobile Brand Bar — shown only on < lg screens
────────────────────────────────────────────────────────────── */
const MobileBrandBar = () => (
    <div
        className="lg:hidden al-mobile-bar px-5 py-4 flex items-center justify-between"
    >
        {/* Logo + name */}
        <div className="flex items-center gap-3">
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.20)" }}
            >
                <img src="/images/logo/gccc.png" alt="GCCC" className="w-6 h-6 object-contain" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    GCCC
                </p>
                <p className="text-[12px] font-bold text-white leading-none">
                    Member Portal
                </p>
            </div>
        </div>

        {/* Secure badge */}
        <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}
        >
            <Shield size={10} className="text-white/60" />
            <span className="text-[10px] font-semibold text-white/60">Secure</span>
        </div>
    </div>
);

export const AuthLayout = ({ children }) => {
    return (
        <>
            <style>{PANEL_STYLES}</style>

            <div className="
                lg:grid lg:grid-cols-[420px_1fr] xl:grid-cols-[460px_1fr]
            ">
                {/* Left brand panel */}
                <BrandPanel />

                {/* Right form area */}
                <div className="
                    al-side-accent relative flex flex-col
                    bg-white dark:bg-slate-950
                    
                ">
                    {/* Mobile bar (top, only visible < lg) */}
                    <MobileBrandBar />

                    {/* Very subtle horizontal top-rule on desktop */}
                    <div
                        className="hidden lg:block h-[3px] w-full flex-shrink-0"
                        style={{
                            background: `linear-gradient(90deg, ${B} 0%, rgba(${B_RGB},0.20) 50%, transparent 100%)`,
                        }}
                    />

                    {/* Form container — vertically centred */}
                    <div
                        className="
                            flex-1 flex items-center justify-center
                            px-5 sm:px-8 lg:px-12 xl:px-16
                            py-10 lg:py-16
                        "
                        data-aos="fade-left"
                        data-aos-duration="560"
                        data-aos-delay="80"
                    >
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>

                    {/* Bottom footer on desktop right */}
                    <div className="
                        hidden lg:flex items-center justify-between
                        px-12 py-5
                        border-t border-slate-100 dark:border-slate-800/60
                    ">
                        <span className="text-[11px] text-slate-400 dark:text-slate-600">
                            © {new Date().getFullYear()} Glory Centre Community Church, Ibadan
                        </span>
                        <Link
                            to="/"
                            className="text-[11px] font-semibold transition-colors
                                text-slate-400 dark:text-slate-600
                                hover:text-slate-700 dark:hover:text-slate-400"
                        >
                            ← Back to website
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};