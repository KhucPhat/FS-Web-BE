const express = require("express");
const { userController } = require("../controllers/controller");
const { validationUser } = require("../validations/validations");
const router = express.Router();

router.post("/login", validationUser.login, userController.login);
router.get("/auth/verify", userController.verifyReister);
router.post("/register", validationUser.register, userController.register);

module.exports = router;
