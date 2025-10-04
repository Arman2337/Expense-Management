const db = require("../models");
const axios = require("axios");
const Expense = db.Expense;
const User = db.User;
const Company = db.Company;

// Employee can submit expense claims [cite: 18]
exports.submitExpense = async (req, res) => {
  const { amount, currency, category, description, expenseDate } = req.body;
  const submittedById = req.session.userId;

  try {
    const user = await User.findByPk(submittedById, { include: 'company' });
    if (!user) return res.status(404).send({ message: 'User not found.' });

    const companyCurrency = user.company.defaultCurrency;
    let amountInCompanyCurrency = amount;

    // Convert currency if it's different from the company's currency [cite: 18, 44]
    if (currency.toUpperCase() !== companyCurrency.toUpperCase()) {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const rate = response.data.rates[companyCurrency];
      if (!rate) {
        return res.status(400).send({ message: `Currency conversion rate for ${companyCurrency} not found.`});
      }
      amountInCompanyCurrency = amount * rate;
    }
    
    // The expense is first approved by the employee's manager [cite: 22]
    const expense = await Expense.create({
      amount,
      currency,
      amountInCompanyCurrency,
      category,
      description,
      expenseDate,
      submittedById,
      status: 'Pending',
      // Assign the user's manager as the first approver
      currentApproverId: user.managerId
    });

    res.status(201).send({ message: "Expense submitted successfully.", expense });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Employee can view their expense history (Approved, Rejected) [cite: 20]
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

// Manager can view expenses waiting for their approval [cite: 34]
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