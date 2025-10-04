import React, { useState } from 'react'; // <-- Added useState import
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // <-- Use form submission
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Expenso</h1>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to your account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email} // <-- Connect value to state
                            onChange={(e) => setEmail(e.target.value)} // <-- Connect onChange to update state
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password} // <-- Connect value to state
                            onChange={(e) => setPassword(e.target.value)} // <-- Connect onChange to update state
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                        />
                    </div>
                    <div className="pt-2">
                        <Button type="submit">Login</Button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    No account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
                </p>
            </Card>
        </div>
    );
}