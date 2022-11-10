import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";

const userService = require("../services/userService");

async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    await userService.signup(email, password);
    return res.status(StatusCodes.OK).send({ message: "회원가입 완료" });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const data = await userService.signin(email, password);
    return res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { signup, signin };
