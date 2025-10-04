// src/pages/ApprovalRulesPage.jsx
import React from 'react';
import { Card } from '../components/Card';

export default function ApprovalRulesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Approval Rules</h1>
            <Card>
                <p className="text-gray-500">
                    [cite_start]This page is where an Administrator will define multi-level and conditional approval flows. [cite: 5, 7, 23]
                </p>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Feature Under Development</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Here, you could build a user interface to create rules such as:
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                        [cite_start]<li>If expense is &gt; $1000, requires Director approval after Manager. [cite: 5]</li>
                        [cite_start]<li>If the category is "Travel", requires Finance department approval. [cite: 28]</li>
                        [cite_start]<li>An expense is auto-approved if the CFO approves it, regardless of other steps. [cite: 40]</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}