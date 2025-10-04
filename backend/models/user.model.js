module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    // Defines user role: 'Admin', 'Manager', 'Employee' [cite: 14]
    role: {
      type: Sequelize.ENUM('Admin', 'Manager', 'Employee'),
      allowNull: false
    }
  });

  User.associate = (models) => {
        // A User belongs to one Company
        User.belongsTo(models.Company, {
            foreignKey: "companyId",
            as: "company",
        });

        // A User can have a Manager (who is also a User)
        User.belongsTo(models.User, { 
            as: 'manager', 
            foreignKey: 'managerId' 
        });

        // A User can have many Employees
        User.hasMany(models.User, { 
            as: 'employees', 
            foreignKey: 'managerId' 
        });

        // A User can submit many Expenses
        User.hasMany(models.Expense, { 
            as: 'expenses', 
            foreignKey: 'submittedById' 
        });
    };
    
  return User;
};