// import axios from 'axios';

// const apiClient = axios.create({
//     baseURL: 'http://localhost:8080/api',
//     withCredentials: true
// });

// export const approvalService = {
//     processExpense(expenseId, decisionData) {
//         // decisionData should be an object like { decision: 'Approved', comments: '...' }
//         return apiClient.post(`/approval/process/${expenseId}`, decisionData);
//     }
// };

import apiClient from './api';

const processExpense = (expenseId, decision, comments) => {
    return apiClient.post(`/approvals/process/${expenseId}`, { decision, comments });
};

export const approvalService = {
    processExpense,
};