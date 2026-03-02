import { memo } from "react";
import { CheckCircle2, Shield, Youtube, Send, Music2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_RGB = "9,152,213";

/* ─────────────────────────────────────────────────────────────
   CSS animations — namespaced sc- to avoid leakage
────────────────────────────────────────────────────────────── */
const STYLES = `
    @keyframes sc-scale-in {
        0%   { transform: scale(0.3); opacity: 0; }
        65%  { transform: scale(1.10); }
        100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes sc-draw {
        from { stroke-dasharray: 0 100; opacity: 0; }
        to   { stroke-dasharray: 100 0; opacity: 1; }
    }
    @keyframes sc-pop {
        0%, 100% { transform: scale(0) rotate(0deg);   opacity: 0; }
        50%       { transform: scale(1) rotate(180deg); opacity: 1; }
    }
    .sc-icon  { animation: sc-scale-in 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .sc-check { animation: sc-draw    0.7s ease-out 0.38s both; }
    .sc-s1    { animation: sc-pop 1.6s ease-in-out 0.6s infinite; }
    .sc-s2    { animation: sc-pop 1.6s ease-in-out 0.9s infinite; }
    .sc-s3    { animation: sc-pop 1.6s ease-in-out 1.2s infinite; }
`;

/* ─────────────────────────────────────────────────────────────
   Inline brand SVG icons
────────────────────────────────────────────────────────────── */
const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth="3" />
  </svg>
);

const TikTokIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5
             2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01
             a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34
             6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SocialChip
────────────────────────────────────────────────────────────── */
// Only change: SocialChip component — circle → pill with label
const SocialChip = memo(({ href, icon: Icon, colorRGB, title }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    aria-label={title}
    className="flex items-center gap-2 px-3 h-9 rounded-full
               transition-all duration-150 active:scale-95 focus:outline-none"
    style={{
      background: `rgba(${colorRGB},0.10)`,
      border: `1px solid rgba(${colorRGB},0.22)`,
      color: `rgba(${colorRGB},1)`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = `rgba(${colorRGB},0.20)`;
      e.currentTarget.style.boxShadow = `0 4px 16px rgba(${colorRGB},0.30)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = `rgba(${colorRGB},0.10)`;
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <Icon size={15} />
    <span style={{
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.03em",
      lineHeight: 1,
      color: `rgba(${colorRGB},0.9)`,
    }}>
      {title}
    </span>
  </a>
));

/* ─────────────────────────────────────────────────────────────
   SuccessCompletion
────────────────────────────────────────────────────────────── */
const SuccessCompletion = memo(() => (
  <div className="w-full py-8 sm:py-10">
    <style>{STYLES}</style>

    <div className="flex flex-col items-center gap-9 max-w-lg mx-auto">

      {/* ── Check icon ──────────────────────────────────── */}
      <div className="sc-icon relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
        <div className="absolute inset-0 rounded-full animate-ping"
          style={{ background: B, opacity: 0.14 }} />
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(145deg, ${B} 0%, ${B_D} 100%)`,
            boxShadow: `0 8px 40px rgba(${B_RGB},0.45)`,
          }}
        >
          <svg className="sc-check w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeDasharray="100">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="sc-s1 absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400" />
        <span className="sc-s2 absolute -bottom-1 -left-2  w-2 h-2 rounded-full bg-emerald-400" />
        <span className="sc-s3 absolute top-1/2  -right-3  w-2.5 h-2.5 rounded-full"
          style={{ background: B, opacity: 0.5 }} />
      </div>

      {/* ── Heading ─────────────────────────────────────── */}
      <div className="text-center flex flex-col gap-3"
        data-aos="fade-up" data-aos-delay="380" data-aos-duration="480">
        <div className="flex items-center justify-center gap-2.5">
          <span className="block w-[3px] h-3.5 rounded-full flex-shrink-0" style={{ background: B }} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: B }}>
            Registration Complete
          </span>
          <span className="block w-[3px] h-3.5 rounded-full flex-shrink-0" style={{ background: B }} />
        </div>
        <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
          Welcome to our community. It was a blessing to have you fellowship with us today.
        </p>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="w-full h-px" data-aos="fade-in" data-aos-delay="460"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(${B_RGB},0.22) 40%, rgba(${B_RGB},0.22) 60%, transparent 100%)`
        }} />


      {/* ── Follow us card ──────────────────────────────── */}
      <div
        className="w-full rounded-xl overflow-hidden border
                   bg-white dark:bg-slate-800/40
                   border-slate-200 dark:border-slate-700/60 shadow-sm"
        data-aos="fade-up" data-aos-delay="600" data-aos-duration="480"
      >
        {/* Panel header */}
        <div className="flex items-center gap-3 px-5 py-3.5
                        border-b border-slate-100 dark:border-slate-700/50
                        bg-slate-50/70 dark:bg-slate-800/60">
          <span className="block w-[3px] h-4 rounded-full flex-shrink-0" style={{ background: B }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]
                           text-slate-500 dark:text-slate-400">
            Follow us
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 py-5">
          <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            Stay connected. Join GCCC Ibadan on all our platforms and be part of what God is doing in our community.
          </p>

          {/* Social chips */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <SocialChip href="https://www.youtube.com/@GcccIbadan"
              icon={Youtube} colorRGB="220,38,38" title="YouTube" />
            <SocialChip href="https://www.facebook.com/share/1K8ura74Dc/"
              icon={FacebookIcon} colorRGB="24,119,242" title="Facebook" />
            <SocialChip href="https://www.instagram.com/gcccibadan"
              icon={InstagramIcon} colorRGB="225,48,108" title="Instagram" />
            <SocialChip href="https://www.tiktok.com/@gcccibadan"
              icon={TikTokIcon} colorRGB="20,20,20" title="TikTok" />
            <SocialChip href="https://t.me/Pastoropeyemipeter"
              icon={Send} colorRGB="0,136,204" title="Telegram" />
            <SocialChip href="https://open.spotify.com/show/5yc39lH1EtNRoUQb1mG7SY"
              icon={Music2} colorRGB="29,185,84" title="Spotify" />
          </div>
        </div>
      </div>

      {/* ── Message card ────────────────────────────────── */}
      <div
        className="w-full rounded-xl border p-5
                   bg-slate-50 dark:bg-slate-800/50
                   border-slate-200 dark:border-slate-700/60"
        data-aos="fade-up" data-aos-delay="520" data-aos-duration="480"
      >
        <div className="flex gap-4">
          <span className="block w-[3px] rounded-full flex-shrink-0 self-stretch" style={{ background: B }} />
          <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Your details have been received and our team will connect with you soon.
            May your week be filled with peace and God's abundant blessings.
          </p>
        </div>
      </div>

      {/* ── Complete button ──────────────────────────────── */}
      <div className="w-full" data-aos="fade-up" data-aos-delay="800" data-aos-duration="480">
        <button
          onClick={() => window.location.reload()}
          className="group w-full flex items-center justify-center gap-2.5
                     py-4 rounded-xl text-sm font-bold text-white
                     transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: `linear-gradient(135deg, ${B} 0%, ${B_D} 100%)`,
            boxShadow: `0 4px 24px rgba(${B_RGB},0.35)`,
          }}
        >
          <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
          Complete
        </button>
      </div>

      {/* ── Security note ───────────────────────────────── */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500"
        data-aos="fade-in" data-aos-delay="900">
        <Shield size={13} className="shrink-0 text-emerald-500" />
        Your information is secure and encrypted
      </div>

    </div>
  </div >
));

SuccessCompletion.displayName = "SuccessCompletion";
export default SuccessCompletion;