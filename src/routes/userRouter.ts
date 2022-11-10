import express from "express";
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/user/signup", userController.signup);
userRouter.post("/user/signin", userController.signin);
//router.get("/user", authMiddleware.auth, userController.signup);

module.exports = userRouter;
