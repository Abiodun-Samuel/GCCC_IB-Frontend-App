import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminService } from '../services/admin.service';
import { QUERY_KEYS } from '../utils/queryKeys';
import { handleApiError } from '@/utils/helper';
import { Toast } from '@/lib/toastify';

export const useAdminAnalytics = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.ANALYTICS(params),
    queryFn: async () => {
      const { data } = await AdminService.getAdminAnalytics(params);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};
export const useFetchFromYouTube = (options = {}) => {
  return useMutation({
    mutationFn: AdminService.fetchFromYouTube,
    onSuccess: (data, variables) => {
      Toast.success('YouTube videoes have been fetched successfully. ');
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};
export const useAssignRoleToUsers = (options = {}) => {
  return useMutation({
    mutationFn: AdminService.assignRoleToUsers,
    onSuccess: (data, variables) => {
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};

export const useSyncUsersPermissions = (options = {}) => {
  return useMutation({
    mutationFn: AdminService.syncUsersPermissions,
    onSuccess: (data, variables) => {
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};
