const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

module.exports = {
  MONGO_URL: process.env.MONGODB_URL,
  PORT: parseInt(process.env.PORT, 10) || 3000,
};
