module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define("expense", {
    // Expense details submitted by employee
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
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    expenseDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    receiptImageUrl: {
      type: Sequelize.STRING
    },
    // Tracks the current state of the expense
    status: {
      type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending'
    },
    // Comment added by approver on rejection/approval
    approverComments: {
      type: Sequelize.TEXT
    }
  });
  return Expense;
};