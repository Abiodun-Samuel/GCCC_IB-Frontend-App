import $api from '@/lib/axios';

const BASE_URL = '/events';
const ADMIN_BASE_URL = '/admin/events';

export const EventService = {
  /**
   * Get all events with optional filters (public)
   * @param {Object} params - Query parameters (page, per_page, etc.)
   * @returns {Promise} API response with pagination meta
   */
  async getEvents(params = {}) {
    const { data } = await $api.get(BASE_URL, { params });
    return data;
  },

  async getClosestEvents() {
    const { data } = await $api.get(`${BASE_URL}/closest`);
    return data;
  },

  /**
   * Get a single event by ID or slug (public)
   * @param {string|number} identifier - Event ID or slug
   * @returns {Promise} API response
   */
  async getEvent(identifier) {
    const { data } = await $api.get(`${BASE_URL}/${identifier}`);
    return data;
  },

  /**
   * Create a new event (admin only)
   * @param {Object} payload - Event data
   * @returns {Promise} API response
   */
  async createEvent(payload) {
    const { data } = await $api.post(ADMIN_BASE_URL, payload);
    return data;
  },

  /**
   * Update an event (admin only)
   * @param {string|number} id - Event ID
   * @param {Object} payload - Updated event data
   * @returns {Promise} API response
   */
  async updateEvent({ id, ...payload }) {
    const { data } = await $api.put(`${ADMIN_BASE_URL}/${id}`, payload);
    return data;
  },

  /**
   * Delete an event (admin only)
   * @param {string|number} id - Event ID
   * @returns {Promise} API response
   */
  async deleteEvent(id) {
    const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
    return data;
  },
};