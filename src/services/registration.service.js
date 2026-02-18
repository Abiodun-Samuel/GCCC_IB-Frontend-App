import $api from '@/lib/axios';

const BASE_URL = '/event-registrations';
const ADMIN_BASE_URL = '/event-registrations';

export const EventRegistrationService = {
    /**
     * Create a new event registration (user signs up for an event)
     * @param {Object} payload - Registration data (event_id, user details, etc.)
     * @returns {Promise} API response
     */
    async createRegistration(payload) {
        const { data } = await $api.post(BASE_URL, payload);
        return data;
    },

    /**
     * Get a single event registration by ID
     * @param {string|number} id - Registration ID
     * @returns {Promise} API response
     */
    async getRegistration(id) {
        const { data } = await $api.get(`${BASE_URL}/${id}`);
        return data;
    },

    /**
     * Get user's own registrations
     * @param {Object} params - Query parameters (page, per_page, status, etc.)
     * @returns {Promise} API response with pagination meta
     */
    async getMyRegistrations(params = {}) {
        const { data } = await $api.get(`${BASE_URL}/my-registrations`, { params });
        return data;
    },

    /**
     * Get all registrations for a specific event
     * @param {string|number} eventId - Event ID
     * @param {Object} params - Query parameters (page, per_page, status, etc.)
     * @returns {Promise} API response with pagination meta
     */
    async getEventRegistrations(eventId, params = {}) {
        const { data } = await $api.get(`${BASE_URL}/event/${eventId}`, { params });
        return data;
    },

    /**
     * Get all registrations (admin view)
     * @param {Object} params - Query parameters (page, per_page, event_id, status, search, etc.)
     * @returns {Promise} API response
     */
    async getAdminRegistrations(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },

    /**
     * Update an event registration
     * @param {string|number} id - Registration ID
     * @param {Object} payload - Updated registration data
     * @returns {Promise} API response
     */
    async updateRegistration({ id, ...payload }) {
        const { data } = await $api.put(`${BASE_URL}/${id}`, payload);
        return data;
    },

    /**
     * Cancel a registration
     * @param {string|number} id - Registration ID
     * @returns {Promise} API response
     */
    async cancelRegistration(id) {
        const { data } = await $api.patch(`${BASE_URL}/${id}/cancel`);
        return data;
    },

    /**
     * Delete a registration (admin only)
     * @param {string|number} id - Registration ID
     * @returns {Promise} API response
     */
    async deleteRegistration(id) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },

    /**
     * Update registration status (admin only)
     * @param {string|number} id - Registration ID
     * @param {string} status - New status (confirmed, pending, cancelled, attended, etc.)
     * @returns {Promise} API response
     */
    async updateRegistrationStatus({ id, status }) {
        const { data } = await $api.patch(`${ADMIN_BASE_URL}/${id}/status`, { status });
        return data;
    },

    /**
     * Check in a registration (mark as attended)
     * @param {string|number} id - Registration ID
     * @returns {Promise} API response
     */
    async checkInRegistration(id) {
        const { data } = await $api.patch(`${ADMIN_BASE_URL}/${id}/check-in`);
        return data;
    },
};