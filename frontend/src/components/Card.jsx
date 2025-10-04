import React from 'react';

export function Card({ children, className = '' }) {
    return <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>{children}</div>;
}