const { User } = require("../models/models");

exports.create = async (data) => User.create(data);
exports.findOneByEmail = async (email) => User.findOne(email);
exports.findOneAndUpdate = async (data, update) =>
  User.findOneAndUpdate(data, update, { new: true });
exports.findSelect = async (data, select) => User.find(data).select(select);
