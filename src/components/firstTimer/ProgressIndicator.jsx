import { useEffect } from "react";
import { CheckIcon } from "@/icons";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";   // primary brand blue
const B_D = "#0778aa";   // 15% darker — for gradient tails
const B_RGB = "9,152,213";

export const ProgressIndicator = ({ currentStep, totalSteps }) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

    useEffect(() => {
        AOS.init({ duration: 500, easing: "ease-out-cubic", once: true, offset: 10 });
    }, []);

    return (
        <div className="w-full select-none">

            {/* ── Top meta row ───────────────────────────────────── */}
            <div
                className="flex items-center justify-between mb-6"
                data-aos="fade-down"
                data-aos-duration="380"
            >
                <span className="text-[11px] font-semibold uppercase tracking-widest
                    text-slate-500 dark:text-slate-400">
                    Your progress
                </span>

                {/* Step chip */}
                <span
                    className="inline-flex items-center gap-0.5 px-3 py-1 rounded-full
                        text-[11px] font-black border"
                    style={{
                        color: B,
                        borderColor: `rgba(${B_RGB},0.25)`,
                        backgroundColor: `rgba(${B_RGB},0.07)`,
                    }}
                >
                    <span>{currentStep}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium mx-0.5">/</span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">{totalSteps}</span>
                </span>
            </div>

            {/* ── Track + nodes ──────────────────────────────────── */}
            <div
                className="relative flex items-center justify-between"
                data-aos="fade-up"
                data-aos-duration="480"
                data-aos-delay="40"
            >
                {/* BG track */}
                <div className="absolute top-[18px] left-0 w-full h-[2px] -translate-y-1/2 rounded-full
                    bg-slate-200 dark:bg-slate-700" />

                {/* Active fill */}
                <div
                    className="absolute top-[18px] left-0 h-[2px] -translate-y-1/2 rounded-full
                        transition-all duration-700 ease-out"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${B} 0%, ${B_D} 100%)`,
                    }}
                />

                {steps.map((s, idx) => {
                    const done = s < currentStep;
                    const current = s === currentStep;
                    const pending = s > currentStep;

                    return (
                        <div
                            key={s}
                            className="relative z-10 flex flex-col items-center gap-2"
                            data-aos="zoom-in"
                            data-aos-delay={60 + idx * 55}
                            data-aos-duration="350"
                        >
                            {/* Circle */}
                            <div
                                className={`
                                    relative flex items-center justify-center
                                    w-9 h-9 rounded-full text-[11px] font-black
                                    transition-all duration-300
                                    ${pending
                                        ? "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                                        : ""
                                    }
                                `}
                                style={
                                    done
                                        ? {
                                            background: B,
                                            color: "#fff",
                                            boxShadow: `0 2px 12px rgba(${B_RGB},0.40)`,
                                        }
                                        : current
                                            ? {
                                                background: "#fff",
                                                border: `2.5px solid ${B}`,
                                                color: B,
                                                boxShadow: `0 0 0 5px rgba(${B_RGB},0.14), 0 2px 12px rgba(${B_RGB},0.22)`,
                                            }
                                            : {}
                                }
                            >
                                {done
                                    ? <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                                    : <span>{s}</span>
                                }

                                {/* Active pulse */}
                                {current && (
                                    <span
                                        className="absolute inset-0 rounded-full animate-ping"
                                        style={{ background: B, opacity: 0.18 }}
                                    />
                                )}
                            </div>

                            {/* Step label (sm+) */}
                            <span
                                className={`
                                    hidden sm:block text-[10px] font-semibold uppercase tracking-wider
                                    whitespace-nowrap transition-colors duration-200
                                    ${current ? "text-slate-900 dark:text-white"
                                        : done ? "text-slate-400 dark:text-slate-500"
                                            : "text-slate-300 dark:text-slate-600"}
                                `}
                            >
                                Step {s}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── Mobile bar (hidden sm+) ─────────────────────────── */}
            <div
                className="mt-5 sm:hidden"
                data-aos="fade-up"
                data-aos-delay="180"
                data-aos-duration="380"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Step <strong className="text-slate-800 dark:text-white">{currentStep}</strong> of {totalSteps}
                    </span>
                    <span className="text-[11px] font-black" style={{ color: B }}>
                        {pct}% complete
                    </span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden
                    bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${B} 0%, ${B_D} 100%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};