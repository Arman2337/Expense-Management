const controller = require("../controllers/expense.controller");
const router = require("express").Router();
// Correctly import checkAuth and the new checkRole
const { checkAuth, checkRole } = require("../middleware/auth.middleware");

// A user must be logged in for all of these
router.use(checkAuth);

// Routes for Employees
router.post("/submit", checkRole(['Employee']), controller.submitExpense);
router.get("/my-expenses", checkRole(['Employee']), controller.getMyExpenses);

// Route for Managers
router.get("/pending-approvals", checkRole(['Manager']), controller.getPendingApprovals);

// Route for Admins
router.get("/all-pending", checkRole(['Admin']), controller.getAllPendingExpenses);

module.exports = router;