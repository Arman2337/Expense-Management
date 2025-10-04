// routes/expense.routes.js
const controller = require("../controllers/expense.controller");
const { checkAuth, checkManager } = require("../middleware/auth.middleware");
const router = require("express").Router();

// All expense routes require a user to be logged in
router.use(checkAuth);

router.post("/", controller.submitExpense);
router.get("/my-expenses", controller.getMyExpenses);

// Only Managers or Admins can see pending approvals
router.get("/pending-approvals", checkManager, controller.getPendingApprovals);

module.exports = router;