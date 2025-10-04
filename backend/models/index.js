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

// Import all models and add them to the db object
db.Company = require("./company.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Expense = require("./expense.model.js")(sequelize, Sequelize);
// ADD THESE TWO LINES TO LOAD YOUR NEW MODELS
db.ApprovalRule = require("./approvalRule.model.js")(sequelize, Sequelize);
db.ApprovalStep = require("./approvalStep.model.js")(sequelize, Sequelize);


// --- Run Associations ---
// This code block automatically runs the .associate function from each model file,
// ensuring all relationships are created correctly.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Automatically alter tables to match models (fixes missing columns)
db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized (altered).'))
  .catch(err => console.error('Database sync error:', err));

module.exports = db;