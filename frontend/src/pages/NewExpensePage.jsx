import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Calendar, DollarSign, FileText, Tag, Upload, AlertCircle, CheckCircle, Clock, User, Loader, Eye } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { ocrService } from '../services/ocrService';

export default function NewExpensePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('Draft');
    const [showForm, setShowForm] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [ocrResult, setOcrResult] = useState(null);
    
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: '',
        expenseDate: '',
        paidBy: 'Company',
        remarks: '',
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

    const paidByOptions = [
        'Company',
        'Personal - Reimbursable',
        'Personal - Non-reimbursable'
    ];

    // Fetch existing expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await expenseService.getMyExpenses();
                setExpenses(response.data || []);
            } catch (error) {
                console.error('Failed to fetch expenses:', error);
                setExpenses([]);
            }
        };
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, receipt: e.target.files[0] });
    };

    const handleNewExpense = () => {
        setShowForm(true);
        setError('');
        setSuccess(false);
        setCurrentStatus('Draft');
        // Reset form data
        setFormData({
            description: '',
            category: '',
            amount: '',
            expenseDate: '',
            paidBy: 'Company',
            remarks: '',
            receipt: null
        });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setError('');
        setSuccess(false);
        setOcrResult(null);
    };

    const handleOcrUpload = async (file) => {
        try {
            // Validate file
            const validation = ocrService.validateFile(file);
            if (!validation.valid) {
                setError(validation.message);
                return;
            }

            setOcrProcessing(true);
            setError('');
            
            // Process with OCR
            const result = await ocrService.processReceipt(file);
            
            if (result.success) {
                // Format the OCR result for the form
                const formattedData = ocrService.formatExpenseData(result);
                
                if (formattedData) {
                    // Populate form with OCR data
                    setFormData(prev => ({
                        ...prev,
                        description: formattedData.description || prev.description,
                        amount: formattedData.amount || prev.amount,
                        category: formattedData.category || prev.category,
                        expenseDate: formattedData.expenseDate || prev.expenseDate,
                        remarks: formattedData.remarks || prev.remarks,
                        receipt: file
                    }));
                    
                    setOcrResult({
                        confidence: formattedData.ocrConfidence,
                        extractedText: formattedData.extractedText
                    });
                    
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                } else {
                    setError('Could not extract expense data from receipt. Please fill the form manually.');
                }
            } else {
                setError(result.message || 'Failed to process receipt');
            }
        } catch (error) {
            console.error('OCR processing error:', error);
            setError(error.message || 'Failed to process receipt. Please try again.');
        } finally {
            setOcrProcessing(false);
        }
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
                submitData.append('remarks', formData.remarks);
                submitData.append('receipt', formData.receipt);
            } else {
                submitData = {
                    description: formData.description,
                    category: formData.category,
                    amount: formData.amount,
                    expenseDate: formData.expenseDate,
                    remarks: formData.remarks
                };
            }
            await expenseService.submitExpense(submitData);
            setCurrentStatus('Waiting approval');
            setSuccess(true);
            // Refresh expenses list
            const response = await expenseService.getMyExpenses();
            setExpenses(response.data || []);
            setTimeout(() => {
                setSuccess(false);
                setShowForm(false);
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit expense. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const StatusProgress = ({ currentStatus }) => {
        const statuses = ['Draft', 'Waiting approval', 'Approved'];
        const currentIndex = statuses.indexOf(currentStatus);
        
        return (
            <div className="flex items-center justify-center mb-4">
                {statuses.map((status, index) => (
                    <div key={status} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${
                            index <= currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                        <span className={`mx-2 text-sm ${
                            index <= currentIndex ? 'text-blue-600 font-semibold' : 'text-gray-500'
                        }`}>
                            {status}
                        </span>
                        {index < statuses.length - 1 && (
                            <div className={`w-8 h-0.5 ${
                                index < currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="h-full">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <h1 className="text-2xl font-bold text-gray-800">Employee's View</h1>
                <p className="text-gray-600 text-sm mt-1">User should be able to upload a receipt from his computer or take a photo of the receipt, using OCR a new expense should get created with total amount and other necessary details.</p>
            </div>

            {/* Two Panel Layout */}
            <div className="flex h-[calc(100vh-120px)]">
                {/* Left Panel - Expenses List */}
                <div className="w-3/5 bg-white border-r border-gray-200 overflow-hidden">
                    {/* Upload/New buttons */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex gap-2">
                            <label className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer inline-flex items-center ${
                                ocrProcessing 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}>
                                {ocrProcessing ? (
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                {ocrProcessing ? 'Processing...' : 'Upload & Scan'}
                                <input 
                                    type="file" 
                                    className="sr-only"
                                    accept="image/*"
                                    disabled={ocrProcessing}
                                    onChange={async (e) => {
                                        if (e.target.files[0]) {
                                            handleNewExpense();
                                            await handleOcrUpload(e.target.files[0]);
                                        }
                                        // Clear the input so the same file can be selected again
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                            <button 
                                onClick={handleNewExpense}
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                            >
                                New
                            </button>
                        </div>
                    </div>

                    {/* Expenses Table */}
                    <div className="overflow-auto h-full">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Paid By</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Remarks</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length > 0 ? expenses.map((expense, index) => (
                                    <tr key={expense.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3">Sarah</td>
                                        <td className="px-4 py-3">{expense.description || 'Restaurant bill'}</td>
                                        <td className="px-4 py-3">{expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '9th Oct, 2025'}</td>
                                        <td className="px-4 py-3">{expense.category || 'Food'}</td>
                                        <td className="px-4 py-3">Sarah</td>
                                        <td className="px-4 py-3">{expense.remarks || 'None'}</td>
                                        <td className="px-4 py-3">{expense.currency || 'INR'} {expense.amount || '567.45'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                expense.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {expense.status === 'Pending' ? 'Submitted' : expense.status || 'Submitted'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            No expenses found. Create your first expense using the form on the right.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel - Expense Form */}
                <div className="w-2/5 bg-white overflow-auto">
                    {!showForm ? (
                        // Default State - No Form
                        <div className="p-6 h-full flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Create New Expense</h3>
                                <p className="text-sm text-gray-500 mb-4">Click the "New" button to start creating a new expense report.</p>
                                <button 
                                    onClick={handleNewExpense}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Create New Expense
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Expense Form
                        <div className="p-6">
                        {/* Attach Receipt Button */}
                        <div className="mb-6">
                            <label htmlFor="receipt-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Attach Receipt
                            </label>
                            <input 
                                id="receipt-upload" 
                                type="file" 
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                            />
                            {formData.receipt && (
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    ✓ {formData.receipt.name}
                                </p>
                            )}
                        </div>

                        {/* Status Progress */}
                        <StatusProgress currentStatus={currentStatus} />

                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 font-semibold">Success!</p>
                                <p className="text-sm text-green-600">
                                    {ocrResult ? 'Receipt processed and expense data extracted!' : 'Your expense has been submitted for approval.'}
                                </p>
                            </div>
                        )}

                        {/* OCR Result Display */}
                        {ocrResult && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-blue-800 font-semibold">OCR Processing Result</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        ocrResult.confidence > 70 ? 'bg-green-100 text-green-800' :
                                        ocrResult.confidence > 40 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        Confidence: {ocrResult.confidence}%
                                    </span>
                                </div>
                                <p className="text-sm text-blue-600 mb-2">Form fields have been automatically populated from your receipt.</p>
                                <details className="text-xs">
                                    <summary className="cursor-pointer text-blue-700 hover:text-blue-800">View extracted text</summary>
                                    <div className="mt-2 p-2 bg-white rounded border text-gray-700 font-mono text-xs max-h-32 overflow-y-auto">
                                        {ocrResult.extractedText || 'No text extracted'}
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    placeholder="Enter description"
                                />
                            </div>

                            {/* Row 1: Expense Date and Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expense Date
                                    </label>
                                    <input
                                        type="date"
                                        id="expenseDate"
                                        required
                                        value={formData.expenseDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none bg-white"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Paid By and Total Amount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Paid By
                                    </label>
                                    <select
                                        id="paidBy"
                                        value={formData.paidBy}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none bg-white"
                                    >
                                        {paidByOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total amount in <span className="text-blue-600">currency selection ▼</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        required
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                        placeholder="567.45"
                                    />
                                </div>
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    rows="3"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelForm}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>

                        </form>
                        </div>
                    )}
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