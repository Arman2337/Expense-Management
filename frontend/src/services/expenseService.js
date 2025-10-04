import apiClient from './api';

const submitExpense = async (expenseData) => {
    // The component will pass an object with all the expense details
    return await apiClient.post('/expenses', expenseData);
};

const getMyExpenses = async () => {
    return await apiClient.get('/expenses/my-expenses');
};

const getPendingApprovals = async () => {
    // This is the call we'll use in the dashboard
    return await apiClient.get('/expenses/pending-approvals');
};

const processExpense = async (expenseId, decision, comments) => {
    return await apiClient.post(`/approvals/${expenseId}`, { decision, comments });
};

export const expenseService = {
    submitExpense,
    getMyExpenses,
    getPendingApprovals,
    processExpense,
};
