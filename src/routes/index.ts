import express from "express";
const userRouter = require("./userRouter");
const router = express.Router();

router.use(userRouter);

module.exports = router;
