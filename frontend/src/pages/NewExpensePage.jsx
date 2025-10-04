import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Calendar, DollarSign, FileText, Tag, Upload, AlertCircle } from 'lucide-react';
import { expenseService } from '../services/expenseService';

export default function NewExpensePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: '',
        expenseDate: '',
        receipt: null
    });

    const categories = [
        'Travel',
        'Meals & Entertainment',
        'Office Supplies',
        'Software & Subscriptions',
        'Professional Development',
        'Client Meeting',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, receipt: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Validation
        if (!formData.description || !formData.category || !formData.amount || !formData.expenseDate) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            // Submit to backend
            let submitData;
            if (formData.receipt) {
                submitData = new FormData();
                submitData.append('description', formData.description);
                submitData.append('category', formData.category);
                submitData.append('amount', formData.amount);
                submitData.append('expenseDate', formData.expenseDate);
                submitData.append('receipt', formData.receipt);
            } else {
                submitData = {
                    description: formData.description,
                    category: formData.category,
                    amount: formData.amount,
                    expenseDate: formData.expenseDate
                };
            }
            await expenseService.submitExpense(submitData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit expense. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Receipt className="w-8 h-8" />
                    Submit New Expense
                </h1>
                <p className="text-blue-100">Fill in the details below to submit your expense for approval</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-slideDown">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-800">Success!</p>
                        <p className="text-sm text-green-600">Your expense has been submitted successfully.</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Description */}
                        <div className="group">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Description *
                            </label>
                            <input
                                type="text"
                                id="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="e.g., Lunch meeting with client"
                            />
                        </div>

                        {/* Category and Amount Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="group">
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div className="group">
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    required
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Expense Date *
                            </label>
                            <input
                                type="date"
                                id="expenseDate"
                                required
                                value={formData.expenseDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Receipt Upload */}
                        <div className="group">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-gray-400" />
                                Receipt (Optional)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="receipt-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input 
                                                id="receipt-upload" 
                                                name="receipt-upload" 
                                                type="file" 
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept="image/*,.pdf"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                    {formData.receipt && (
                                        <p className="text-sm text-green-600 font-medium mt-2">
                                            ✓ {formData.receipt.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Submitting...' : 'Submit Expense'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}