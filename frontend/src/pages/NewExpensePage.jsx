import React from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function NewExpensePage() {
    const navigate = useNavigate();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit New Expense</h1>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Description" id="description" placeholder="e.g., Lunch with client" />
                    <Input label="Category" id="category" placeholder="e.g., Client Meal" />
                    <Input label="Amount" id="amount" type="number" placeholder="75.50" />
                    <Input label="Date" id="date" type="date" />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                     <Button onClick={() => navigate(-1)} variant="secondary">Cancel</Button>
                     <Button onClick={() => navigate('/')}>Submit Expense</Button>
                </div>
            </Card>
        </div>
    );
}