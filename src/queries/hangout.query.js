import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HangoutService } from '@/services/hangout.service';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';

/** A validation reply's first field message beats the generic "data was invalid". */
const errorMessage = (error) => {
  const firstFieldError = Object.values(error?.data?.errors ?? {})[0]?.[0];
  return firstFieldError || handleApiError(error);
};

/**
 * Hangout details for the public page (public)
 */
export const useHangout = (options = {}) => useQuery({
  queryKey: QUERY_KEYS.HANGOUT.DETAILS,
  queryFn: HangoutService.getHangout,
  staleTime: 2 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  ...options,
});

/**
 * Register for the hangout, or update an existing registration (public)
 * @param {Object} options - Mutation options with onSuccess/onError callbacks
 */
export const useHangoutRegistration = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: HangoutService.register,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HANGOUT.DETAILS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HANGOUT.REGISTRATIONS_ALL });
      if (data?.message) Toast.success(data.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      Toast.error(errorMessage(error));
      options.onError?.(error);
    },
  });
};

/**
 * Hangout registrations with filters, sorting and pagination (admin only).
 * Keeps the previous page on screen while the next one loads.
 * @param {Object} params - search, game, support, sort, direction, page, per_page
 */
export const useHangoutRegistrations = (params = {}, options = {}) => useQuery({
  queryKey: QUERY_KEYS.HANGOUT.REGISTRATIONS(params),
  queryFn: () => HangoutService.getRegistrations(params),
  placeholderData: keepPreviousData,
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  ...options,
});
