import $api from '../lib/axios';

export const AuthService = {
  async login(payload) {
    const { data } = await $api.post('/login', payload);
    return data;
  },

  async register(payload) {
    const { data } = await $api.post('/register', payload);
    return data;
  },

  async getMe() {
    const { data } = await $api.get('/auth/me');
    return data;
  },

  async logout() {
    const { data } = await $api.post('/logout');
    return data;
  },

  async sendResetLink(payload) {
    const { data } = await $api.post('/forgot-password', payload);
    return data;
  },

  async resetPassword(payload) {
    const { data } = await $api.post('/reset-password', payload);
    return data;
  },
};
