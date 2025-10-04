const controller = require("../controllers/approval.controller");
const router = require("express").Router();
const { checkAuth, checkRole } = require("../middleware/auth.middleware");

// Use a more specific path: /process/:expenseId
router.post(
    "/process/:expenseId", 
    [checkAuth, checkRole(['Manager', 'Admin'])], 
    controller.processExpense
);

module.exports = router;