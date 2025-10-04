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
  return User;
};