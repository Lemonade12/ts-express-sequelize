import express from "express";
const noticeController = require("../controllers/noticeController");
const authMiddleware = require("../modules/auth");
const validator = require("../modules/validator");

const router = express.Router();

router.post(
  "/notice",
  authMiddleware.auth,
  authMiddleware.isAdmin,
  noticeController.createNoticeController
); // 게시글 작성
router.patch(
  "/notice/:id",
  authMiddleware.auth,
  authMiddleware.isAdmin,
  noticeController.updateNoticeController
); // 게시글 수정,삭제,복구
router.get("/notice/:id", noticeController.readNoticeController); // 공지글 상세보기(조회수 1증가)
//router.get("/notice", validator.searchConditionValidator, noticeController.readPostListController); // 공지글 목록

module.exports = router;
