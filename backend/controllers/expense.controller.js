const db = require("../models");
const axios = require("axios");
const Expense = db.Expense;
const User = db.User;
const Company = db.Company;

// Employee can submit expense claims
exports.submitExpense = async (req, res) => {
  const { amount, currency, category, description, expenseDate } = req.body;
  const submittedById = req.session.userId;

  try {
    // Validation
    if (!amount || !category || !description || !expenseDate) {
      return res.status(400).send({ message: 'All required fields must be provided.' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).send({ message: 'Amount must be greater than 0.' });
    }

    const user = await User.findByPk(submittedById, { include: 'company' });
    if (!user) return res.status(404).send({ message: 'User not found.' });

    const companyCurrency = user.company.defaultCurrency;
    let amountInCompanyCurrency = amount;

    // Use currency from request or default to company currency
    const expenseCurrency = currency || companyCurrency;

    // Convert currency if it's different from the company's currency
    if (expenseCurrency.toUpperCase() !== companyCurrency.toUpperCase()) {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${expenseCurrency}`);
        const rate = response.data.rates[companyCurrency];
        if (!rate) {
          return res.status(400).send({ message: `Currency conversion rate for ${companyCurrency} not found.`});
        }
        amountInCompanyCurrency = amount * rate;
      } catch (error) {
        console.error('Currency conversion error:', error);
        amountInCompanyCurrency = amount; // Fallback to same amount
      }
    }
    
    // Handle file upload (if present)
    let receiptPath = null;
    if (req.file) {
      receiptPath = req.file.path;
    }

    // The expense is first approved by the employee's manager
    const expense = await Expense.create({
      amount: parseFloat(amount),
      currency: expenseCurrency,
      amountInCompanyCurrency,
      category,
      description,
      expenseDate,
      receiptImageUrl: receiptPath,
      submittedById,
      status: 'Pending',
      // Assign the user's manager as the first approver
      currentApproverId: user.managerId
    });

    res.status(201).send({ 
      message: "Expense submitted successfully.", 
      expense: {
        id: expense.id,
        amount: expense.amount,
        currency: expense.currency,
        category: expense.category,
        description: expense.description,
        expenseDate: expense.expenseDate,
        status: expense.status
      }
    });
  } catch (error) {
    console.error('Submit expense error:', error);
    res.status(500).send({ message: error.message });
  }
};

// Employee can view their expense history (Approved, Rejected)
exports.getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { submittedById: req.session.userId },
      order: [['createdAt', 'DESC']]
    });
    
    // Format the response to match frontend expectations
    const formattedExpenses = expenses.map(expense => ({
      id: expense.id,
      description: expense.description,
      category: expense.category,
      amount: parseFloat(expense.amount),
      currency: expense.currency,
      date: expense.expenseDate,
      status: expense.status,
      receiptImageUrl: expense.receiptImageUrl,
      approverComments: expense.approverComments
    }));
    
    res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error('Get my expenses error:', error);
    res.status(500).send({ message: error.message });
  }
};

// Manager can view expenses waiting for their approval
exports.getPendingApprovals = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        currentApproverId: req.session.userId,
        status: 'Pending'
      },
      include: [{ 
        model: User, 
        as: 'submittedBy', 
        attributes: ['id', 'name', 'email'] 
      }],
      order: [['createdAt', 'ASC']]
    });
    
    // Format the response to match frontend expectations
    const formattedExpenses = expenses.map(expense => ({
      id: expense.id,
      description: expense.description,
      category: expense.category,
      amount: parseFloat(expense.amount),
      currency: expense.currency,
      expenseDate: expense.expenseDate,
      status: expense.status,
      submittedBy: {
        id: expense.submittedBy.id,
        name: expense.submittedBy.name,
        email: expense.submittedBy.email
      }
    }));
    
    res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).send({ message: error.message });
  }
};