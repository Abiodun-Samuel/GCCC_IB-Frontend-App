import $api from '../lib/axios';

const ATTENDANCE_RECORDS = '/usher-attendance';

export const AttendanceRecords = {
  async getAllAttendanceRecords() {
    const { data } = await $api.get(`${ATTENDANCE_RECORDS}`);
    return data;
  },

  async getAttendanceRecordById(id) {
    const { data } = await $api.get(`${ATTENDANCE_RECORDS}/${id}`);
    return data;
  },

  async createAttendanceRecord(payload) {
    const { data } = await $api.post(`${ATTENDANCE_RECORDS}`, payload);
    return data;
  },

  async updateAttendanceRecord(payload) {
    const usherAttendance = payload.id;
    const { data } = await $api.put(
      `${ATTENDANCE_RECORDS}/${usherAttendance}`,
      payload
    );
    return data;
  },

  async deleteAttendanceRecords(id) {
    const usherAttendance = id;
    const { data } = await $api.delete(
      `${ATTENDANCE_RECORDS}/${usherAttendance}`,
      {
        data: { id },
      }
    );
    return data;
  },
};
