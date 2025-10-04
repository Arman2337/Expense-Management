import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';

export default function NewExpensePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: '',
        currency: 'USD', // Default or fetch from user/company profile
        expenseDate: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await expenseService.submitExpense(formData); // [cite: 18]
            alert('Expense submitted successfully!');
            navigate('/'); // Navigate to dashboard after submission
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to submit expense.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit New Expense</h1>
            <Card>
                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Description" id="description" placeholder="e.g., Lunch with client" value={formData.description} onChange={handleChange} required />
                        <Input label="Category" id="category" placeholder="e.g., Client Meal" value={formData.category} onChange={handleChange} required />
                        <Input label="Amount" id="amount" type="number" placeholder="75.50" value={formData.amount} onChange={handleChange} required />
                        <Input label="Currency" id="currency" placeholder="e.g., USD, INR" value={formData.currency} onChange={handleChange} required />
                        <Input label="Date" id="expenseDate" type="date" value={formData.expenseDate} onChange={handleChange} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                         <Button type="button" onClick={() => navigate(-1)} variant="secondary" disabled={isSubmitting}>Cancel</Button>
                         <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Expense'}
                         </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}