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

  Company.associate = (models) => {
        // A Company has many Users
        Company.hasMany(models.User, { 
            as: "users",
            foreignKey: "companyId"
        });
    };
    
  return Company;
};