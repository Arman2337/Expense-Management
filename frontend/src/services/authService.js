import apiClient from './api';

const login = async (email, password) => {
    // The component will now only pass the email and password.
    // The service handles the actual API call and returns the response.
    return await apiClient.post('/auth/login', { email, password });
};

const signup = async (companyName, adminName, email, password) => {
    return await apiClient.post('/auth/signup', { companyName, adminName, email, password });
};

const logout = async () => {
    return await apiClient.post('/auth/logout');
};

// Export the functions so they can be used in other files
export const authService = {
    login,
    signup,
    logout,
};
