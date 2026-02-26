// ─── AdminRedeemableItemsList.jsx ────────────────────────────────────────────

import { useState, useCallback, useMemo, memo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import {
    Plus, Pencil, Trash2, AlertTriangle,
    ImageIcon, X, Upload, Activity, TrendingUp,
    Gift, Package, Tag, ToggleRight, Users,
} from 'lucide-react';

import InputForm from '@/components/form/useForm/InputForm';
import TextAreaForm from '@/components/form/TextAreaForm';
import RadioForm from '@/components/form/useForm/RadioForm';
import Modal from '@/components/ui/modal/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { useModal } from '@/hooks/useModal';
import { generateInitials } from '@/utils/helper';
import {
    useAdminRedeemableItems,
    useCreateRedeemableItem,
    useUpdateRedeemableItem,
    useDeleteRedeemableItem,
} from '@/queries/redeemable-items.query';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_RADIO_OPTIONS = [
    { value: '1', label: 'Active', description: 'Visible and available for redemption' },
    { value: '0', label: 'Inactive', description: 'Hidden from members' },
];

const STATUS_BADGE = {
    true: { color: 'success', label: 'Active' },
    false: { color: 'light', label: 'Inactive' },
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

// ─── Coin Icon ────────────────────────────────────────────────────────────────

const CoinIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 7v1m0 8v1M9.5 10.5h3a1.5 1.5 0 0 1 0 3h-3m0-3v3m0-3h-.5m3.5 3h.5" />
    </svg>
);

// ─── Yup Schema ───────────────────────────────────────────────────────────────

const nullableString = yup
    .string().nullable().optional()
    .transform((v) => (v === '' ? null : v));

const itemSchema = yup.object({
    title: yup.string().trim().min(2, 'Title must be at least 2 characters').max(150).required('Title is required'),
    category: yup.string().trim().min(2, 'Category must be at least 2 characters').max(150).required('Category is required'),
    subtitle: nullableString.max(200, 'Subtitle is too long'),
    description: yup.string().trim().min(5, 'Description must be at least 5 characters').required('Description is required'),
    points_required: yup.number().typeError('Points must be a number').integer().min(1, 'Minimum 1 point').required('Points required'),
    stock: yup.number().typeError('Stock must be a number').integer().min(0, 'Stock cannot be negative')
        .nullable().optional().transform((v) => (isNaN(v) ? null : v)),
    is_active: yup.string().oneOf(['0', '1']).required('Status is required'),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const normalizeItemForForm = (item) => ({
    ...item,
    is_active: item.is_active ? '1' : '0',
    stock: item.stock ?? '',
    subtitle: item.subtitle ?? '',
    description: item.description ?? '',
    category: item.category ?? 'other',
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
);

const SkeletonRow = memo(() => (
    <tr className="border-b border-gray-100 dark:border-gray-700/50">
        <td className="px-4 py-3.5">
            <div className="flex items-center gap-3">
                <Pulse className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="space-y-1.5"><Pulse className="h-3.5 w-36" /><Pulse className="h-2.5 w-24" /></div>
            </div>
        </td>
        {[80, 70, 60, 70, 60, 60].map((w, i) => (
            <td key={i} className="px-4 py-3.5"><Pulse className="h-3.5" style={{ width: w }} /></td>
        ))}
        <td className="px-4 py-3.5">
            <div className="flex gap-1.5">{[1, 2].map((i) => <Pulse key={i} className="w-8 h-8 rounded-lg" />)}</div>
        </td>
    </tr>
));
SkeletonRow.displayName = 'SkeletonRow';

const SkeletonTable = memo(() => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div><Pulse className="h-6 w-40 mb-1" /><Pulse className="h-4 w-56" /></div>
            <Pulse className="h-9 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <Pulse className="w-11 h-11 rounded-xl" />
                    <div className="space-y-1.5"><Pulse className="h-3 w-16" /><Pulse className="h-6 w-10" /></div>
                </div>
            ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <th key={i} className="px-4 py-3"><Pulse className="h-3 w-16" /></th>
                        ))}
                    </tr>
                </thead>
                <tbody>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
            </table>
        </div>
    </div>
));
SkeletonTable.displayName = 'SkeletonTable';

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
StatsCard.displayName = 'StatsCard';

// ─── Image Upload ──────────────────────────────────────────────────────────────

const ImageUpload = memo(({ value, onChange, error }) => {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFile = useCallback(async (file) => {
        setUploadError('');
        if (!file.type.startsWith('image/')) { setUploadError('Please select a valid image file.'); return; }
        if (file.size > MAX_IMAGE_SIZE_BYTES) { setUploadError('Image must be under 2 MB.'); return; }
        onChange(await fileToBase64(file));
    }, [onChange]);

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Item Image</label>
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
                        <img src={value} alt="Item preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button type="button" onClick={() => inputRef.current?.click()}
                                className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white transition-colors">
                                <Upload size={12} />Change
                            </button>
                            <button type="button" onClick={() => onChange(null)}
                                className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-600 transition-colors">
                                <X size={12} />Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()}
                        className="w-full py-8 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl"><ImageIcon size={22} /></div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drop image here or click to upload</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG, WEBP — max 2 MB</p>
                        </div>
                    </button>
                )}
                <input ref={inputRef} type="file" accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                    className="hidden" />
            </div>
            {(uploadError || error) && <p className="text-xs text-red-500 dark:text-red-400">{uploadError || error}</p>}
        </div>
    );
});
ImageUpload.displayName = 'ImageUpload';

// ─── Section Label ─────────────────────────────────────────────────────────────

const SectionLabel = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mt-5 mb-3">
        <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <Icon size={12} className="text-blue-500 dark:text-blue-400" />
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
);

// ─── Item Form ─────────────────────────────────────────────────────────────────

const ItemForm = memo(({ defaultValues, onSubmit, isLoading, isEdit = false }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(itemSchema),
        defaultValues: defaultValues ?? { is_active: '1', category: 'other' },
    });

    const imageValue = watch('image');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <ImageUpload
                value={imageValue}
                onChange={(val) => setValue('image', val, { shouldValidate: true })}
                error={errors.image?.message}
            />

            <SectionLabel icon={Gift} label="Item Details" />
            <InputForm
                label="Title" name="title" register={register}
                error={errors.title?.message} placeholder="e.g. Worship Album Download" required
            />
            <InputForm
                label="Subtitle" name="subtitle" register={register}
                error={errors.subtitle?.message} placeholder="e.g. Exclusive digital download"
            />
            <TextAreaForm
                label="Description" name="description" register={register}
                error={errors.description?.message}
                placeholder="Describe this redeemable item..."
                required rows={3}
            />

            <SectionLabel icon={CoinIcon} label="Points & Stock" />
            <div className="grid grid-cols-2 gap-3">
                <InputForm
                    label="Points Required" name="points_required" register={register}
                    error={errors.points_required?.message} placeholder="e.g. 500" required type="number"
                />
                <InputForm
                    label="Stock (blank = unlimited)" name="stock" register={register}
                    error={errors.stock?.message} placeholder="e.g. 100" type="number"
                />
            </div>

            <SectionLabel icon={Tag} label="Category" />
            <InputForm
                label="Category" name="category" register={register}
                error={errors.category?.message} placeholder="Category" type="text"
            />

            <SectionLabel icon={ToggleRight} label="Status" />
            <RadioForm
                name="is_active" register={register}
                error={errors.is_active?.message}
                options={ACTIVE_RADIO_OPTIONS}
                layout="horizontal"
            />

            <div className="pt-3">
                <Button type="submit" variant="primary" loading={isLoading} className="w-full">
                    {isEdit ? 'Update Item' : 'Create Item'}
                </Button>
            </div>
        </form>
    );
});
ItemForm.displayName = 'ItemForm';

// ─── Redeemers Panel ──────────────────────────────────────────────────────────

const RedeemersPanel = memo(({ redeemers }) => {
    if (!redeemers?.length) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-500">
                <Users size={28} className="opacity-40" />
                <p className="text-sm">No one has redeemed this item yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {redeemers.map((r) => (
                <div key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                    <Avatar src={r.avatar} name={generateInitials(r.name)} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{r.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {dayjs(r.redeemed_at).format('DD MMM YYYY, hh:mm A')}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 flex-shrink-0">
                        <CoinIcon className="w-3.5 h-3.5" />
                        {r.points_spent?.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
});
RedeemersPanel.displayName = 'RedeemersPanel';

// ─── Delete Modal ──────────────────────────────────────────────────────────────

const DeleteModal = memo(({ isOpen, onClose, onConfirm, itemTitle, isLoading }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Item" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={26} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You're about to permanently delete{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">"{itemTitle}"</span>.
                    This action cannot be undone.
                </p>
            </div>
            <div className="flex gap-3 w-full pt-1">
                <Button variant="outline-light" onClick={onClose} className="flex-1" disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm} loading={isLoading} className="flex-1">Delete Item</Button>
            </div>
        </div>
    </Modal>
));
DeleteModal.displayName = 'DeleteModal';

// ─── Action Button ─────────────────────────────────────────────────────────────

const ActionBtn = memo(({ onClick, title, colorClass, children }) => (
    <button type="button" onClick={onClick} title={title}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${colorClass}`}>
        {children}
    </button>
));
ActionBtn.displayName = 'ActionBtn';

// ─── Item Row ──────────────────────────────────────────────────────────────────

const ItemRow = memo(({ item, onEdit, onDelete, onViewRedeemers }) => {
    const activeBadge = STATUS_BADGE[String(item.is_active)] ?? STATUS_BADGE.false;

    return (
        <tr className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors">

            {/* Title + image */}
            <td className="px-4 py-3.5 max-w-[220px]">
                <div className="flex items-center gap-3">
                    {item.image ? (
                        <img src={item.image} alt={item.title}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600" />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                            <Gift size={15} className="text-purple-400 dark:text-purple-500" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={item.title}>
                            {item.title}
                        </p>
                        {item.subtitle && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.subtitle}</p>
                        )}
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 capitalize">
                    <Tag size={11} className="text-gray-400 flex-shrink-0" />
                    {item.category ?? '—'}
                </div>
            </td>

            {/* Points */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <CoinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {item.points_required?.toLocaleString()}
                </div>
            </td>

            {/* Stock */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                {item.stock !== null && item.stock !== undefined ? (
                    <div className="space-y-0.5">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.stock}</p>
                        {item.stock_label && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">{item.stock_label}</p>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">Unlimited</span>
                )}
            </td>

            {/* Total Redeemed — clickable to open redeemers modal */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <button onClick={() => onViewRedeemers(item)} title="View redeemers"
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    <Users size={12} className="flex-shrink-0" />
                    {item.total_redeemed ?? 0}
                </button>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant="light" color={activeBadge.color} size="sm">{activeBadge.label}</Badge>
            </td>

            {/* Availability */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                {item.is_available
                    ? <Badge variant="light" color="success" size="sm">Available</Badge>
                    : <Badge variant="light" color="light" size="sm">Unavailable</Badge>
                }
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                    <ActionBtn onClick={() => onEdit(item)} title="Edit item"
                        colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40">
                        <Pencil size={13} />
                    </ActionBtn>
                    <ActionBtn onClick={() => onDelete(item)} title="Delete item"
                        colorClass="bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40">
                        <Trash2 size={13} />
                    </ActionBtn>
                </div>
            </td>
        </tr>
    );
});
ItemRow.displayName = 'ItemRow';

// ─── Table Header ──────────────────────────────────────────────────────────────

const TH = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
        {children}
    </th>
);

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = memo(({ onCreateClick }) => (
    <tr>
        <td colSpan={8} className="px-4 py-16 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                    <Gift size={28} className="opacity-50" />
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">No redeemable items yet</p>
                    <p className="text-sm mt-0.5">Create your first item to get started</p>
                </div>
                <Button variant="outline-primary" startIcon={<Plus size={14} />} onClick={onCreateClick}>
                    Create Item
                </Button>
            </div>
        </td>
    </tr>
));
EmptyState.displayName = 'EmptyState';

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminRedeemableItemsList = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [redeemersItem, setRedeemersItem] = useState(null);

    const createModal = useModal(false);
    const editModal = useModal(false);
    const deleteModal = useModal(false);
    const redeemersModal = useModal(false);

    const { data: itemsData, isLoading } = useAdminRedeemableItems();

    const { mutate: createItem, isPending: isCreating } = useCreateRedeemableItem({
        onSuccess: createModal.closeModal,
    });
    const { mutate: updateItem, isPending: isUpdating } = useUpdateRedeemableItem({
        onSuccess: editModal.closeModal,
    });
    const { mutate: deleteItem, isPending: isDeleting } = useDeleteRedeemableItem({
        onSuccess: () => { deleteModal.closeModal(); setItemToDelete(null); },
    });

    const items = itemsData?.data ?? [];

    const stats = useMemo(() => ({
        total: items.length,
        active: items.filter((i) => i.is_active).length,
        available: items.filter((i) => i.is_available).length,
        totalRedeemed: items.reduce((sum, i) => sum + (i.total_redeemed ?? 0), 0),
    }), [items]);

    const handleEdit = useCallback((item) => {
        setSelectedItem(normalizeItemForForm(item));
        editModal.openModal();
    }, [editModal]);

    const handleDeletePrompt = useCallback((item) => {
        setItemToDelete(item);
        deleteModal.openModal();
    }, [deleteModal]);

    const handleViewRedeemers = useCallback((item) => {
        setRedeemersItem(item);
        redeemersModal.openModal();
    }, [redeemersModal]);

    const handleCreateSubmit = useCallback((data) => {
        createItem({ ...data, is_active: data.is_active === '1' });
    }, [createItem]);

    const handleUpdateSubmit = useCallback((data) => {
        updateItem({ id: selectedItem.id, ...data, is_active: data.is_active === '1' });
    }, [updateItem, selectedItem]);

    const handleDeleteConfirm = useCallback(() => {
        if (itemToDelete) deleteItem(itemToDelete.id);
    }, [deleteItem, itemToDelete]);

    const handleCloseDelete = useCallback(() => {
        deleteModal.closeModal();
        setItemToDelete(null);
    }, [deleteModal]);

    if (isLoading) return <SkeletonTable />;

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Redeemable Items</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Manage items members can redeem with their points
                    </p>
                </div>
                <Button variant="primary" startIcon={<Plus size={16} />} onClick={createModal.openModal}>
                    New Item
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard icon={Package} label="Total Items" value={stats.total} color="blue" />
                <StatsCard icon={ToggleRight} label="Active" value={stats.active} color="green" />
                <StatsCard icon={Activity} label="Available" value={stats.available} color="amber" />
                <StatsCard icon={TrendingUp} label="Total Redeemed" value={stats.totalRedeemed} color="slate" />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <TH>Item</TH>
                                <TH>Category</TH>
                                <TH>Points</TH>
                                <TH>Stock</TH>
                                <TH>Redeemed</TH>
                                <TH>Status</TH>
                                <TH>Availability</TH>
                                <TH>Actions</TH>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0
                                ? items.map((item) => (
                                    <ItemRow key={item.id} item={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDeletePrompt}
                                        onViewRedeemers={handleViewRedeemers}
                                    />
                                ))
                                : <EmptyState onCreateClick={createModal.openModal} />
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal}
                title="Create Redeemable Item" description="Fill in the details to add a new redeemable item"
                maxWidth="max-w-2xl">
                <ItemForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal}
                title="Edit Redeemable Item" description="Update the item details"
                maxWidth="max-w-2xl">
                {selectedItem && (
                    <ItemForm key={selectedItem.id} defaultValues={selectedItem}
                        onSubmit={handleUpdateSubmit} isLoading={isUpdating} isEdit />
                )}
            </Modal>

            {/* Redeemers Modal */}
            <Modal isOpen={redeemersModal.isOpen} onClose={redeemersModal.closeModal}
                title={`Redeemers — ${redeemersItem?.title ?? ''}`}
                description={`${redeemersItem?.total_redeemed ?? 0} member(s) have redeemed this item`}
                maxWidth="max-w-lg">
                <RedeemersPanel redeemers={redeemersItem?.redeemers} />
            </Modal>

            {/* Delete Modal */}
            <DeleteModal isOpen={deleteModal.isOpen} onClose={handleCloseDelete}
                onConfirm={handleDeleteConfirm} itemTitle={itemToDelete?.title} isLoading={isDeleting} />
        </div>
    );
};

export default AdminRedeemableItemsList;