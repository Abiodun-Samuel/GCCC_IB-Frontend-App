import { useState, useCallback, useMemo } from 'react';
import {
    CalendarDays,
    Clock,
    MapPin,
    Radio,
    Video,
    ExternalLink,
    ChevronRight,
    Layers,
    CheckCircle2,
    Timer,
    CalendarClock,
    Globe,
    Mic,
    X,
    Play,
} from 'lucide-react';
import { Tabs } from '@/components/ui/tab/Tabs';
import Modal from '@/components/ui/modal/Modal';
import { useModal } from '@/hooks/useModal';
import { useEvents } from '@/queries/events.query';
import Animated from '@/components/common/Animated';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_TABS = [
    { key: 'all', label: 'All Events', icon: Layers },
    { key: 'ongoing', label: 'Ongoing', icon: Timer },
    { key: 'upcoming', label: 'Upcoming', icon: CalendarClock },
    { key: 'past', label: 'Past', icon: CheckCircle2 },
];

const STATUS_STYLES = {
    ongoing: {
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700',
        dot: 'bg-emerald-500',
        pulse: true,
        label: 'Live Now',
    },
    upcoming: {
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 ring-1 ring-indigo-300 dark:ring-indigo-700',
        dot: 'bg-indigo-500',
        pulse: false,
        label: 'Upcoming',
    },
    past: {
        badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-400 ring-1 ring-gray-300 dark:ring-gray-600',
        dot: 'bg-gray-400',
        pulse: false,
        label: 'Ended',
    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.past;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
            <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${style.dot} opacity-75 ${style.pulse ? 'animate-ping' : ''}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
            </span>
            {style.label}
        </span>
    );
};

const MetaItem = ({ icon: Icon, children, className = '' }) => (
    <span className={`flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-400 dark:text-indigo-500" />
        <span className="truncate">{children}</span>
    </span>
);

const StreamingBadge = ({ hasAudio, hasVideo }) => {
    if (!hasAudio && !hasVideo) return null;
    return (
        <div className="flex gap-1.5">
            {hasVideo && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800">
                    <Video className="w-3 h-3" /> Video
                </span>
            )}
            {hasAudio && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 ring-1 ring-sky-200 dark:ring-sky-800">
                    <Mic className="w-3 h-3" /> Audio
                </span>
            )}
        </div>
    );
};

// ─── Event Card ───────────────────────────────────────────────────────────────

const EventCard = ({ event, onViewDetails }) => {
    const isPast = event.status === 'past';

    return (
        <div
            className={`
        group relative flex flex-col bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden
        border border-gray-100 dark:border-gray-700/60
        shadow-sm hover:shadow-xl dark:hover:shadow-black/30
        transition-all duration-500 ease-out
        hover:-translate-y-1
        ${isPast ? 'opacity-80 hover:opacity-100' : ''}
      `}
        >
            {/* Image */}
            <div className="relative overflow-hidden h-44 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950">
                {event.image ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isPast ? 'grayscale-[40%]' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <CalendarDays className="w-12 h-12 text-indigo-300 dark:text-indigo-700" />
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Status badge top-right */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={event.status} />
                </div>

                {/* Streaming badges bottom-left */}
                {event.has_streaming && (
                    <div className="absolute bottom-3 left-3">
                        <StreamingBadge
                            hasAudio={!!event.audio_streaming_link}
                            hasVideo={!!event.video_streaming_link}
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                    {event.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {event.description}
                </p>

                <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/60">
                    <MetaItem icon={CalendarDays}>{event.date}</MetaItem>
                    <MetaItem icon={Clock}>{event.time}</MetaItem>
                    <MetaItem icon={MapPin}>{event.location}</MetaItem>
                </div>

                {/* CTA */}
                <button
                    onClick={() => onViewDetails(event)}
                    className="
            mt-2 w-full flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500
            text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/40
            transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30
            active:scale-95
          "
                >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─── Event Detail Modal Content ───────────────────────────────────────────────

const EventDetailContent = ({ event }) => {
    if (!event) return null;

    const hasStreaming = event.has_streaming;

    return (
        <div className="flex flex-col gap-6">
            {/* Hero Image */}
            {event.image && (
                <div className="relative -mx-6 -mt-6 h-52 overflow-hidden rounded-t-lg">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <StatusBadge status={event.status} />
                    </div>
                </div>
            )}

            {/* Title & Description */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: CalendarDays, label: 'Date', value: event.date },
                    { icon: Clock, label: 'Time', value: event.time },
                    { icon: MapPin, label: 'Location', value: event.location },
                    event.end_date && { icon: CalendarDays, label: 'End Date', value: event.end_date },
                ].filter(Boolean).map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 shrink-0">
                            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration */}
            {event.is_registration_open && event.registration_link && (
                <div className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Registration Open</span>
                    </div>
                    {event.registration_deadline && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-500">Deadline: {event.registration_deadline}</p>
                    )}
                    <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                        Register Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            )}

            {/* Streaming Links */}
            {hasStreaming && (
                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        <Radio className="w-3.5 h-3.5 inline mr-1.5 text-indigo-400" />
                        Live Streaming
                    </h4>
                    <div className="flex flex-col gap-2">
                        {event.video_streaming_link && (
                            <a
                                href={event.video_streaming_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  flex items-center gap-3 p-3 rounded-xl
                  bg-purple-50 dark:bg-purple-900/20
                  border border-purple-200 dark:border-purple-800
                  hover:bg-purple-100 dark:hover:bg-purple-900/40
                  transition-colors group/link
                "
                            >
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/60">
                                    <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Watch Live</p>
                                    <p className="text-xs text-purple-500 dark:text-purple-500 truncate">{event.video_streaming_link}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-purple-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                        )}
                        {event.audio_streaming_link && event.audio_streaming_link !== event.video_streaming_link && (
                            <a
                                href={event.audio_streaming_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  flex items-center gap-3 p-3 rounded-xl
                  bg-sky-50 dark:bg-sky-900/20
                  border border-sky-200 dark:border-sky-800
                  hover:bg-sky-100 dark:hover:bg-sky-900/40
                  transition-colors group/link
                "
                            >
                                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/60">
                                    <Mic className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">Listen Live</p>
                                    <p className="text-xs text-sky-500 dark:text-sky-500 truncate">{event.audio_streaming_link}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-sky-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ status }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
        <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600">
            <CalendarDays className="w-10 h-10" />
        </div>
        <div className="text-center">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No {status === 'all' ? '' : status} events found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later for updates.</p>
        </div>
    </div>
);

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

const EventCardSkeleton = () => (
    <div className="flex flex-col bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-sm animate-pulse">
        <div className="h-44 bg-gray-200 dark:bg-gray-700" />
        <div className="p-5 flex flex-col gap-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
            <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3" />
                ))}
            </div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-2" />
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const EventsList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { isOpen, openModal, closeModal } = useModal(false);

    const { data, isLoading, isError } = useEvents();

    const events = data?.data ?? [];

    // Derive tab counts
    const tabsWithCounts = useMemo(() => {
        return STATUS_TABS.map((tab) => ({
            ...tab,
            count:
                tab.key === 'all'
                    ? events.length
                    : events.filter((e) => e.status === tab.key).length,
        }));
    }, [events]);

    // Filter events by active tab
    const filteredEvents = useMemo(() => {
        if (activeTab === 'all') return events;
        return events.filter((e) => e.status === activeTab);
    }, [events, activeTab]);

    const handleViewDetails = useCallback(
        (event) => {
            setSelectedEvent(event);
            openModal();
        },
        [openModal]
    );

    const handleCloseModal = useCallback(() => {
        closeModal();
        // Delay clearing so modal exit animation can play
        setTimeout(() => setSelectedEvent(null), 300);
    }, [closeModal]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* ── Header ── */}
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-indigo-100/60 dark:bg-indigo-900/20 blur-3xl" />
                <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full bg-purple-100/60 dark:bg-purple-900/20 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-1 rounded-full ring-1 ring-indigo-200 dark:ring-indigo-800">
                                    <CalendarDays className="w-3 h-3" />
                                    Events
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                Church Events
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Stay updated with all upcoming, ongoing and past events.
                            </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                            <span>{events.filter((e) => e.status === 'ongoing').length} Live Events</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

                {/* Tabs */}
                <Tabs
                    tabs={tabsWithCounts}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="!border-b-0 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700"
                />

                {/* Error */}
                {isError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
                        <X className="w-4 h-4 shrink-0" />
                        Failed to load events. Please try again later.
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
                    ) : filteredEvents.length === 0 ? (
                        <EmptyState status={activeTab} />
                    ) : (
                        filteredEvents.map((event, index) => (
                            <Animated
                                key={event.id}
                                animation="fade"
                                duration={0.4}
                                delay={index * 0.07}
                            >
                                <EventCard event={event} onViewDetails={handleViewDetails} />
                            </Animated>
                        ))
                    )}
                </div>
            </div>

            {/* ── Event Detail Modal ── */}
            <Modal
                isOpen={isOpen}
                onClose={handleCloseModal}
                title={selectedEvent?.title ?? ''}
                maxWidth="max-w-2xl"
            >
                <EventDetailContent event={selectedEvent} />
            </Modal>
        </div>
    );
};

export default EventsList;