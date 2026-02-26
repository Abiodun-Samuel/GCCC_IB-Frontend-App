import $api from '@/lib/axios';

const BASE_URL = '/redeemable-items';
const ADMIN_BASE_URL = '/admin/redeemable-items';

export const RedeemableItemService = {
    // ─── USER ───────────────────────────────────────────

    async getRedeemableItems(params = {}) {
        const { data } = await $api.get(BASE_URL, { params });
        return data;
    },

    async redeemItem(payload) {
        console.log(payload)
        const { data } = await $api.post(`${BASE_URL}/${payload.item_id}/redeem`);
        return data;
    },

    // ─── ADMIN ──────────────────────────────────────────

    async adminGetRedeemableItems(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },

    async createRedeemableItem(payload) {
        const { data } = await $api.post(ADMIN_BASE_URL, payload);
        return data;
    },

    async updateRedeemableItem({ id, ...payload }) {
        const { data } = await $api.put(`${ADMIN_BASE_URL}/${id}`, payload);
        return data;
    },

    async deleteRedeemableItem(id) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },
};