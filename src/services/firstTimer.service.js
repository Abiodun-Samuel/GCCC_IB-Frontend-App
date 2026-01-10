import $api from '../lib/axios';

const FIRST_TIMER = 'first-timers';
const ADMIN = `/admin/${FIRST_TIMER}`;

export const FirstTimerService = {
  async getFirstTimers(params = {}) {
    const queryParams = new URLSearchParams();

    [
      'week_ending',
      'date_of_visit',
      'date_month_of_visit',
      'assigned_to_member',
      'follow_up_status',
    ].forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const query = queryParams.toString();
    const endpoint = `/${FIRST_TIMER}${query ? `?${query}` : ''}`;

    const { data } = await $api.get(endpoint);
    return data;
  },

  async fetchFirstTimer(id) {
    const { data } = await $api.get(`/${FIRST_TIMER}/${id}`);
    return data;
  },
  async updateFirstTimer(payload) {
    const { data } = await $api.put(`/${FIRST_TIMER}/${payload.id}`, payload);
    return data;
  },
  async createFirstTimer(payload) {
    const { data } = await $api.post(`/${FIRST_TIMER}`, payload);
    return data;
  },

  async sendFirstTimerWelcomeEmail(payload) {
    const { data } = await $api.post(
      `/${FIRST_TIMER}/${payload.id}/welcome-email`,
      payload
    );
    return data;
  },

  storeFirstTimersFollowups: async (payload) => {
    const { data } = await $api.post(
      `/${FIRST_TIMER}/${payload.first_timer_id}/store-follow-ups`,
      payload
    );
    return data;
  },

  getFirstTimersWithFollowups: async () => {
    const { data } = await $api.get(`/${FIRST_TIMER}/followups`);
    return data;
  },

  getFirstTimersFollowups: async (id) => {
    const { data } = await $api.get(`/${FIRST_TIMER}/${id}/get-follow-ups`);
    return data;
  },

  getFirstTimersAssigned: async () => {
    const { data } = await $api.get('/first-timers/assigned');
    return data;
  },

  async getFirstTimersAnalytics(params) {
    const { data } = await $api.get(`${ADMIN}/analytics?year=${params?.year}`);
    return data;
  },

  async getFirstTimerReport(params = {}) {
    const queryParams = new URLSearchParams();

    ['year'].forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const query = queryParams.toString();
    const endpoint = `/admin/first-timers/report${query ? `?${query}` : ''}`;

    const { data } = await $api.get(endpoint);
    return data;
  },
};
