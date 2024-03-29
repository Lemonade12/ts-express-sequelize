import express from "express";
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const chatRouter = require("./chatRouter");
const noticeRouter = require("./noticeRouter");
const router = express.Router();

router.use(userRouter);
router.use(postRouter);
router.use(chatRouter);
router.use(noticeRouter);

module.exports = router;
