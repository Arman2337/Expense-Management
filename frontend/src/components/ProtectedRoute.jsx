import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    // Show a loading indicator while checking auth status
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If authenticated, render the child route. Otherwise, redirect to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}