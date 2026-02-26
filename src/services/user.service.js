import $api from '../lib/axios';

// for all users  (admin, leaders and members)
export const UserService = {
  sendAwardPoints: async (payload) => {
    const { data } = await $api.post('/award/points', payload);
    return data;
  },
  updateProfile: async (payload) => {
    const { data } = await $api.put('/update-profile', payload);
    return data;
  },
  // leaders
  getAssignedAbsentees: async () => {
    const { data } = await $api.get('/leaders/absentees');
    return data;
  },
  getAssignedMembers: async () => {
    const { data } = await $api.get('/members/assigned');
    return data;
  }
};
