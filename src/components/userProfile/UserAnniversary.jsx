import { useModal } from '../../hooks/useModal';
import InputForm from '../form/useForm/InputForm';
import Button from '../ui/Button';
import Modal from '../ui/modal/Modal';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { useUpdateProfile } from '../../queries/user.query';
import { EditIcon, PlusIcon, TrashIcon } from '@/icons';
import { CakeIcon } from 'lucide-react';

// Anniversary type options
const ANNIVERSARY_TYPES = [
    { value: 'wedding', label: 'Wedding Anniversary' },
    { value: 'work', label: 'Work Anniversary' },
    { value: 'salvation', label: 'Salvation Date' },
    //   { value: 'ordination', label: 'Ordination Date' },
    { value: 'baptism', label: 'Baptism Date' },
    { value: 'membership', label: 'Membership Date' },
    { value: 'custom', label: 'Custom' },
];

// Helper: Calculate years since date
const calculateYearsSince = (date) => {
    if (!date) return 0;
    const anniversaryDate = new Date(date);
    const today = new Date();
    let years = today.getFullYear() - anniversaryDate.getFullYear();
    const monthDiff = today.getMonth() - anniversaryDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < anniversaryDate.getDate())) {
        years--;
    }
    return years;
};

// Helper: Calculate days until next occurrence
const calculateDaysUntil = (date) => {
    if (!date) return null;
    const anniversaryDate = new Date(date);
    const today = new Date();

    let nextOccurrence = new Date(
        today.getFullYear(),
        anniversaryDate.getMonth(),
        anniversaryDate.getDate()
    );

    if (nextOccurrence < today) {
        nextOccurrence.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextOccurrence - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// Helper: Get month and day only
const getMonthDay = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
};

export default function UserAnniversaryCard() {
    const { user } = useAuthStore();
    const { isOpen, openModal, closeModal } = useModal();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            anniversaries: user?.anniversaries || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'anniversaries',
    });

    const { mutate: updateProfile, isPending } = useUpdateProfile({
        onSuccess: () => closeModal(),
    });

    const handleSave = (data) => {
        const errors = [];
        const types = data.anniversaries.map((a) => a.type);
        const titles = data.anniversaries.map((a) => a.title?.toLowerCase().trim() || '');

        // Check for duplicate types (excluding 'custom')
        const duplicateIndices = [];
        const seenTypes = new Set();

        types.forEach((type, index) => {
            if (type !== 'custom') {
                if (seenTypes.has(type)) {
                    duplicateIndices.push(index);
                    errors.push({
                        index,
                        field: 'type',
                        message: `${ANNIVERSARY_TYPES.find((t) => t.value === type)?.label} already exists.`,
                    });
                } else {
                    seenTypes.add(type);
                }
            }
        });

        // Check for titles that conflict with existing types or birthday
        const typeKeywords = {
            wedding: ['wedding', 'married', 'marriage', 'wed'],
            work: ['work', 'job', 'career', 'employment', 'started working'],
            salvation: ['salvation', 'saved', 'born again', 'accepted christ'],
            ordination: ['ordination', 'ordained', 'pastor', 'ministry'],
            baptism: ['baptism', 'baptized', 'baptised', 'water baptism'],
            membership: ['membership', 'member', 'joined church', 'became member'],
        };

        // Add birthday keywords if user has birthday
        const birthdayKeywords = ['birthday', 'birth day', 'born', 'bday', 'b-day'];

        data.anniversaries.forEach((anniversary, index) => {
            const title = anniversary.title?.toLowerCase().trim() || '';

            if (!title) {
                errors.push({
                    index,
                    field: 'title',
                    message: 'Title is required',
                });
                return;
            }

            // Check if title contains birthday keywords
            if (user?.date_of_birth) {
                const hasBirthdayKeyword = birthdayKeywords.some((keyword) =>
                    title.includes(keyword)
                );

                if (hasBirthdayKeyword) {
                    errors.push({
                        index,
                        field: 'title',
                        message: 'Cannot use "birthday" - you already have a birthday set in your profile',
                    });
                }
            }

            // Check if title contains keywords of other types
            Object.entries(typeKeywords).forEach(([type, keywords]) => {
                // Skip if this is the current anniversary's type
                if (anniversary.type === type) return;

                const hasKeyword = keywords.some((keyword) => title.includes(keyword));

                if (hasKeyword) {
                    // Check if this type already exists in the list
                    const typeExists = data.anniversaries.some(
                        (ann, idx) => idx !== index && ann.type === type
                    );

                    if (typeExists) {
                        const typeName = ANNIVERSARY_TYPES.find((t) => t.value === type)?.label;
                        errors.push({
                            index,
                            field: 'title',
                            message: `Title suggests "${typeName}" but that type already exists`,
                        });
                    }
                }
            });

            // Check for duplicate titles (case-insensitive)
            const duplicateTitleIndex = titles.findIndex(
                (t, idx) => idx !== index && t === title
            );

            if (duplicateTitleIndex !== -1) {
                errors.push({
                    index,
                    field: 'title',
                    message: 'This title is already used for another anniversary',
                });
            }
        });

        // If there are errors, set them and prevent submission
        if (errors.length > 0) {
            errors.forEach((error) => {
                setError(`anniversaries.${error.index}.${error.field}`, {
                    type: 'manual',
                    message: error.message,
                });
            });
            return;
        }

        updateProfile({ anniversaries: data.anniversaries });
    };

    const handleEdit = () => {
        reset({
            anniversaries: user?.anniversaries || [],
        });
        openModal();
    };

    const addAnniversary = () => {
        append({
            type: 'wedding',
            date: '',
            title: '',
        });
    };

    // Check if a type is already used (for visual indicator)
    const isTypeDuplicate = (currentIndex, currentType) => {
        if (currentType === 'custom') return false; // Custom can have multiple

        const allAnniversaries = watch('anniversaries') || [];
        return allAnniversaries.some(
            (anniversary, index) => index !== currentIndex && anniversary.type === currentType
        );
    };

    // Check if title has conflicts
    const getTitleWarning = (currentIndex) => {
        const allAnniversaries = watch('anniversaries') || [];
        const currentTitle = watch(`anniversaries.${currentIndex}.title`)?.toLowerCase().trim() || '';

        if (!currentTitle) return null;

        // Birthday keywords
        const birthdayKeywords = ['birthday', 'birth day', 'born', 'bday', 'b-day'];

        // Check for birthday conflict
        if (user?.date_of_birth) {
            const hasBirthdayKeyword = birthdayKeywords.some((keyword) =>
                currentTitle.includes(keyword)
            );

            if (hasBirthdayKeyword) {
                return 'Contains "birthday" - conflicts with your profile birthday';
            }
        }

        // Type keywords mapping
        const typeKeywords = {
            wedding: ['wedding', 'married', 'marriage', 'wed'],
            work: ['work', 'job', 'career', 'employment', 'started working'],
            salvation: ['salvation', 'saved', 'born again', 'accepted christ'],
            ordination: ['ordination', 'ordained', 'pastor', 'ministry'],
            baptism: ['baptism', 'baptized', 'baptised', 'water baptism'],
            membership: ['membership', 'member', 'joined church', 'became member'],
        };

        // Check for type keyword conflicts
        for (const [type, keywords] of Object.entries(typeKeywords)) {
            const currentType = watch(`anniversaries.${currentIndex}.type`);
            if (currentType === type) continue; // Skip own type

            const hasKeyword = keywords.some((keyword) => currentTitle.includes(keyword));

            if (hasKeyword) {
                const typeExists = allAnniversaries.some(
                    (ann, idx) => idx !== currentIndex && ann.type === type
                );

                if (typeExists) {
                    const typeName = ANNIVERSARY_TYPES.find((t) => t.value === type)?.label;
                    return `Suggests "${typeName}" but that type already exists`;
                }
            }
        }

        // Check for duplicate titles
        const duplicateTitle = allAnniversaries.some(
            (ann, idx) => idx !== currentIndex && ann.title?.toLowerCase().trim() === currentTitle
        );

        if (duplicateTitle) {
            return 'This title is already used';
        }

        return null;
    };

    const anniversaries = user?.anniversaries || [];
    const hasAnniversaries = anniversaries.length > 0;

    return (
        <>
            <div className="overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-700/60 bg-white dark:bg-gray-800/50 backdrop-blur-sm transition-colors mb-6">
                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700/60 lg:px-6 lg:pt-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Anniversaries
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {user?.date_of_birth
                                ? 'Your birthday and special milestones'
                                : 'Special dates and milestones in your life'}
                        </p>
                    </div>
                    <Button variant="neutral" onClick={handleEdit}>
                        <EditIcon width={16} height={16} className="text-gray-700 dark:text-gray-300" />
                    </Button>
                </div>

                {/* Info Display */}
                <div className="px-5 py-5 lg:px-6 lg:py-6">
                    {/* Birthday Section - Always show if date_of_birth exists */}
                    {user?.date_of_birth && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Birthday
                            </h4>
                            <div className="group relative p-4 border border-purple-100 dark:border-purple-700/60 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/10 dark:to-gray-800/30 rounded-xl hover:shadow-md hover:border-purple-200 dark:hover:border-purple-600 transition-all">
                                {(() => {
                                    const daysUntil = calculateDaysUntil(user.date_of_birth);
                                    const isUpcoming = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;

                                    return (
                                        <>
                                            {isUpcoming && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                                                        In {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-3">
                                                <div className="bg-purple-100 dark:bg-purple-500 flex items-center justify-center w-10 h-10 rounded-lg transition-transform group-hover:scale-110">
                                                    <CakeIcon
                                                        width={20}
                                                        height={20}
                                                        className="text-purple-700 dark:text-purple-900"
                                                        fill="currentColor"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            Birthday
                                                        </p>
                                                    </div>
                                                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
                                                        Special Day
                                                    </p>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                                            <span className="font-medium">Date:</span> {getMonthDay(user.date_of_birth)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Anniversaries Section */}
                    {hasAnniversaries && user?.date_of_birth && (
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Other Anniversaries
                        </h4>
                    )}

                    {!hasAnniversaries && !user?.date_of_birth ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
                                <CakeIcon width={28} height={28} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                No anniversaries added yet
                            </p>
                            <Button variant="primary" onClick={handleEdit}>
                                <PlusIcon width={16} height={16} />
                                Add Your First Anniversary
                            </Button>
                        </div>
                    ) : !hasAnniversaries && user?.date_of_birth ? (
                        <div className="text-center py-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                No other anniversaries added yet
                            </p>
                            <Button variant="outline" onClick={handleEdit}>
                                <PlusIcon width={16} height={16} />
                                Add Anniversary
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
                            {anniversaries.map((anniversary, index) => {
                                const yearsSince = calculateYearsSince(anniversary.date);
                                const daysUntil = calculateDaysUntil(anniversary.date);
                                const isUpcoming = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
                                const typeLabel =
                                    ANNIVERSARY_TYPES.find((t) => t.value === anniversary.type)?.label ||
                                    anniversary.type;

                                return (
                                    <div
                                        key={index}
                                        className={`group relative p-4 border rounded-xl transition-all ${isUpcoming
                                                ? 'border-blue-200 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'border-gray-100 dark:border-gray-700/60 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800/50 dark:to-gray-800/30'
                                            } hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600`}
                                    >
                                        {isUpcoming && (
                                            <div className="absolute top-2 right-2">
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                                    In {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 dark:bg-gray-500 flex items-center justify-center w-10 h-10 rounded-lg transition-transform group-hover:scale-110">
                                                <CakeIcon
                                                    width={20}
                                                    height={20}
                                                    className="text-blue-700 dark:text-gray-800"
                                                    fill="currentColor"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 wrap-break-word">
                                                        {anniversary.title || typeLabel}
                                                    </p>
                                                </div>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    {typeLabel}
                                                </p>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Date:</span> {getMonthDay(anniversary.date)}
                                                    </p>
                                                    {yearsSince > 0 && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                                            <span className="font-medium">
                                                                {yearsSince} {yearsSince === 1 ? 'year' : 'years'}
                                                            </span>{' '}
                                                            ago
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                description="Add or edit your special dates and anniversaries."
                title="Manage Anniversaries"
                isOpen={isOpen}
                onClose={closeModal}
            >
                <form className="space-y-5" onSubmit={handleSubmit(handleSave)}>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {fields.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                <CakeIcon
                                    width={32}
                                    height={32}
                                    className="text-gray-400 dark:text-gray-500 mx-auto mb-3"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    No anniversaries yet. Add your first one!
                                </p>
                            </div>
                        )}

                        {fields.map((field, index) => {
                            const watchedType = watch(`anniversaries.${index}.type`);
                            const isDuplicate = isTypeDuplicate(index, watchedType);
                            const titleWarning = getTitleWarning(index);
                            const hasWarning = isDuplicate || titleWarning;

                            return (
                                <div
                                    key={field.id}
                                    className={`p-4 border rounded-xl bg-gray-50/50 dark:bg-gray-800/30 relative ${hasWarning
                                            ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    {/* Warning badges */}
                                    {hasWarning && (
                                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                                            {isDuplicate && (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900/50 dark:text-red-300">
                                                    Duplicate Type
                                                </span>
                                            )}
                                            {titleWarning && (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900/50 dark:text-orange-300">
                                                    Title Issue
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Remove anniversary"
                                    >
                                        <TrashIcon width={16} height={16} />
                                    </button>

                                    <div className="space-y-4 pr-6">
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                            {/* Type Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    {...register(`anniversaries.${index}.type`, {
                                                        required: 'Type is required',
                                                    })}
                                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${isDuplicate || errors.anniversaries?.[index]?.type
                                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                                                        }`}
                                                >
                                                    {ANNIVERSARY_TYPES.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {isDuplicate && !errors.anniversaries?.[index]?.type && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        This type is already added. Each type can only be used once (except
                                                        Custom).
                                                    </p>
                                                )}
                                                {errors.anniversaries?.[index]?.type && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        {errors.anniversaries[index].type.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Date */}
                                            <InputForm
                                                label={
                                                    <>
                                                        Date <span className="text-red-500">*</span>
                                                    </>
                                                }
                                                name={`anniversaries.${index}.date`}
                                                type="date"
                                                register={register}
                                                rules={{ required: 'Date is required' }}
                                                error={errors.anniversaries?.[index]?.date?.message}
                                            />
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <InputForm
                                                label={
                                                    <>
                                                        Title <span className="text-red-500">*</span>
                                                    </>
                                                }
                                                name={`anniversaries.${index}.title`}
                                                type="text"
                                                placeholder="e.g., Our Special Day, Started at ABC Company"
                                                register={register}
                                                rules={{ required: 'Title is required' }}
                                                error={errors.anniversaries?.[index]?.title?.message}
                                            />
                                            {titleWarning && !errors.anniversaries?.[index]?.title && (
                                                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                                                    ⚠️ {titleWarning}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Anniversary Button */}
                    <div className="border-t pt-4 dark:border-gray-600">
                        <Button type="button" variant="outline" onClick={addAnniversary} className="w-full">
                            <PlusIcon width={16} height={16} />
                            Add Anniversary
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 border-t pt-5 dark:border-gray-600">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={closeModal}
                            disabled={isPending}
                            className="flex-1"
                        >
                            Cancel
                        </Button>

                        <Button type="submit" loading={isPending} disabled={isPending} className="flex-1">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}