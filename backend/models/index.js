const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Company = require("./company.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Expense = require("./expense.model.js")(sequelize, Sequelize);

// --- Define Associations ---

// A Company has many Users
db.Company.hasMany(db.User, { as: "users" });
db.User.belongsTo(db.Company, {
  foreignKey: "companyId",
  as: "company",
});

// A User (Manager) can have many Employees
// This sets up the manager relationship [cite: 15]
db.User.hasMany(db.User, { as: 'employees', foreignKey: 'managerId' });
db.User.belongsTo(db.User, { as: 'manager', foreignKey: 'managerId' });

// A User can submit many Expenses
db.User.hasMany(db.Expense, { as: 'expenses', foreignKey: 'submittedById' });
db.Expense.belongsTo(db.User, { as: 'submittedBy', foreignKey: 'submittedById' });

// An Expense is approved by a sequence of Users (Managers/Admins)
db.Expense.belongsTo(db.User, { as: 'currentApprover', foreignKey: 'currentApproverId' });


module.exports = db;