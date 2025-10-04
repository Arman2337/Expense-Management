// // src/components/Header.jsx
// import React from 'react';
// // Corrected import path for v2
// import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';

// export default function Header({ setSidebarOpen }) {
//     // Note: MenuIcon was renamed to Bars3Icon in v2
//     return (
//         <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
//             <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-gray-500 focus:outline-none lg:hidden"
//             >
//                 <Bars3Icon className="h-6 w-6" />
//             </button>

//             <div className="flex-1 flex justify-between items-center">
//                 <div></div>
//                 <div className="relative">
//                     <button className="flex items-center text-gray-600 focus:outline-none">
//                         <UserCircleIcon className="h-8 w-8 text-gray-400" />
//                         <span className="hidden md:inline-flex ml-2">Admin</span>
//                     </button>
//                 </div>
//             </div>
//         </header>
//     );
// }