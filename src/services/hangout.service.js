import $api from '@/lib/axios';

const BASE_URL = '/hangout';
const ADMIN_BASE_URL = '/admin/hangout';

export const HangoutService = {
  /**
   * Hangout details for the public page: games, support account,
   * whether registration is open (public)
   */
  async getHangout() {
    const { data } = await $api.get(BASE_URL);
    return data;
  },

  /**
   * Register, or update the registration that already uses this email (public)
   * @param {Object} payload - full_name, email, phone_number, whatsapp_number, game, support_amount
   */
  async register(payload) {
    const { data } = await $api.post(`${BASE_URL}/registrations`, payload);
    return data;
  },

  /**
   * Registrations with filters, sorting and pagination (admin only)
   * @param {Object} params - search, game, support, sort, direction, page, per_page
   */
  async getRegistrations(params = {}) {
    const { data } = await $api.get(`${ADMIN_BASE_URL}/registrations`, { params });
    return data;
  },

  /**
   * Registrations matching the same filters, as a CSV file (admin only)
   * @returns {Promise<Blob>}
   */
  async exportRegistrations(params = {}) {
    const { data } = await $api.get(`${ADMIN_BASE_URL}/registrations/export`, {
      params,
      responseType: 'blob',
      headers: { Accept: 'text/csv' },
    });
    return data;
  },
};
