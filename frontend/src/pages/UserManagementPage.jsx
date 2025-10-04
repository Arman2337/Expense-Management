import React from 'react';
import { Card } from '../components/Card';

export default function UserManagementPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            <Card>
                <p className="text-gray-600">Here you will be able to create, view, and manage all users in the company.</p>
            </Card>
        </div>
    );
}