import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HomeIcon,
    UsersIcon,
    DocumentAddIcon,
    DocumentTextIcon,
    CogIcon,
    LogoutIcon,
    ShieldCheckIcon,
    ViewGridIcon
} from '@heroicons/react/outline';

// This array defines EVERY possible link and the roles that can see them.
const allNavigationLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'New Expense', href: '/expenses/new', icon: DocumentAddIcon, roles: ['Employee'] },
    { name: 'My Expenses', href: '/expenses/my', icon: DocumentTextIcon, roles: ['Employee'] },
    { name: 'Pending Approvals', href: '/approvals/team', icon: ShieldCheckIcon, roles: ['Manager'] },
    { name: 'All Pending', href: '/approvals/all', icon: ViewGridIcon, roles: ['Admin'] },
    { name: 'User Management', href: '/users', icon: UsersIcon, roles: ['Admin'] },
    { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['Admin'] },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    // We get the current user object from our authentication context.
    const { user, logout } = useAuth();

    // This is the most important part:
    // We filter the entire list of links, keeping only the ones where
    // the link's 'roles' array includes the current user's role.
    const filteredNav = allNavigationLinks.filter(link => 
        user?.role && link.roles.includes(user.role)
    );

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">Expenso</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* We map over the FILTERED list to create the links */}
                    {filteredNav.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="h-6 w-6 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4 py-6 border-t border-gray-700">
                     <button onClick={logout} className="flex items-center w-full px-4 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg">
                        <LogoutIcon className="h-6 w-6 mr-3" />
                        Logout
                     </button>
                </div>
            </div>
        </>
    );
}