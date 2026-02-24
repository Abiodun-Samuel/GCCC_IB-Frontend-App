// ─── EventsManagement.jsx ────────────────────────────────────────────────────
// Fully refactored event management system
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Plus, Search, Pencil, Trash2, MapPin, Clock,
    Link2, Radio, Video, AlertTriangle, ImageIcon, X, Upload,
    Filter, CalendarDays, Activity, TrendingUp, Users,
    ExternalLink, ArrowUpDown, ChevronDown,
} from 'lucide-react';

import InputForm from '@/components/form/useForm/InputForm';
import DateForm from '@/components/form/useForm/DateForm';
import SingleSelectForm from '@/components/form/useForm/SingleSelectForm';
import Modal from '@/components/ui/modal/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Paginator from '@/components/common/Paginator';
import { useModal } from '@/hooks/useModal';
import {
    useEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
} from '@/queries/events.query';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: 'upcoming', text: 'Upcoming' },
    { value: 'ongoing', text: 'Ongoing' },
    { value: 'past', text: 'Past' },
];

const ORDER_OPTIONS = [
    { value: 'asc', text: 'Date: Oldest first' },
    { value: 'desc', text: 'Date: Newest first' },
];

const PER_PAGE_OPTIONS = [
    { value: '10', text: '10 / page' },
    { value: '15', text: '15 / page' },
    { value: '25', text: '25 / page' },
    { value: '50', text: '50 / page' },
];

const STATUS_BADGE = {
    upcoming: { color: 'primary', label: 'Upcoming' },
    ongoing: { color: 'success', label: 'Ongoing' },
    past: { color: 'light', label: 'Past' },
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// ─── Yup Schemas ──────────────────────────────────────────────────────────────

const nullableUrl = yup
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v))
    .url('Must be a valid URL');

const nullableString = yup
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === '' ? null : v));

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeField = (label) =>
    yup
        .string()
        .nullable()
        .optional()
        .transform((v) => {
            if (!v || v === '') return null;
            const parts = v.split(':');
            return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : v;
        })
        .test('hh-mm', `${label} must be in HH:MM format.`, (v) =>
            !v ? true : HH_MM_REGEX.test(v)
        );

const baseShape = {
    title: yup
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title is too long')
        .required('Title is required'),

    description: yup
        .string()
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),

    start_date: yup.string().required('Start date is required'),

    end_date: nullableString.test(
        'end-after-start',
        'End date must be on or after start date',
        function (val) {
            const { start_date } = this.parent;
            if (!val || !start_date) return true;
            return new Date(val) >= new Date(start_date);
        }
    ),

    start_time: yup
        .string()
        .nullable()
        .transform((v) => {
            if (!v || v === '') return null;
            const parts = v.split(':');
            return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : v;
        })
        .required('Start time is required')
        .matches(HH_MM_REGEX, 'Start time must be in HH:MM format.'),

    end_time: timeField('End time').test(
        'end-after-start-time',
        'End time must be after start time',
        function (val) {
            const { start_time, start_date, end_date } = this.parent;
            if (!val || !start_time) return true;
            if (end_date && start_date && end_date !== start_date) return true;
            return val > start_time;
        }
    ),

    location: yup
        .string()
        .trim()
        .max(255)
        .required('Location is required'),

    status: yup
        .string()
        .oneOf(['upcoming', 'ongoing', 'past'])
        .required('Status is required'),

    registration_link: nullableUrl,
    registration_deadline: nullableString,
    audio_streaming_link: nullableUrl,
    video_streaming_link: nullableUrl,
};

const createEventSchema = yup.object(baseShape);
const updateEventSchema = yup.object(baseShape);

// ─── Utility Helpers ──────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
};

const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(+h, +m);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const toHHMM = (val) => {
    if (!val) return '';
    const parts = String(val).split(':');
    return parts.length >= 2
        ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
        : val;
};

const normalizeEventForForm = (event) => ({
    ...event,
    start_time: toHHMM(event.start_time),
    end_time: toHHMM(event.end_time),
    image: event.image ?? null,
    location: event.location ?? '',
    registration_link: event.registration_link ?? '',
    audio_streaming_link: event.audio_streaming_link ?? '',
    video_streaming_link: event.video_streaming_link ?? '',
    registration_deadline: event.registration_deadline ?? '',
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
);

const SkeletonRow = memo(() => (
    <tr className="border-b border-gray-100 dark:border-gray-700/50">
        <td className="px-4 py-3.5"><div className="flex items-center gap-3"><Pulse className="w-9 h-9 rounded-lg flex-shrink-0" /><div className="space-y-1.5"><Pulse className="h-3.5 w-36" /><Pulse className="h-2.5 w-24" /></div></div></td>
        {[80, 90, 70, 60, 80, 70].map((w, i) => (
            <td key={i} className="px-4 py-3.5"><Pulse className="h-3.5" style={{ width: w }} /></td>
        ))}
        <td className="px-4 py-3.5"><div className="flex gap-1.5">{[1, 2, 3].map(i => <Pulse key={i} className="w-8 h-8 rounded-lg" />)}</div></td>
    </tr>
));

const SkeletonTable = memo(() => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div><Pulse className="h-6 w-32 mb-1" /><Pulse className="h-4 w-52" /></div>
            <Pulse className="h-9 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3"><Pulse className="w-11 h-11 rounded-xl" /><div className="space-y-1.5"><Pulse className="h-3 w-16" /><Pulse className="h-6 w-10" /></div></div>)}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-200 dark:border-gray-700 flex gap-3"><Pulse className="h-9 flex-1 max-w-xs rounded-lg" /><Pulse className="h-9 w-28 rounded-lg" /><Pulse className="h-9 w-36 rounded-lg" /><Pulse className="h-9 w-28 rounded-lg" /></div>
            <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">{Array.from({ length: 8 }).map((_, i) => <th key={i} className="px-4 py-3"><Pulse className="h-3 w-16" /></th>)}</tr></thead><tbody>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</tbody></table>
        </div>
    </div>
));

// ─── Stats Card ───────────────────────────────────────────────────────────────

const STAT_COLORS = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    slate: 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400',
};

const StatsCard = memo(({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-sm">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${STAT_COLORS[color]}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
        </div>
    </div>
));

// ─── Image Upload ──────────────────────────────────────────────────────────────

const ImageUpload = memo(({ value, onChange, error }) => {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFile = useCallback(async (file) => {
        setUploadError('');
        if (!file.type.startsWith('image/')) { setUploadError('Please select a valid image file.'); return; }
        if (file.size > MAX_IMAGE_SIZE_BYTES) { setUploadError('Image must be under 2 MB.'); return; }
        const base64 = await fileToBase64(file);
        onChange(base64);
    }, [onChange]);

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Event Image</label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                className={`relative rounded-xl border-2 border-dashed transition-colors duration-200 overflow-hidden
          ${dragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
          ${error || uploadError ? 'border-red-400' : ''}`}
            >
                {value ? (
                    <div className="relative h-40">
                        <img src={value} alt="Event preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white transition-colors"><Upload size={12} />Change</button>
                            <button type="button" onClick={() => onChange(null)} className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-600 transition-colors"><X size={12} />Remove</button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()} className="w-full py-8 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl"><ImageIcon size={22} /></div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drop image here or click to upload</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG, WEBP — max 2 MB</p>
                        </div>
                    </button>
                )}
                <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} className="hidden" />
            </div>
            {(uploadError || error) && <p className="text-xs text-red-500 dark:text-red-400">{uploadError || error}</p>}
        </div>
    );
});

// ─── Minor Form Helpers ────────────────────────────────────────────────────────

const TextareaForm = memo(({ label, name, register, error, placeholder, required, disabled, rows = 3 }) => (
    <div className="w-full">
        {label && (
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
        )}
        <textarea
            id={name} rows={rows} disabled={disabled} placeholder={placeholder}
            {...register(name, { required: required ? `${label || 'This field'} is required` : false })}
            className={`w-full text-sm rounded-lg px-4 py-2.5 resize-none transition-colors duration-200
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
        border focus:outline-none focus:ring-1
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-500'}
        ${disabled ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60' : ''}`}
        />
        {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400" role="alert">{error}</p>}
    </div>
));

const TimeForm = memo(({ label, name, register, error, required, disabled }) => (
    <div className="w-full">
        {label && (
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
        )}
        <input
            id={name} type="time" disabled={disabled}
            {...register(name)}
            className={`w-full text-sm rounded-lg px-4 py-2.5 transition-colors duration-200
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        border focus:outline-none focus:ring-1
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-500'}
        ${disabled ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60' : ''}`}
        />
        {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
));

const SectionLabel = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mt-5 mb-3">
        <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <Icon size={12} className="text-blue-500 dark:text-blue-400" />
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
);

// ─── Event Form ────────────────────────────────────────────────────────────────

const EventForm = memo(({ defaultValues, onSubmit, isLoading, isEdit = false }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(isEdit ? updateEventSchema : createEventSchema),
        defaultValues: defaultValues ?? { status: 'upcoming' },
    });

    const imageValue = watch('image');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <ImageUpload
                value={imageValue}
                onChange={(val) => setValue('image', val, { shouldValidate: true })}
                error={errors.image?.message}
            />

            <SectionLabel icon={CalendarDays} label="Event Details" />
            <InputForm label="Title" name="title" register={register} error={errors.title?.message} placeholder="e.g. Apostolic Summit 2026" required />
            <TextareaForm label="Description" name="description" register={register} error={errors.description?.message} placeholder="Describe the event..." required rows={3} />

            <SectionLabel icon={Clock} label="Schedule" />
            <div className="grid grid-cols-2 gap-3">
                <DateForm label="Start Date" name="start_date" register={register} error={errors.start_date?.message} required />
                <DateForm label="End Date" name="end_date" register={register} error={errors.end_date?.message} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <TimeForm label="Start Time" name="start_time" register={register} error={errors.start_time?.message} required />
                <TimeForm label="End Time" name="end_time" register={register} error={errors.end_time?.message} />
            </div>

            <SectionLabel icon={MapPin} label="Location & Status" />
            <div className="grid grid-cols-2 gap-3">
                <InputForm
                    label="Location" name="location" register={register}
                    error={errors.location?.message} placeholder="e.g. GCCC Ibadan" required
                />
                <SingleSelectForm
                    label="Status" name="status" options={STATUS_OPTIONS}
                    register={register} setValue={setValue}
                    error={errors.status?.message} required
                    defaultValue={defaultValues?.status ?? 'upcoming'}
                    searchable={false}
                />
            </div>

            <SectionLabel icon={Link2} label="Registration" />
            <div className="grid grid-cols-2 gap-3">
                <InputForm label="Registration Link" name="registration_link" register={register} error={errors.registration_link?.message} placeholder="https://..." />
                <DateForm label="Registration Deadline" name="registration_deadline" register={register} error={errors.registration_deadline?.message} />
            </div>

            <SectionLabel icon={Radio} label="Streaming" />
            <InputForm label="Audio Stream URL" name="audio_streaming_link" register={register} error={errors.audio_streaming_link?.message} placeholder="https://..." />
            <InputForm label="Video Stream URL" name="video_streaming_link" register={register} error={errors.video_streaming_link?.message} placeholder="https://youtube.com/..." />

            <div className="pt-3">
                <Button type="submit" variant="primary" loading={isLoading} className="w-full">
                    {isEdit ? 'Update Event' : 'Create Event'}
                </Button>
            </div>
        </form>
    );
});

// ─── Delete Modal ──────────────────────────────────────────────────────────────

const DeleteModal = memo(({ isOpen, onClose, onConfirm, eventTitle, isLoading }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={26} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You're about to permanently delete{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">"{eventTitle}"</span>.
                    This action cannot be undone.
                </p>
            </div>
            <div className="flex gap-3 w-full pt-1">
                <Button variant="outline-light" onClick={onClose} className="flex-1" disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm} loading={isLoading} className="flex-1">Delete Event</Button>
            </div>
        </div>
    </Modal>
));

// ─── Action Button ─────────────────────────────────────────────────────────────

const ActionBtn = memo(({ onClick, href, title, colorClass, children }) => {
    const cls = `p-2 rounded-lg transition-colors flex items-center justify-center ${colorClass}`;
    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>
                {children}
            </a>
        );
    }
    return (
        <button type="button" onClick={onClick} title={title} className={cls}>
            {children}
        </button>
    );
});

// ─── Event Row ─────────────────────────────────────────────────────────────────

const EventRow = memo(({ event, onEdit, onDelete }) => {
    const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.upcoming;

    return (
        <tr className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors">

            {/* Title + image */}
            <td className="px-4 py-3.5 max-w-[200px]">
                <div className="flex items-center gap-3">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600" />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                            <CalendarDays size={15} className="text-blue-400 dark:text-blue-500" />
                        </div>
                    )}
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={event.title}>
                        {event.title}
                    </p>
                </div>
            </td>

            {/* Description */}
            <td className="px-4 py-3.5 max-w-[180px]">
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</p>
            </td>

            {/* Date */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(event.start_date)}</p>
                {event.end_date && event.end_date !== event.start_date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">→ {formatDate(event.end_date)}</p>
                )}
            </td>

            {/* Time */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                {event.start_time ? (
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <Clock size={11} className="text-gray-400 flex-shrink-0" />
                            {formatTime(event.start_time)}
                        </div>
                        {event.end_time && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 pl-4">→ {formatTime(event.end_time)}</p>
                        )}
                    </div>
                ) : <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>}
            </td>

            {/* Location */}
            <td className="px-4 py-3.5 max-w-[140px]">
                {event.location ? (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                ) : <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>}
            </td>

            {/* Status */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant="light" color={badge.color} size="sm">{badge.label}</Badge>
            </td>

            {/* Registration */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                {event.is_registration_open ? (
                    <Badge variant="light" color="success" size="sm">Open</Badge>
                ) : (
                    <Badge variant="light" color="light" size="sm">Closed</Badge>
                )}
            </td>

            {/* Streaming */}
            <td className="px-4 py-3.5">
                {event.has_streaming ? (
                    <div className="flex items-center gap-1.5">
                        {event.video_streaming_link && (
                            <a href={event.video_streaming_link} target="_blank" rel="noopener noreferrer" title="Video stream"
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
                                <Video size={12} />
                            </a>
                        )}
                        {event.audio_streaming_link && (
                            <a href={event.audio_streaming_link} target="_blank" rel="noopener noreferrer" title="Audio stream"
                                className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-500 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors">
                                <Radio size={12} />
                            </a>
                        )}
                    </div>
                ) : <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>}
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">

                    {/* ── Registrations page ── */}
                    <Link
                        to={`/dashboard/admin/events/${event.id}/registration`}
                        title="View registrations"
                        className="p-2 rounded-lg transition-colors flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                    >
                        <Users size={13} />
                    </Link>

                    {/* ── External registration link ── */}
                    {event.registration_link && (
                        <ActionBtn
                            href={event.registration_link}
                            title="Registration page"
                            colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                        >
                            <ExternalLink size={13} />
                        </ActionBtn>
                    )}

                    <ActionBtn
                        onClick={() => onEdit(event)}
                        title="Edit event"
                        colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    >
                        <Pencil size={13} />
                    </ActionBtn>

                    <ActionBtn
                        onClick={() => onDelete(event)}
                        title="Delete event"
                        colorClass="bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                        <Trash2 size={13} />
                    </ActionBtn>
                </div>
            </td>
        </tr>
    );
});

// ─── Table Header Cell ─────────────────────────────────────────────────────────

const TH = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
        {children}
    </th>
);

// ─── Filter Bar ────────────────────────────────────────────────────────────────

const FilterBar = memo(({ filters, onFiltersChange, onSearch }) => {
    const [localSearch, setLocalSearch] = useState(filters.search ?? '');

    useEffect(() => { setLocalSearch(filters.search ?? ''); }, [filters.search]);

    const handleKeyDown = (e) => { if (e.key === 'Enter') onSearch(localSearch); };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">

            <div className="relative flex items-center gap-2 flex-1 w-full sm:max-w-xs">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search events..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 transition-colors"
                    />
                </div>
                <Button variant="primary" onClick={() => onSearch(localSearch)} className="flex-shrink-0 !px-3 !h-9">
                    <Search size={14} />
                </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <Filter size={13} className="text-gray-400 flex-shrink-0" />
                    <div className="flex gap-1">
                        {[{ value: '', text: 'All' }, ...STATUS_OPTIONS].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => onFiltersChange('status', opt.value)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.status === opt.value
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <ArrowUpDown size={13} className="text-gray-400 flex-shrink-0" />
                    <select
                        value={filters.order}
                        onChange={(e) => onFiltersChange('order', e.target.value)}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200 cursor-pointer"
                    >
                        {ORDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.text}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-1.5">
                    <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
                    <select
                        value={filters.per_page}
                        onChange={(e) => onFiltersChange('per_page', e.target.value)}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200 cursor-pointer"
                    >
                        {PER_PAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.text}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
});

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = memo(({ hasFilters, onCreateClick }) => (
    <tr>
        <td colSpan={9} className="px-4 py-16 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                    <CalendarDays size={28} className="opacity-50" />
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                        {hasFilters ? 'No events match your filters' : 'No events yet'}
                    </p>
                    <p className="text-sm mt-0.5">
                        {hasFilters ? 'Try adjusting your search or filters' : 'Create your first event to get started'}
                    </p>
                </div>
                {!hasFilters && (
                    <Button variant="outline-primary" startIcon={<Plus size={14} />} onClick={onCreateClick}>
                        Create Event
                    </Button>
                )}
            </div>
        </td>
    </tr>
));

// ─── Main Component ────────────────────────────────────────────────────────────

const INITIAL_FILTERS = { search: '', status: '', order: 'asc', per_page: '15' };

const AdminEventsList = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [page, setPage] = useState(1);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const createModal = useModal(false);
    const editModal = useModal(false);
    const deleteModal = useModal(false);

    const queryParams = useMemo(() => ({
        page,
        per_page: Number(filters.per_page),
        order: filters.order,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
    }), [page, filters]);

    const { data: eventsData, isLoading } = useEvents(queryParams);

    const { mutate: createEvent, isPending: isCreating } = useCreateEvent({
        onSuccess: createModal.closeModal,
    });
    const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent({
        onSuccess: editModal.closeModal,
    });
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent({
        onSuccess: () => { deleteModal.closeModal(); setEventToDelete(null); },
    });

    const events = eventsData?.data ?? [];
    const pagination = eventsData?.meta ?? null;
    const paginatorObj = useMemo(() => {
        if (!pagination) return null;
        return {
            links: pagination.links ?? [],
            current_page: pagination.current_page,
            from: pagination.from,
            to: pagination.to,
            total: pagination.total,
        };
    }, [pagination]);

    const stats = useMemo(() => ({
        total: pagination?.total ?? 0,
        upcoming: events.filter((e) => e.status === 'upcoming').length,
        ongoing: events.filter((e) => e.status === 'ongoing').length,
        past: events.filter((e) => e.status === 'past').length,
    }), [events, pagination]);

    const hasFilters = !!(filters.search || filters.status);

    const handleFiltersChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }, []);

    const handleSearch = useCallback((searchValue) => {
        setFilters((prev) => ({ ...prev, search: searchValue }));
        setPage(1);
    }, []);

    const handleEdit = useCallback((event) => {
        setSelectedEvent(normalizeEventForForm(event));
        editModal.openModal();
    }, [editModal]);

    const handleDeletePrompt = useCallback((event) => {
        setEventToDelete(event);
        deleteModal.openModal();
    }, [deleteModal]);

    const handleCreateSubmit = useCallback((data) => { createEvent(data); }, [createEvent]);
    const handleUpdateSubmit = useCallback((data) => { updateEvent({ id: selectedEvent.id, ...data }); }, [updateEvent, selectedEvent]);
    const handleDeleteConfirm = useCallback(() => { if (eventToDelete) deleteEvent(eventToDelete.id); }, [deleteEvent, eventToDelete]);
    const handleCloseDelete = useCallback(() => { deleteModal.closeModal(); setEventToDelete(null); }, [deleteModal]);

    if (isLoading) return <SkeletonTable />;

    return (
        <div className="space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Events</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Manage church events and gatherings
                    </p>
                </div>
                <Button variant="primary" startIcon={<Plus size={16} />} onClick={createModal.openModal}>
                    New Event
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard icon={CalendarDays} label="Total Events" value={stats.total} color="blue" />
                <StatsCard icon={TrendingUp} label="Upcoming" value={stats.upcoming} color="amber" />
                <StatsCard icon={Activity} label="Ongoing" value={stats.ongoing} color="green" />
                <StatsCard icon={Users} label="Past" value={stats.past} color="slate" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <FilterBar filters={filters} onFiltersChange={handleFiltersChange} onSearch={handleSearch} />

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <TH>Event</TH>
                                <TH>Description</TH>
                                <TH>Date</TH>
                                <TH>Time</TH>
                                <TH>Location</TH>
                                <TH>Status</TH>
                                <TH>Registration</TH>
                                <TH>Streaming</TH>
                                <TH>Actions</TH>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0
                                ? events.map((event) => (
                                    <EventRow
                                        key={event.id}
                                        event={event}
                                        onEdit={handleEdit}
                                        onDelete={handleDeletePrompt}
                                    />
                                ))
                                : <EmptyState hasFilters={hasFilters} onCreateClick={createModal.openModal} />
                            }
                        </tbody>
                    </table>
                </div>

                {paginatorObj && (
                    <div className="px-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                        <Paginator paginationData={paginatorObj} onPageChange={setPage} />
                    </div>
                )}
            </div>

            <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} title="Create Event" description="Fill in the details below to create a new event" maxWidth="max-w-2xl">
                <EventForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
            </Modal>

            <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} title="Edit Event" description="Update the event details" maxWidth="max-w-2xl">
                {selectedEvent && (
                    <EventForm key={selectedEvent.id} defaultValues={selectedEvent} onSubmit={handleUpdateSubmit} isLoading={isUpdating} isEdit />
                )}
            </Modal>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDelete}
                onConfirm={handleDeleteConfirm}
                eventTitle={eventToDelete?.title}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AdminEventsList;