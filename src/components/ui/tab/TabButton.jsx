import { useState, useEffect } from "react";

/* ─── Brand ─────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_RGB = "9,152,213";

export const TabButton = ({ active, onClick, icon: Icon, label, count }) => {
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        if (!pressed) return;
        const t = setTimeout(() => setPressed(false), 140);
        return () => clearTimeout(t);
    }, [pressed]);

    return (
        <button
            onClick={(e) => { setPressed(true); onClick?.(e); }}
            className={`
                relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3
                text-[13px] sm:text-sm font-semibold rounded-xl
                transition-all duration-200
                ${pressed ? "scale-95" : "scale-100"}
                ${active
                    ? "text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }
            `}
            style={active
                ? {
                    background: `linear-gradient(135deg, ${B} 0%, ${B_D} 100%)`,
                    boxShadow: `0 4px 18px rgba(${B_RGB},0.32)`,
                    transition: "all 0.22s cubic-bezier(0.25,0.1,0.25,1)",
                }
                : { transition: "all 0.22s cubic-bezier(0.25,0.1,0.25,1)" }
            }
        >
            {/* Icon */}
            {Icon && (
                <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200
                        ${active
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600"
                        }`}
                />
            )}

            {/* Label */}
            <span>{label}</span>

            {/* Count badge */}
            {count !== undefined && (
                <span
                    className={`
                        ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-black
                        transition-colors duration-200
                        ${active
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }
                    `}
                >
                    {count}
                </span>
            )}
        </button>
    );
};