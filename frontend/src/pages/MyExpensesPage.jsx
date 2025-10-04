// src/pages/MyExpensesPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { expenseService } from '../services/expenseService';

export default function MyExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await expenseService.getMyExpenses();
                setExpenses(response.data);
            } catch (error) {
                console.error("Failed to fetch expenses", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return <div>Loading expenses...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length > 0 ? expenses.map(expense => (
                                <tr key={expense.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{expense.description}</td>
                                    <td className="px-4 py-3">{expense.currency} {expense.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(expense.status)}`}>
                                            {expense.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">You have not submitted any expenses yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}