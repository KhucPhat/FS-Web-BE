const bcrypt = require("bcryptjs");

exports.hashData = (value) => {
  const hashed = bcrypt.hashSync(value, 10);
  return hashed;
};

exports.compareData = (data, userData) => {
  return bcrypt.compare(data, userData);
};
