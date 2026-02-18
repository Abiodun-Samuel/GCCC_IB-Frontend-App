import $api from '@/lib/axios';

const BASE_URL = '/events';
const ADMIN_BASE_URL = '/admin/events';

export const EventService = {
  /**
   * Create a new event
   * @param {Object} payload - Event data (title, description, date, location, etc.)
   * @returns {Promise} API response
   */
  async createEvent(payload) {
    const { data } = await $api.post(ADMIN_BASE_URL, payload);
    return data;
  },

  /**
   * Get a single event by ID or slug
   * @param {string|number} identifier - Event ID or slug
   * @returns {Promise} API response
   */
  async getEvent(identifier) {
    const { data } = await $api.get(`${BASE_URL}/${identifier}`);
    return data;
  },

  /**
   * Get all events with optional filters
   * @param {Object} params - Query parameters (page, per_page, status, date_from, date_to, category, etc.)
   * @returns {Promise} API response with pagination meta
   */
  async getEvents(params = {}) {
    const { data } = await $api.get(BASE_URL, { params });
    return data;
  },

  /**
   * Get all events (admin view with additional data)
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getAdminEvents(params = {}) {
    const { data } = await $api.get(ADMIN_BASE_URL, { params });
    return data;
  },

  /**
   * Get featured/upcoming events
   * @returns {Promise} API response
   */
  async getFeaturedEvents() {
    const { data } = await $api.get(`${BASE_URL}/featured`);
    return data;
  },

  /**
   * Update an event
   * @param {string|number} id - Event ID
   * @param {Object} payload - Updated event data
   * @returns {Promise} API response
   */
  async updateEvent({ id, ...payload }) {
    const { data } = await $api.put(`${ADMIN_BASE_URL}/${id}`, payload);
    return data;
  },

  /**
   * Delete an event
   * @param {string|number} id - Event ID
   * @returns {Promise} API response
   */
  async deleteEvent(id) {
    const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
    return data;
  },

  /**
   * Publish/unpublish an event
   * @param {string|number} id - Event ID
   * @param {boolean} published - Publish status
   * @returns {Promise} API response
   */
  async toggleEventStatus({ id, published }) {
    const { data } = await $api.patch(`${ADMIN_BASE_URL}/${id}/status`, { published });
    return data;
  },
};