import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const userService = require("../services/userService");

interface SystemError {
  statusCode: number;
  message: string;
}

async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    await userService.signup(email, password);
    return res.status(StatusCodes.OK).send({ message: "회원가입 완료" });
  } catch (error) {
    const err = error as SystemError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { signup };
