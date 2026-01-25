import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AttendanceService } from '../services/attendance.service';
import { QUERY_KEYS } from '../utils/queryKeys';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../lib/toastify';
import { handleApiError } from '../utils/helper';
import { useAuthStore } from '@/store/auth.store';

export const useAllAttendance = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.ALL_RECORDS(params),
    queryFn: async () => {
      const { data } = await AttendanceService.getAllAttendance(params);
      return data || [];
    },
    cacheTime: 5 * 60 * 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });
};

export const useUserAttendance = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.ALL_RECORDS_USER(params),
    queryFn: async () => {
      const { data } = await AttendanceService.getAllUserAttendance(params);
      return data || [];
    },
    cacheTime: 5 * 60 * 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });
};

// Mark attendance mutation
export const useMarkAttendance = (options = {}) => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuthStore();


  return useMutation({
    mutationFn: AttendanceService.markAttendance,
    onSuccess: ({ data, message }, variables) => {
      const { user } = data
      setAuthenticatedUser({ user })
      Toast.success(message || 'Attendance submitted successfully');
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 3000);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

// Mark absentees mutation
export const useMarkAbsentees = (params = {}, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AttendanceService.markAbsentees,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ATTENDANCE.ALL_RECORDS(params),
      });
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

export const useAdminMarkAttendance = (params = {}, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AttendanceService.adminMarkAttendance,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ATTENDANCE.ALL_RECORDS(params),
      });
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

export const useAssignAbsenteesToLeaders = (options = {}) => {
  return useMutation({
    mutationFn: AttendanceService.assignAbsenteesToLeaders,
    onSuccess: (data, variables) => {
      Toast.success(data?.message);
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

export const useUsersMonthlyAttendanceStats = (year, month) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.USER_BY_MONTH_YEAR(year, month),
    queryFn: async () => {
      const { data } = await AttendanceService.getUserAttendanceMonthlyStats(
        year,
        month
      );
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useMonthlyAttendanceStats = (year, mode) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.BY_MONTH_YEAR(year, mode),
    queryFn: async () => {
      const { data } = await AttendanceService.getAdminAttendanceMonthlyStats(
        year,
        mode
      );
      return data;
    },
    // enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // ...options,
  });
};

export const useAttendanceReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE.REPORT(params),
    queryFn: async () => {
      const { data } = await AttendanceService.getAttendanceReport(params);
      return data;
    },
    cacheTime: 5 * 60 * 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });
};