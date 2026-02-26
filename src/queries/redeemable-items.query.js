import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RedeemableItemService } from '@/services/redeemable-items.service';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';


// ─── READ (USER) ─────────────────────────────────────────

export const useRedeemableItems = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.LIST(params),
        queryFn: () => RedeemableItemService.getRedeemableItems(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};


// ─── READ (ADMIN) ────────────────────────────────────────

export const useAdminRedeemableItems = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.ADMIN_LIST(params),
        queryFn: () => RedeemableItemService.adminGetRedeemableItems(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};


// ─── REDEEM ──────────────────────────────────────────────

export const useRedeemItem = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: RedeemableItemService.redeemItem,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            Toast.error(handleApiError(error));
            options.onError?.(error);
        },
    });
};


// ─── CREATE ──────────────────────────────────────────────

export const useCreateRedeemableItem = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: RedeemableItemService.createRedeemableItem,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            Toast.error(handleApiError(error));
            options.onError?.(error);
        },
    });
};


// ─── UPDATE ──────────────────────────────────────────────

export const useUpdateRedeemableItem = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: RedeemableItemService.updateRedeemableItem,
        onSuccess: (data, variables) => {
            if (variables?.id) {
                queryClient.invalidateQueries({
                    queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.DETAIL(variables.id),
                });
            }

            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.ALL });

            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            Toast.error(handleApiError(error));
            options.onError?.(error);
        },
    });
};


// ─── DELETE ──────────────────────────────────────────────

export const useDeleteRedeemableItem = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: RedeemableItemService.deleteRedeemableItem,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REDEEMABLE_ITEMS.ALL });
            if (data?.message) Toast.success(data.message);
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            Toast.error(handleApiError(error));
            options.onError?.(error);
        },
    });
};