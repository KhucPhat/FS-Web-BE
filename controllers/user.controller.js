const { hashData } = require("../utils/password.util");
const { userService } = require("../services/services");
const apiResponse = require("../utils/apiResponse");
const {
  genareteAccessToken,
  generateVerifyToken,
  verifyToken,
} = require("../utils/token.util");
const config = require("../config/config");
const { sendEmailUser } = require("../utils/mailer.util");

const register = async (req, res) => {
  const data = { ...req.body };
  const password = data.password;
  const encryptPass = hashData(password);
  const newUser = {
    username: data.username,
    phonenumber: data.phonenumber,
    birthday: data.birthday,
    gender: data.gender,
    email: data.email,
    password: encryptPass,
  };
  try {
    const checkEmailDuplicate = await userService.findOneByEmail({
      email: data.email,
    });

    if (checkEmailDuplicate)
      return apiResponse.notFoundResponse(res, "Email already exists!");

    await userService.create(newUser);

    const cookieToken = await generateVerifyToken(newUser);
    res.cookie("temp_data", cookieToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    });

    // console.log(
    //   "sendCookie",
    //   res.cookie("temp_data", cookieToken, {
    //     maxAge: 5 * 60 * 1000,
    //     httpOnly: true,
    //   })
    // );

    // console.log("response", res);

    const toEmail = `${config.APP_URL}/api/v1/user/auth/verify`;

    sendEmailUser(data.email, "Xác thực đăng ký", "../views/sendEmail", {
      name: data.username,
      verificationLink: toEmail,
    });

    return apiResponse.successResponse(
      res,
      "Đăng ký thành công.Vui lòng xác thực tài khoản bằng email"
    );
  } catch (error) {
    return apiResponse.errorResponse(res, error);
  }
};

const verifyRegister = async (req, res) => {
  const cookieToken = req.cookies.temp_data;
  const userData = verifyToken(cookieToken, config.VERIFY_TOKEN_SECRET);

  try {
    if (!userData) return apiResponse.notFoundResponse(res, "Forbidden");
    await userService.findOneAndUpdate(
      { email: userData.data.email },
      { verified: true }
    );

    return apiResponse.successResponse(res, "Xác thực thành công");
  } catch (error) {
    return apiResponse.ErrorResponse(res, error.message);
  }
};

const login = async (req, res) => { };

module.exports = {
  register,
  verifyRegister,
};
