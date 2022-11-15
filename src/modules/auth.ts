import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const db = require("../../database/index");
const user = db.user;
import sequelize from "sequelize";
const Op = sequelize.Op;
const secret_key = process.env.SECRET_KEY!;

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const access_token = req.headers.authorization;
    jwt.verify(access_token, secret_key, async (error, decoded) => {
      if (error) {
        // console.log('error', 333333333333333);
        return res.status(401).json({ message: "Access token 이 유효하지 않습니다." });
      }
      if (typeof decoded == "object") {
        const isExistingUser = await user.findOne({
          where: {
            id: decoded.id,
          },
        });
        if (isExistingUser) {
          // console.log(555555555555555555);
          req.userId = decoded.id;
          next();
        } else {
          // console.log(6666666);
          return res.status(401).json({ message: "존재하지 않는 유저 입니다." });
        }
      }
    });
  } else {
    // console.log(456456);
    return res.status(401).json({ message: "Access token 이 존재하지 않습니다." });
  }
};
module.exports = { auth };
