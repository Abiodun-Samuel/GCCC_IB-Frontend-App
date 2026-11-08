import { useState } from 'react';

const ButtonSwitch = ({
    children,
    icon,
    description,
    color = "indigo",
    onChange,
    checked = false,
    title,
    className = "",
    disabled = false,
}) => {
    // Card color classes for different color variants
    const colorClasses = {
        indigo: {
            iconBg: "bg-indigo-100 group-hover:bg-indigo-200 dark:bg-indigo-900/30 dark:group-hover:bg-indigo-900/50",
            iconText: "text-indigo-600 dark:text-indigo-400",
            border: "border-gray-200 hover:border-indigo-300 dark:border-gray-600 dark:hover:border-indigo-600",
            focusRing: "focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400",
            switchBg: "bg-indigo-600",
        },
        blue: {
            iconBg: "bg-blue-100 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50",
            iconText: "text-blue-600 dark:text-blue-400",
            border: "border-gray-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-600",
            focusRing: "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
            switchBg: "bg-blue-600",
        },
        green: {
            iconBg: "bg-green-100 group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50",
            iconText: "text-green-600 dark:text-green-400",
            border: "border-gray-200 hover:border-green-300 dark:border-gray-600 dark:hover:border-green-600",
            focusRing: "focus-visible:ring-green-500 dark:focus-visible:ring-green-400",
            switchBg: "bg-green-600",
        },
        red: {
            iconBg: "bg-red-100 group-hover:bg-red-200 dark:bg-red-900/30 dark:group-hover:bg-red-900/50",
            iconText: "text-red-600 dark:text-red-400",
            border: "border-gray-200 hover:border-red-300 dark:border-gray-600 dark:hover:border-red-600",
            focusRing: "focus-visible:ring-red-500 dark:focus-visible:ring-red-400",
            switchBg: "bg-red-600",
        },
        purple: {
            iconBg: "bg-purple-100 group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-900/50",
            iconText: "text-purple-600 dark:text-purple-400",
            border: "border-gray-200 hover:border-purple-300 dark:border-gray-600 dark:hover:border-purple-600",
            focusRing: "focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400",
            switchBg: "bg-purple-600",
        },
        amber: {
            iconBg: "bg-amber-100 group-hover:bg-amber-200 dark:bg-amber-900/30 dark:group-hover:bg-amber-900/50",
            iconText: "text-amber-600 dark:text-amber-400",
            border: "border-gray-200 hover:border-amber-300 dark:border-gray-600 dark:hover:border-amber-600",
            focusRing: "focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400",
            switchBg: "bg-amber-600",
        },
        cyan: {
            iconBg: "bg-cyan-100 group-hover:bg-cyan-200 dark:bg-cyan-900/30 dark:group-hover:bg-cyan-900/50",
            iconText: "text-cyan-600 dark:text-cyan-400",
            border: "border-gray-200 hover:border-cyan-300 dark:border-gray-600 dark:hover:border-cyan-600",
            focusRing: "focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-400",
            switchBg: "bg-cyan-600",
        },
        emerald: {
            iconBg: "bg-emerald-100 group-hover:bg-emerald-200 dark:bg-emerald-900/30 dark:group-hover:bg-emerald-900/50",
            iconText: "text-emerald-600 dark:text-emerald-400",
            border: "border-gray-200 hover:border-emerald-300 dark:border-gray-600 dark:hover:border-emerald-600",
            focusRing: "focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400",
            switchBg: "bg-emerald-600",
        },
        orange: {
            iconBg: "bg-orange-100 group-hover:bg-orange-200 dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50",
            iconText: "text-orange-600 dark:text-orange-400",
            border: "border-gray-200 hover:border-orange-300 dark:border-gray-600 dark:hover:border-orange-600",
            focusRing: "focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400",
            switchBg: "bg-orange-600",
        },
        pink: {
            iconBg: "bg-pink-100 group-hover:bg-pink-200 dark:bg-pink-900/30 dark:group-hover:bg-pink-900/50",
            iconText: "text-pink-600 dark:text-pink-400",
            border: "border-gray-200 hover:border-pink-300 dark:border-gray-600 dark:hover:border-pink-600",
            focusRing: "focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400",
            switchBg: "bg-pink-600",
        },
        slate: {
            iconBg: "bg-slate-100 group-hover:bg-slate-200 dark:bg-slate-900/30 dark:group-hover:bg-slate-900/50",
            iconText: "text-slate-600 dark:text-slate-400",
            border: "border-gray-200 hover:border-slate-300 dark:border-gray-600 dark:hover:border-slate-600",
            focusRing: "focus-visible:ring-slate-500 dark:focus-visible:ring-slate-400",
            switchBg: "bg-slate-600",
        },
    };

    const currentColor = colorClasses[color] || colorClasses.indigo;

    const disabledClasses = disabled
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer";

    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <button
            type="button"
            title={title || ""}
            className={`
                flex items-start group w-full
                gap-2 sm:gap-3 
                p-3 sm:p-4 
                bg-white dark:bg-gray-700 
                rounded-lg border 
                hover:shadow-md 
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-gray-900
                ${currentColor.border}
                ${currentColor.focusRing}
                ${disabledClasses}
                ${className}
            `.trim().replace(/\s+/g, " ")}
            onClick={handleClick}
            disabled={disabled}
            role="switch"
            aria-checked={checked}
        >
            {/* Icon Container - Responsive sizing */}
            <div
                className={`
                    p-2 sm:p-3 
                    rounded-lg 
                    transition-colors
                    shrink-0
                    ${currentColor.iconBg}
                `.trim().replace(/\s+/g, " ")}
            >
                {icon && (
                    <span className={`flex items-center ${currentColor.iconText}`}>
                        {icon}
                    </span>
                )}
            </div>

            {/* Text Content - Responsive typography */}
            <div className="text-left flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {children}
                </h3>
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {description}
                    </p>
                )}
            </div>

            {/* Toggle Switch */}
            <div className="relative shrink-0">
                <div
                    className={`
                        w-11 h-6 rounded-full transition-colors
                        ${checked ? currentColor.switchBg : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                >
                    <div
                        className={`
                            absolute top-0.5 left-0.5 
                            w-5 h-5 
                            bg-white rounded-full 
                            shadow-sm
                            transition-transform duration-200
                            ${checked ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </div>
            </div>
        </button>
    );
};

export default ButtonSwitch;
