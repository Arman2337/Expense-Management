// routes/user.routes.js
const controller = require("../controllers/user.controller");
const { checkAuth, checkAdmin } = require("../middleware/auth.middleware");
const router = require("express").Router();

// Only an authenticated Admin can create or view users
router.use(checkAuth, checkAdmin);

router.post("/", controller.createUser);
router.get("/", controller.getAllUsers);

module.exports = router;