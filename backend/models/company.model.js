module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define("company", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    defaultCurrency: {
      type: Sequelize.STRING(3), // e.g., 'USD', 'INR'
      allowNull: false
    }
  });
  return Company;
};