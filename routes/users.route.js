const express = require("express");
const { userController } = require("../controllers/controller");
const { validationUser } = require("../validations/validations");
const { authVerifyAccount } = require("../middllewares/auth");
const router = express.Router();

router.post(
  "/change-password",
  validationUser.changePass,
  userController.changePassword
);
router.post(
  "/new-password",
  validationUser.newPass,
  userController.newPassword
);
router.post("/confirm-otp", userController.confirmOtp);
router.post(
  "/forget-pass",
  validationUser.forgetPass,
  userController.forgetPass
);
router.post(
  "/login",
  validationUser.login,
  authVerifyAccount,
  userController.login
);
router.get("/auth/verify", userController.verifyRegister);
router.post("/register", validationUser.register, userController.register);

module.exports = router;
