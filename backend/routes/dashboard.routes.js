const controller = require("../controllers/dashboard.controller");
const router = require("express").Router();
const { checkAuth } = require("../middleware/auth.middleware"); // Import middleware

// Defines the GET /api/dashboard/stats?role=... endpoint
// ADDED: checkAuth middleware to protect the route
router.get("/stats", checkAuth, controller.getStats);

module.exports = router;