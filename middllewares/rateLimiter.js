const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // số lượng yêu cầu tối đa
  message: "Quá nhiều yêu cầu từ IP của bạn, vui lòng thử lại sau 15 phút.",
  skipSuccessfulRequests: true,
});

module.exports = authLimiter;
