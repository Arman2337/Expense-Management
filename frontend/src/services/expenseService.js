// frontend/src/services/expenseService.js
import apiClient from './api';

const submitExpense = async (expenseData) => {
    // Corrected to match the route in expense.controller.js
    return await apiClient.post('/expenses/submit', expenseData);
};

const getMyExpenses = async () => {
    // This route is correct
    return await apiClient.get('/expenses/my-expenses');
};

const getPendingApprovals = async () => {
    // This route is correct
    return await apiClient.get('/expenses/pending-approvals');
};

const processExpense = async (expenseId, decision, comments) => {
    // Corrected to match the route in approval.controller.js
    return await apiClient.post(`/approval/process/${expenseId}`, { decision, comments });
};

export const expenseService = {
    submitExpense,
    getMyExpenses,
    getPendingApprovals,
    processExpense,
};