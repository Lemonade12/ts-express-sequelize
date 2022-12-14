import express from "express";
const postController = require("../controllers/postController");
const authMiddleware = require("../modules/auth");
const cacheCheck = require("../modules/cacheCheck");
const validator = require("../modules/validator");

const router = express.Router();

router.post(
  "/post",
  authMiddleware.auth,
  cacheCheck.hitRankCacheCheck,
  postController.createPostController
); // 게시글 작성
router.patch(
  "/post/:id",
  authMiddleware.auth,
  cacheCheck.hitRankCacheCheck,
  postController.updatePostController
); // 게시글 수정,삭제,복구
router.get("/post/:id", cacheCheck.hitRankCacheCheck, postController.readPostController); // 게시글 상세보기(조회수 1증가)
router.post("/post/like/:id", authMiddleware.auth, postController.likeController); // 좋아요, 좋아요 취소
router.get("/post", validator.searchConditionValidator, postController.readPostListController); // 게시글 목록
router.get("/hitRank", cacheCheck.hitRankCacheCheck, postController.readHitRankController); //게시물 조회수 랭킹(인기게시글 top 10)

module.exports = router;
