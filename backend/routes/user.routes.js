const controller = require("../controllers/user.controller");
// Import checkAuth and the new checkRole middleware
const { checkAuth, checkRole } = require("../middleware/auth.middleware");
const router = require("express").Router();

// Use the new checkRole middleware to ensure only Admins can access these routes
// The user must be logged in AND have the 'Admin' role.
router.post("/", [checkAuth, checkRole(['Admin'])], controller.createUser);
router.get("/", [checkAuth, checkRole(['Admin'])], controller.getAllUsers);

module.exports = router;