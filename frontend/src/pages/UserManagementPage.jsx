import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
// You need to create this service to handle API calls
import { userService } from '../services/userService'; 

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the new user form
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        managerId: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data);
            // Filter for managers to populate the 'Assign Manager' dropdown
            setManagers(response.data.filter(user => user.role === 'Manager'));
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.id]: e.target.value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        // Clear previous errors
        setError('');
        
        const payload = { ...newUser };
        // Ensure managerId is null if the role is Manager or if it's not set
        if (payload.role === 'Manager' || !payload.managerId) {
            payload.managerId = null;
        }

        try {
            await userService.createUser(payload); // 
            alert('User created successfully!');
            // Reset form and refresh user list
            setNewUser({ name: '', email: '', password: '', role: 'Employee', managerId: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user.');
        }
    };

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

            {/* Create User Form */}
            <Card className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input id="name" placeholder="Full Name" value={newUser.name} onChange={handleInputChange} required />
                    <Input id="email" type="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} required />
                    <Input id="password" type="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} required />
                    <select id="role" value={newUser.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                    </select>
                    {/* Only show manager selection for Employees [cite: 15] */}
                    {newUser.role === 'Employee' && (
                        <select id="managerId" value={newUser.managerId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Assign a Manager (Optional)</option>
                            {managers.map(manager => (
                                <option key={manager.id} value={manager.id}>{manager.name}</option>
                            ))}
                        </select>
                    )}
                    <div className="md:col-span-3 flex justify-end">
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </Card>

            {/* Users List */}
            <Card>
                 <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </Card>
        </div>
    );
}