import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                {trend && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </p>
                )}
            </div>
            <div className={`${color} p-4 rounded-full`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
        </div>
    </div>
);

// Employee View Component
const EmployeeDashboard = () => {
    const stats = [
        { title: 'Total Expenses', value: '12', icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        { title: 'Pending', value: '3', icon: Clock, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { title: 'Approved', value: '8', icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600' },
        { title: 'Rejected', value: '1', icon: XCircle, color: 'bg-gradient-to-br from-red-500 to-red-600' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
                <p className="text-gray-600">Your recent expense submissions will appear here.</p>
            </div>
        </div>
    );
};

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

    const stats = [
        { title: 'Pending Approvals', value: approvals.length.toString(), icon: Clock, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { title: 'Approved Today', value: '5', icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600', trend: '+12% from yesterday' },
        { title: 'Total Amount', value: '$2,450', icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Pending Approvals ({approvals.length})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    {approvals.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {approvals.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {item.submittedBy.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.submittedBy.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.expenseDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900">{item.currency} {item.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button className="px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                                                    Approve
                                                </button>
                                                <button className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm">
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No pending approvals at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Admin View Component
const AdminDashboard = () => {
    const stats = [
        { title: 'Total Users', value: '45', icon: Clock, color: 'bg-gradient-to-br from-purple-500 to-purple-600', trend: '+3 this month' },
        { title: 'Active Expenses', value: '23', icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        { title: 'Monthly Total', value: '$12,450', icon: TrendingUp, color: 'bg-gradient-to-br from-green-500 to-green-600', trend: '+8% from last month' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                    System Overview
                </h2>
                <p className="text-gray-600">Monitor system-wide activities and manage company settings from the sidebar.</p>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user } = useAuth();

    const renderDashboardByRole = () => {
        switch (user?.role) {
            case 'Admin': return <AdminDashboard />;
            case 'Manager': return <ManagerDashboard />;
            case 'Employee': return <EmployeeDashboard />;
            default: return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                <p className="text-blue-100">Here's what's happening with your expenses today.</p>
            </div>
            {renderDashboardByRole()}
        </div>
    );
}