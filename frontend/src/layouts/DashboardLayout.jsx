import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, ScrollText, Users, Settings } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/login');

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'My Expenses', icon: <ScrollText size={20} />, path: '/expenses/my' },
        { name: 'User Management', icon: <Users size={20} />, path: '/users' },
        { name: 'Approval Rules', icon: <Settings size={20} />, path: '/rules' },
    ];

    const NavLink = ({ path, icon, name }) => (
        <Link to={path} onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            {icon}<span>{name}</span>
        </Link>
    );

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold">Expenso</h1>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => <NavLink key={item.name} {...item} />)}
                </nav>
                <div className="px-4 py-6 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <LogOut size={20} /><span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

const Header = ({ toggleSidebar }) => (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6">
        <button onClick={toggleSidebar} className="md:hidden text-gray-500"><Menu size={24} /></button>
        <div className="text-gray-800 font-semibold hidden md:block">Welcome back!</div>
        <div className="flex items-center space-x-4">
            <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/150x150" alt="User Avatar" />
        </div>
    </header>
);


export default function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="h-screen flex bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
                    <Outlet /> {/* This is where the page content will be rendered */}
                </main>
            </div>
        </div>
    );
}