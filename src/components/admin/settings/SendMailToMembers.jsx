import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Upload, Users, FileSpreadsheet, X } from 'lucide-react';

// Components
import Animated from '@/components/common/Animated';
import Message from '@/components/common/Message';
import Modal from '@/components/ui/modal/Modal';
import Button from '@/components/ui/Button';
import ButtonCard from '@/components/ui/ButtonCard';
import InputForm from '@/components/form/useForm/InputForm';
import MultiSelectForm from '@/components/form/useForm/MultiSelectForm';
import RadioForm from '@/components/form/useForm/RadioForm';
import RoleSelection from '@/components/admin/members/RoleSelection';

// Hooks & Utils
import { useModal } from '@/hooks/useModal';
import { useMembersByRole } from '@/queries/member.query';
import { useSendBulkMail } from '@/queries/mail.query';
import { extractEmailsFromCsv, readFileAsText } from '@/utils/csv';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Recipient selection modes.
 * - MEMBERS: pick existing members by role -> sends `user_ids`
 * - CSV:     upload a CSV with an `email` column -> sends `emails`
 */
const RECIPIENT_MODE = {
    MEMBERS: 'members',
    CSV: 'csv',
};

const INITIAL_VALUES = {
    template_id: '',
    user_ids: [],
    emails: [],
    use_merge_info: false,
};

const ACCEPTED_CSV_TYPES = '.csv,text/csv';
const MAX_CSV_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

/**
 * Schema is mode-aware: recipients are validated against `user_ids` in member
 * mode and `emails` in CSV mode, so only the active field is required.
 */
const buildSchema = (mode) =>
    yup.object().shape({
        template_id: yup
            .string()
            .required('Email template is required')
            .trim(),
        user_ids: yup
            .array()
            .of(yup.number().positive())
            .when([], {
                is: () => mode === RECIPIENT_MODE.MEMBERS,
                then: (schema) =>
                    schema.min(1, 'At least one recipient is required').required('Recipients are required'),
                otherwise: (schema) => schema.strip(),
            }),
        emails: yup
            .array()
            .of(yup.string().email())
            .when([], {
                is: () => mode === RECIPIENT_MODE.CSV,
                then: (schema) =>
                    schema
                        .min(1, 'Upload a CSV with at least one valid email')
                        .required('Recipient emails are required'),
                otherwise: (schema) => schema.strip(),
            }),
        use_merge_info: yup
            .boolean()
            .required('Please select merge info option'),
    });

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform members data to select options
 * @param {Array} members - Array of member objects
 * @returns {Array} - Array of option objects {value, text}
 */
const transformMembersToOptions = (members) => {
    if (!Array.isArray(members) || members.length === 0) return [];

    return members.map(member => ({
        value: member.id,
        text: member.full_name || `${member.first_name} ${member.last_name}`,
    }));
};

/**
 * Get role display label
 * @param {string} role - Role value
 * @returns {string} - Formatted role label
 */
const getRoleLabel = (role) => {
    const roleLabels = {
        all: 'All Users',
        admin: 'Admins',
        leader: 'Leaders',
        member: 'Members',
        firstTimer: 'First Timers',
        pastor: 'Pastors',
        gloryTeam: 'Glory Team',
        nonGloryTeam: 'Non-Glory Team',
    };

    return roleLabels[role] || 'Users';
};

const toMergeBoolean = (value) => value === 'true' || value === true;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SendMailToMembers = () => {
    const {
        isOpen: isOpenModal,
        openModal,
        closeModal
    } = useModal();

    return (
        <>
            <ButtonCard
                onClick={openModal}
                color="orange"
                type="button"
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                description="Send email to pastor, admin, leader, member and all users."
            >
                Send Mail
            </ButtonCard>

            <Modal
                maxWidth="max-w-4xl"
                title="Send Mail to Members"
                description="Select recipients and email template to send bulk emails."
                isOpen={isOpenModal}
                onClose={closeModal}
            >
                {/* Remount the form each time the modal opens so state resets cleanly */}
                {isOpenModal && <SendMailForm onClose={closeModal} />}
            </Modal>
        </>
    );
};

// ============================================================================
// MODE TOGGLE
// ============================================================================

const ModeToggle = ({ mode, onChange, disabled }) => {
    const tabs = [
        { value: RECIPIENT_MODE.MEMBERS, label: 'Select Members', icon: Users },
        { value: RECIPIENT_MODE.CSV, label: 'Upload CSV', icon: FileSpreadsheet },
    ];

    return (
        <div
            role="tablist"
            aria-label="Recipient source"
            className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
            {tabs.map(({ value, label, icon: Icon }) => {
                const isActive = mode === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        disabled={disabled}
                        onClick={() => onChange(value)}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                            ${isActive
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}
                            ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

// ============================================================================
// CSV UPLOAD
// ============================================================================

const CsvEmailUpload = ({ emails, invalid, fileName, error, disabled, onFile, onClear }) => {
    const inputRef = useRef(null);

    const handleSelect = useCallback((event) => {
        const file = event.target.files?.[0];
        // Reset the input value so re-selecting the same file fires onChange again
        event.target.value = '';
        if (file) onFile(file);
    }, [onFile]);

    const handleClear = useCallback(() => {
        if (inputRef.current) inputRef.current.value = '';
        onClear();
    }, [onClear]);

    return (
        <div className="w-full space-y-3">
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_CSV_TYPES}
                onChange={handleSelect}
                disabled={disabled}
                className="hidden"
                aria-label="Upload CSV file"
            />

            {!fileName ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className={`flex flex-col items-center justify-center w-full gap-2 px-4 py-8 text-center border-2 border-dashed rounded-lg transition-colors
                        ${disabled
                            ? 'cursor-not-allowed opacity-60 border-gray-300 dark:border-gray-600'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'}`}
                >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Click to upload a CSV file
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        The file must include a column titled <strong>email</strong> (max 5MB)
                    </span>
                </button>
            ) : (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <div className="flex items-center gap-3 min-w-0">
                        <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                {fileName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {emails.length} valid email{emails.length === 1 ? '' : 's'} found
                                {invalid.length > 0 && ` · ${invalid.length} skipped`}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={disabled}
                        aria-label="Remove uploaded file"
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:cursor-not-allowed"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}

            {invalid.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    Skipped {invalid.length} invalid {invalid.length === 1 ? 'entry' : 'entries'}: {invalid.slice(0, 3).join(', ')}
                    {invalid.length > 3 && '…'}
                </p>
            )}
        </div>
    );
};

// ============================================================================
// FORM COMPONENT
// ============================================================================

const SendMailForm = ({ onClose }) => {
    // ========================================
    // STATE
    // ========================================
    const [mode, setMode] = useState(RECIPIENT_MODE.MEMBERS);
    const [selectedRole, setSelectedRole] = useState('all');

    // CSV upload state
    const [csvFileName, setCsvFileName] = useState('');
    const [csvInvalid, setCsvInvalid] = useState([]);
    const [csvError, setCsvError] = useState(null);

    const isCsvMode = mode === RECIPIENT_MODE.CSV;

    // ========================================
    // FORM SETUP
    // ========================================
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(useMemo(() => buildSchema(mode), [mode])),
        defaultValues: INITIAL_VALUES,
        mode: 'onChange',
    });

    // Watch values for display purposes
    const templateId = watch('template_id');
    const emails = watch('emails') || [];

    // ========================================
    // QUERIES & MUTATIONS
    // ========================================
    const {
        data: members = [],
        isLoading: isLoadingMembers,
        isError: isMembersError,
        error: membersError
    } = useMembersByRole({ role: selectedRole });

    const {
        mutateAsync: sendBulkMail,
        isPending: isSending
    } = useSendBulkMail({
        onSuccess: () => {
            onClose?.();
        }
    });

    // ========================================
    // DERIVED DATA
    // ========================================
    const userOptions = useMemo(() =>
        transformMembersToOptions(members),
        [members]
    );

    const roleLabel = useMemo(() =>
        getRoleLabel(selectedRole),
        [selectedRole]
    );

    const isFormDisabled = isSending || isSubmitting;
    const hasNoRecipients = !isLoadingMembers && userOptions.length === 0;

    // Submit is blocked only by conditions relevant to the active mode
    const recipientCount = isCsvMode ? emails.length : (watch('user_ids')?.length || 0);
    const isSubmitBlocked = isCsvMode
        ? emails.length === 0
        : (isMembersError || hasNoRecipients);

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Switch between member-select and CSV-upload modes.
     * Resets the inactive mode's recipient state so a stale value can't be sent.
     */
    const handleModeChange = useCallback((nextMode) => {
        if (nextMode === mode) return;
        setMode(nextMode);
        clearErrors(['user_ids', 'emails']);

        if (nextMode === RECIPIENT_MODE.MEMBERS) {
            setValue('emails', [], { shouldValidate: false });
            setCsvFileName('');
            setCsvInvalid([]);
            setCsvError(null);
        } else {
            setValue('user_ids', [], { shouldValidate: false });
        }
    }, [mode, clearErrors, setValue]);

    /**
     * Handle role change
     * Clears selected user_ids when role changes
     */
    const handleRoleChange = useCallback((role) => {
        setSelectedRole(role);
        setValue('user_ids', [], { shouldValidate: false });
    }, [setValue]);

    /**
     * Parse an uploaded CSV file and load its emails into the form.
     */
    const handleCsvFile = useCallback(async (file) => {
        setCsvError(null);
        setCsvInvalid([]);

        if (file.size > MAX_CSV_SIZE_BYTES) {
            setCsvFileName('');
            setValue('emails', [], { shouldValidate: true });
            setCsvError('File is too large. Please upload a CSV under 5MB.');
            return;
        }

        try {
            const text = await readFileAsText(file);
            const { emails: parsedEmails, invalid, error } = extractEmailsFromCsv(text);

            setCsvFileName(file.name);
            setCsvInvalid(invalid);
            setCsvError(error);
            setValue('emails', parsedEmails, { shouldValidate: true });
        } catch {
            setCsvFileName('');
            setValue('emails', [], { shouldValidate: true });
            setCsvError('Could not read the file. Please try again.');
        }
    }, [setValue]);

    /**
     * Clear the uploaded CSV file and its parsed emails.
     */
    const handleClearCsv = useCallback(() => {
        setCsvFileName('');
        setCsvInvalid([]);
        setCsvError(null);
        setValue('emails', [], { shouldValidate: true });
    }, [setValue]);

    /**
     * Handle form submission
     * Builds a mode-specific payload: `user_ids` for member mode, `emails` for CSV mode.
     */
    const onSubmit = useCallback(async (formData) => {
        try {
            const payload = {
                template_id: formData.template_id.trim(),
                use_merge_info: toMergeBoolean(formData.use_merge_info),
                ...(isCsvMode
                    ? { emails: formData.emails }
                    : { user_ids: formData.user_ids }),
            };

            await sendBulkMail(payload);
        } catch (error) {
            // Error handling is done in the mutation hook
            console.error('Failed to send bulk mail:', error);
        }
    }, [sendBulkMail, isCsvMode]);

    /**
     * Handle cancel
     */
    const handleCancel = useCallback(() => {
        if (!isFormDisabled) {
            onClose?.();
        }
    }, [onClose, isFormDisabled]);

    // ========================================
    // RENDER HELPERS
    // ========================================
    const getRecipientPlaceholder = () => {
        if (isLoadingMembers) return "Loading recipients...";
        if (hasNoRecipients) return `No ${roleLabel.toLowerCase()} available`;
        return "Select recipients...";
    };

    // ========================================
    // RENDER
    // ========================================
    return (
        <Animated animation="fade-up" className="space-y-5 w-full">
            {/* Error Messages */}
            {!isCsvMode && isMembersError && (
                <Message
                    data={{
                        message: membersError?.message || 'Failed to load recipients'
                    }}
                    variant="error"
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Template ID Input */}
                <div className="w-full">
                    <InputForm
                        label="Email Template ID"
                        expandParent
                        name="template_id"
                        register={register}
                        error={errors.template_id?.message}
                        disabled={isFormDisabled}
                        placeholder="Enter template ID (e.g., welcome-email)"
                        required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        The unique identifier for the email template to use.
                    </p>
                </div>

                {/* Recipient Source Toggle */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recipient Source
                    </label>
                    <ModeToggle
                        mode={mode}
                        onChange={handleModeChange}
                        disabled={isFormDisabled}
                    />
                </div>

                {/* ── MEMBER MODE ── */}
                {!isCsvMode && (
                    <>
                        {/* Role Selection */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Recipient Group
                            </label>
                            <RoleSelection
                                selectedRole={selectedRole}
                                onRoleChange={handleRoleChange}
                                disabled={isFormDisabled}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Choose a group to filter available recipients. Currently showing: <strong>{roleLabel}</strong>
                            </p>
                        </div>

                        {/* Recipients Selection */}
                        <div className="w-full">
                            <MultiSelectForm
                                label={`Select Recipients (${roleLabel})`}
                                expandParent
                                name="user_ids"
                                options={userOptions}
                                register={register}
                                setValue={setValue}
                                error={errors.user_ids?.message}
                                disabled={isFormDisabled || isLoadingMembers || hasNoRecipients}
                                placeholder={getRecipientPlaceholder()}
                                required
                            />

                            {/* Loading State */}
                            {isLoadingMembers && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading {roleLabel.toLowerCase()}...
                                </p>
                            )}

                            {/* No Recipients Warning */}
                            {hasNoRecipients && (
                                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    No {roleLabel.toLowerCase()} available. Try selecting a different group.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* ── CSV MODE ── */}
                {isCsvMode && (
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload Recipient Emails
                        </label>
                        <CsvEmailUpload
                            emails={emails}
                            invalid={csvInvalid}
                            fileName={csvFileName}
                            error={csvError || errors.emails?.message}
                            disabled={isFormDisabled}
                            onFile={handleCsvFile}
                            onClear={handleClearCsv}
                        />
                    </div>
                )}

                {/* Merge Info Option */}
                <div className="w-full">
                    <RadioForm
                        label="Use Merge Info"
                        name="use_merge_info"
                        register={register}
                        error={errors.use_merge_info?.message}
                        disabled={isFormDisabled}
                        description="Enable this to include personalized member information (name, email, etc.) in the email template."
                        layout="grid"
                        required
                        options={[
                            {
                                value: 'true',
                                label: 'Yes',
                                description: 'Include member merge fields in email'
                            },
                            {
                                value: 'false',
                                label: 'No',
                                description: 'Send generic email without merge fields'
                            }
                        ]}
                    />
                </div>

                {/* Summary Info */}
                {templateId && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Ready to Send
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Template: <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded text-blue-900 dark:text-blue-100">{templateId}</code>
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Recipients: {recipientCount} {isCsvMode ? 'email' : 'member'}{recipientCount === 1 ? '' : 's'} selected
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Merge Info: <strong>{toMergeBoolean(watch('use_merge_info')) ? 'Enabled' : 'Disabled'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 border-t pt-5 dark:border-gray-600">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isFormDisabled}
                        className="flex-1"
                        aria-label="Cancel email sending"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        loading={isFormDisabled}
                        disabled={isFormDisabled || isSubmitBlocked}
                        className="flex-1"
                        aria-label="Send email"
                    >
                        {isFormDisabled ? 'Sending...' : 'Send Email'}
                    </Button>
                </div>
            </form>
        </Animated>
    );
};

export default SendMailToMembers;
