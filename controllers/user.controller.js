const { hashData } = require("../utils/password.util");
const { userService } = require("../services/services");
const apiResponse = require("../utils/apiResponse");

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

    return apiResponse.successResponse(res, "Đăng ký thành công");
  } catch (error) {
    return apiResponse.errorResponse(res, error);
  }
};

const login = async (req, res) => { 
  
}

module.exports = {
  register,
};
