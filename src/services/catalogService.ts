import api from '../lib/api';

export const catalogService = {
    async getAllTitles(params?: any) {
        const response = await api.get("/catalog/titles",{ params });
        return response.data;
    },

    async getTitleById(id: string) {
        const response = await api.get(`/catalog/title/${id}`);
        return response.data;
    },

    async createTitle(data: any) {
        const response = await api.post("/catalog/title",data);
        return response.data;
    },

    async updateTitle(id: string,data: any) {
        const response = await api.put(`/catalog/title/${id}`,data);
        return response.data
    },

    async deleteTitle(id: string) {
        const response = await api.delete(`/catalog/title/${id}`);
        return response.data;
    }
}