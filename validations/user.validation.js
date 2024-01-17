const Joi = require("joi");
const apiResponse = require("../utils/apiResponse");

exports.register = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-ZÀ-ỹ ]+$/)
      .custom((value, helpers) => {
        if (/[^a-zA-ZÀ-ỹ ]/.test(value)) {
          return helpers.message("Tên không được chứa ký tự đặc biệt");
        }
        return value;
      })
      .min(3)
      .max(30)
      .required(),
    phonenumber: Joi.string().pattern(new RegExp("^[0-9]{10,11}$")).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const userData = {
    username: req.body.username,
    phonenumber: req.body.phonenumber,
    email: req.body.email,
    password: req.body.password,
  };
  const { error } = schema.validate(userData);
  if (error) {
    return apiResponse.errorResponse(res, error.details[0].message);
  }

  next();
};

exports.login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const userData = {
    email: req.body.email,
    password: req.body.password,
  };
  const { error } = schema.validate(userData);
  if (error) {
    return apiResponse.errorResponse(res, error.details[0].message);
  }

  next();
};
