import apiClient from './api';

const submitExpense = async (expenseData) => {
    // expenseData can be either FormData (with file) or regular object
    // The component will pass FormData if there's a file
    const config = {
        headers: {
            'Content-Type': expenseData instanceof FormData 
                ? 'multipart/form-data' 
                : 'application/json'
        }
    };
    
    return await apiClient.post('/expenses', expenseData, config);
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

const getExpenseById = async (expenseId) => {
    return await apiClient.get(`/expenses/${expenseId}`);
};

const updateExpense = async (expenseId, expenseData) => {
    const config = {
        headers: {
            'Content-Type': expenseData instanceof FormData 
                ? 'multipart/form-data' 
                : 'application/json'
        }
    };
    
    return await apiClient.put(`/expenses/${expenseId}`, expenseData, config);
};

const deleteExpense = async (expenseId) => {
    return await apiClient.delete(`/expenses/${expenseId}`);
};

export const expenseService = {
    submitExpense,
    getMyExpenses,
    getPendingApprovals,
    processExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
};