import { memo, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, Video,
    CheckCircle2, AlertCircle, Loader2,
    ArrowRight, ChevronLeft, Users, Wifi,
} from 'lucide-react';
import { useEvent } from '@/queries/events.query';
import { Toast } from '@/lib/toastify';
import PageHeader from '@/components/common/PageHeader';

/* ─── Tokens ──────────────────────────────────────────────────────────────────── */
const B = '#0998d5';
const B_RGB = '9,152,213';

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */
const fmtTime = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const STATUS = {
    ongoing: { label: 'Live Now', dotCls: 'bg-emerald-500', textCls: 'text-emerald-600 dark:text-emerald-400', badgeCls: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', pulse: true },
    upcoming: { label: 'Upcoming', dotCls: 'bg-sky-500', textCls: 'text-sky-600 dark:text-sky-400', badgeCls: 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20', pulse: false },
    past: { label: 'Ended', dotCls: 'bg-slate-400', textCls: 'text-slate-500 dark:text-slate-400', badgeCls: 'bg-slate-100 dark:bg-white/[0.06] border-slate-200 dark:border-white/[0.10]', pulse: false },
};

/* ─── StatusPill ──────────────────────────────────────────────────────────────── */
const StatusPill = memo(({ status }) => {
    const s = STATUS[status] || STATUS.upcoming;
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.textCls} ${s.badgeCls}`}>
            <span className="relative flex w-1.5 h-1.5 shrink-0">
                {s.pulse && <span className={`absolute inset-0 rounded-full animate-ping opacity-70 ${s.dotCls}`} />}
                <span className={`relative w-1.5 h-1.5 rounded-full ${s.dotCls}`} />
            </span>
            {s.label}
        </span>
    );
});
StatusPill.displayName = 'StatusPill';

/* ─── Skeleton ────────────────────────────────────────────────────────────────── */
const Bone = memo(({ className = '', delay = 0, round = 'rounded-xl' }) => (
    <div className={`relative overflow-hidden ${round} bg-slate-100 dark:bg-white/[0.06] ${className}`}>
        <div className="absolute inset-0 -translate-x-full" style={{
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.65) 50%,transparent)',
            animation: `sk-bone 1.8s ease-in-out ${delay}s infinite`,
        }} />
    </div>
));
Bone.displayName = 'Bone';

const Skeleton = memo(() => (
    <>
        <style>{`@keyframes sk-bone{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}`}</style>

        <div className="min-h-screen bg-white dark:bg-[#020c16]">
            {/* PageHeader skeleton */}
            <div className="border-b border-slate-100 dark:border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-8">
                    <Bone className="h-6 w-24 mb-8 rounded-full" delay={0} />
                    <div className="flex items-start justify-between gap-8">
                        <div className="flex flex-col gap-2.5 flex-1">
                            <Bone className="h-2.5 w-28 rounded" delay={0.06} />
                            <Bone className="h-10 w-3/4" delay={0.10} />
                            <Bone className="h-4 w-1/2" delay={0.13} />
                        </div>
                        <Bone className="h-7 w-24 rounded-full mt-1" delay={0.15} />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
                {/* Image */}
                <Bone className="w-full rounded-2xl mb-12" style={{ aspectRatio: '16/7' }} delay={0.05} />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
                    {/* Left */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {[0.14, 0.17, 0.20].map(d => (
                                <div key={d} className="flex items-center gap-2">
                                    <Bone className="w-4 h-4 rounded-full" round="rounded-full" delay={d} />
                                    <Bone className="h-3.5 w-24 rounded" delay={d + 0.01} />
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />
                        <div className="flex flex-col gap-3">
                            {[['100%', 0.22], ['90%', 0.24], ['82%', 0.25], ['68%', 0.26]].map(([w, d]) => (
                                <Bone key={d} className="h-4 rounded" delay={d} style={{ width: w }} />
                            ))}
                        </div>
                    </div>

                    {/* Right form skeleton */}
                    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] flex items-center gap-3">
                            <Bone className="w-[3px] h-5 rounded-full" round="rounded-full" delay={0.18} />
                            <Bone className="h-4 w-40 rounded" delay={0.20} />
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                {[0.22, 0.24].map(d => (
                                    <div key={d} className="flex flex-col gap-2">
                                        <Bone className="h-2 w-16 rounded" delay={d} />
                                        <Bone className="h-11" delay={d + 0.02} />
                                    </div>
                                ))}
                            </div>
                            {[0.28, 0.30, 0.32].map(d => (
                                <div key={d} className="flex flex-col gap-2">
                                    <Bone className="h-2 w-20 rounded" delay={d} />
                                    <Bone className="h-11" delay={d + 0.02} />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                <Bone className="h-14" delay={0.36} />
                                <Bone className="h-14" delay={0.38} />
                            </div>
                            <Bone className="h-[52px]" delay={0.42} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
));
Skeleton.displayName = 'Skeleton';

/* ─── Field ───────────────────────────────────────────────────────────────────── */
const Field = memo(({ label, required, error, hint, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
            {label}{required && <span className="ml-0.5" style={{ color: B }}>*</span>}
        </label>
        {children}
        {hint && !error && (
            <p className="text-[11px] text-slate-400 dark:text-white/25 mt-0.5">{hint}</p>
        )}
        <AnimatePresence>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[11px] text-red-500 dark:text-red-400 mt-0.5"
                >
                    <AlertCircle size={10} className="shrink-0" />{error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
));
Field.displayName = 'Field';

const inputCls = `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
    bg-white dark:bg-white/[0.05]
    border border-slate-200 dark:border-white/[0.08]
    text-slate-900 dark:text-white
    placeholder:text-slate-300 dark:placeholder:text-white/20
    hover:border-slate-300 dark:hover:border-white/[0.15]
    focus:border-[#0998d5] focus:ring-2 focus:ring-[#0998d5]/10
`;

/* ─── Success ─────────────────────────────────────────────────────────────────── */
const SuccessState = memo(({ event, name }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
    >
        {/* Check row */}
        <div className="flex items-start gap-4 p-5 rounded-xl"
            style={{ background: `rgba(${B_RGB},0.05)`, border: `1px solid rgba(${B_RGB},0.14)` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(${B_RGB},0.10)`, border: `1px solid rgba(${B_RGB},0.20)` }}>
                <CheckCircle2 size={18} style={{ color: B }} strokeWidth={1.75} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    You're confirmed, {name}!
                </p>
                <p className="text-xs text-slate-500 dark:text-white/40 mt-1.5 leading-relaxed">
                    Registered for{' '}
                    <span className="font-semibold text-slate-700 dark:text-white/65">{event?.title}</span>.
                    {' '}Check your email for a confirmation.
                </p>
            </div>
        </div>

        {event?.video_streaming_link && (
            <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between px-5 py-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(130deg,#cc0000,#991111)', boxShadow: '0 2px 16px rgba(204,0,0,0.20)' }}>
                <span className="flex items-center gap-2.5"><Video size={14} />Watch Live Stream</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
        )}

        <Link to="/dashboard/events"
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors
                bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]
                text-slate-600 dark:text-white/45">
            <ChevronLeft size={14} />All Events
        </Link>
    </motion.div>
));
SuccessState.displayName = 'SuccessState';

/* ─── Registration Form ───────────────────────────────────────────────────────── */
const RegistrationForm = memo(({ event, onSuccess }) => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
        defaultValues: { first_name: '', last_name: '', email: '', phone: '', attendance_type: 'in_person', note: '' },
    });

    const onSubmit = useCallback(async (data) => {
        try {
            await new Promise(r => setTimeout(r, 1200)); // TODO: replace with mutation
            onSuccess(data);
        } catch {
            Toast.error('Registration failed. Please try again.');
        }
    }, [onSuccess]);

    const mode = watch('attendance_type');

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" required error={errors.first_name?.message}>
                    <input type="text" placeholder="John" className={inputCls}
                        {...register('first_name', { required: 'Required' })} />
                </Field>
                <Field label="Last Name" required error={errors.last_name?.message}>
                    <input type="text" placeholder="Doe" className={inputCls}
                        {...register('last_name', { required: 'Required' })} />
                </Field>
            </div>

            <Field label="Email Address" required error={errors.email?.message}>
                <input type="email" placeholder="you@example.com" className={inputCls}
                    {...register('email', {
                        required: 'Required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })} />
            </Field>

            <Field label="Phone Number" error={errors.phone?.message} hint="Optional — used only for event reminders">
                <input type="tel" placeholder="08012345678" className={inputCls}
                    {...register('phone', {
                        pattern: { value: /^[0-9+\-\s()]{7,15}$/, message: 'Invalid phone number' },
                    })} />
            </Field>

            <Field label="Attendance Mode">
                <div className="grid grid-cols-2 gap-3 mt-1">
                    {[
                        { value: 'in_person', label: 'In Person', Icon: Users },
                        { value: 'online', label: 'Online', Icon: Wifi },
                    ].map(({ value, label, Icon }) => {
                        const on = mode === value;
                        return (
                            <label key={value}
                                className={`relative flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer select-none border transition-all duration-200
                                    ${on
                                        ? 'border-[#0998d5] bg-[#eef8fd] dark:bg-[#0998d5]/[0.09]'
                                        : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-transparent hover:bg-slate-50/80 dark:hover:bg-white/[0.04]'
                                    }`}>
                                <input type="radio" value={value} className="sr-only" {...register('attendance_type')} />
                                <Icon size={14} style={on ? { color: B } : {}} className={on ? '' : 'text-slate-300 dark:text-white/25'} />
                                <span className={`text-sm font-semibold ${on ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/35'}`}>
                                    {label}
                                </span>
                                {on && (
                                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: B }} />
                                )}
                            </label>
                        );
                    })}
                </div>
            </Field>

            <Field label="Message" error={errors.note?.message} hint="Optional — share any questions with the team">
                <textarea rows={3} placeholder="Anything you'd like us to know…"
                    className={`${inputCls} resize-none`}
                    {...register('note', { maxLength: { value: 300, message: 'Max 300 characters' } })} />
            </Field>

            <div className="flex flex-col gap-2.5 pt-1">
                <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.985 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold text-white disabled:opacity-55"
                    style={{
                        background: `linear-gradient(135deg, ${B} 0%, #0568a4 100%)`,
                        boxShadow: `0 4px 24px rgba(${B_RGB},0.28)`,
                    }}>
                    {isSubmitting
                        ? <><Loader2 size={15} className="animate-spin" />Registering…</>
                        : <>Reserve My Spot <ArrowRight size={14} /></>
                    }
                </motion.button>
                <p className="text-center text-[10px] text-slate-400 dark:text-white/20 leading-relaxed">
                    By registering you agree to receive event updates from GCCC Ibadan.
                </p>
            </div>
        </form>
    );
});
RegistrationForm.displayName = 'RegistrationForm';

/* ─── Form Panel ──────────────────────────────────────────────────────────────── */
const FormPanel = memo(({ event, submittedName, onSuccess }) => {
    const isClosed = !event.is_registration_open;
    const heading = submittedName ? 'Registration complete'
        : isClosed ? 'Registration closed'
            : 'Secure your spot';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] shadow-[0_4px_32px_rgba(0,0,0,0.07)] dark:shadow-none"
        >
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02]">
                <span className="block w-[3px] h-[18px] rounded-full shrink-0" style={{ background: B }} />
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{heading}</h2>
                    {!submittedName && !isClosed && (
                        <p className="text-[11px] text-slate-400 dark:text-white/30 mt-1 leading-none">
                            Fields marked <span style={{ color: B }}>*</span> are required
                        </p>
                    )}
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {submittedName ? (
                        <SuccessState key="success" event={event} name={submittedName} />
                    ) : isClosed ? (
                        <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 py-1">
                            <p className="text-sm text-slate-500 dark:text-white/35 leading-relaxed">
                                Registration for this event is no longer available.
                                Please contact us if you have any questions.
                            </p>
                            {event.video_streaming_link && (
                                <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 text-sm font-bold transition-colors"
                                    style={{ color: B }}>
                                    Watch the stream instead
                                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            )}
                        </motion.div>
                    ) : (
                        <RegistrationForm key="form" event={event} onSuccess={onSuccess} />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});
FormPanel.displayName = 'FormPanel';

/* ─── Event Info ──────────────────────────────────────────────────────────────── */
const EventInfo = memo(({ event }) => {
    const start = fmtTime(event.start_time) || event.time;
    const end = fmtTime(event.end_time);
    const time = end ? `${start} – ${end}` : start;

    const meta = [
        { Icon: Calendar, label: event.date },
        { Icon: Clock, label: time },
        { Icon: MapPin, label: event.location },
    ].filter(m => m.label);

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
        >
            {/* Meta row */}
            <div className="flex flex-wrap gap-x-7 gap-y-3">
                {meta.map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                            bg-slate-50 dark:bg-white/[0.05]
                            border border-slate-200 dark:border-white/[0.08]">
                            <Icon size={12} style={{ color: B }} />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-white/50 font-medium">{label}</span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />

            {/* Description */}
            {event.description && (
                <div className="flex flex-col gap-4">
                    {event.description.split('\n').filter(Boolean).map((p, i) => (
                        <p key={i} className="text-[15px] leading-[1.85] text-slate-600 dark:text-white/[0.46] max-w-prose">
                            {p}
                        </p>
                    ))}
                </div>
            )}

            {/* Stream CTA */}
            {event.has_streaming && event.video_streaming_link && (
                <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer"
                    className="group self-start inline-flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                        bg-slate-900 hover:bg-slate-800 dark:bg-white/[0.07] dark:hover:bg-white/[0.12]
                        text-white border border-slate-800 dark:border-white/[0.08]">
                    <Video size={13} />
                    Watch Live Stream
                </a>
            )}

            {/* Deadline */}
            {event.registration_deadline && (
                <div className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                    bg-amber-50 dark:bg-amber-400/[0.07]
                    border border-amber-100 dark:border-amber-400/[0.15]
                    text-amber-700 dark:text-amber-400">
                    <AlertCircle size={12} className="shrink-0" />
                    Registration closes{' '}
                    {new Date(event.registration_deadline).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                    })}
                </div>
            )}
        </motion.div>
    );
});
EventInfo.displayName = 'EventInfo';

/* ─── Error State ─────────────────────────────────────────────────────────────── */
const ErrorState = memo(() => (
    <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center
            bg-slate-100 dark:bg-white/[0.05]
            border border-slate-200 dark:border-white/[0.08]">
            <AlertCircle size={22} className="text-slate-400 dark:text-white/30" strokeWidth={1.4} />
        </div>
        <div className="flex flex-col gap-1.5">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Event not found</p>
            <p className="text-sm text-slate-400 dark:text-white/30 max-w-xs leading-relaxed mx-auto">
                This link may be invalid or the event has been removed.
            </p>
        </div>
        <Link to="/dashboard/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
                text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft size={14} />Browse all events
        </Link>
    </div>
));
ErrorState.displayName = 'ErrorState';

/* ─── Page ────────────────────────────────────────────────────────────────────── */
const EventRegistration = () => {
    const { eventId } = useParams();
    const { data, isLoading, isError } = useEvent(eventId);
    const [submittedName, setSubmittedName] = useState(null);

    const event = Array.isArray(data?.data) ? data.data[0] : (data?.data ?? null);
    const handleSuccess = useCallback((d) => setSubmittedName(d.first_name), []);

    if (isLoading) return <Skeleton />;

    return (
        <main>
            <PageHeader
                backTo="/dashboard/events"
                backLabel="Events"
                eyebrow="Event Registration"
                title={event?.title ?? '—'}
                right={event && <StatusPill status={event.status} />}
            />
            {(isError || !event) ? <ErrorState /> : (
                <>
                    {/* Hero image — full width inside the container */}
                    {event.image && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/[0.04] mb-12"
                            style={{ aspectRatio: '16/7' }}
                        >
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                            {/* Subtle vignette — no hard fade, just depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                        </motion.div>
                    )}

                    {/* Two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start pb-16">
                        <EventInfo event={event} />
                        <FormPanel event={event} submittedName={submittedName} onSuccess={handleSuccess} />
                    </div>
                </>
            )}
        </main>
    );
};

export default EventRegistration;