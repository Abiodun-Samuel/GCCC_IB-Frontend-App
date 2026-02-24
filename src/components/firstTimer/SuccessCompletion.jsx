import { useEffect, memo } from "react";
import { TelegramIcon } from "@/icons";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

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

const SuccessCompletion = memo(() => {
  useEffect(() => {
    AOS.init({ duration: 580, easing: "ease-out-cubic", once: true, offset: 0 });
  }, []);

  return (
    <div className="w-full py-8 sm:py-10">
      <style>{STYLES}</style>

      <div className="flex flex-col items-center gap-9 max-w-lg mx-auto">

        {/* ── Check icon ──────────────────────────────────── */}
        <div className="sc-icon relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: B, opacity: 0.14 }}
          />
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(145deg, ${B} 0%, ${B_D} 100%)`,
              boxShadow: `0 8px 40px rgba(${B_RGB},0.45)`,
            }}
          >
            <svg
              className="sc-check w-10 h-10 sm:w-12 sm:h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeDasharray="100"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="sc-s1 absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400" />
          <span className="sc-s2 absolute -bottom-1 -left-2  w-2 h-2 rounded-full bg-emerald-400" />
          <span className="sc-s3 absolute top-1/2  -right-3  w-2.5 h-2.5 rounded-full"
            style={{ background: B, opacity: 0.5 }} />
        </div>

        {/* ── Heading ─────────────────────────────────────── */}
        <div
          className="text-center flex flex-col gap-3"
          data-aos="fade-up"
          data-aos-delay="380"
          data-aos-duration="480"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2.5">
            <span
              className="block w-[3px] h-3.5 rounded-full flex-shrink-0"
              style={{ background: B }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.22em]"
              style={{ color: B }}
            >
              Registration Complete
            </span>
            <span
              className="block w-[3px] h-3.5 rounded-full flex-shrink-0"
              style={{ background: B }}
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight
                        text-slate-900 dark:text-white leading-tight">
            You're all set! 🎉
          </h2>

          {/* Body */}
          <p className="text-[15px] text-slate-600 dark:text-slate-300
                        leading-relaxed max-w-sm mx-auto">
            Welcome to our community. It was a blessing to have you fellowship with us today.
          </p>
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div
          className="w-full h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${B_RGB},0.22) 40%, rgba(${B_RGB},0.22) 60%, transparent 100%)`
          }}
          data-aos="fade-in"
          data-aos-delay="460"
        />

        {/* ── Message card ────────────────────────────────── */}
        <div
          className="w-full rounded-xl border p-5
                        bg-slate-50 dark:bg-slate-800/50
                        border-slate-200 dark:border-slate-700/60"
          data-aos="fade-up"
          data-aos-delay="520"
          data-aos-duration="480"
        >
          <div className="flex gap-4">
            {/* Left accent */}
            <span
              className="block w-[3px] rounded-full flex-shrink-0 self-stretch"
              style={{ background: B }}
            />
            <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Your details have been received and our team will connect with you soon.
              May your week be filled with peace and God's abundant blessings. 🙏
            </p>
          </div>
        </div>

        {/* ── Telegram CTA ────────────────────────────────── */}
        <div
          className="w-full rounded-xl overflow-hidden border
                        bg-white dark:bg-slate-800/40
                        border-slate-200 dark:border-slate-700/60
                        shadow-sm"
          data-aos="fade-up"
          data-aos-delay="620"
          data-aos-duration="480"
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 px-5 py-3.5
                        border-b border-slate-100 dark:border-slate-700/50
                        bg-slate-50/70 dark:bg-slate-800/60">
            <span className="block w-[3px] h-4 rounded-full flex-shrink-0 bg-[#0088cc]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]
                            text-slate-500 dark:text-slate-400">
              Stay connected
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-5">
            {/* Icon */}
            <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                            bg-[#0088cc]/10 border border-[#0088cc]/20">
              <TelegramIcon />
            </div>

            {/* Copy */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                Join our Telegram channel
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Daily devotionals, prayer points &amp; community updates
              </p>
            </div>

            {/* CTA */}
            <a
              href="https://t.me/Pastoropeyemipeter"
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 inline-flex items-center gap-2
                                px-5 py-2.5 rounded-lg text-sm font-bold text-white
                                transition-all duration-200 hover:opacity-90 hover:-translate-y-px
                                bg-[#0088cc]"
              style={{ boxShadow: "0 3px 14px rgba(0,136,204,0.28)" }}
            >
              Join
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          </div>
        </div>

        {/* ── Complete button ──────────────────────────────── */}
        <div
          className="w-full"
          data-aos="fade-up"
          data-aos-delay="720"
          data-aos-duration="480"
        >
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
            <CheckCircle2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Complete
          </button>
        </div>

        {/* ── Security note ───────────────────────────────── */}
        <div
          className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500"
          data-aos="fade-in"
          data-aos-delay="820"
        >
          <Shield size={13} className="shrink-0 text-emerald-500" />
          Your information is secure and encrypted
        </div>
      </div>
    </div>
  );
});

SuccessCompletion.displayName = "SuccessCompletion";
export default SuccessCompletion;