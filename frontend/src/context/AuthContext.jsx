import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            setUser(response.data); // The backend sends back user data
            navigate('/'); // Navigate to dashboard on successful login
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw so the LoginPage can show an error message
        }
    };

    const signup = async (signupData) => {
        try {
            // Call the signup service
            await authService.signup(signupData.companyName, signupData.adminName, signupData.email, signupData.password);
            // After a successful signup, automatically log the new user in
            await login(signupData.email, signupData.password);
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        isAuthenticated: !!user, // isAuthenticated is true if user is not null
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};