const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.User;

// Admin can create Employees & Managers [cite: 13]
exports.createUser = async (req, res) => {
  const { name, email, password, role, managerId } = req.body;
  try {
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      role, // Role is either 'Employee' or 'Manager' [cite: 14]
      managerId, // Assign manager relationship [cite: 15]
      companyId: req.session.companyId,
    });
    res.status(201).send({ message: "User created successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { companyId: req.session.companyId },
            attributes: ['id', 'name', 'email', 'role', 'managerId'] // Exclude password
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};