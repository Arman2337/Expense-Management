import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
// We only need expenseService now
import { expenseService } from '../services/expenseService';

// Employee View Component
const EmployeeDashboard = () => (
    <Card>Welcome, Employee! Use the sidebar to manage your expenses.</Card>
);

// Manager View Component
const ManagerDashboard = () => {
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApprovals = async () => {
        setIsLoading(true);
        try {
            const response = await expenseService.getPendingApprovals();
            setApprovals(response.data);
        } catch (error) {
            console.error("Failed to fetch pending approvals", error);
            setError("Could not load approvals.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleProcessExpense = async (expenseId, decision) => {
        const comments = prompt(`Enter comments for this ${decision.toLowerCase()}:`);
        if (comments === null) return; // User cancelled the prompt

        try {
            // **THIS IS THE FIX:** Changed from approvalService to expenseService
            await expenseService.processExpense(expenseId, decision, comments);
            
            // Remove the processed expense from the list
            setApprovals(prev => prev.filter(item => item.id !== expenseId));
        } catch (err) {
            console.error(`Failed to ${decision.toLowerCase()} expense`, err);
            alert(`Error: ${err.response?.data?.message || 'Could not process the expense.'}`);
        }
    };


    if (isLoading) return <div>Loading approvals...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

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
                                   <td className="px-4 py-3">{new Date(item.expenseDate).toLocaleDateString()}</td>
                                   <td className="px-4 py-3">{item.currency} {item.amount}</td>
                                   <td className="px-4 py-3">
                                       <div className="flex justify-center items-center gap-2">
                                           <Button onClick={() => handleProcessExpense(item.id, 'Approved')} variant="primary" className="text-xs !px-2 !py-1">Approve</Button>
                                           <Button onClick={() => handleProcessExpense(item.id, 'Rejected')} variant="danger" className="text-xs !px-2 !py-1">Reject</Button>
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