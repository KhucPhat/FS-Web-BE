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
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const userData = {
    username: req.body.username,
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

exports.forgetPass = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const dataEmail = {
    email: req.body.email,
  };
  const { error } = schema.validate(dataEmail);
  if (error) return apiResponse.errorResponse(res, error.details[0].message);

  next();
};

exports.newPass = (req, res, next) => {
  const schema = Joi.object({
    new_password: Joi.string().min(6).required(),
  });

  const dataPass = {
    new_password: req.body.new_password,
  };
  const { error } = schema.validate(dataPass);
  if (error) return apiResponse.errorResponse(res, error.details[0].message);

  next();
};

exports.changePass = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    new_password: Joi.string().min(6).required(),
  });

  const dataPass = {
    password: req.body.password,
    new_password: req.body.new_password,
  };
  const { error } = schema.validate(dataPass);
  if (error) return apiResponse.errorResponse(res, error.details[0].message);

  next();
};
