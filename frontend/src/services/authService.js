// frontend/src/services/authService.js
import apiClient from './api';

const login = async (email, password) => {
    return await apiClient.post('/auth/login', { email, password });
};

const signup = async (signupData) => {
    // Updated to accept a single object to match the component and controller
    return await apiClient.post('/auth/signup', signupData);
};

const logout = async () => {
    return await apiClient.post('/auth/logout');
};

const me = async () => {
    return await apiClient.get('/auth/me');
};

export const authService = {
    login,
    signup,
    logout,
    me,
};