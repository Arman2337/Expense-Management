const db = require("../models");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const User = db.User;
const Company = db.Company;

// On first login/signup, a new Company and Admin User are auto-created [cite: 11]
exports.signup = async (req, res) => {
  const { companyName, countryCode, email, password, adminName } = req.body;

  try {
    // Fetch currency from the external API based on country 
    // Note: In a real app, you'd find the country by code and get its currency.
    // This is a simplified example.
    const currencyResponse = await axios.get(`https://restcountries.com/v3.1/all?fields=name,currencies`);
    // This logic would need to be more robust to find the correct currency
    const defaultCurrency = 'USD'; // Placeholder

    const company = await Company.create({
      name: companyName,
      defaultCurrency: defaultCurrency,
    });

    const user = await User.create({
      name: adminName,
      email: email,
      password: bcrypt.hashSync(password, 8),
      role: 'Admin', // First user is always an Admin
      companyId: company.id,
    });

    // Create session on signup
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.companyId = user.companyId;

    res.status(201).send({ message: "Admin and Company registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password!" });
        }

        // Set session cookie
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.companyId = user.companyId;

        res.status(200).send({
            id: user.id,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: "Could not log out, please try again." });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.status(200).send({ message: "Logout successful." });
    });
};



exports.me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({ message: "Not authenticated" });
    }

    try {
        const user = await User.findByPk(req.session.userId, {
            // Exclude sensitive information like password
            attributes: ['id', 'name', 'email', 'role'] 
        });

        if (!user) {
            // This can happen if the user was deleted but the cookie remains
            req.session.destroy();
            res.clearCookie('connect.sid');
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};