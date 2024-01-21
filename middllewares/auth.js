const { userService } = require("../services/services");
const { sendEmailUser } = require("../utils/mailer.util");
const { generateVerifyToken } = require("../utils/token.util");
const apiResponse = require("../utils/apiResponse");
const config = require("../config/config");

exports.authVerifyAccount = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await userService.findOneByEmail({ email: email });
    if (!user.verified) {
      const infoUser = {
        username: user.username,
        email: user.email,
        password: user.password,
      };

      const cookieToken = generateVerifyToken(infoUser);
      res.cookie("temp_data", cookieToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      });

      const toEmail = `${config.APP_URL}/api/v1/user/auth/verify`;

      sendEmailUser(user.email, "Xác thực đăng ký", "../views/sendEmail", {
        name: user.username,
        verificationLink: toEmail,
      });

      return apiResponse.notFoundResponse(
        res,
        "Tài khoản chưa được xác thực.Vui lòng kiểm tra email xác thực tài khoản"
      );
    }

    next();
  } catch (err) {
    console.log(err);
    return apiResponse.errorResponse(res, err.message);
  }
};
