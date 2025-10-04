import React, { useState, useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, ScrollText, Users, Settings, PlusCircle, Bell, ShieldCheck, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // 1. Define ALL possible navigation items with a 'roles' property
    const allNavItems = useMemo(() => [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['Admin', 'Manager', 'Employee'] },
        { name: 'New Expense', icon: <PlusCircle size={20} />, path: '/expenses/new', roles: ['Employee'] },
        { name: 'My Expenses', icon: <ScrollText size={20} />, path: '/expenses/my', roles: ['Employee'] },
        { name: 'Pending Approvals', icon: <ShieldCheck size={20} />, path: '/approvals/team', roles: ['Manager'] },
        { name: 'User Management', icon: <Users size={20} />, path: '/users', roles: ['Admin'] },
        { name: 'Approval Rules', icon: <Scale size={20} />, path: '/rules', roles: ['Admin'] },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['Admin'] },
    ], []);

    // 2. Filter the items based on the current user's role
    const filteredNavItems = useMemo(() => {
        if (!user?.role) return [];
        return allNavItems.filter(item => item.roles.includes(user.role));
    }, [user, allNavItems]);


    const NavLink = ({ path, icon, name }) => {
        const isActive = location.pathname === path;
        return (
            <Link 
                to={path} 
                onClick={() => setIsOpen(false)} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                <span className="font-medium">{name}</span>
            </Link>
        );
    };

    return (
        <>
            {/* ... (rest of the component is the same) ... */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col z-40 transform transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">E</span>
                        </div>
                        <h1 className="text-xl font-bold">Expenso</h1>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* User Profile */}
                <div className="px-4 py-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {/* 3. Map over the new, FILTERED list of items */}
                    {filteredNavItems.map(item => <NavLink key={item.name} {...item} />)}
                </nav>
                
                {/* Logout */}
                <div className="px-4 py-6 border-t border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};


const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();
    
    return (
        <header className="bg-white shadow-sm h-20 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200">
            {/* Mobile Menu Button */}
            <button 
                onClick={toggleSidebar} 
                className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
                <Menu size={24} />
            </button>
            
            {/* Welcome Message */}
            <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-gray-800">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h2>
                <p className="text-sm text-gray-500">Have a great day at work</p>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Employee'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                        <span className="text-white font-semibold">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="h-screen flex bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}