import React, { createContext, useState, useContext, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await authService.me();
                setUser(response.data);
            } catch (error) {
                // No active session found, which is normal if not logged in
                setUser(null);
            } finally {
                setLoading(false); // Stop loading once the check is complete
            }
        };
        checkSession();
    }, []);

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
            // **THE FIX IS HERE:** We now pass the entire signupData object directly.
            await authService.signup(signupData);
            // After signup, automatically log the new user in
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
        loading,
        isAuthenticated: !!user, // isAuthenticated is true if user is not null
        login,
        signup,
        logout,
    };

   return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};