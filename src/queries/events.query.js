import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService } from '@/services/events.service';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * Create a new event (admin only)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useCreateEvent = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EventService.createEvent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.ALL });
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
 * Get a single event by ID or slug
 * @param {string|number} identifier - Event ID or slug
 * @param {Object} options - Query options (enabled, onSuccess, etc.)
 */
export const useEvent = (identifier, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.DETAIL(identifier),
    queryFn: () => EventService.getEvent(identifier),
    enabled: !!identifier && options.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Get all events with optional filters
 * @param {Object} params - Query parameters (page, per_page, status, date_from, date_to, category, etc.)
 * @param {Object} options - Query options
 */
export const useEvents = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.LIST(params),
    queryFn: () => EventService.getEvents(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get all events (admin view)
 * @param {Object} params - Query parameters
 * @param {Object} options - Query options
 */
export const useAdminEvents = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.ADMIN(params),
    queryFn: () => EventService.getAdminEvents(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get featured/upcoming events
 * @param {Object} options - Query options
 */
export const useFeaturedEvents = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.FEATURED,
    queryFn: EventService.getFeaturedEvents,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Update an event (admin only)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useUpdateEvent = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EventService.updateEvent,
    onSuccess: (data, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.EVENTS.DETAIL(variables.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.ALL });
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
 * Toggle event published status (admin only)
 * @param {Object} options - Mutation options
 */
export const useToggleEventStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EventService.toggleEventStatus,
    onSuccess: (data, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.EVENTS.DETAIL(variables.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.ALL });
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
 * Delete an event (admin only)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useDeleteEvent = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EventService.deleteEvent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.ALL });
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