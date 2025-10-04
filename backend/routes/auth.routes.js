const controller = require("../controllers/auth.controller");
const router = require("express").Router();
const { checkAuth } = require("../middleware/auth.middleware"); // Import middleware

// Public routes - anyone can access these
router.post("/signup", controller.signup);
router.post("/login", controller.login);

// Protected routes - only logged-in users can access these
router.post("/logout", checkAuth, controller.logout);
router.get("/me", checkAuth, controller.me);

module.exports = router;