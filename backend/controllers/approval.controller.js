const db = require("../models");
const Expense = db.Expense;
const ApprovalRule = db.ApprovalRule;
const ApprovalStep = db.ApprovalStep;

exports.processExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { decision, comments } = req.body;
    const approverId = req.session.userId;

    try {
        const expense = await Expense.findByPk(expenseId);
        if (!expense) return res.status(404).send({ message: "Expense not found." });
        if (expense.currentApproverId !== approverId) return res.status(403).send({ message: "You are not the current approver." });
        if (expense.status !== 'Pending') return res.status(400).send({ message: "This expense has already been processed." });

        expense.approverComments = comments;

        if (decision === 'Rejected') {
            // If rejected, the process stops here.
            expense.status = 'Rejected';
            expense.currentApproverId = null;
            await expense.save();
            return res.status(200).send({ message: "Expense has been rejected." });
        }

        // If 'Approved', we find the next approver
        if (decision === 'Approved') {
            // Find the rule this expense is following
            const rule = await ApprovalRule.findByPk(expense.approvalRuleId, {
                include: { model: ApprovalStep, as: 'steps' }
            });
            
            if (!rule || rule.steps.length === 0) {
                // This is the final approver (or no rule was found)
                expense.status = 'Approved';
                expense.currentApproverId = null;
                expense.approvedById = approverId;
            } else {
                // Find the current step in the sequence
                const currentStep = rule.steps.find(step => step.approverId === approverId);
                // Find the next step in the sequence
                const nextStep = rule.steps.find(step => step.step === currentStep.step + 1);

                if (nextStep) {
                    // There is a next approver, assign the expense to them
                    expense.currentApproverId = nextStep.approverId;
                } else {
                    // This was the last step in the rule, so it's finally approved
                    expense.status = 'Approved';
                    expense.currentApproverId = null;
                    expense.approvedById = approverId;
                }
            }
        }

        await expense.save();
        res.status(200).send({ message: `Expense has been processed.` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};