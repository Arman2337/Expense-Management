const db = require("../models");
const axios = require("axios");
const Expense = db.Expense;
const User = db.User;
const Company = db.Company;
const ApprovalRule = db.ApprovalRule;
const ApprovalStep = db.ApprovalStep;

// [cite_start]// Employee can submit expense claims [cite: 18]
exports.submitExpense = async (req, res) => {
    const { amount, currency, category, description, expenseDate } = req.body;
    const submittedById = req.session.userId;
    const { companyId } = req.session;

    try {
        const user = await User.findByPk(submittedById, { include: 'company' });
        if (!user) return res.status(404).send({ message: 'User not found.' });

        const companyCurrency = user.company.defaultCurrency;
        let amountInCompanyCurrency = parseFloat(amount);

        [cite_start]// Convert currency if it's different from the company's currency [cite: 18, 44]
        if (currency && currency.toUpperCase() !== companyCurrency.toUpperCase()) {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
            const rate = response.data.rates[companyCurrency];
            if (!rate) {
                return res.status(400).send({ message: `Currency conversion rate for ${companyCurrency} not found.` });
            }
            amountInCompanyCurrency = amount * rate;
        }

        // --- NEW LOGIC TO FIND APPROVER ---
        let currentApproverId = null;
        let applicableRuleId = null;

        // Find a matching approval rule, ordered by the highest minimum amount first to catch the most specific rule.
        const rule = await ApprovalRule.findOne({
            where: {
                companyId: companyId,
                minAmount: { [db.Sequelize.Op.lte]: amountInCompanyCurrency }
            },
            order: [['minAmount', 'DESC']]
        });

        if (rule) {
            // If a rule is found, find its first step
            const firstStep = await ApprovalStep.findOne({
                where: { approvalRuleId: rule.id, step: 1 }
            });
            if (firstStep) {
                currentApproverId = firstStep.approverId;
                applicableRuleId = rule.id; // Associate the expense with the rule
            }
        } else {
            // If no rule matches, fall back to the user's direct manager
            currentApproverId = user.managerId;
        }

        if (!currentApproverId) {
            return res.status(400).send({ message: "No approver could be found for this expense. Please contact an admin." });
        }
        
        const expense = await Expense.create({
            amount: parseFloat(amount),
            currency,
            amountInCompanyCurrency,
            category,
            description,
            expenseDate,
            submittedById,
            companyId, // Make sure to save the companyId
            status: 'Pending',
            currentApproverId: currentApproverId,
            approvalRuleId: applicableRuleId // Save the ID of the rule being followed
        });

        res.status(201).send({ message: "Expense submitted successfully.", expense });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// --- No Changes Needed for the Functions Below ---

// [cite_start]// Employee can view their expense history (Approved, Rejected) [cite: 20]
exports.getMyExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { submittedById: req.session.userId }
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// [cite_start]// Manager can view expenses waiting for their approval [cite: 34]
exports.getPendingApprovals = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: {
                currentApproverId: req.session.userId,
                status: 'Pending'
            },
            include: [{ model: User, as: 'submittedBy', attributes: ['name', 'email'] }]
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Admin can view all pending expenses in the company
exports.getAllPendingExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: {
                companyId: req.session.companyId,
                status: 'Pending'
            },
            include: [
                { model: User, as: 'submittedBy', attributes: ['name', 'email'] },
                { model: User, as: 'currentApprover', attributes: ['name', 'email'] }
            ]
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};