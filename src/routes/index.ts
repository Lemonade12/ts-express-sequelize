import express from "express";
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const chatRouter = require("./chatRouter");
const router = express.Router();

router.use(userRouter);
router.use(postRouter);
router.use(chatRouter);

module.exports = router;
