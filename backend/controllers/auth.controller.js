const db = require("../models");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const User = db.User;
const Company = db.Company;

// On first login/signup, a new Company and Admin User are auto-created [cite: 11]
exports.signup = async (req, res) => {
  // Added countryCode to be received from the frontend
  const { companyName, countryCode, email, password, adminName } = req.body;

  try {
    let defaultCurrency = 'USD'; // Default fallback currency
    try {
        // Fetch currency from the external API based on country code [cite: 48]
        const currencyResponse = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=currencies`);
        if (currencyResponse.data.currencies) {
            // Get the first currency code (e.g., 'USD', 'INR')
            const currencyKey = Object.keys(currencyResponse.data.currencies)[0];
            if (currencyKey) {
                defaultCurrency = currencyKey;
            }
        }
    } catch (apiError) {
        // If the API call fails or country is not found, we'll log it and use the fallback.
        console.error("Could not fetch currency for country code:", countryCode, apiError.message);
        // We can optionally send a warning, but for signup flow, we'll proceed with the default.
    }


    const company = await Company.create({
      name: companyName,
      defaultCurrency: defaultCurrency,
    });

    const user = await User.create({
      name: adminName,
      email: email,
      password: bcrypt.hashSync(password, 8),
      role: 'Admin', // First user is always an Admin [cite: 11]
      companyId: company.id,
    });

    // Create session on signup
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.companyId = user.companyId;

    res.status(201).send({ message: "Admin and Company registered successfully!" });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: "Failed! Email is already in use." });
    }
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