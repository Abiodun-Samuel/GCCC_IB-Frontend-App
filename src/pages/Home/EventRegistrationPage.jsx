import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    User,
    Phone,
    MessageCircle,
    Mail,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Sparkles,
    Heart,
    ChevronRight,
    Star,
    Users,
    TrendingUp,
    Zap,
    Lock,
    Bus,
    Shirt,
} from "lucide-react";
import Button from "@/components/ui/Button";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import RadioForm from "@/components/form/useForm/RadioForm";
import InputForm from "@/components/form/useForm/InputForm";
import { EventRegistrationSchema } from "@/schema";
import { useAdminRegistrations, useCreateRegistration } from "@/queries/registration.query";
import Message from "@/components/common/Message";

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────
const Shimmer = ({ className = "" }) => (
    <div className={`relative overflow-hidden rounded-lg bg-white/[0.06] ${className}`}>
        <div
            className="absolute inset-0"
            style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
                animation: "skeleton-sweep 1.6s ease-in-out infinite",
            }}
        />
    </div>
);

// ─── Keyframes ────────────────────────────────────────────────────────────────
const STYLES = `
    @keyframes sweep {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes barGrow {
        from { width: 0%; }
    }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const CapacityTrackerSkeleton = () => (
    <>
        <style>{STYLES}</style>
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-6">

                {/* Left: label + bar */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <Shimmer className="h-4 w-32 rounded-full" />
                        <Shimmer className="h-6 w-24 rounded-full" />
                    </div>
                    <Shimmer className="h-3 w-full rounded-full" />
                    <div className="flex justify-between">
                        <Shimmer className="h-3 w-28 rounded-full" />
                        <Shimmer className="h-3 w-16 rounded-full" />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-16 bg-white/10" />

                {/* Right: two stat pills */}
                <div className="flex sm:flex-col gap-3">
                    <Shimmer className="h-14 w-32 rounded-xl" />
                    <Shimmer className="h-14 w-32 rounded-xl" />
                </div>
            </div>
        </div>
    </>
);

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter = ({ to, duration = 900 }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const tick = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [to, duration]);
    return <>{val}</>;
};

// ─── Capacity Tracker ─────────────────────────────────────────────────────────
const CapacityTracker = ({ data, isLoading }) => {
    const [barReady, setBarReady] = useState(false);

    useEffect(() => {
        if (data) {
            const t = setTimeout(() => setBarReady(true), 80);
            return () => clearTimeout(t);
        }
    }, [data]);

    if (isLoading || !data) return <CapacityTrackerSkeleton />;

    const { total_registered = 0, max_capacity = 0, available_slots = 0 } = data;
    const pct = max_capacity > 0 ? Math.min(100, Math.round((total_registered / max_capacity) * 100)) : 0;

    // Tier
    const tier = pct >= 85 ? "hot" : pct >= 55 ? "warm" : "cool";
    const T = {
        hot: { c1: "#eb2225", c2: "#ff6060", badge: "bg-red-500/20 text-red-300 border-red-500/30", label: "Almost Full", Icon: Lock },
        warm: { c1: "#f59e0b", c2: "#fcd34d", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30", label: "Going Fast", Icon: TrendingUp },
        cool: { c1: "#119bd6", c2: "#38bdf8", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30", label: "Spots Open", Icon: Zap },
    }[tier];

    const slotsColor = tier === "hot" ? "#fb7185" : tier === "warm" ? "#fcd34d" : "#34d399";

    return (
        <>
            <style>{STYLES}</style>

            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden"
                style={{ animation: "fadeUp 0.4s ease both" }}>

                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-6">

                    {/* ── Left: title + bar ──────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* Row: title + badge */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-white/60" strokeWidth={1.8} />
                                <span className="text-sm font-semibold text-white/80 tracking-wide">
                                    Event Capacity
                                </span>
                            </div>

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${T.badge}`}>
                                <T.Icon className="w-3 h-3" strokeWidth={2.5} />
                                {T.label}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-3 rounded-full bg-white/10 overflow-hidden mb-3">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{
                                    width: barReady ? `${pct}%` : "0%",
                                    background: `linear-gradient(90deg, ${T.c1}, ${T.c2})`,
                                    transition: "width 1.1s cubic-bezier(0.34, 1.2, 0.64, 1)",
                                    boxShadow: `0 0 14px ${T.c1}99`,
                                }}
                            />
                        </div>

                        {/* Bar footnote */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/55">
                                <span className="font-bold text-white">{total_registered}</span> of{" "}
                                <span className="font-bold text-white">{max_capacity}</span> seats filled
                            </span>
                            <span className="text-xs font-black" style={{ color: T.c2 }}>
                                {pct}%
                            </span>
                        </div>
                    </div>

                    {/* Vertical divider */}
                    <div className="hidden sm:block w-px self-stretch bg-white/10" />

                    {/* ── Right: stat pills ──────────────────── */}
                    <div className="flex sm:flex-col gap-3 shrink-0">

                        {/* Registered */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 min-w-[130px]">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-sky-300" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-white/50 leading-none mb-1">Registered</p>
                                <p className="text-xl font-black text-white leading-none tabular-nums">
                                    <Counter to={total_registered} />
                                </p>
                            </div>
                        </div>

                        {/* Available */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 min-w-[130px]">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${slotsColor}22` }}>
                                <Zap className="w-4 h-4" style={{ color: slotsColor }} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-white/50 leading-none mb-1">Available</p>
                                <p className="text-xl font-black leading-none tabular-nums" style={{ color: slotsColor }}>
                                    <Counter to={available_slots} />
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ name }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-[#119bd6]/10 border border-[#119bd6]/25 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#119bd6]" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#eb2225] to-[#d41e21] flex items-center justify-center shadow-lg shadow-[#eb2225]/40">
                <Star className="w-3 h-3 text-white fill-white" />
            </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">You're In!</h3>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
            Thank you,{" "}
            <span className="font-semibold text-[#119bd6]">{name}</span>. We'll see
            you at <em className="text-gray-700">The Call To Meet The One</em>.
        </p>

        <div className="w-full space-y-2">
            {[
                { icon: Calendar, label: "Date", value: "Sunday, 22nd February" },
                { icon: Clock, label: "Time", value: "5:00 PM" },
                { icon: MapPin, label: "Venue", value: "28 Efon Alaye Sule Abore, Lagos" },
                { icon: Bus, label: "Departure", value: "2:00 PM from Church" },
                { icon: Shirt, label: "Dress Code", value: "Shades of Brown" },
            ].map(({ icon: Icon, label, value }) => (
                <div
                    key={label}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                    <Icon className="w-4 h-4 text-[#119bd6] shrink-0" strokeWidth={1.8} />
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
                        <p className="text-sm font-medium text-gray-700">{value}</p>
                    </div>
                </div>
            ))}
        </div>

        <Button className="w-full mt-4" onClick={() => window.location.reload()}>Completed</Button>
    </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function EventRegistrationPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submittedName, setSubmittedName] = useState("");
    const { data, isLoading } = useAdminRegistrations();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(EventRegistrationSchema) });

    const { mutate: createRegistration, isPending, isError, error } = useCreateRegistration({
        onSuccess: (data) => {
            setSubmitted(true);
            reset();
        },
    });

    const onSubmit = async (data) => {
        setSubmittedName(data.fullName.split(" ")[0]);
        createRegistration({
            title: 'The Call To Meet The One',
            full_name: data.fullName,
            email: data.email,
            phone_number: data.phoneNumber,
            whatsapp_number: data.whatsappNumber || data.phoneNumber,
            attending: data.attending,
        });
    };

    return (
        <HomepageComponentCard>
            <div className="max-w-7xl mx-auto px-5">
                <div className="mb-10 relative rounded-2xl overflow-hidden group cursor-default">
                    {/* Glow border */}
                    <div
                        className="absolute -inset-px rounded-2xl blur-sm opacity-60"
                        style={{
                            background: "linear-gradient(135deg, rgba(17,155,214,0.5) 0%, rgba(235,34,37,0.35) 100%)",
                        }}
                    />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                        <img
                            src="/images/the_one.jpeg"
                            alt="The Call To Meet The One – Toyosi Oseni"
                            className="w-full object-cover max-h-64 sm:max-h-[400px] object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#24244e]/90 via-[#24244e]/20 to-transparent" />

                        {/* Bottom pills */}
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                            {[
                                { icon: Calendar, text: "Sunday, 22nd Feb" },
                                { icon: Clock, text: "5:00 PM" },
                                { icon: MapPin, text: "Lagos" },
                            ].map(({ icon: Icon, text }) => (
                                <span
                                    key={text}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 backdrop-blur-md border border-white/15"
                                >
                                    <Icon className="w-3.5 h-3.5 shrink-0 text-[#119bd6]" />
                                    {text}
                                </span>
                            ))}
                        </div>

                        {/* Speaker badge top-right */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="text-xs font-bold text-white">Toyosi Oseni</span>
                        </div>
                    </div>
                </div>

                {/* ── Capacity Tracker ─────────────────────────────────── */}
                <CapacityTracker data={data?.data} isLoading={isLoading} />

                {/* ── Two-column Layout ─────────────────────────────────── */}
                <div className="grid lg:grid-cols-[1fr_1.7fr] gap-8 lg:gap-10 items-start">

                    {/* ── Left: Event Info ──────────────────────────────── */}
                    <div className="space-y-6 lg:sticky lg:top-8">

                        {/* Title */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eb2225]/10 border border-[#eb2225]/20 mb-4">
                                <Heart className="w-3.5 h-3.5 text-[#eb2225] fill-[#eb2225]" />
                                <span className="text-xs font-bold text-[#eb2225] uppercase tracking-widest">
                                    Special Event
                                </span>
                            </div>
                            <p className="text-xs font-medium text-white/35 uppercase tracking-[0.15em] mb-1">
                                The Call To Meet
                            </p>
                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
                                The{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #119bd6 0%, #eb2225 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    One
                                </span>
                            </h1>
                            <p className="mt-3 text-sm text-white/35 leading-relaxed">
                                Fill this form to indicate your interest.
                            </p>
                        </div>

                        {/* Detail Cards */}
                        <div className="space-y-2">
                            {[
                                { icon: Calendar, label: "Date", value: "Sunday, 22nd February", accent: "#119bd6" },
                                { icon: Clock, label: "Time", value: "5:00 PM", accent: "#eb2225" },
                                { icon: MapPin, label: "Venue", value: "28 Efon Alaye Sule Abore, Lagos", accent: "#119bd6" },
                                { icon: Bus, label: "Departure", value: "2:00 PM from Church", accent: "#eb2225" },
                                { icon: Shirt, label: "Dress Code", value: "Shades of Brown", accent: "#119bd6" },
                            ].map(({ icon: Icon, label, value, accent }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-white/12 hover:bg-white/[0.06] transition-all duration-200"
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: `${accent}18` }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.8} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">
                                            {label}
                                        </p>
                                        <p className="text-sm font-medium text-white/70">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* ── Right: Form Card ──────────────────────────────── */}
                    <div className="relative">
                        {/* Ambient glow */}
                        <div
                            className="absolute -inset-px rounded-2xl opacity-40 blur-lg"
                            style={{
                                background: "linear-gradient(135deg, rgba(17,155,214,0.4) 0%, rgba(235,34,37,0.25) 100%)",
                            }}
                        />

                        <div className="relative bg-white/[0.05] backdrop-blur-2xl rounded-2xl border border-white/[0.09] overflow-hidden shadow-2xl shadow-black/50">

                            {/* Top shimmer */}
                            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                            {/* Card Header */}
                            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-white/[0.07]">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #119bd6, #0d8ac0)", boxShadow: "0 4px 14px rgba(17,155,214,0.4)" }}
                                    >
                                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">Register Your Interest</h2>
                                        <p className="text-xs text-white/30">Takes less than a minute</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 sm:px-8 py-7 bg-white">
                                {submitted ? (
                                    <SuccessScreen name={submittedName} />
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                                        {isError && error && (
                                            <Message variant="error" data={error?.data} />
                                        )}

                                        <InputForm
                                            label="Full Name"
                                            name="fullName"
                                            register={register}
                                            error={errors.fullName?.message}
                                            placeholder="e.g. Adaeze Johnson"
                                            required
                                            icon={<User className="w-4 h-4" strokeWidth={1.8} />}
                                        />

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <InputForm
                                                label="Phone Number"
                                                name="phoneNumber"
                                                type="tel"
                                                register={register}
                                                error={errors.phoneNumber?.message}
                                                placeholder="+234 800 000 0000"
                                                required
                                                icon={<Phone className="w-4 h-4" strokeWidth={1.8} />}
                                            />
                                            <InputForm
                                                label="WhatsApp Number"
                                                name="whatsappNumber"
                                                type="tel"
                                                register={register}
                                                error={errors.whatsappNumber?.message}
                                                placeholder="If different"
                                                icon={<MessageCircle className="w-4 h-4" strokeWidth={1.8} />}
                                            />
                                        </div>

                                        <InputForm
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            register={register}
                                            error={errors.email?.message}
                                            placeholder="you@example.com"
                                            required
                                            icon={<Mail className="w-4 h-4" strokeWidth={1.8} />}
                                        />

                                        <div className="border-t border-gray-100" />

                                        <RadioForm
                                            label="Will you be attending the meeting?"
                                            name="attending"
                                            register={register}
                                            error={errors.attending?.message}
                                            required
                                            options={[
                                                { value: true, label: "Yes, I'll be there 🙌" },
                                                { value: false, label: "No, I can't make it" },
                                            ]}
                                            layout="grid"
                                        />

                                        <Button
                                            type="submit"
                                            color="green"
                                            loading={isPending}
                                            disabled={isPending}
                                            className="w-full !h-12 !rounded-xl"
                                            endIcon={<ChevronRight className="w-4 h-4" strokeWidth={2.5} />}
                                        >
                                            {isPending ? 'Submitting...' : 'Submit Registration'}
                                        </Button>

                                        <p className="text-center text-xs text-gray-500 leading-relaxed">
                                            Your details are kept confidential and will only be used
                                            to communicate event information.
                                        </p>
                                    </form>
                                )}
                            </div>

                            {/* Bottom shimmer */}
                            <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                        </div>
                    </div>

                </div>
            </div>
        </HomepageComponentCard>
    );
}