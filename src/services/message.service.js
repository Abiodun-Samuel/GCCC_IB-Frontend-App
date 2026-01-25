import $api from '../lib/axios';

const MESSAGES_ENDPOINT = 'messages';

export const MessageService = {
    async getInbox(params = {}) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/inbox`, { params });
        return data;
    },

    async getSent(params = {}) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/sent`, { params });
        return data;
    },

    async getArchived(params = {}) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/archived`, { params });
        return data;
    },

    async getUnreadCount() {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/unread-count`);
        return data;
    },

    async getMessage(messageId) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/${messageId}`);
        return data;
    },

    async getConversations(params = {}) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/conversations`, { params });
        return data;
    },

    async getConversation(userId) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/conversation/${userId}`);
        return data;
    },

    async searchMessages(params = {}) {
        const { data } = await $api.get(`/${MESSAGES_ENDPOINT}/search/query`, { params });
        return data;
    },

    async sendMessage(payload) {
        const { data } = await $api.post(`/${MESSAGES_ENDPOINT}`, payload);
        return data;
    },

    async replyToMessage(messageId, payload) {
        const { data } = await $api.post(`/${MESSAGES_ENDPOINT}/${messageId}/reply`, payload);
        return data;
    },

    async markMultipleAsRead(payload) {
        const { data } = await $api.post(`/${MESSAGES_ENDPOINT}/mark-multiple-read`, payload);
        return data;
    },

    async bulkDelete(payload) {
        const { data } = await $api.post(`/${MESSAGES_ENDPOINT}/bulk-delete`, payload);
        return data;
    },

    async markAsRead(messageId) {
        const { data } = await $api.patch(`/${MESSAGES_ENDPOINT}/${messageId}/mark-read`);
        return data;
    },

    async markAsUnread(messageId) {
        const { data } = await $api.patch(`/${MESSAGES_ENDPOINT}/${messageId}/mark-unread`);
        return data;
    },

    async archiveMessage(messageId) {
        const { data } = await $api.patch(`/${MESSAGES_ENDPOINT}/${messageId}/archive`);
        return data;
    },

    async unarchiveMessage(messageId) {
        const { data } = await $api.patch(`/${MESSAGES_ENDPOINT}/${messageId}/unarchive`);
        return data;
    },

    async deleteMessage(messageId) {
        const { data } = await $api.delete(`/${MESSAGES_ENDPOINT}/${messageId}`);
        return data;
    },
};