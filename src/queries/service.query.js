import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../services/service.service';
import { QUERY_KEYS } from '../utils/queryKeys';

export const useServices = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.ALL,
    queryFn: async () => {
      const { data } = await ServiceService.getAllServices();
      return data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};
export const useCoreAppData = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.CORE_DATA,
    queryFn: async () => {
      const { data } = await ServiceService.fetchCoreAppData();
      return {
        birthday_list: data?.birthday_list,
        anniversary_list: data?.anniversary_list,
      }
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useTodaysService = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.TODAY,
    queryFn: async () => {
      const { data } = await ServiceService.getTodaysService();
      return {
        service: data?.service,
        can_mark: data?.can_mark,
        service_status: data?.service_status,
        seconds_until_start: data?.seconds_until_start,
        attendance: data?.attendance,
      };
    },
    staleTime: 0 * 60 * 1000,
    cacheTime: 0 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 0,
    ...options,
  });
};

