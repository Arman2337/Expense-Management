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
        // **IMPROVED ERROR HANDLING IS HERE**
        if (error.name === 'SequelizeUniqueConstraintError') {
            // This error happens when the email is already in use
            return res.status(409).send({ message: "Error: Email address is already registered." });
        }
        if (error.name === 'SequelizeValidationError') {
            // This error happens if a field fails a model validation (e.g., password too short)
            const messages = error.errors.map(e => e.message);
            return res.status(400).send({ message: `Validation error: ${messages.join(', ')}` });
        }
        // For any other unexpected errors
        res.status(500).send({ message: error.message || "An unexpected error occurred while creating the user." });
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