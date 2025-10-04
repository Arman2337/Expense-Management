import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { dashboardService } from '../services/dashboardService';
import ApprovalModal from '../components/ApprovalModal';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';

// A generic loader component
const Loader = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

// A reusable Stat Card Component
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

// --- Role-Specific Dashboards ---

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dashboardService.getStats('employee')
            .then(response => setStats(response.data))
            .catch(err => console.error("Failed to fetch employee stats", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading || !stats) return <Loader />;

    const statCards = [
        { title: 'Total Expenses', value: stats.total, icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        { title: 'Pending', value: stats.pending, icon: Clock, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600' },
        { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-gradient-to-br from-red-500 to-red-600' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => <StatCard key={index} {...stat} />)}
            </div>
        </div>
    );
};

const ManagerDashboard = () => {
    const [approvals, setApprovals] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState({ isOpen: false, expense: null, decision: '' });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [approvalsRes, statsRes] = await Promise.all([
                expenseService.getPendingApprovals(),
                dashboardService.getStats('manager')
            ]);
            setApprovals(approvalsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch manager data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (expense, decision) => {
        setModalState({ isOpen: true, expense, decision });
    };

    const handleProcessExpense = async (expenseId, decision, comments) => {
        try {
            await expenseService.processExpense(expenseId, decision, { comments });
            setApprovals(prev => prev.filter(item => item.id !== expenseId)); // Update UI immediately
            setModalState({ isOpen: false, expense: null, decision: '' }); // Close modal
        } catch (err) {
            console.error("Failed to process expense", err);
        }
    };

    if (isLoading || !stats) return <Loader />;

    const statCards = [
        { title: 'Pending Approvals', value: approvals.length, icon: Clock, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { title: 'Approved Today', value: stats.approvedToday, icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600', trend: stats.approvalTrend },
        { title: 'Team Total (Month)', value: `$${stats.teamMonthlyTotal}`, icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    ];

    return (
        <>
            <ApprovalModal {...modalState} onClose={() => setModalState({ isOpen: false, expense: null, decision: '' })} onSubmit={handleProcessExpense} />
            <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => <StatCard key={index} {...stat} />)}
                </div>
                {/* ... Table for approvals ... */}
            </div>
        </>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dashboardService.getStats('admin')
            .then(response => setStats(response.data))
            .catch(err => console.error("Failed to fetch admin stats", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading || !stats) return <Loader />;

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-gradient-to-br from-purple-500 to-purple-600', trend: stats.userTrend },
        { title: 'Total Pending', value: stats.totalPending, icon: Clock, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { title: 'Company Monthly Total', value: `$${stats.companyMonthlyTotal}`, icon: DollarSign, color: 'bg-gradient-to-br from-blue-500 to-blue-600', trend: stats.monthlyTrend },
    ];
    
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => <StatCard key={index} {...stat} />)}
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

export default function DashboardPage() {
    const { user } = useAuth();

    const renderDashboardByRole = () => {
        switch (user?.role) {
            case 'Admin': return <AdminDashboard />;
            case 'Manager': return <ManagerDashboard />;
            case 'Employee': return <EmployeeDashboard />;
            default: return <Loader />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-blue-100">Here's what's happening with your expenses today.</p>
            </div>
            {renderDashboardByRole()}
        </div>
    );
}