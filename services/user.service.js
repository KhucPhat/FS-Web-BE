const { User } = require("../models/models");

exports.create = async (data) => User.create(data);
exports.findOneByEmail = async (email) => User.findOne(email);
