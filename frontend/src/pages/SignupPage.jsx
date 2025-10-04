import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function SignupPage() {
    const navigate = useNavigate();

    const handleSignup = () => navigate('/'); // Navigate to dashboard after signup

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Expenso</h1>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Admin Account</h2>
                <div className="space-y-4">
                    <Input label="Company Name" id="companyName" placeholder="Innovate Corp" />
                    <Input label="Your Name" id="adminName" placeholder="Super Admin" />
                    <Input label="Email Address" id="email" type="email" placeholder="admin@example.com" />
                    <Input label="Password" id="password" type="password" placeholder="••••••••" />
                    <div className="pt-2"><Button onClick={handleSignup}>Create Account</Button></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
                </p>
            </Card>
        </div>
    );
}