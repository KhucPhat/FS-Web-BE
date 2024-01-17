const express = require("express");
const { userController } = require("../controllers/controller");
const { validationUser } = require("../validations/validations");
const router = express.Router();

router.get("/auth/verify", userController.verifyRegister);
router.post("/register", validationUser.register, userController.register);

module.exports = router;
