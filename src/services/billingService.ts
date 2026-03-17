import api from '../lib/api';

export const billingService = {
    async getSummary(){
        const response = await api.get("/analytics/billing/summary");
        return response.data;
    },
    async getTrends(){
        const response = await api.get("/analytics/billing/trends");
        return response.data;
    },
    async getCustomers(){
        const response = await api.get("/billing/customers");
        return response.data;
    },
    async getSubscription(){
        const response = await api.get("/billing/subscription-customers");
        return response.data;
    },
    async getWebhooks(){
        const response = await api.get("/billing/billing-webhooks");
        return response.data
    }
}