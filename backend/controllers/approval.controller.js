const db = require("../models");
const Expense = db.Expense;
const User = db.User;

// Managers can Approve/Reject with comments [cite: 35]
exports.processExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { decision, comments } = req.body; // decision should be 'Approved' or 'Rejected'
    const approverId = req.session.userId;

    try {
        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
            return res.status(404).send({ message: "Expense not found." });
        }

        if (expense.currentApproverId !== approverId) {
            return res.status(403).send({ message: "You are not the current approver for this expense." });
        }
        
        if (expense.status !== 'Pending') {
            return res.status(400).send({ message: "This expense has already been processed." });
        }

        expense.status = decision;
        expense.approverComments = comments;
        expense.currentApproverId = null; // Mark as processed

        // **THIS IS THE REQUIRED FIX:**
        // If the decision is 'Approved', we store the approver's ID.
        // This is what the dashboard controller needs to calculate stats.
        if (decision === 'Approved') {
            expense.approvedById = approverId;
        }
        
        // This comment block remains as a reminder for the next feature.
        // Logic for multi-level approval would go here. 
        // A more complex system would update currentApproverId to the next person in the chain. 
        
        await expense.save();

        res.status(200).send({ message: `Expense has been ${decision.toLowerCase()}.` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};