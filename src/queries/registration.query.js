import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventRegistrationService } from '@/services/registration.service';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * Create a new event registration (user signs up)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useCreateRegistration = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.createRegistration,
        onSuccess: (data, variables) => {
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.MY_REGISTRATIONS });
            // if (variables?.event_id) {
            //     queryClient.invalidateQueries({
            //         queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.BY_EVENT(variables.event_id),
            //     });
            // }
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Get a single event registration by ID
 * @param {string|number} id - Registration ID
 * @param {Object} options - Query options (enabled, onSuccess, etc.)
 */
export const useRegistration = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.DETAIL(id),
        queryFn: () => EventRegistrationService.getRegistration(id),
        enabled: !!id && options.enabled !== false,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Get current user's own registrations
 * @param {Object} params - Query parameters (page, per_page, status, etc.)
 * @param {Object} options - Query options
 */
export const useMyRegistrations = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.MY_REGISTRATIONS(params),
        queryFn: () => EventRegistrationService.getMyRegistrations(params),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Get all registrations for a specific event
 * @param {string|number} eventId - Event ID
 * @param {Object} params - Query parameters (page, per_page, status, etc.)
 * @param {Object} options - Query options
 */
export const useEventRegistrations = (eventId, params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.BY_EVENT(eventId, params),
        queryFn: () => EventRegistrationService.getEventRegistrations(eventId, params),
        enabled: !!eventId && options.enabled !== false,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Get all registrations (admin view)
 * @param {Object} params - Query parameters (page, per_page, event_id, status, search, etc.)
 * @param {Object} options - Query options
 */
export const useAdminRegistrations = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ADMIN(params),
        queryFn: () => EventRegistrationService.getAdminRegistrations(params),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Update an event registration
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useUpdateRegistration = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.updateRegistration,
        onSuccess: (data, variables) => {
            if (variables?.id) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.DETAIL(variables.id),
                });
            }
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.MY_REGISTRATIONS });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};

/**
 * Cancel a registration (user action)
 * @param {Object} options - Mutation options
 */
export const useCancelRegistration = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.cancelRegistration,
        onSuccess: (data, variables) => {
            if (variables) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.DETAIL(variables),
                });
            }
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.MY_REGISTRATIONS });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};

/**
 * Update registration status (admin only)
 * @param {Object} options - Mutation options
 */
export const useUpdateRegistrationStatus = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.updateRegistrationStatus,
        onSuccess: (data, variables) => {
            if (variables?.id) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.DETAIL(variables.id),
                });
            }
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};

/**
 * Check in a registration (mark as attended) - admin only
 * @param {Object} options - Mutation options
 */
export const useCheckInRegistration = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.checkInRegistration,
        onSuccess: (data, variables) => {
            if (variables) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.DETAIL(variables),
                });
            }
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * Delete a registration (admin only)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useDeleteRegistration = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: EventRegistrationService.deleteRegistration,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_REGISTRATIONS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            const message = handleApiError(error);
            Toast.error(message);
            options.onError?.(error);
        },
    });
};