import express from "express";
const postController = require("../controllers/postController");
const authMiddleware = require("../modules/auth");

const router = express.Router();

router.post("/post", authMiddleware.auth, postController.createPostController); // 게시글 작성
router.patch("/post/:id", authMiddleware.auth, postController.updatePostController); // 게시글 수정,삭제,복구
router.get("/post/:id", postController.readPostController); // 게시글 상세보기(조회수 1증가)
router.post("/post/like/:id", authMiddleware.auth, postController.likeController); // 좋아요, 좋아요 취소
router.get("/post", postController.readPostListController); // 게시글 목록

module.exports = router;
