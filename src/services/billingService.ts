import api from '../lib/api';

export const billingService = {
    async getSummary(){
        const response = await api.get("/analytics/billing/summary");
        return response.data;
    },
    async getCustomers(){
        const response = await ()
    }
}