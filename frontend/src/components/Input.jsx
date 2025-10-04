import React from 'react';

export function Input({ label, id, type = 'text', placeholder }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1">
                <input type={type} id={id} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
        </div>
    );
}