// frontend/src/services/userService.js
import apiClient from './api'; // Make sure you have this apiClient file

const getAllUsers = async () => {
    return await apiClient.get('/users');
};

const createUser = async (userData) => {
    return await apiClient.post('/users', userData);
};

export const userService = {
    getAllUsers,
    createUser,
};