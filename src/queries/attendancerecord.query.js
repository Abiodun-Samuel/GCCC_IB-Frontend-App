import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Toast } from '../lib/toastify';
import { handleApiError } from '../utils/helper';
import { AttendanceRecords } from '@/services/attendancerecord.service';

// Get all attendance records
export const useAttendanceRecords = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.ALL,
    queryFn: async () => {
      const { data } = await AttendanceRecords.getAllAttendanceRecords();
      return data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};

// Get attendance record by ID
export const useAttendanceRecord = (id, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.DETAIL(id),
    queryFn: async () => {
      const { data } = await AttendanceRecords.getAttendanceRecordById(id);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Create attendance record
export const useCreateAttendanceRecord = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await AttendanceRecords.createAttendanceRecord(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.ALL,
      });
      Toast.success(data?.message || 'Attendance record created successfully');
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

// Update attendance record
export const useUpdateAttendanceRecord = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await AttendanceRecords.updateAttendanceRecord(payload);
    },
    onSuccess: (data, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.DETAIL(variables.id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.ALL,
      });
      Toast.success(data?.message || 'Attendance record updated successfully');
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};

// Delete multiple attendance records
export const useDeleteAttendanceRecords = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await AttendanceRecords.deleteAttendanceRecords(id);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ATTENDANCE_RECORDS.ALL,
      });
      Toast.success(data?.message || 'Attendance records deleted successfully');
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      const message = handleApiError(error);
      Toast.error(message);
      options.onError?.(new Error(message));
    },
  });
};
