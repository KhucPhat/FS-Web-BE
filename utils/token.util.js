const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.genareteAccessToken = (id) => {
  try {
    return jwt.sign(
      {
        id: id,
      },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1w" },
      { algorithm: "RS256" }
    );
  } catch (error) {
    console.error("Error generating token:", err);
  }
};

exports.generateVerifyToken = (data) => {
  try {
    return jwt.sign(
      { data: data },
      config.VERIFY_TOKEN_SECRET,
      { expiresIn: "5m" },
      { algorithm: "RS256" }
    );
  } catch (error) {
    console.error("Error generating token:", err);
  }
};

exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Xác thực thất bại: ", error);
  }
};
