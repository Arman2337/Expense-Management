import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '',
        adminName: '',
        email: '',
        password: '',
        countryCode: '' // Added countryCode
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.countryCode || formData.countryCode.length < 2) {
            setError("Please enter a valid 2 or 3 letter country code (e.g., US, IN).");
            return;
        }
        try {
            await signup(formData);
            // Navigation is handled by the AuthContext after successful signup/login
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Expenso</h1>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Admin Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <input id="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    <input id="adminName" placeholder="Your Name" value={formData.adminName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    <input id="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    <input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    <input id="countryCode" placeholder="Country Code (e.g., US, IN)" value={formData.countryCode} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    <div className="pt-2"><Button type="submit">Create Account</Button></div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
                </p>
            </Card>
        </div>
    );
}