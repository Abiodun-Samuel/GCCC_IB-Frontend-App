import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService } from '@/services/events.service';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Get all events with optional filters (public)
 * @param {Object} params - Query parameters (page, per_page, etc.)
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

export const useClosestEvent = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS.LIST(params),
    queryFn: () => EventService.getClosestEvents(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get a single event by ID or slug (public)
 * @param {string|number} identifier - Event ID or slug
 * @param {Object} options - Query options
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
      Toast.error(handleApiError(error));
      options.onError?.(error);
    },
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.DETAIL(variables.id) });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.ALL });
      if (data?.message) Toast.success(data.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      Toast.error(handleApiError(error));
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
      Toast.error(handleApiError(error));
      options.onError?.(error);
    },
  });
};