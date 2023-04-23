import express from "express";
import multer from "multer";
import fs from "fs";
import ApiError from "../modules/api.error";
const postController = require("../controllers/postController");
const authMiddleware = require("../modules/auth");
const cacheCheck = require("../modules/cacheCheck");
const validator = require("../modules/validator");

const router = express.Router();

try {
  fs.readdirSync("uploads"); // 폴더 확인
} catch (err) {
  console.error("uploads 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 폴더 생성
}

const upload = multer({
  storage: multer.diskStorage({
    // 저장한공간 정보 : 하드디스크에 저장
    destination(req, file, done) {
      // 저장 위치
      done(null, "uploads/"); // uploads라는 폴더 안에 저장
    },
    filename(req, file, done) {
      // 파일명을 어떤 이름으로 올릴지
      done(null, Date.now() + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5메가로 용량 제한
  fileFilter(req, file, callback) {
    const typeArray = file.mimetype.split("/");
    const fileType = typeArray[1];
    if (fileType == "png") {
      callback(null, true);
    } else {
      return callback(new Error("png 파일만 업로드 가능합니다."));
    }
  },
}).array("file");

router.post(
  "/post",
  authMiddleware.auth,
  cacheCheck.hitRankCacheCheck,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("error1");
        return res.status(400).json({ message: "5mb 이하 파일만 업로드 가능합니다." });
      } else if (err) {
        console.log("error2");
        return res.status(400).json({ message: err.message });
      } else {
        next();
      }
    });
  },
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
router.post("/comment", authMiddleware.auth, postController.createCommentController); //댓글 작성, 알림 업데이트
router.patch("/comment/:id", authMiddleware.auth, postController.updateCommentController); // 댓글수정
router.get("/alarm/:id", postController.readAlarmController); //댓글알람 읽기
router.get("/alarmList", authMiddleware.auth, postController.readAlarmListController); //댓글 알림 리스트
module.exports = router;
