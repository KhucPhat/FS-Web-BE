const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: [true, "Vui lòng điền đầy đủ tên!"],
      unique: true,
    },
    birthday: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      require: [true, "Vui lòng nhập email!"],
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Email is not valid",
      },
    },
    password: {
      type: String,
      require: [true, "Vui lòng nhập mật khẩu của bạn"],
      minlength: [6, "Password must be at least 6 characters long"],
      default: "admin123",
    },
    role: {
      type: String,
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.protectedFields = ["_id", "__v"];

module.exports = mongoose.model("users", userSchema);
