import express, { Request, Response } from "express";
import { body } from "express-validator";
const validator = require("../modules/validator");
const userController = require("../controllers/userController");
const userRouter = express.Router();

//회원가입
userRouter.post(
  "/user/signup",
  [
    body("email").isEmail().withMessage("Please check email format."),
    body("password").isLength({ min: 5 }).withMessage("password must be at least 5 long."),
    body("name").not().isEmpty().withMessage("name is required."),
  ],
  userController.signup
);

//로그인
userRouter.post(
  "/user/signin",
  [
    body("email").isEmail().withMessage("Please check email format."),
    body("password").isLength({ min: 5 }).withMessage("password must be at least 5 long."),
  ],
  userController.signin
);

//Accesstoken 만료 재발급
userRouter.post("/expiration", userController.reissueAcessTokenController);

//일일방문자수(오늘), 중복카운트x
userRouter.get("/user/visitor", userController.readTodayVisitorController);

module.exports = userRouter;
