const { hashData, compareData } = require("../utils/password.util");
const { userService } = require("../services/services");
const apiResponse = require("../utils/apiResponse");
const {
  generateAccessToken,
  generateVerifyToken,
  verifyToken,
} = require("../utils/token.util");
const config = require("../config/config");
const { sendEmailUser } = require("../utils/mailer.util");

const register = async (req, res) => {
  const data = { ...req.body };

  try {
    const checkEmailDuplicate = await userService.findOneByEmail({
      email: data.email,
    });

    if (checkEmailDuplicate)
      return apiResponse.notFoundResponse(res, "Email already exists!");

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

    await userService.create(newUser);

    const newCookieToken = generateVerifyToken(newUser);
    res.cookie("temp_data", newCookieToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    });

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

const login = async (req, res) => {
  let data = { ...req.body };
  try {
    const user = await userService.findOneByEmail({ email: data.email });

    if (!user) return apiResponse.notFoundResponse(res, "Email không tồn tại.");

    const passwordIsValid = await compareData(data.password, user.password);

    if (!passwordIsValid)
      return apiResponse.validationErrorWithData(res, "Mật khẩu không đúng.");

    const accessToken = generateAccessToken(user._id);
    const info = await userService.findSelect({ _id: user._id }, "-password");

    return apiResponse.successResponseWithData(res, "Đăng nhập thành công", {
      accessToken: accessToken,
      info: info,
    });
  } catch (error) {
    return apiResponse.errorResponse(res, error.message);
  }
};

const forgetPass = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await userService.findOneByEmail({ email: email });
    if (!user)
      return apiResponse.notFoundResponse(
        res,
        "Không tìm thấy tài khoản, vui lòng kiểm tra lại địa chỉ email đã nhập."
      );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    res.cookie("otp", otp, { maxAge: 60000, httpOnly: true });
    res.cookie("email", email, { httpOnly: true });

    sendEmailUser(email, "Thay đổi mật khẩu", "../views/sendOtp", {
      otp: otp,
    });

    return apiResponse.successResponse(res, "success");
  } catch (error) {
    return apiResponse.errorResponse(res, error.message);
  }
};

const confirmOtp = async (req, res) => {
  const otpEmail = req.cookies.otp;
  const dataOtp = req.body.otp;
  try {
    if (otpEmail !== dataOtp)
      return apiResponse.notFoundResponse(res, "Mã OTP không đúng");
    return apiResponse.successResponse(res, "success");
  } catch (error) {
    return apiResponse.errorResponse(res, error.message);
  }
};

const newPassword = async (req, res) => {
  const email = req.cookies.email;
  const newPassword = req.body.new_password;
  try {
    if (!email)
      return apiResponse.notFoundResponse(res, "Tài khoản không tồn tại");
    await userService.findOneAndUpdate(
      { email: email },
      { password: hashData(newPassword) }
    );
    res.clearCookie("email");
    return apiResponse.successResponse(res, "Thay đổi mật khẩu thành công");
  } catch (error) {
    return apiResponse.errorResponse(res, error.message);
  }
};

const changePassword = async (req, res) => {
  const data = { ...req.body };
  try {
    const user = await userService.findOneByEmail({ email: data.email });
    const passwordIsValid = await compareData(data.password, user.password);

    if (!passwordIsValid)
      return apiResponse.notFoundResponse(res, "Mật khẩu không đúng");

    await userService.findOneAndUpdate(
      { email: data.email },
      { password: hashData(data.new_password) }
    );

    return apiResponse.successResponse(res, "Thay đổi mật khẩu thành công");
  } catch (error) {
    return apiResponse.errorResponse(res, error.message);
  }
};

module.exports = {
  register,
  verifyRegister,
  login,
  forgetPass,
  confirmOtp,
  newPassword,
  changePassword,
};
