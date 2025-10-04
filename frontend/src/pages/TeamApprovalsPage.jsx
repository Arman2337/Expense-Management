import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { expenseService } from '../services/expenseService';
import ApprovalModal from '../components/ApprovalModal';
import { Loader } from 'lucide-react';

export default function TeamApprovalsPage() {
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState({ isOpen: false, expense: null, decision: '' });

    const fetchApprovals = async () => {
        setIsLoading(true);
        try {
            const response = await expenseService.getPendingApprovals();
            setApprovals(response.data);
        } catch (error) {
            console.error("Failed to fetch pending approvals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleOpenModal = (expense, decision) => {
        setModalState({ isOpen: true, expense, decision });
    };

    const handleProcessExpense = async (expenseId, decision, comments) => {
        try {
            await expenseService.processExpense(expenseId, decision, comments);
            // After processing, remove the item from the list for an instant UI update
            setApprovals(prev => prev.filter(item => item.id !== expenseId));
            setModalState({ isOpen: false, expense: null, decision: '' }); // Close modal
        } catch (err) {
            console.error("Failed to process expense", err);
            // Optionally, show an error message to the user
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <>
            <ApprovalModal {...modalState} onClose={() => setModalState({ isOpen: false, expense: null, decision: '' })} onSubmit={handleProcessExpense} />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Team Pending Approvals</h1>
                <Card>
                    <div className="overflow-x-auto">
                        {approvals.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvals.map(item => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{item.submittedBy.name}</td>
                                            <td className="px-4 py-3">{new Date(item.expenseDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-semibold">{item.currency} {item.amount}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button onClick={() => handleOpenModal(item, 'Approved')} variant="primary">Approve</Button>
                                                    <Button onClick={() => handleOpenModal(item, 'Rejected')} variant="danger">Reject</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-12 text-gray-500">You have no pending approvals at this time.</p>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
}