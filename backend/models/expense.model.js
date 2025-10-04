module.exports = (sequelize, Sequelize) => {
    const Expense = sequelize.define("expense", {
        // --- Core Expense Details ---
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
        
        // --- Approval Workflow Tracking ---
        status: {
            type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending'
        },
        approverComments: {
            type: Sequelize.TEXT
        },

        // --- NEW: Foreign Keys for Relationships ---
        // These fields were missing and are crucial for the app to function.
        companyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        submittedById: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        currentApproverId: {
            type: Sequelize.INTEGER
            // This can be null if the expense is approved, rejected, or doesn't need approval
        },
        approvedById: {
            type: Sequelize.INTEGER
            // This stores who gave the final approval
        },
        approvalRuleId: {
            type: Sequelize.INTEGER,
            allowNull: true // Can be null if no specific rule applies
        }
    });

    // --- NEW: Defining Associations ---
    // This part tells Sequelize how the Expense model is related to other models.
    Expense.associate = (models) => {
        // An expense belongs to one Company
        Expense.belongsTo(models.Company, {
            foreignKey: 'companyId',
            as: 'company'
        });
        // An expense is submitted by one User
        Expense.belongsTo(models.User, {
            foreignKey: 'submittedById',
            as: 'submittedBy'
        });
        // An expense can have a current approver who is also a User
        Expense.belongsTo(models.User, {
            foreignKey: 'currentApproverId',
            as: 'currentApprover'
        });
        // An expense can have a final approver who is also a User
        Expense.belongsTo(models.User, {
            foreignKey: 'approvedById',
            as: 'approvedBy'
        });
        Expense.belongsTo(models.ApprovalRule, {
            foreignKey: 'approvalRuleId',
            as: 'approvalRule'
        });
    };

    return Expense;
};