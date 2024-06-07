import express from "express";
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const chatRouter = require("./chatRouter");
const noticeRouter = require("./noticeRouter");
const searchRouter = require("./searchRouter");
const router = express.Router();

router.use(userRouter);
router.use(postRouter);
router.use(chatRouter);
router.use(noticeRouter);
router.use(searchRouter);

module.exports = router;
