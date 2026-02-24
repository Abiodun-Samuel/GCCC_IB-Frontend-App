import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * PageHeader
 * ─────────────────────────────────────────────────────
 * Full-width interior header. Constrained to max-w-7xl.
 *
 * Props
 *   backTo    string       back-link href
 *   backLabel string       back-link text
 *   eyebrow   string       small-caps label above title
 *   title     string|node  primary heading
 *   subtitle  string|node  supporting line
 *   right     node         right-side slot (pills, CTAs)
 *   className string
 */
const PageHeader = memo(({
    backTo = '/',
    backLabel = 'Back',
    eyebrow,
    title,
    subtitle,
    right,
    className = '',
}) => (
    <header className={`w-full border-b border-slate-100 dark:border-white/[0.06] mb-5 pb-5  ${className}`}>
        {/* Back nav */}
        <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 mb-8 group"
        >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-white/[0.07] group-hover:bg-slate-200 dark:group-hover:bg-white/[0.12] transition-colors duration-150">
                <ChevronLeft size={12} strokeWidth={2.5} className="text-slate-500 dark:text-white/50" />
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-white/40 group-hover:text-slate-800 dark:group-hover:text-white/70 transition-colors duration-150">
                {backLabel}
            </span>
        </Link>

        {/* Title row */}
        <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
                {eyebrow && (
                    <span className="text-[10px] font-black uppercase tracking-[0.26em] text-[#0998d5]">
                        {eyebrow}
                    </span>
                )}
                {title && (
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.12] text-slate-900 dark:text-white">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed mt-0.5 max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>

            {right && (
                <div className="shrink-0 mt-1">{right}</div>
            )}
        </div>
    </header>
));

PageHeader.displayName = 'PageHeader';
export default PageHeader;