// routes/approval.routes.js
const controller = require("../controllers/approval.controller");
const { checkAuth, checkManager } = require("../middleware/auth.middleware");
const router =require("express").Router();

// Approving or rejecting requires Manager or Admin role
router.use(checkAuth, checkManager);

router.post("/:expenseId", controller.processExpense);

module.exports = router;