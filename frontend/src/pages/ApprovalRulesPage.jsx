import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { approvalService } from '../services/approvalService';
import { userService } from '../services/userService';
import { Plus, Trash2 } from 'lucide-react';

export default function ApprovalRulesPage() {
    const [rules, setRules] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the new rule form
    const [newRuleName, setNewRuleName] = useState('');
    const [minAmount, setMinAmount] = useState(0);
    const [steps, setSteps] = useState([]);

    const fetchData = async () => {
        try {
            const [rulesRes, usersRes] = await Promise.all([
                approvalService.getRules(),
                userService.getAllUsers()
            ]);
            setRules(rulesRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddStep = () => {
        setSteps([...steps, { approverId: '', step: steps.length + 1 }]);
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step: i + 1 })));
    };

    const handleStepChange = (index, approverId) => {
        const newSteps = [...steps];
        newSteps[index].approverId = approverId;
        setSteps(newSteps);
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        setError('');
        const ruleData = { name: newRuleName, minAmount: parseFloat(minAmount), steps };

        try {
            await approvalService.createRule(ruleData);
            // Reset form and refetch rules
            setNewRuleName('');
            setMinAmount(0);
            setSteps([]);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create rule.');
        }
    };

    if (isLoading) return <div>Loading rules...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Approval Rules</h1>
            
            {/* Form to Create New Rule */}
            <Card>
                <h2 className="text-xl font-bold mb-4">Create New Rule</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
                <form onSubmit={handleCreateRule} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Rule Name" id="name" value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} placeholder="e.g., High Value Expenses" required />
                        <Input label="Minimum Amount ($)" id="minAmount" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold my-2">Approval Steps (in order)</h3>
                        <div className="space-y-2">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <span className="font-bold text-gray-500">{index + 1}</span>
                                    <select
                                        value={step.approverId}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">Select Approver...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                                        ))}
                                    </select>
                                    <Button type="button" variant="danger" onClick={() => handleRemoveStep(index)} className="!px-3 !py-2">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="secondary" onClick={handleAddStep} className="mt-2">
                            <Plus size={16} className="mr-2" /> Add Step
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit">Save Rule</Button>
                    </div>
                </form>
            </Card>

            {/* List of Existing Rules */}
            <Card>
                 <h2 className="text-xl font-bold mb-4">Existing Rules</h2>
                 <div className="space-y-4">
                     {rules.map(rule => (
                         <div key={rule.id} className="p-4 border rounded-lg">
                             <h3 className="font-bold">{rule.name} (Min Amount: ${rule.minAmount})</h3>
                             <ol className="list-decimal list-inside mt-2 text-sm text-gray-600">
                                {rule.steps.map(step => (
                                    <li key={step.id}>{step.approver.name}</li>
                                ))}
                             </ol>
                         </div>
                     ))}
                     {rules.length === 0 && <p className="text-gray-500">No approval rules have been created yet.</p>}
                 </div>
            </Card>
        </div>
    );
}