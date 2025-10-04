module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define("expense", {
    // Expense details submitted by employee [cite: 18]
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(3),
      allowNull: false
    },
    amountInCompanyCurrency: {
      type: Sequelize.DECIMAL(10, 2)
    },
    category: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    expenseDate: {
      type: Sequelize.DATEONLY
    },
    receiptImageUrl: {
        type: Sequelize.STRING
    },
    // Tracks the current state of the expense [cite: 20]
    status: {
      type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending'
    },
    // Comment added by approver on rejection/approval [cite: 35]
    approverComments: {
        type: Sequelize.TEXT
    }
  });
  return Expense;
};