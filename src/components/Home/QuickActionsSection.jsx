import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MessageCircleQuestion, Sparkles, ArrowUpRight } from 'lucide-react';
import { HandIcon } from '@/icons';

import AnimatedBackground, { BRAND, BRAND_RGB, PAGE_BG } from '@/components/common/AnimatedBackground';
import { QUICK_ACTION_LINKS, SECTION_SPACING } from '@/utils/constant';

/* ─────────────────────────────────────────────
   CARD header
───────────────────────────────────────────── */
const CARD_META = [
    {
        num: '01',
        Icon: MessageCircleQuestion,
        glyph: '?',
        label: 'Questions',
        title: 'Ask Anything',
        body: 'Bible questions, life questions, or anything you have not gotten answers to. Feel free to ask them all.',
        cta: 'Ask a question',
        color: '#0998d5',
        light: '#e0f2fe',
    },
    {
        num: '02',
        Icon: HandIcon,
        glyph: '✦',
        label: 'Prayer',
        title: 'Prayer Request',
        body: 'Send your prayer requests knowing that whatever we ask in His name, He will do it. Let us together glorify the Father.',
        cta: 'Send a request',
        color: '#b45309',
        light: '#fef3c7',
    },
    {
        num: '03',
        Icon: Sparkles,
        glyph: '★',
        label: 'Testimony',
        title: 'Share Your Story',
        body: 'At GCCC Ibadan we have a culture of sharing what the Lord has done. Let your story encourage the whole family.',
        cta: 'Share a testimony',
        color: '#059669',
        light: '#d1fae5',
    },
];

/* ─────────────────────────────────────────────
   REUSABLE SECTION HEADER
   Export and reuse across sections:
     <SectionHeader
       eyebrow="Get Involved"
       titleBlack="How Can We"
       titleBlue="Serve You?"
       subtitle="..."
     />
───────────────────────────────────────────── */
export const SectionHeader = memo(({ eyebrow, titleBlack, titleBlue, subtitle, aosDelay = 0 }) => (
    <div
        data-aos="fade-up"
        data-aos-duration="440"
        data-aos-delay={aosDelay}
        className="flex flex-col ap-3 mb-16 sm:mb-24"
    >
        {eyebrow && (
            <div className="flex items-center gap-2.5">
                <div
                    className="w-5 h-0.5 rounded-full"
                    style={{ background: BRAND }}
                />
                <span
                    className="text-[10px] font-black uppercase tracking-[0.24em]"
                    style={{ color: BRAND }}
                >
                    {eyebrow}
                </span>
            </div>
        )}

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            {titleBlack && <span>{titleBlack} </span>}
            {titleBlue && <span style={{ color: BRAND }}>{titleBlue}</span>}
        </h2>

        {subtitle && (
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                {subtitle}
            </p>
        )}
    </div>
));
SectionHeader.displayName = 'SectionHeader';

/* ─────────────────────────────────────────────
   ACTION CARD
───────────────────────────────────────────── */
const ActionCard = memo(({ meta, link, index }) => {
    const { num, Icon, glyph, label, title, body, cta, color, light } = meta;

    return (
        <Link
            to={link.to}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 active:-translate-y-0.5"
            data-aos="fade-up"
            data-aos-duration="460"
            data-aos-delay={80 + index * 85}
        >
            {/* 1px colour top bar */}
            <div className="h-1 w-full shrink-0" style={{ background: color }} />

            {/* Decorative oversized glyph */}
            <span
                aria-hidden="true"
                className="absolute -right-3 -top-1 text-[9rem] sm:text-[11rem] leading-none select-none pointer-events-none font-black opacity-[0.055] -rotate-[10deg] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-[0.10] group-hover:-rotate-[5deg] group-hover:scale-110"
                style={{ color }}
            >
                {glyph}
            </span>

            <div className="relative z-10 flex flex-col flex-1 p-6 sm:p-7 gap-5">

                {/* Icon + number */}
                <div className="flex items-start justify-between">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110 group-hover:-rotate-3"
                        style={{ background: light }}
                    >
                        <Icon size={22} style={{ color }} strokeWidth={1.8} />
                    </div>
                    <span
                        className="text-2xl font-black tabular-nums select-none opacity-[0.10] dark:opacity-[0.06] transition-opacity duration-200 group-hover:opacity-100"
                        style={{ color }}
                    >
                        {num}
                    </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5 flex-1">
                    <p
                        className="text-[10px] font-black uppercase tracking-[0.20em]"
                        style={{ color }}
                    >
                        {label}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                        {title}
                    </h3>
                    <div
                        className="w-8 h-0.5 rounded-full my-1"
                        style={{ background: `${color}45` }}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {body}
                    </p>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                    <span className="text-sm font-semibold" style={{ color }}>
                        {cta}
                    </span>
                    <span
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ background: light }}
                    >
                        <ArrowUpRight size={15} style={{ color }} strokeWidth={2.2} />
                    </span>
                </div>

            </div>
        </Link>
    );
});
ActionCard.displayName = 'QA.ActionCard';

/* ─────────────────────────────────────────────
   QUOTE STRIP
───────────────────────────────────────────── */
const QuoteStrip = memo(() => (
    <div
        data-aos="fade-up"
        data-aos-duration="460"
        data-aos-delay="100"
        className="relative rounded overflow-hidden px-8 py-10 sm:px-12 sm:py-12"
        style={{ backgroundColor: PAGE_BG }}
    >
        <AnimatedBackground withBaseBg={false} />

        {/* Centre glow — animate-glow-pulse defined in tailwind.config + globals.css */}
        <div
            className="absolute left-1/2 top-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-glow-pulse"
            style={{ background: `radial-gradient(circle, rgba(${BRAND_RGB},0.12) 0%, transparent 68%)` }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 max-w-4xl mx-auto">
            {/* Vertical brand line */}
            <div
                className="hidden sm:block w-0.5 self-stretch rounded-full shrink-0"
                style={{ background: `linear-gradient(to bottom, ${BRAND}, transparent)` }}
            />

            <div className="flex flex-col gap-3 text-center sm:text-left">
                <p
                    className="text-[10px] font-black uppercase tracking-[0.24em]"
                    style={{ color: `rgba(${BRAND_RGB},0.55)` }}
                >
                    John 14:13
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    Whatever you ask in my name, this I will do, that the Father may be glorified in the Son.
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Ask, pray, and share with a family that genuinely cares.
                </p>
            </div>
        </div>
    </div>
));
QuoteStrip.displayName = 'QA.QuoteStrip';

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
const QuickActionsSection = () => {
    useEffect(() => {
        document.documentElement.classList.add('aos-running');
        AOS.init({
            once: true,
            duration: 440,
            easing: 'ease-out-cubic',
            offset: 40,
            disableMutationObserver: false,
        });
    }, []);

    return (
        <section
            className={`relative overflow-hidden w-full bg-white dark:bg-gray-950 ${SECTION_SPACING}`}
            aria-label="Quick Actions"
        >
            {/* Dot grid texture — defined in globals.css or as a bg-[image:...] utility */}
            <div
                className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(9,152,213,0.10) 1px, transparent 1px)`,
                    backgroundSize: '28px 28px',
                }}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col">

                <SectionHeader
                    eyebrow="Get Involved"
                    titleBlack="How Can We"
                    titleBlue="Serve You?"
                    subtitle="We are more than a church. Ask questions, send prayer requests, and share what God has done in your life."
                />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10 sm:gap-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {QUICK_ACTION_LINKS.map((link, index) => (
                        <ActionCard
                            key={link.alt ?? index}
                            meta={CARD_META[index] ?? CARD_META[0]}
                            link={link}
                            index={index}
                        />
                    ))}
                </div>

                <QuoteStrip />
            </div>
        </section>
    );
};

export default memo(QuickActionsSection);