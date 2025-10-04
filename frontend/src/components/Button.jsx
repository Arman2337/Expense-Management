import React from 'react';

export function Button({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyles = "w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };
  return <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</button>;
}