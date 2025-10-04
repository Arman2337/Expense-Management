import apiClient from './api';

// This service will fetch statistics for each dashboard.
// Your backend needs to provide an endpoint for this.
const getStats = (role) => {
    return apiClient.get(`/dashboard/stats?role=${role}`);
};

export const dashboardService = {
    getStats,
};