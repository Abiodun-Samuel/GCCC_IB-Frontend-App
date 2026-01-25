import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../utils/queryKeys';
import { Toast } from '../lib/toastify';
import { handleApiError } from '../utils/helper';
import { MessageService } from '@/services/message.service';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useInboxMessages = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.INBOX(params),
        queryFn: async () => {
            const { data } = await MessageService.getInbox(params);
            return data || [];
        },
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useSentMessages = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.SENT(params),
        queryFn: async () => {
            const { data } = await MessageService.getSent(params);
            return data || [];
        },
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useArchivedMessages = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.ARCHIVED(params),
        queryFn: async () => {
            const { data } = await MessageService.getArchived(params);
            return data || [];
        },
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useUnreadCount = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.UNREAD_COUNT,
        queryFn: async () => {
            const { data } = await MessageService.getUnreadCount();
            return data?.unread_count || 0;
        },
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
        ...options,
    });
};

export const useConversations = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.CONVERSATIONS(params),
        queryFn: async () => {
            const { data } = await MessageService.getConversations(params);
            return data || [];
        },
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useConversation = (userId, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.CONVERSATION(userId),
        queryFn: async () => {
            const { data } = await MessageService.getConversation(userId);
            return data || [];
        },
        enabled: !!userId,
        staleTime: 30 * 1000,
        ...options,
    });
};

export const useSearchMessages = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MESSAGES.SEARCH(params),
        queryFn: async () => {
            const { data } = await MessageService.searchMessages(params);
            return data || [];
        },
        enabled: !!params.query && params.query.length > 2,
        staleTime: 60 * 1000,
        ...options,
    });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useSendMessage = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.sendMessage,
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.UNREAD_COUNT,
            });
            Toast.success('Message sent successfully!');
            options.onSuccess?.(response.data, variables);
        },
        onError: (error) => {
            console.log(error)
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to send message');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useReplyToMessage = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageId, ...payload }) => {
            return await MessageService.replyToMessage(messageId, payload);
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.CONVERSATION(variables.recipient_id),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            Toast.success('Reply sent successfully!');
            options.onSuccess?.(response.data, variables);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to send reply');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useMarkAsRead = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.markAsRead,
        onSuccess: (response, messageId) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.UNREAD_COUNT,
            });
            options.onSuccess?.(response.data, messageId);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useMarkAsUnread = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.markAsUnread,
        onSuccess: (response, messageId) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.UNREAD_COUNT,
            });
            Toast.success('Marked as unread');
            options.onSuccess?.(response.data, messageId);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to mark as unread');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useMarkMultipleAsRead = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageIds }) => {
            return await MessageService.markMultipleAsRead({ message_ids: messageIds });
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.UNREAD_COUNT,
            });
            Toast.success(`${variables.messageIds.length} messages marked as read`);
            options.onSuccess?.(response.data, variables);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to mark messages as read');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useArchiveMessage = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.archiveMessage,
        onSuccess: (response, messageId) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.ARCHIVED(),
            });
            Toast.success('Message archived');
            options.onSuccess?.(response.data, messageId);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to archive message');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useUnarchiveMessage = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.unarchiveMessage,
        onSuccess: (response, messageId) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.ARCHIVED(),
            });
            Toast.success('Message unarchived');
            options.onSuccess?.(response.data, messageId);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to unarchive message');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useDeleteMessage = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: MessageService.deleteMessage,
        onSuccess: (response, messageId) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.ARCHIVED(),
            });
            Toast.success('Message deleted');
            options.onSuccess?.(response.data, messageId);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to delete message');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};

export const useBulkDeleteMessages = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageIds }) => {
            return await MessageService.bulkDelete({ message_ids: messageIds });
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.INBOX(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.SENT(),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.MESSAGES.ARCHIVED(),
            });
            Toast.success(`${variables.messageIds.length} messages deleted`);
            options.onSuccess?.(response.data, variables);
        },
        onError: (error) => {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Failed to delete messages');
            options.onError?.(new Error(errorDetails.message));
        },
    });
};