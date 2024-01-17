const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

module.exports = {
  MONGO_URL: process.env.MONGODB_URL,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  VERIFY_TOKEN_SECRET: process.env.VERIFY_TOKEN_SECRET,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  APP_URL: process.env.APP_URL,
};
