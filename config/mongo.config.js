const mongoose = require("mongoose");
const config = require("./config");

const connectDatabase = async () => {
  try {
    await mongoose
      .connect(config.MONGO_URL)
      .then(() => console.log("Connected to MongoDB successfully"))
      .catch((err) => {
        console.log("Connection error : ", err);
        process.exit();
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectDatabase,
};
