import express, { Request, Response } from "express";
import { body } from "express-validator";
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post(
  "/user/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  userController.signup
);
userRouter.post("/user/signin", userController.signin);
//router.get("/user", authMiddleware.auth, userController.signup);

module.exports = userRouter;
