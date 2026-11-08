import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MemberService } from '../services/member.service';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Toast } from '../lib/toastify';
import { handleApiError } from '../utils/helper';

export const useAllUsers = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.ALL_USERS,
    queryFn: async () => {
      const { data } = await MemberService.getAllUsers();
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};
export const useMembers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.ALL(params),
    queryFn: async () => {
      const { data } = await MemberService.getAllMembers(params);
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};

export function useMembersByRole(params = {}, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.ROLE(params?.role, params),
    queryFn: async () => {
      const { data } = await MemberService.fetchMembersByRole(params?.role, params);
      return data;
    },
    enabled: !!params?.role,
    staleTime: 1000 * 60 * 5,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
}

// Get member by ID
export const useMember = (memberId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.DETAIL(memberId),
    queryFn: async () => {
      const response = await MemberService.getMemberById(memberId);
      return response.data;
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    ...options,
    retry: 0,
  });
};

export const useUpdateMember = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await MemberService.updateMember(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        QUERY_KEYS.MEMBERS.DETAIL(variables?.id?.toString()),
        data?.data || data
      );
      Toast.success(data?.message);
      options.onSuccess?.(data?.data ?? data, variables);
    },
    onError: (error) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useCreateMember = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MemberService.createMember,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBERS.ALL });
      Toast.success(response.message);
      options.onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useUpdateGloryTeamMembers = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MemberService.updateGloryTeamMembers,
    onSuccess: (response, variables) => {
      Toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBERS.ROLE({}) });
      options.onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useAssignMembers = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MemberService.assignMembers,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBERS.ALL });
      Toast.success(response.message);
      options.onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      console.log(error)
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};

export const useDeleteMember = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MemberService.deleteMember,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBERS.ALL });
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const errorDetails = handleApiError(error);
      Toast.error(errorDetails.message);
      options.onError?.(new Error(errorDetails.message));
    },
  });
};
