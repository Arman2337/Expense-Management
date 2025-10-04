import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';

// Employee View Component
const EmployeeDashboard = () => (
    <Card>Welcome, Employee! Use the sidebar to manage your expenses.</Card>
);

// Manager View Component
const ManagerDashboard = () => {
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const response = await expenseService.getPendingApprovals();
                setApprovals(response.data);
            } catch (error) {
                console.error("Failed to fetch pending approvals", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApprovals();
    }, []);

    if (isLoading) return <div>Loading approvals...</div>;

    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4">Pending Approvals ({approvals.length})</h2>
            <div className="overflow-x-auto">
                {approvals.length > 0 ? (
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
                           {approvals.map(item => (
                               <tr key={item.id} className="border-t">
                                   <td className="px-4 py-3">{item.submittedBy.name}</td>
                                   <td className="px-4 py-3">{item.expenseDate}</td>
                                   <td className="px-4 py-3">{item.currency} {item.amount}</td>
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
                ) : <p className="text-gray-600">No pending approvals.</p>}
            </div>
        </Card>
    );
};

// Admin View Component
const AdminDashboard = () => (
    <Card>Welcome, Admin! Use the sidebar to manage users and settings.</Card>
);

export default function DashboardPage() {
    const { user } = useAuth();

    const renderDashboardByRole = () => {
        switch (user?.role) {
            case 'Admin': return <AdminDashboard />;
            case 'Manager': return <ManagerDashboard />;
            case 'Employee': return <EmployeeDashboard />;
            default: return <div className="text-center p-8">Loading user data...</div>;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            {renderDashboardByRole()}
        </div>
    );
}