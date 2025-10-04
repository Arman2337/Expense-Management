// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const setupSession = require('./config/session.config');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Important for cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session management
app.use(setupSession(db.sequelize));

// Sync database
db.sequelize.sync();
// In development, you might want to drop and resync the database
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Expense Management API." });
});
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/approvals', require('./routes/approval.routes'));


// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});