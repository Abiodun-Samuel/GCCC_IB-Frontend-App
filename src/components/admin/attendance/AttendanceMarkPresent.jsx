import { useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-multi-date-picker';
import Animated from '@/components/common/Animated';
import Message from '@/components/common/Message';
import Button from '@/components/ui/Button';
import { useAdminMarkAttendance } from '@/queries/attendance.query';
import { useMembersByRole } from '@/queries/member.query';
import MultiSelectForm from '@/components/form/useForm/MultiSelectForm';
import { getMatchingServiceId } from '@/utils/helper';
import { markPresentMemberSchema } from '@/schema';
import { Toast } from '@/lib/toastify';

const INITIAL_VALUES = {
    attendance_date: null,
    member_ids: []
};

const AttendanceMarkPresent = ({ services = [], onClose, activeFilters }) => {
    const { data: members, isLoading: isLoadingMembers } = useMembersByRole({ role: 'all' });;

    const {
        mutateAsync: markPresent,
        isPending: isMarking,
        isError: isMarkError,
        error: markError,
        isSuccess: isMarkSuccess
    } = useAdminMarkAttendance(activeFilters);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(markPresentMemberSchema),
        defaultValues: INITIAL_VALUES,
        mode: 'onChange'
    });

    // Handle success state with cleanup
    useEffect(() => {
        if (isMarkSuccess) {
            reset(INITIAL_VALUES);
            Toast.success('Selected members\' attendance have been recorded successfully.');
        }
    }, [isMarkSuccess, reset]);

    // Memoized member options for select dropdown
    const memberOptions = useMemo(() => {
        if (!members) return [];
        return members.map(member => ({
            value: member.id,
            text: member.full_name
        }));
    }, [members]);

    // Handle date change with error clearing
    const handleDateChange = useCallback((date, onChange) => {
        // Clear date error when user starts typing
        if (errors.attendance_date) {
            clearErrors('attendance_date');
        }

        if (!date) {
            onChange(null);
            return;
        }

        const formattedDate = date.format('YYYY/MM/DD');
        onChange(formattedDate);
    }, [errors.attendance_date, clearErrors]);

    // Submit handler with comprehensive error handling
    const onSubmit = useCallback(async (formData) => {
        try {
            // Validate service exists for selected date
            const serviceId = getMatchingServiceId(services, formData.attendance_date);

            if (!serviceId) {
                setError('attendance_date', {
                    type: 'manual',
                    message: 'No service found for the selected date. Please select a valid service date.'
                });
                return;
            }

            // Transform member IDs into attendance records
            const attendances = formData.member_ids.map(memberId => ({
                user_id: memberId,
                status: 'present',
                mode: 'onsite'
            }));

            // Prepare payload for API
            const payload = {
                service_id: serviceId,
                attendance_date: formData.attendance_date,
                attendances
            };

            await markPresent(payload);
            onClose?.();
        } catch (error) {
            // Graceful error handling with fallback messages
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to mark attendance. Please try again.';
            Toast.error(errorMessage);
        }
    }, [services, markPresent, setError, onClose]);

    // Computed form state
    const isFormDisabled = isMarking || isSubmitting;

    return (
        <Animated
            animation="fade-up"
            className="space-y-5 w-full"
        >
            {/* Error message display */}
            {isMarkError && (
                <Message
                    data={markError?.data}
                    message={markError?.message}
                    variant="error"
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Service Date Picker */}
                <div>
                    <label
                        htmlFor="attendance_date"
                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Service Date <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="attendance_date"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                id="attendance_date"
                                containerStyle={{
                                    width: '100%'
                                }}
                                placeholder="Select service date..."
                                value={value || null}
                                format="YYYY/MM/DD"
                                onChange={(date) => handleDateChange(date, onChange)}
                                disabled={isFormDisabled}
                                className={errors.attendance_date ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.attendance_date && (
                        <p
                            className="mt-1 text-sm text-red-600 dark:text-red-400"
                            role="alert"
                        >
                            {errors.attendance_date.message}
                        </p>
                    )}
                </div>

                {/* Members Multi-Select */}
                <div className="w-full">
                    <MultiSelectForm
                        label="Select Members"
                        expandParent
                        name="member_ids"
                        options={memberOptions}
                        register={register}
                        setValue={setValue}
                        error={errors.member_ids?.message}
                        disabled={isLoadingMembers || isFormDisabled}
                        placeholder={
                            isLoadingMembers
                                ? 'Loading members...'
                                : 'Select members to mark present...'
                        }
                        required
                    />
                    {!isLoadingMembers && memberOptions.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            No members available. Please add members first.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t pt-5 dark:border-gray-600">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isFormDisabled}
                        className="flex-1"
                        aria-label="Cancel attendance marking"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        loading={isFormDisabled}
                        disabled={isFormDisabled}
                        className="flex-1"
                        aria-label="Submit attendance"
                    >
                        {isFormDisabled ? 'Marking...' : 'Mark Present'}
                    </Button>
                </div>
            </form>
        </Animated>
    );
};

export default AttendanceMarkPresent;