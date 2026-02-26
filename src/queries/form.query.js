import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormService } from '../services/form.service';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Toast } from '../lib/toastify';
import { handleApiError } from '../utils/helper';

export const useAllFormMessages = (type, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.FORM_MESSAGES.ALL(type),
    queryFn: async () => {
      const { data } = await FormService.getFormMessages({ type });
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useUpdateFormMessages = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, attended }) => {
      return await FormService.updateFormMessages({ ids, attended });
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FORM_MESSAGES.ALL(variables?.type),
      });
      options.onSuccess?.(response.data, variables);
      Toast.success('Messages updated successfully!');
    },
    onError: (error) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useDeleteFormMessages = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids }) => {
      return await FormService.deleteFormMessages({ ids });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FORM_MESSAGES.ALL(variables?.type),
      });
      Toast.success('Messages deleted successfully');
      options.onSuccess?.(data, variables);
    },
    onError: (error, { ids }, context) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message || 'Failed to delete messages');
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useCreateFormMessages = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FormService.createFormMessages,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      Toast.success('Your message has been submitted successfully.');
      options.onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};
