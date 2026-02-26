import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import dayjs from 'dayjs';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/modal/Modal';
import InputForm from '@/components/form/useForm/InputForm';
import TextAreaForm from '@/components/form/TextAreaForm';
import ConfettiShower from '@/components/dashboard/ConfettiShower';
import { Toast } from '@/lib/toastify';

import { useMarkAttendance } from '@/queries/attendance.query';
import { useCoreAppData, useTodaysService } from '@/queries/service.query';
import { useClosestEvent } from '@/queries/events.query';
import { useAuthStore } from '@/store/auth.store';
import { useSendMessage } from '@/queries/message.query';
import { useModal } from '@/hooks/useModal';
import { buildShareText, fetchEventImageFile, generateInitials } from '@/utils/helper';
import animationData from '../../../src/utils/animation.json';

import {
    Calendar, Clock, Send, Mail,
    Cake, Gift, Heart, Star, Sparkles, Anchor, Award, BookOpen,
    Timer, CheckCircle2, Check, Youtube, Radio,
    LogIn, MapPin, Share2, Wifi, UserCheck, AlertCircle, Zap,
    Mic, Video, CalendarClock, UserPlus, ArrowRight,
    CalendarHeart,
} from 'lucide-react';
import AnimatedBackground, { BRAND, BRAND_RGB, PAGE_BG } from '@/components/common/AnimatedBackground';
import { SECTION_SPACING } from '@/utils/constant';
import { HandIcon } from '@/icons';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const TEAL = '#07c4b8';
const SKY = '#38bdf8';
const TEAL_RGB = '7,196,184';
const SKY_RGB = '56,189,248';
const EMERALD = '#34d399';
const EMERALD_RGB = '52,211,153';

// Celebration palette — red + brand-complementary blues/cyans
const RED = '#e84545';
const RED_RGB = '232,69,69';
const CYAN = '#06b6d4';
const CYAN_RGB = '6,182,212';
const INDIGO = '#818cf8';
const INDIGO_RGB = '129,140,248';

// ─── Constants ────────────────────────────────────────────────────────────────

const ATTENDANCE_SOURCES = { ONLINE: 'online', ONSITE: 'onsite' };
const SERVICE_STATUS = { UPCOMING: 'upcoming', ONGOING: 'ongoing', ENDED: 'ended' };
const CELEBRATION_TABS = { BIRTHDAYS: 'birthdays', ANNIVERSARIES: 'anniversaries' };

const EVENT_STATUS_CFG = {
    ongoing: { label: 'Live Now', colorRGB: EMERALD_RGB, color: EMERALD, pulse: true },
    upcoming: { label: 'Upcoming', colorRGB: SKY_RGB, color: SKY, pulse: false },
    past: { label: 'Ended', colorRGB: '148,163,184', color: '#94a3b8', pulse: false },
};

const STATUS_META = {
    [SERVICE_STATUS.ONGOING]: { label: 'Live Now', color: BRAND, Icon: null },
    [SERVICE_STATUS.UPCOMING]: { label: 'Upcoming', color: SKY, Icon: Timer },
    [SERVICE_STATUS.ENDED]: { label: 'Ended', color: '#94a3b8', Icon: null },
};

const ANN_TYPE_CFG = {
    wedding: { color: RED, colorRGB: RED_RGB, Icon: Heart, label: 'Wedding Anniversary' },
    work: { color: SKY, colorRGB: SKY_RGB, Icon: Award, label: 'Work Anniversary' },
    salvation: { color: BRAND, colorRGB: BRAND_RGB, Icon: Sparkles, label: 'Salvation Date' },
    baptism: { color: TEAL, colorRGB: TEAL_RGB, Icon: Anchor, label: 'Baptism Date' },
    membership: { color: CYAN, colorRGB: CYAN_RGB, Icon: BookOpen, label: 'Membership Date' },
    ordination: { color: INDIGO, colorRGB: INDIGO_RGB, Icon: Star, label: 'Ordination Anniversary' },
    custom: { color: BRAND, colorRGB: BRAND_RGB, Icon: Gift, label: 'Special Date' },
};

// ─── Style helpers ────────────────────────────────────────────────────────────

const cardShell = () => ({
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
});

const glassInner = (alpha = 0.07) => ({
    background: `rgba(255,255,255,${alpha})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
});

// ─── Utilities ────────────────────────────────────────────────────────────────

const fmtShortDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

const fmtTime24 = (t) => {
    if (!t) return null;
    const [hRaw, mRaw] = t.split(':');
    const h = parseInt(hRaw, 10);
    const m = mRaw ?? '00';
    return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

const doShare = async (event) => {
    const url = `${window.location.origin}/events/${event.id}`;
    const richText = buildShareText(event, url);
    if (typeof navigator.share === 'function') {
        const imageFile = await fetchEventImageFile(event.image);
        if (imageFile) {
            const p = { title: event.title, text: richText, files: [imageFile] };
            if (navigator.canShare?.(p)) {
                try { await navigator.share(p); return; } catch (e) { if (e?.name === 'AbortError') return; }
            }
        }
        const p2 = { title: event.title, text: richText, url };
        if (navigator.canShare?.(p2) ?? true) {
            try { await navigator.share(p2); return; } catch (e) { if (e?.name === 'AbortError') return; }
        }
    }
    try {
        await navigator.clipboard.writeText(richText);
        Toast.success('Event details copied!');
    } catch { Toast.error('Could not share event'); }
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const SectionHeader = memo(({ eyebrow, titleWhite, titleBlue, subtitle }) => (
    <div data-aos="fade" data-aos-duration="380" className="flex flex-col gap-3 mb-16 sm:mb-24">
        {eyebrow && (
            <div className="flex items-center gap-2.5">
                <div className="w-5 h-0.5 rounded-full shrink-0" style={{ background: BRAND }} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: BRAND }}>
                    {eyebrow}
                </span>
            </div>
        )}
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            {titleWhite && <span>{titleWhite} </span>}
            {titleBlue && <span style={{ color: BRAND }}>{titleBlue}</span>}
        </h2>
        {subtitle && <p className="text-base text-white/40 leading-relaxed max-w-lg">{subtitle}</p>}
    </div>
));
SectionHeader.displayName = 'Hub.SectionHeader';

const LiveDot = memo(({ color = BRAND }) => (
    <span className="relative inline-flex shrink-0 w-2 h-2">
        <span className="absolute inset-0 rounded-full hub-ripple-ring" style={{ backgroundColor: color }} />
        <span className="relative rounded-full w-2 h-2" style={{ backgroundColor: color }} />
    </span>
));
LiveDot.displayName = 'Hub.LiveDot';

const ServiceStatusPill = memo(({ status }) => {
    const meta = STATUS_META[status];
    if (!meta) return null;
    const { Icon } = meta;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
            style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: meta.color, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}
        >
            {Icon ? <Icon size={9} /> : <LiveDot color={meta.color} />}
            {meta.label}
        </span>
    );
});
ServiceStatusPill.displayName = 'Hub.ServiceStatusPill';

const SkeletonBlock = memo(({ className = '' }) => (
    <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
));
SkeletonBlock.displayName = 'Hub.SkeletonBlock';

// ─── SendMessageModal ─────────────────────────────────────────────────────────

const SendMessageModal = memo(({ isOpen, onClose, recipient }) => {
    const { mutateAsync, isPending } = useSendMessage();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: 'onChange', defaultValues: { subject: '', body: '' },
    });

    useEffect(() => { if (!isOpen) reset(); }, [isOpen, reset]);

    const onSubmit = useCallback(async (data) => {
        if (!data.body?.trim()) { Toast.error('Please enter a message'); return; }
        try {
            await mutateAsync({
                recipient_id: recipient?.id,
                subject: data.subject?.trim() || 'Birthday / Anniversary Wishes',
                body: data.body.trim(),
            });
            onClose(); reset();
            Toast.success(`Message sent to ${recipient?.first_name}!`);
        } catch { }
    }, [recipient, mutateAsync, reset, onClose]);

    return (
        <Modal
            isOpen={isOpen} onClose={onClose}
            title={`Send Wishes to ${recipient?.first_name ?? ''} ${recipient?.last_name ?? ''}`}
            description="Share your blessings and encouragement"
            maxWidth="max-w-lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
                <InputForm
                    label="Subject" name="subject" register={register}
                    placeholder="e.g. Happy Birthday!" error={errors.subject?.message}
                />
                <TextAreaForm
                    label="Message" name="body" required register={register}
                    placeholder="Type your wishes here..." rows={5} error={errors.body?.message}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline-light" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" loading={isPending} disabled={!isValid} startIcon={<Send size={13} />}>
                        Send Message
                    </Button>
                </div>
            </form>
        </Modal>
    );
});
SendMessageModal.displayName = 'Hub.SendMessageModal';

// ─── Celebrations ─────────────────────────────────────────────────────────────

/**
 * Horizontal "sitting rectangle" card.
 * Layout: left accent stripe | avatar (centre-aligned) | flex-col [name · meta · wish btn]
 */
const BirthdayCard = memo(({ person, index }) => {
    const { isOpen, openModal, closeModal } = useModal();
    const name = `${person.first_name} ${person.last_name}`;
    const dateStr = dayjs(person.date_of_birth).format('MMM D');

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.30, delay: index * 0.05, ease: 'easeOut' }}
                className="relative flex items-center rounded-2xl overflow-hidden shrink-0"
                style={{
                    width: 'clamp(220px, 24vw, 296px)',
                    height: 96,
                    background: `linear-gradient(130deg, rgba(${RED_RGB},0.10) 0%, rgba(255,255,255,0.03) 100%)`,
                    border: `1px solid rgba(${RED_RGB},0.16)`,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                }}
            >
                {/* Left accent stripe */}
                <div
                    className="absolute left-0 inset-y-0 w-[3px]"
                    style={{ background: `linear-gradient(180deg, ${RED} 0%, rgba(${RED_RGB},0.20) 100%)` }}
                />
                {/* Corner ambient glow */}
                <div
                    className="absolute -top-6 -right-6 w-16 h-16 rounded-full pointer-events-none blur-2xl opacity-50"
                    style={{ background: `rgba(${RED_RGB},0.20)` }}
                />

                {/* Avatar — vertically centred */}
                <div className="relative z-10 pl-5 pr-4 shrink-0 self-center">
                    <div className="relative">
                        <Avatar src={person.avatar} name={generateInitials(name)} size="sm" />
                        <span
                            className="absolute -bottom-1 -right-1 flex items-center justify-center w-[15px] h-[15px] rounded-full"
                            style={{ background: `rgba(${RED_RGB},0.22)`, border: `1px solid rgba(${RED_RGB},0.40)` }}
                        >
                            <Cake size={7} style={{ color: RED }} />
                        </span>
                    </div>
                </div>

                {/* Text stack + wish button */}
                <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center gap-[5px] pr-4">
                    <p className="text-[13px] font-bold text-white truncate leading-tight">{name}</p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold" style={{ color: RED }}>Birthday</span>
                        <span className="text-white/20 text-[10px]">·</span>
                        <Calendar size={9} className="shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
                        <span className="text-[10px] text-white/38">{dateStr}</span>
                    </div>
                    {/* Wish button — below text, small */}
                    <button
                        onClick={openModal}
                        className="self-start flex items-center gap-1 px-2 py-[4px] rounded-lg
                                   text-[10px] font-bold transition-all duration-150
                                   hover:opacity-90 active:scale-[0.95]"
                        style={{
                            background: `rgba(${RED_RGB},0.14)`,
                            border: `1px solid rgba(${RED_RGB},0.26)`,
                            color: RED,
                        }}
                    >
                        <Mail size={9} />Wish
                    </button>
                </div>
            </motion.div>

            <SendMessageModal isOpen={isOpen} onClose={closeModal} recipient={person} />
        </>
    );
});
BirthdayCard.displayName = 'Hub.BirthdayCard';

const AnniversaryCard = memo(({ anniversary, person, index }) => {
    const { isOpen, openModal, closeModal } = useModal();
    const name = `${person.first_name} ${person.last_name}`;
    const typeKey = anniversary?.type ?? 'custom';
    const cfg = ANN_TYPE_CFG[typeKey] || ANN_TYPE_CFG.custom;
    const AnnIcon = cfg.Icon;
    const label = anniversary?.title || cfg.label;
    const dateStr = fmtShortDate(anniversary?.date);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.30, delay: index * 0.05, ease: 'easeOut' }}
                className="relative flex items-center rounded-2xl overflow-hidden shrink-0"
                style={{
                    width: 'clamp(220px, 24vw, 296px)',
                    height: 96,
                    background: `linear-gradient(130deg, rgba(${cfg.colorRGB},0.10) 0%, rgba(255,255,255,0.03) 100%)`,
                    border: `1px solid rgba(${cfg.colorRGB},0.16)`,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                }}
            >
                {/* Left accent stripe */}
                <div
                    className="absolute left-0 inset-y-0 w-[3px]"
                    style={{ background: `linear-gradient(180deg, ${cfg.color} 0%, rgba(${cfg.colorRGB},0.20) 100%)` }}
                />
                {/* Corner ambient glow */}
                <div
                    className="absolute -top-6 -right-6 w-16 h-16 rounded-full pointer-events-none blur-2xl opacity-50"
                    style={{ background: `rgba(${cfg.colorRGB},0.20)` }}
                />

                {/* Avatar — vertically centred */}
                <div className="relative z-10 pl-5 pr-4 shrink-0 self-center">
                    <div className="relative">
                        <Avatar src={person.avatar} name={generateInitials(name)} size="sm" />
                        <span
                            className="absolute -bottom-1 -right-1 flex items-center justify-center w-[15px] h-[15px] rounded-full"
                            style={{ background: `rgba(${cfg.colorRGB},0.22)`, border: `1px solid rgba(${cfg.colorRGB},0.40)` }}
                        >
                            <AnnIcon size={7} style={{ color: cfg.color }} />
                        </span>
                    </div>
                </div>

                {/* Text stack + wish button */}
                <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center gap-[5px] pr-4">
                    <p className="text-[13px] font-bold text-white truncate leading-tight">{name}</p>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-semibold truncate" style={{ color: cfg.color }}>
                            {label}
                        </span>
                        {dateStr && (
                            <>
                                <span className="text-white/20 text-[10px] shrink-0">·</span>
                                <Calendar size={9} className="shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
                                <span className="text-[10px] text-white/38 shrink-0">{dateStr}</span>
                            </>
                        )}
                    </div>
                    {/* Wish button — below text, small */}
                    <button
                        onClick={openModal}
                        className="self-start flex items-center gap-1 px-2 py-[4px] rounded-lg
                                   text-[10px] font-bold transition-all duration-150
                                   hover:opacity-90 active:scale-[0.95]"
                        style={{
                            background: `rgba(${cfg.colorRGB},0.14)`,
                            border: `1px solid rgba(${cfg.colorRGB},0.26)`,
                            color: cfg.color,
                        }}
                    >
                        <Mail size={9} />Wish
                    </button>
                </div>
            </motion.div>

            <SendMessageModal isOpen={isOpen} onClose={closeModal} recipient={person} />
        </>
    );
});
AnniversaryCard.displayName = 'Hub.AnniversaryCard';

/** Tab pill */
const CelebTab = memo(({ id, Icon, label, count, active, onClick, accentRGB }) => (
    <button
        onClick={() => onClick(id)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold transition-all duration-200"
        style={
            active
                ? {
                    background: `linear-gradient(135deg, rgba(${accentRGB},0.22) 0%, rgba(${accentRGB},0.10) 100%)`,
                    border: `1px solid rgba(${accentRGB},0.32)`,
                    color: '#fff',
                    boxShadow: `0 0 14px rgba(${accentRGB},0.18)`,
                }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.36)',
                }
        }
    >
        <Icon size={11} />
        {label}
        <span
            className="flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-black"
            style={
                active
                    ? { background: `rgba(${accentRGB},0.26)`, color: '#fff' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)' }
            }
        >
            {count}
        </span>
    </button>
));
CelebTab.displayName = 'Hub.CelebTab';

/**
 * Single horizontal scroll track — no duplicate grid rendering.
 * Right-edge fade hints at overflow content.
 */
const ScrollTrack = memo(({ children }) => (
    <div className="relative">
        {/* Right edge fade */}
        <div
            className="absolute right-0 top-0 bottom-0 w-14 pointer-events-none z-10"
            style={{ background: `linear-gradient(to right, transparent, ${PAGE_BG}cc)` }}
        />
        <div
            className="flex gap-3 overflow-x-auto"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            {children}
            {/* Spacer so last card isn't swallowed by fade */}
            <div className="shrink-0 w-8" aria-hidden />
        </div>
    </div>
));
ScrollTrack.displayName = 'Hub.ScrollTrack';

/**
 * CelebrationsSection
 * Inline section below the main grid — no modal trigger, no page-header button.
 * Scope: current month's birthdays and anniversaries.
 */
const CelebrationsSection = memo(({ birthdayList, anniversaryList, hasBirthdays, hasAnniversaries }) => {
    const totalB = birthdayList.length;
    const totalA = anniversaryList.reduce((s, p) => s + (p.anniversaries?.length || 0), 0);
    const grand = totalB + totalA;

    const [tab, setTab] = useState(
        hasBirthdays ? CELEBRATION_TABS.BIRTHDAYS : CELEBRATION_TABS.ANNIVERSARIES
    );

    // Flatten anniversary entries into a single list
    const annEntries = anniversaryList.flatMap((person) =>
        (person.anniversaries ?? []).map((ann) => ({ ann, person }))
    );

    const TABS = [
        hasBirthdays && { id: CELEBRATION_TABS.BIRTHDAYS, Icon: Cake, label: 'Birthdays', count: totalB, accentRGB: RED_RGB },
        hasAnniversaries && { id: CELEBRATION_TABS.ANNIVERSARIES, Icon: Gift, label: 'Anniversaries', count: totalA, accentRGB: BRAND_RGB },
    ].filter(Boolean);

    const monthLabel = dayjs().format('MMMM YYYY');

    return (
        <section data-aos="fade" data-aos-duration="500" className="relative w-full">
            <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                    background: 'rgba(255,255,255,0.028)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                }}
            >
                {/* Inner mesh — sits on top of AnimatedBackground without fighting it */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(ellipse 55% 55% at 2% 0%,    rgba(${RED_RGB},0.050)   0%, transparent 55%),
                            radial-gradient(ellipse 45% 55% at 100% 100%, rgba(${BRAND_RGB},0.055) 0%, transparent 55%)
                        `,
                    }}
                />

                {/* Multicolor top accent line */}
                <div
                    className="h-[2px] w-full shrink-0"
                    style={{
                        background: `linear-gradient(90deg,
                            transparent 0%,
                            rgba(${RED_RGB},0.60) 20%,
                            rgba(${BRAND_RGB},0.55) 50%,
                            rgba(${CYAN_RGB},0.48) 80%,
                            transparent 100%
                        )`,
                    }}
                />

                <div className="relative z-10 p-5 sm:p-6 lg:p-7">

                    {/* ── Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                        {/* Left */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-[2px] rounded-full" style={{ background: RED }} />
                                <span
                                    className="text-[9px] font-black uppercase tracking-[0.22em]"
                                    style={{ color: `rgba(${RED_RGB},0.75)` }}
                                >
                                    {monthLabel}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                                    Celebrations
                                </h2>
                                {/* Total badge */}
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full
                                               text-[10px] font-black text-white/75"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(${RED_RGB},0.14), rgba(${BRAND_RGB},0.10))`,
                                        border: `1px solid rgba(${RED_RGB},0.18)`,
                                    }}
                                >
                                    <CalendarHeart size={9} style={{ color: RED }} />
                                    {grand} milestone{grand !== 1 ? 's' : ''} this month
                                </span>
                            </div>

                            <p className="text-[11px] text-white/26 mt-0.5">
                                Send heartfelt wishes to members celebrating this month
                            </p>
                        </div>

                        {/* Tabs — only shown when both categories have entries */}
                        {TABS.length > 1 && (
                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                                {TABS.map((t) => (
                                    <CelebTab
                                        key={t.id}
                                        id={t.id}
                                        Icon={t.Icon}
                                        label={t.label}
                                        count={t.count}
                                        active={tab === t.id}
                                        onClick={setTab}
                                        accentRGB={t.accentRGB}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div
                        className="h-px w-full mb-5"
                        style={{
                            background: `linear-gradient(90deg,
                                transparent,
                                rgba(${RED_RGB},0.18),
                                rgba(${BRAND_RGB},0.14),
                                transparent
                            )`,
                        }}
                    />

                    {/* ── Card scroll — single render, no hidden duplicate ── */}
                    <AnimatePresence mode="wait">
                        {tab === CELEBRATION_TABS.BIRTHDAYS ? (
                            <motion.div
                                key="birthdays"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <ScrollTrack>
                                    {birthdayList.map((p, i) => (
                                        <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
                                            <BirthdayCard person={p} index={i} />
                                        </div>
                                    ))}
                                </ScrollTrack>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="anniversaries"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <ScrollTrack>
                                    {annEntries.map(({ ann, person }, i) => (
                                        <div key={`${person.id}-${i}`} style={{ scrollSnapAlign: 'start' }}>
                                            <AnniversaryCard anniversary={ann} person={person} index={i} />
                                        </div>
                                    ))}
                                </ScrollTrack>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
});
CelebrationsSection.displayName = 'Hub.CelebrationsSection';

// ─── PageHeader (celebrations button removed) ─────────────────────────────────

const PageHeader = memo(({ user, isAuthenticated }) => {
    const today = dayjs();
    return (
        <div className="flex flex-col gap-6">
            <SectionHeader
                eyebrow="GCCCC · Ibadan"
                titleWhite="Services &"
                titleBlue="Events"
                subtitle="Mark attendance, view upcoming events, and celebrate milestones together."
            />
            <header data-aos="fade" data-aos-duration="380" className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center shrink-0 select-none"
                        style={{ background: `rgba(${BRAND_RGB},0.10)`, border: `1px solid rgba(${BRAND_RGB},0.18)` }}
                    >
                        <span className="text-[7px] font-black uppercase tracking-widest leading-none" style={{ color: BRAND }}>
                            {today.format('MMM')}
                        </span>
                        <span className="text-base font-black text-white leading-tight">{today.format('D')}</span>
                    </div>
                    <div>
                        <p className="text-sm sm:text-base font-bold text-white leading-tight">{today.format('dddd')}</p>
                        <p className="text-[10px] sm:text-xs text-white/35">{today.format('MMMM D, YYYY')}</p>
                    </div>
                </div>
                {user && (
                    <Avatar
                        src={user.avatar}
                        name={generateInitials(`${user.first_name || ''} ${user.last_name || ''}`)}
                        size="sm"
                    />
                )}
            </header>
        </div>
    );
});
PageHeader.displayName = 'Hub.PageHeader';

// ─── Service Rail ─────────────────────────────────────────────────────────────

const StateIconCircle = memo(({ icon: Icon, iconSize = 50, style = {} }) => (
    <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center mx-auto"
        style={{ ...glassInner(0.09), ...style }}
    >
        <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${BRAND_RGB},0.18) 0%, transparent 68%)`, animation: 'hub-glow 3s ease-in-out infinite' }}
        />
        <Icon size={iconSize} style={{ color: BRAND }} strokeWidth={1.4} className="relative z-10" />
    </div>
));
StateIconCircle.displayName = 'Hub.StateIconCircle';

const TimeUnit = memo(({ value, label }) => (
    <div className="flex flex-col items-center gap-1.5">
        <div className="min-w-[62px] px-2 py-3 rounded-xl text-center" style={glassInner(0.09)}>
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
                {String(value).padStart(2, '0')}
            </span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/28">{label}</span>
    </div>
));
TimeUnit.displayName = 'Hub.TimeUnit';

const CountdownTimer = memo(({ secondsUntilStart, onRefresh }) => {
    const [left, setLeft] = useState(secondsUntilStart || 0);
    const calledRef = useRef(false);

    useEffect(() => {
        if (left <= 0) {
            if (!calledRef.current) { calledRef.current = true; onRefresh(); }
            return;
        }
        const id = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000);
        return () => clearInterval(id);
    }, [left, onRefresh]);

    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-1.5">
                <Clock size={11} style={{ color: `rgba(${BRAND_RGB},0.60)` }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Starts In</span>
            </div>
            <div className="flex items-center gap-2.5">
                <TimeUnit value={h} label="Hrs" />
                <span className="text-xl font-black text-white/15 mb-5 select-none">:</span>
                <TimeUnit value={m} label="Min" />
                <span className="text-xl font-black text-white/15 mb-5 select-none">:</span>
                <TimeUnit value={s} label="Sec" />
            </div>
            {left <= 0 && (
                <div className="flex items-center gap-1.5">
                    <LiveDot />
                    <span className="text-[10px] font-semibold" style={{ color: BRAND }}>Checking status...</span>
                </div>
            )}
        </div>
    );
});
CountdownTimer.displayName = 'Hub.CountdownTimer';

const ClockInButton = memo(({ onClockIn, isPending }) => (
    <div className="hub-fade-in flex flex-col items-center gap-6">
        {!isPending ? (
            <div className="relative">
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        inset: -40,
                        background: `radial-gradient(circle, rgba(${BRAND_RGB},0.22) 0%, transparent 62%)`,
                        animation: 'hub-glow 3s ease-in-out infinite',
                    }}
                />
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="absolute rounded-full hub-ripple-ring pointer-events-none"
                        style={{
                            inset: -(10 + i * 18),
                            border: `1px solid rgba(${BRAND_RGB},${0.42 - i * 0.16})`,
                            animation: `hub-ripple ${1.4 + i * 0.5}s ease-out ${i * 0.35}s infinite`,
                        }}
                    />
                ))}
                <motion.button
                    onClick={onClockIn}
                    disabled={isPending}
                    className="relative rounded-full cursor-pointer disabled:opacity-50"
                    style={{
                        padding: '2.4rem',
                        background: `linear-gradient(135deg, ${BRAND} 0%, ${TEAL} 100%)`,
                        boxShadow: `0 0 60px rgba(${BRAND_RGB},0.44), 0 8px 32px rgba(0,0,0,0.38)`,
                        border: '2px solid rgba(255,255,255,0.14)',
                    }}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    whileHover={{ scale: 1.09 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.6, ease: 'easeInOut' }}
                    aria-label="Clock in for today's service"
                >
                    <HandIcon height={150} width={150} />
                </motion.button>
            </div>
        ) : (
            <div className="hub-lottie-wrap">
                <div
                    className="absolute inset-0 blur-3xl rounded-full pointer-events-none"
                    style={{ background: `rgba(${BRAND_RGB},0.16)` }}
                />
                <Lottie animationData={animationData} loop style={{ width: 190, height: 190 }} className="relative z-10" />
            </div>
        )}
        <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white">{isPending ? 'Submitting...' : 'Tap to Clock In'}</p>
            <p className="text-xs text-white/32">{isPending ? 'Recording your attendance...' : 'Mark your attendance for today'}</p>
        </div>
    </div>
));
ClockInButton.displayName = 'Hub.ClockInButton';

const AttendanceRecordedState = memo(({ attendance }) => (
    <div className="hub-fade-in flex flex-col items-center gap-5">
        <div className="relative w-24 h-24 hub-scale-in">
            <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none" style={{ background: `rgba(${BRAND_RGB},0.22)` }} />
            <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center" style={glassInner(0.10)}>
                <CheckCircle2 size={50} style={{ color: BRAND }} strokeWidth={1.4} />
            </div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-base font-bold text-white">Attendance Recorded!</p>
            <p className="text-xs text-white/35 leading-relaxed max-w-[220px]">
                Your presence has been recorded. Thank you for being here today!
            </p>
            {attendance && (
                <div className="inline-flex flex-col gap-1 px-4 py-2.5 rounded-xl text-xs text-left" style={glassInner(0.08)}>
                    <span className="text-white/40">
                        Mode{' '}<span className="capitalize font-semibold" style={{ color: BRAND }}>{attendance.mode}</span>
                    </span>
                    <span className="text-white/40">
                        Time{' '}<span className="font-semibold" style={{ color: BRAND }}>{attendance.marked_at}</span>
                    </span>
                </div>
            )}
        </div>
    </div>
));
AttendanceRecordedState.displayName = 'Hub.AttendanceRecordedState';

const ServiceEndedState = memo(({ serviceName, attendance }) => (
    <div className="flex flex-col items-center gap-5">
        <StateIconCircle icon={Clock} />
        <div className="text-center space-y-2">
            <p className="text-base font-bold text-white">Service Has Ended</p>
            <p className="text-xs text-white/35 leading-relaxed max-w-[220px]">
                {serviceName} has ended. The attendance window is now closed.
            </p>
            {attendance ? (
                <div className="inline-block px-4 py-2.5 rounded-xl text-xs text-left" style={glassInner(0.08)}>
                    <p className="flex items-center gap-1.5 font-semibold" style={{ color: BRAND }}>
                        <Check size={11} />You marked your attendance
                    </p>
                    <p className="text-white/32 mt-0.5">{attendance.marked_at}</p>
                </div>
            ) : (
                <p className="text-xs text-white/22">Attendance was not recorded.</p>
            )}
        </div>
    </div>
));
ServiceEndedState.displayName = 'Hub.ServiceEndedState';

const RecapLinks = memo(() => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
        <a
            href="https://www.youtube.com/@GcccIbadan" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-white hover:opacity-85 active:scale-95 transition-all"
            style={{ background: '#cc0000' }}
        >
            <Youtube size={13} />Watch Recap
        </a>
        <a
            href="https://t.me/Pastoropeyemipeter" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-white hover:opacity-85 active:scale-95 transition-all"
            style={{ background: `rgba(${BRAND_RGB},0.26)`, border: `1px solid rgba(${BRAND_RGB},0.36)` }}
        >
            <Radio size={13} />Get Audio
        </a>
    </div>
));
RecapLinks.displayName = 'Hub.RecapLinks';

const NoServiceContent = memo(() => (
    <div className="flex flex-col items-center gap-5">
        <StateIconCircle icon={Calendar} />
        <div className="text-center space-y-2">
            <p className="text-base font-bold text-white">No Service Today</p>
            <p className="text-xs text-white/35 leading-relaxed max-w-[200px]">
                No service is scheduled. Stay connected through our platforms.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button startIcon={<Youtube />} endIcon={<ArrowRight size={14} />} variant="danger"
                href="https://www.youtube.com/@GcccIbadan" target="_blank" rel="noopener noreferrer">
                Watch on YouTube
            </Button>
            <Button endIcon={<ArrowRight size={14} />} startIcon={<Radio />}
                href="https://t.me/Pastoropeyemipeter" target="_blank" rel="noopener noreferrer">
                Telegram
            </Button>
        </div>
    </div>
));
NoServiceContent.displayName = 'Hub.NoServiceContent';

const UnauthContent = memo(() => (
    <div className="flex flex-col items-center gap-6">
        <StateIconCircle icon={LogIn} />
        <div className="text-center space-y-2">
            <p className="text-base font-bold text-white">Sign In to Continue</p>
            <p className="text-xs text-white/35 leading-relaxed max-w-[200px]">
                Sign in to mark attendance and stay connected with the community.
            </p>
        </div>
        <Button
            href="/login" startIcon={<LogIn />}
            style={{
                background: `linear-gradient(135deg, ${BRAND} 0%, ${TEAL} 100%)`,
                boxShadow: `0 0 26px rgba(${BRAND_RGB},0.30), 0 4px 14px rgba(0,0,0,0.28)`,
            }}
        >
            Sign In
        </Button>
    </div>
));
UnauthContent.displayName = 'Hub.UnauthContent';

const ServiceLoadingContent = memo(() => (
    <div className="flex flex-col items-center gap-4">
        <div className="hub-lottie-wrap">
            <div className="absolute inset-0 blur-3xl rounded-full pointer-events-none" style={{ background: `rgba(${BRAND_RGB},0.14)` }} />
            <Lottie animationData={animationData} loop style={{ width: 190, height: 190 }} className="relative z-10" />
        </div>
        <p className="text-xs text-white/40">Loading service...</p>
    </div>
));
ServiceLoadingContent.displayName = 'Hub.ServiceLoadingContent';

const ServiceRail = memo(({
    status, service, secondsUntilStart,
    showMarkedAttendance, attendance,
    onClockIn, isPending, onRefresh,
    isLoading, isError, isAuthenticated,
}) => {
    const renderBody = () => {
        if (!isAuthenticated) return <UnauthContent />;
        if (isLoading) return <ServiceLoadingContent />;
        if (isError || !status) return <NoServiceContent />;
        switch (status) {
            case SERVICE_STATUS.UPCOMING:
                return <CountdownTimer secondsUntilStart={secondsUntilStart || 0} onRefresh={onRefresh} />;
            case SERVICE_STATUS.ONGOING:
                return showMarkedAttendance
                    ? <AttendanceRecordedState key="rec" attendance={attendance} />
                    : <ClockInButton key="btn" onClockIn={onClockIn} isPending={isPending} />;
            case SERVICE_STATUS.ENDED:
                return (
                    <div className="flex flex-col items-center gap-5">
                        <ServiceEndedState serviceName={service?.name} attendance={attendance} />
                        <RecapLinks />
                    </div>
                );
            default: return <NoServiceContent />;
        }
    };

    return (
        <aside data-aos="fade" data-aos-duration="480" data-aos-delay="60" className="relative flex flex-col h-full">
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: '-60px -50px -60px -8px',
                    background: `radial-gradient(ellipse 80% 60% at 25% 40%, rgba(${BRAND_RGB},0.08) 0%, transparent 68%)`,
                    zIndex: 0,
                }}
            />
            <div
                className="relative z-10 flex flex-col h-full pl-5 py-5"
                style={{ borderLeft: `2px solid rgba(${BRAND_RGB},0.28)` }}
            >
                <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: `rgba(${BRAND_RGB},0.55)` }}>
                        Today's Service
                    </p>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                            {isLoading && isAuthenticated ? '—' : (service?.name || 'GCCC Ibadan.')}
                        </h2>
                        {isAuthenticated && !isLoading && status && <ServiceStatusPill status={status} />}
                    </div>
                    {isAuthenticated && service?.description && !isLoading && (
                        <p className="text-xs text-white/32 leading-relaxed max-w-[280px]">{service.description}</p>
                    )}
                </div>
                <div className="w-10 h-px my-5" style={{ background: `rgba(${BRAND_RGB},0.18)` }} />
                <div className="hub-service-body flex-1 flex flex-col items-center justify-center text-center">
                    {renderBody()}
                </div>
            </div>
        </aside>
    );
});
ServiceRail.displayName = 'Hub.ServiceRail';

// ─── Event Panel ──────────────────────────────────────────────────────────────

const EventCardInner = memo(({ event }) => {
    const [imgError, setImgError] = useState(false);
    const cfg = EVENT_STATUS_CFG[event.status] || EVENT_STATUS_CFG.upcoming;
    const handleShare = useCallback(() => doShare(event), [event]);

    const startTimeFmt = fmtTime24(event.start_time) || event.time;
    const endTimeFmt = fmtTime24(event.end_time);
    const timeRange = endTimeFmt ? `${startTimeFmt} – ${endTimeFmt}` : startTimeFmt;

    const endDateFmt = event.end_date
        ? new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null;
    const dateRange = endDateFmt && endDateFmt !== event.date ? `${event.date} – ${endDateFmt}` : event.date;

    const regDeadlineFmt = event.registration_deadline
        ? new Date(event.registration_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    const hasVideo = event.has_streaming && !!event.video_streaming_link;
    const hasAudio = event.has_streaming && !!event.audio_streaming_link;
    const hasRegistration = event.is_registration_open && !!event.registration_link;

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden bg-white/5 rounded-t-2xl" style={{ height: 180 }}>
                {!imgError ? (
                    <img src={event.image} alt={event.title} onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.07), rgba(${TEAL_RGB},0.04))` }}>
                        <Calendar size={36} style={{ color: `rgba(${BRAND_RGB},0.22)` }} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/15 to-transparent" />
                <div className="absolute top-4 left-4">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-sm"
                        style={{ background: `rgba(${cfg.colorRGB},0.18)`, border: `1px solid rgba(${cfg.colorRGB},0.32)`, color: cfg.color }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color, ...(cfg.pulse && { animation: 'hub-ripple 1.6s ease-out infinite' }) }} />
                        {cfg.label}
                    </span>
                </div>
                <div className="absolute top-4 right-4">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white"
                        style={{ background: `rgba(${BRAND_RGB},0.65)`, backdropFilter: 'blur(6px)' }}
                    >
                        <Clock size={10} />{timeRange}
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-tight line-clamp-2 drop-shadow">{event.title}</h3>
                </div>
            </div>
            <div className="flex flex-col gap-3.5 p-5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <CalendarClock size={13} style={{ color: `rgba(${BRAND_RGB},0.65)` }} className="shrink-0" />
                        <span className="text-sm text-white/45 truncate">{dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                        <MapPin size={13} style={{ color: `rgba(${BRAND_RGB},0.65)` }} className="shrink-0" />
                        <span className="text-sm text-white/45 truncate">{event.location}</span>
                    </div>
                </div>
                {event.description && (
                    <p className="text-sm text-white/32 line-clamp-3 leading-relaxed">{event.description}</p>
                )}
                {(hasVideo || hasAudio || hasRegistration) && (
                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                        {hasVideo && (
                            <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-85 active:scale-95"
                                style={{ background: '#cc000022', border: '1px solid #cc000055', color: '#f87171' }}>
                                <Video size={11} />Watch Live
                            </a>
                        )}
                        {hasAudio && (
                            <a href={event.audio_streaming_link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-85 active:scale-95"
                                style={{ background: `rgba(${TEAL_RGB},0.12)`, border: `1px solid rgba(${TEAL_RGB},0.28)`, color: TEAL }}>
                                <Mic size={11} />Listen Live
                            </a>
                        )}
                        {hasRegistration && (
                            <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-85 active:scale-95">
                                <UserPlus size={11} />Register
                                {regDeadlineFmt && <span className="text-white/30 font-normal">· {regDeadlineFmt}</span>}
                            </a>
                        )}
                    </div>
                )}
                <div className="flex items-center justify-between gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                        {event.has_streaming && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                style={{ background: `rgba(${BRAND_RGB},0.14)`, color: '#7dd3fc' }}>
                                <Wifi size={10} />Streaming
                            </span>
                        )}
                        {event.is_registration_open && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                style={{ background: 'rgba(52,211,153,0.14)', color: '#6ee7b7' }}>
                                <UserCheck size={10} />Open
                            </span>
                        )}
                        {!event.has_streaming && !event.is_registration_open && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.28)' }}>
                                <MapPin size={10} />In-person
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleShare}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND} 0%, ${TEAL} 100%)`,
                            boxShadow: `0 2px 14px rgba(${BRAND_RGB},0.32)`,
                        }}
                        aria-label={`Share ${event.title}`}
                    >
                        <Share2 size={13} />Share
                    </button>
                </div>
            </div>
        </div>
    );
});
EventCardInner.displayName = 'Hub.EventCardInner';

const EventPanel = memo(({ event, isLoading, isError }) => {
    const isLive = event?.status === 'ongoing';
    return (
        <section data-aos="fade" data-aos-duration="480" data-aos-delay="100" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `rgba(${BRAND_RGB},0.11)`, border: `1px solid rgba(${BRAND_RGB},0.16)` }}
                    >
                        <Zap size={14} style={{ color: BRAND }} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight capitalize leading-tight">{event?.status} Event</h2>
                        {!isLoading && !isError && (
                            <p className="text-[10px] text-white/28 mt-0.5">{!event ? 'Nothing scheduled' : event.date}</p>
                        )}
                    </div>
                </div>
                {isLive && !isLoading && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <LiveDot color={EMERALD} />
                        <span className="text-[10px] font-semibold text-emerald-400">Live Now</span>
                    </div>
                )}
            </div>
            <div className="ev-card hub-event-card-shell rounded-2xl overflow-hidden" style={cardShell()}>
                {isLoading ? (
                    <div className="animate-pulse">
                        <div style={{ height: 180, background: 'rgba(255,255,255,0.05)' }} />
                        <div className="p-5 space-y-3">
                            <SkeletonBlock className="h-3.5 w-3/4" /><SkeletonBlock className="h-3 w-1/2" />
                            <SkeletonBlock className="h-3 w-full" />
                            <div className="flex justify-between pt-1">
                                <SkeletonBlock className="h-6 w-20" /><SkeletonBlock className="h-7 w-20" />
                            </div>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center text-center p-12">
                        <AlertCircle size={28} style={{ color: '#f87171' }} className="mb-3" />
                        <p className="text-sm font-bold text-white">Failed to Load Event</p>
                        <p className="text-xs text-white/32 mt-1">Try refreshing the page.</p>
                    </div>
                ) : !event ? (
                    <div className="flex flex-col items-center justify-center text-center p-12">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: `rgba(${BRAND_RGB},0.07)`, border: `1px solid rgba(${BRAND_RGB},0.10)` }}
                        >
                            <Calendar size={24} style={{ color: `rgba(${BRAND_RGB},0.35)` }} strokeWidth={1.3} />
                        </div>
                        <p className="text-sm font-bold text-white mb-1.5">No Events Today</p>
                        <p className="text-xs text-white/28 max-w-[180px] leading-relaxed">
                            Nothing scheduled. Check back later for upcoming events.
                        </p>
                    </div>
                ) : (
                    <EventCardInner event={event} />
                )}
            </div>
        </section>
    );
});
EventPanel.displayName = 'Hub.EventPanel';

// ─── Root ─────────────────────────────────────────────────────────────────────

const SanctuaryHub = () => {
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuthStore();

    const { data: serviceData, isLoading: svcLoading, isFetching: svcFetching, isError: svcError, refetch } = useTodaysService();
    const { data: coreData, isLoading: coreLoading, isFetching: coreFetching } = useCoreAppData();
    const { data: eventsData, isLoading: eventsLoading, isError: eventsError } = useClosestEvent();
    const { mutate, isPending, isSuccess } = useMarkAttendance();

    const { service, service_status, seconds_until_start, can_mark, attendance } = serviceData || {};
    const { birthday_list = [], anniversary_list = [] } = coreData || {};

    const hasBirthdays = birthday_list.length > 0;
    const hasAnniversaries = anniversary_list.some((p) => p.anniversaries?.length);
    const hasCelebrations = hasBirthdays || hasAnniversaries;

    const todayEvent = eventsData?.data ?? null;
    const showMarkedAttendance = isSuccess || (serviceData && !can_mark && attendance);
    const isSvcLoading = isAuthenticated && (svcLoading || svcFetching || isPending);
    const isSvcError = isAuthenticated && svcError;

    const source = searchParams.get('source') === ATTENDANCE_SOURCES.ONLINE
        ? ATTENDANCE_SOURCES.ONLINE
        : ATTENDANCE_SOURCES.ONSITE;

    const handleRefresh = useCallback(() => refetch(), [refetch]);
    const handleClockIn = useCallback((e) => {
        e.preventDefault();
        if (!service?.id) return;
        mutate({ service_id: service.id, mode: source, status: 'present' });
    }, [service?.id, source, mutate]);

    return (
        <section
            id="events"
            className={`relative overflow-hidden w-full min-h-screen ${SECTION_SPACING}`}
            style={{ backgroundColor: PAGE_BG }}
        >
            <AnimatedBackground withBaseBg />
            {isAuthenticated && hasCelebrations && <ConfettiShower duration={15} />}

            <div className="container mx-auto px-2 relative z-10 flex flex-col gap-16 sm:gap-20">

                <PageHeader user={user} isAuthenticated={isAuthenticated} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-stretch">
                    <ServiceRail
                        status={service_status}
                        service={service}
                        secondsUntilStart={seconds_until_start}
                        showMarkedAttendance={showMarkedAttendance}
                        attendance={attendance}
                        onClockIn={handleClockIn}
                        isPending={isPending}
                        onRefresh={handleRefresh}
                        isLoading={isSvcLoading}
                        isError={isSvcError}
                        isAuthenticated={isAuthenticated}
                    />
                    <EventPanel event={todayEvent} isLoading={eventsLoading} isError={eventsError} />
                </div>

                {/* Inline celebrations — auth-gated, month-scoped */}
                {isAuthenticated && hasCelebrations && (
                    <CelebrationsSection
                        birthdayList={birthday_list}
                        anniversaryList={anniversary_list}
                        hasBirthdays={hasBirthdays}
                        hasAnniversaries={hasAnniversaries}
                    />
                )}

            </div>
        </section>
    );
};

export default memo(SanctuaryHub);