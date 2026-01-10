import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, CheckCircle, Filter } from 'lucide-react';

// Components
import Button from '@/components/ui/Button';
import SingleSelectForm from '@/components/form/useForm/SingleSelectForm';

// Hooks & Utils
import { useUpdateFirstTimer } from '@/queries/firstTimer.query';
import { useFollowUpStatuses } from '@/queries/followupstatus.query';
import { useMembersByRole } from '@/queries/member.query';
import { useAuthStore } from '@/store/auth.store';
import { updateFirstTimerStatusSchema } from '@/schema';
import { Toast } from '@/lib/toastify';
import { ROLE_OPTIONS } from '@/utils/data';

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLE_SELECT_OPTIONS = ROLE_OPTIONS
    .filter(
        (role) =>
            !['firstTimer', 'nonGloryTeam', 'all'].includes(role.value)
    )
    .map((role) => ({
        value: role.value,
        text: role.text,
    }));

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

    return members.map(member => {
        const fullName = member.full_name || `${member.first_name} ${member.last_name}`.trim();
        const displayName = fullName || member.email;

        // Add unit information for glory team members
        if (member.is_glory_team_member) {
            const units = member.units && Array.isArray(member.units) && member.units.length > 0
                ? member.units.map(unit => unit.name).join(', ')
                : 'No Unit';

            return {
                value: member.id,
                text: `${displayName} - (${units})`
            };
        }

        return {
            value: member.id,
            text: displayName
        };
    });
};

/**
 * Transform follow-up statuses to select options
 * @param {Array} statuses - Array of status objects
 * @returns {Array} - Array of option objects {value, text}
 */
const transformStatusesToOptions = (statuses) => {
    if (!Array.isArray(statuses) || statuses.length === 0) return [];

    return statuses.map(status => ({
        value: status.id,
        text: status.title
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EditFirstTimer = ({ firstTimerData, onClose }) => {
    // ========================================
    // STATE
    // ========================================
    const [selectedRole, setSelectedRole] = useState('leader');

    // ========================================
    // STORE & QUERIES
    // ========================================
    const { isAdmin } = useAuthStore();

    const {
        mutateAsync: updateFirstTimer,
        isPending: isUpdateFirstTimerPending
    } = useUpdateFirstTimer();

    const {
        data: followupStatuses = []
    } = useFollowUpStatuses();

    const {
        data: members = [],
        isLoading: isLoadingMembers,
        isError: isMembersError,
        error: membersError
    } = useMembersByRole({ role: selectedRole });

    // ========================================
    // FORM SETUP
    // ========================================
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(updateFirstTimerStatusSchema),
        defaultValues: {
            followup_by_id: firstTimerData?.assigned_to_member?.id || '',
            follow_up_status_id: firstTimerData?.follow_up_status?.id || '',
            id: firstTimerData?.id,
        }
    });

    // Watch form values
    const followupById = watch('followup_by_id');

    // ========================================
    // DERIVED DATA
    // ========================================
    const membersOptions = useMemo(() =>
        transformMembersToOptions(members),
        [members]
    );

    const followupStatusesOptions = useMemo(() =>
        transformStatusesToOptions(followupStatuses),
        [followupStatuses]
    );

    const roleLabel = useMemo(() =>
        getRoleLabel(selectedRole),
        [selectedRole]
    );

    const isFormDisabled = isUpdateFirstTimerPending;
    const hasNoMembers = !isLoadingMembers && membersOptions.length === 0;

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Handle role change
     * Clears selected member when role changes
     */
    const handleRoleChange = useCallback((event) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        setValue('followup_by_id', '', { shouldValidate: false });
    }, [setValue]);

    /**
     * Handle form submission
     */
    const handleEditFirstTimer = useCallback(async (data) => {
        try {
            await updateFirstTimer(data);
            Toast.success('First timer updated successfully');
            onClose?.();
        } catch (error) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to update first timer';
            Toast.error(errorMessage);
        }
    }, [updateFirstTimer, onClose]);

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
    const getMemberPlaceholder = () => {
        if (isLoadingMembers) return "Loading members...";
        if (hasNoMembers) return `No ${roleLabel.toLowerCase()} available`;
        return "Select a member...";
    };

    // ========================================
    // RENDER
    // ========================================
    return (
        <form onSubmit={handleSubmit(handleEditFirstTimer)} className='w-full space-y-6'>
            {/* Error Message */}
            {isMembersError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {membersError?.message || 'Failed to load members'}
                    </p>
                </div>
            )}

            {/* Assign to Member Section - Only visible to admins */}
            {isAdmin && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-4">
                    {/* Section Header */}
                    <div className="flex items-start gap-2 pb-3 border-b border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Member Assignment
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Assign this first timer to a member for follow-up
                            </p>
                        </div>
                    </div>

                    {/* Role Filter Dropdown */}
                    <div className="w-full">
                        <label
                            htmlFor="role-filter"
                            className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Filter Members by Role
                        </label>
                        <select
                            id="role-filter"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            disabled={isFormDisabled}
                            className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:border-blue-300 dark:hover:border-blue-600"
                        >
                            {ROLE_SELECT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                            Currently showing: <strong>{roleLabel}</strong>
                        </p>
                    </div>

                    {/* Member Selection */}
                    <div className="w-full">
                        <SingleSelectForm
                            label="Assign to Member"
                            name="followup_by_id"
                            register={register}
                            setValue={setValue}
                            error={errors.followup_by_id?.message}
                            searchable={true}
                            expandParent={true}
                            options={membersOptions}
                            disabled={isFormDisabled || isLoadingMembers || hasNoMembers}
                            placeholder={getMemberPlaceholder()}
                            defaultValue={firstTimerData?.assigned_to_member?.id}
                        />

                        {/* Helper Text */}
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1.5">
                            <span className="text-base">💡</span>
                            Glory Team members are displayed with their assigned units for easy identification.
                        </p>

                        {/* Loading State */}
                        {isLoadingMembers && (
                            <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading {roleLabel.toLowerCase()}...
                                </p>
                            </div>
                        )}

                        {/* No Members Warning */}
                        {hasNoMembers && (
                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>No {roleLabel.toLowerCase()} available. Try selecting a different role.</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Assignment Summary Info */}
                    {followupById && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                        Assignment Ready
                                    </h4>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                        First timer <strong className="text-blue-700 dark:text-blue-300">{firstTimerData?.full_name || 'Unknown'}</strong> will be assigned to the selected member for follow-up.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Follow-up Status Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-xl p-5 space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Follow-up Status
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Update the current follow-up status
                        </p>
                    </div>
                </div>

                {/* Status Selection */}
                <div>
                    <SingleSelectForm
                        label="Select Status"
                        name="follow_up_status_id"
                        options={followupStatusesOptions}
                        register={register}
                        setValue={setValue}
                        error={errors.follow_up_status_id?.message}
                        searchable={true}
                        expandParent={true}
                        disabled={isFormDisabled}
                        placeholder="Select new status..."
                        defaultValue={firstTimerData?.follow_up_status?.id}
                    />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1.5">
                        <span className="text-base">📊</span>
                        Track the progress of follow-up activities
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant='ghost'
                    onClick={handleCancel}
                    disabled={isFormDisabled}
                    className="flex-1 h-11"
                    aria-label="Cancel editing"
                >
                    Cancel
                </Button>
                <Button
                    type='submit'
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                    loading={isFormDisabled}
                    disabled={isFormDisabled || (isAdmin && (isMembersError || hasNoMembers))}
                    aria-label="Update first timer"
                >
                    {isFormDisabled ? 'Updating...' : 'Update First Timer'}
                </Button>
            </div>
        </form>
    );
};

export default EditFirstTimer;