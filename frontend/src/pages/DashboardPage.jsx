import React from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const dummyPendingApprovals = [
    { id: 1, employee: 'Bob Employee', date: '2025-10-15', category: 'Client Meal', amount: 75.50 },
    { id: 4, employee: 'Charlie Employee', date: '2025-10-14', category: 'Software', amount: 150.00 },
];

export default function DashboardPage() {
    const navigate = useNavigate();
    // In a real app, you would fetch the user's role and data
    const userRole = 'Manager'; // Change this to 'Employee', 'Manager', or 'Admin' to see different views

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            
            {/* Manager View */}
            {userRole === 'Manager' && (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Employee</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyPendingApprovals.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3">{item.employee}</td>
                                        <td className="px-4 py-3">{item.date}</td>
                                        <td className="px-4 py-3">${item.amount.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center items-center gap-2">
                                                <Button variant="primary" className="text-xs !px-2 !py-1">Approve</Button>
                                                <Button variant="danger" className="text-xs !px-2 !py-1">Reject</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
            
            <Card>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-600">Your recent expense activities will be shown here.</p>
            </Card>
        </div>
    );
}