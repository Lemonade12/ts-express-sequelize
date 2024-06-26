import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";
import { body, validationResult } from "express-validator";
import { emitWarning } from "process";
import jwt from "jsonwebtoken";

const userService = require("../services/userService");

async function signup(req: Request, res: Response) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: validation.array() });
    }
    const { email, password, name } = req.body;
    await userService.signup(email, password, name);
    return res.status(StatusCodes.OK).send({ message: "회원가입 완료" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function signin(req: Request, res: Response) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: validation.array() });
    }
    const { email, password } = req.body;
    const data = await userService.signin(email, password);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function logout(req: Request, res: Response) {
  try {
    const userId = req.userId;
    await userService.logout(userId);
    return res.status(StatusCodes.OK).send({ message: "로그아웃 완료" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readTodayVisitorController(req: Request, res: Response) {
  try {
    const data: number = await userService.readTodayVisitorService();
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function reissueAcessTokenController(req: Request, res: Response) {
  try {
    const data: string = await userService.reissueAcessTokenService(req.headers.refreshtoken);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  signup,
  signin,
  readTodayVisitorController,
  reissueAcessTokenController,
  logout,
};
