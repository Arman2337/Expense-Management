import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';

export default function ApprovalModal({ isOpen, onClose, onSubmit, expense, decision }) {
    const [comments, setComments] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(expense.id, decision, comments);
    };

    const decisionColor = decision === 'Approved' ? 'green' : 'red';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md w-full transform transition-transform duration-300 scale-95 hover:scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-bold text-${decisionColor}-600`}>
                        Confirm {decision}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="mb-2 text-gray-700">
                    You are about to {decision.toLowerCase()} the expense of <span className="font-semibold">{expense.currency} {expense.amount}</span> submitted by <span className="font-semibold">{expense.submittedBy.name}</span>.
                </p>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments (optional)..."
                    className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    rows="3"
                ></textarea>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className={`px-6 py-2 bg-${decisionColor}-600 text-white font-semibold rounded-lg hover:bg-${decisionColor}-700 transition-colors shadow-lg`}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}