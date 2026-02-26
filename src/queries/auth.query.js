import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Toast } from '../lib/toastify';
import { useAuthStore } from '../store/auth.store';
import { handleApiError } from '../utils/helper';

export const useMe = (options = {}) => {
  const { setAuthenticatedUser, resetAuthenticatedUser, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      try {
        const {
          data: { user },
        } = await AuthService.getMe();
        setAuthenticatedUser({ user });
        return user;
      } catch (error) {
        resetAuthenticatedUser();
      }
    },
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 0,
    ...options,
    enabled: isAuthenticated,
    onError: (error) => {
      options.onError?.(error);
    },
  });
};

export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();
  const { setAuthenticatedUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: ({ data }) => {
      const { token, user } = data;
      setAuthenticatedUser({ user });
      setToken({ token });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
      Toast.success(`Welcome back, ${user?.first_name}!`);
      options.onSuccess?.(response, credentials);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};

export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: AuthService.sendResetLink,
    onSuccess: (data) => {
      Toast.success(data?.message);
      options.onSuccess?.(data, credentials);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};
export const useResetPassword = (options = {}) => {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: (data) => {
      Toast.success(data?.message);
      options.onSuccess?.(data, credentials);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
    },
  });
};

// Logout mutation
export const useLogout = (options = {}) => {
  const queryClient = useQueryClient();
  const { resetAuthenticatedUser } = useAuthStore();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.clear();
      resetAuthenticatedUser();

      Toast.success('You have been logged out successfully');
      options.onSuccess?.();
    },
    onError: (error) => {
      resetAuthenticatedUser();
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(error);
    },
  });
};
