import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

async function signValidator(method: any) {
  switch (method) {
    case "createUser": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("password", "userName doesn't exists").exists().isLength({ min: 5 }),
      ];
    }
  }
}

async function searchConditionValidator(req: Request, res: Response, next: NextFunction) {
  const arrOrderBy = ["작성일", "조회수", "좋아요 수"];
  const arrOrder = ["ASC", "DESC"];
  const orderBy = req.query.orderBy as string;
  const order = req.query.order as string;
  if (orderBy && !arrOrderBy.includes(orderBy)) {
    return res
      .status(400)
      .json({ message: "orderBy1 : '작성일','조회수','좋아요 수' 중에 입력해주세요." });
  }
  if (order && !arrOrder.includes(order)) {
    return res.status(400).json({ message: "order : 'ASC','DESC' 중에 입력해주세요." });
  }
  next();
}

module.exports = { signValidator, searchConditionValidator };
