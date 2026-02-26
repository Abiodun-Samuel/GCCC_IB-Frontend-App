import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../utils/queryKeys';
import { UserService } from '../services/user.service';
import { Toast } from '../lib/toastify';
import { useAuthStore } from '@/store/auth.store';
import { handleApiError } from '@/utils/helper';

export const useUpdateProfile = (options = {}) => {
  const { setAuthenticatedUser, user } = useAuthStore();

  return useMutation({
    mutationKey: undefined,
    mutationFn: async (variables) => {
      const data = await UserService.updateProfile(variables);
      return data;
    },
    onMutate: async (variables) => {
      if (variables.avatar) {
        const optimisticUser = { ...user, avatar: variables.avatar };
        setAuthenticatedUser({ user: optimisticUser });
      }
      return { previousUser: user };
    },
    onSuccess: ({ data }, variables, _) => {
      const { user } = data;
      setAuthenticatedUser({ user });
      Toast.success(data?.message || 'Profile updated successfully');
      options.onSuccess?.(data, variables);
    },

    onError: (error, _, context) => {
      if (context?.previousUser) {
        setAuthenticatedUser({ user: context.previousUser });
      }
      const message = handleApiError(error);
      Toast.error(message || 'Failed to update user record');
      options.onError?.(error);
    },
  });
};

export const useGetAssignedAbsentees = (options = {}) => {
  const { isAdmin, isLeader, isMember } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.USER.ABSENT,
    queryFn: async () => {
      const { data } = await UserService.getAssignedAbsentees();
      return data;
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: isAdmin || isLeader || isMember,
    ...options,
  });
};

export const useGetAssignedMembers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.ASSIGNED_MEMBER,
    queryFn: async () => {
      const { data } = await UserService.getAssignedMembers();
      return data;
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.sendAwardPoints,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
    onError: () => { },
  });
};