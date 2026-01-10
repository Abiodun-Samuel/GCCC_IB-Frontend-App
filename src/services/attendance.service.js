import $api from '../lib/axios';

export const AttendanceService = {
  async markAttendance(payload) {
    const { data } = await $api.post(`/attendance/mark`, payload);
    return data;
  },
  async getUserAttendanceMonthlyStats(year, month) {
    const { data } = await $api.get(
      `/attendance/monthly-stats?year=${year}&month=${month}`
    );
    return data;
  },
  // admin
  async markAbsentees(payload) {
    const { data } = await $api.post(
      `/admin/attendance/mark-absentees`,
      payload
    );
    return data;
  },
  async adminMarkAttendance(payload) {
    const { data } = await $api.post(`/admin/attendance/mark`, payload);
    return data;
  },
  async assignAbsenteesToLeaders(payload) {
    const { data } = await $api.post(
      `/admin/attendance/assign-absentees-to-leaders`,
      payload
    );
    return data;
  },
  async getAllUserAttendance(params = {}) {
    const queryParams = new URLSearchParams();

    params.attendance_date?.forEach((date) =>
      queryParams.append('attendance_date[]', date)
    );

    ['service_id', 'status', 'mode'].forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const query = queryParams.toString();
    const endpoint = `/attendance/history${query ? `?${query}` : ''}`;

    const { data } = await $api.get(endpoint);
    return data;
  },
  async getAllAttendance(params = {}) {
    const queryParams = new URLSearchParams();

    params.attendance_date?.forEach((date) =>
      queryParams.append('attendance_date[]', date)
    );

    ['service_id', 'status', 'mode'].forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const query = queryParams.toString();
    const endpoint = `/admin/attendance${query ? `?${query}` : ''}`;

    const { data } = await $api.get(endpoint);
    return data;
  },

  async getAttendanceReport(params = {}) {
    const queryParams = new URLSearchParams();

    ['service_id', 'attendance_date'].forEach((key) => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const query = queryParams.toString();
    const endpoint = `/attendance/report${query ? `?${query}` : ''}`;

    const { data } = await $api.get(endpoint);
    return data;
  },

  async getAdminAttendanceMonthlyStats(year, mode) {
    const { data } = await $api.get(
      `/admin/attendance/monthly-stats?year=${year}&mode=${mode}`
    );
    return data;
  },
};
