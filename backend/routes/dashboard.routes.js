const controller = require("../controllers/dashboard.controller");
const router = require("express").Router();

// Defines the GET /api/dashboard/stats?role=... endpoint
router.get("/stats", controller.getStats);

module.exports = router;