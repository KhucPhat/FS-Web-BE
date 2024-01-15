const express = require("express");
const router = express.Router();
const userRouter = require("./users.route");

router.use("/user", userRouter);

module.exports = router;
