import React from 'react';

// The function now accepts 'label' and 'id' specifically,
// and gathers all other props into a 'props' object.
export function Input({ label, id, ...props }) {
    return (
        <div>
            {/* The label is optional; it won't render if not provided */}
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            
            <input
                id={id} // The id is passed explicitly
                {...props} // All other props (value, onChange, type, placeholder, etc.) are spread here
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}