// // src/components/Sidebar.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// // Corrected import path for v2
// import { HomeIcon, UsersIcon, DocumentTextIcon, ScaleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

// const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
//     { name: 'My Expenses', href: '/expenses/my', icon: DocumentTextIcon },
//     { name: 'User Management', href: '/users', icon: UsersIcon },
//     { name: 'Approval Rules', href: '/rules', icon: ScaleIcon },
// ];

// export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
//     // Note: LogoutIcon was renamed to ArrowLeftOnRectangleIcon in v2
//     return (
//         <>
//             <div 
//                 className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//                 onClick={() => setSidebarOpen(false)}
//             ></div>
//             <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
//                 <div className="flex items-center justify-center h-20 border-b border-gray-700">
//                     <h1 className="text-2xl font-bold">Expenso</h1>
//                 </div>
//                 <nav className="flex-1 px-4 py-6 space-y-2">
//                     {navigation.map((item) => (
//                         <NavLink
//                             key={item.name}
//                             to={item.href}
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
//                                 isActive
//                                     ? 'bg-gray-900 text-white'
//                                     : 'text-gray-400 hover:bg-gray-700 hover:text-white'
//                                 }`
//                             }
//                             onClick={() => setSidebarOpen(false)}
//                         >
//                             <item.icon className="h-6 w-6 mr-3" />
//                             {item.name}
//                         </NavLink>
//                     ))}
//                 </nav>
//                 <div className="px-4 py-6 border-t border-gray-700">
//                      <button className="flex items-center w-full px-4 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg">
//                         <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
//                         Logout
//                      </button>
//                 </div>
//             </div>
//         </>
//     );
// }