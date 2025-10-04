const controller = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

module.exports = router;