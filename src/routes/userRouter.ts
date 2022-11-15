import express, { Request, Response } from "express";
import { body } from "express-validator";
const validator = require("../modules/validator");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post(
  "/user/signup",
  body("email").isEmail().withMessage("Please check email format."),
  body("password").isLength({ min: 5 }).withMessage("password must be at least 5 long."),
  body("name").not().isEmpty().withMessage("name is required."),
  userController.signup
);
userRouter.post("/user/signin", userController.signin);
//router.get("/user", authMiddleware.auth, userController.signup);

module.exports = userRouter;
