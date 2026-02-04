import $api from '../lib/axios';

export const AuthService = {
  async login(payload) {
    const { data } = await $api.post('/auth/login', payload);
    return data;
  },

  async register(payload) {
    const { data } = await $api.post('/auth/register', payload);
    return data;
  },

  async getMe() {
    const { data } = await $api.get('/auth/me');
    return data;
  },

  async logout() {
    const { data } = await $api.post('/auth/logout');
    return data;
  },

  async sendResetLink(payload) {
    const { data } = await $api.post('/auth/forgot-password', payload);
    return data;
  },

  async resetPassword(payload) {
    const { data } = await $api.post('/auth/reset-password', payload);
    return data;
  },
};
