import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function LoginPage() {
    const navigate = useNavigate();
    
    // In a real app, this would call your backend API
    const handleLogin = () => navigate('/'); 

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Expenso</h1>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to your account</h2>
                <div className="space-y-4">
                    <Input label="Email Address" id="email" type="email" placeholder="you@example.com" />
                    <Input label="Password" id="password" type="password" placeholder="••••••••" />
                    <div className="pt-2"><Button onClick={handleLogin}>Login</Button></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    No account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
                </p>
            </Card>
        </div>
    );
}