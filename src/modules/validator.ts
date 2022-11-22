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

async function searchConditionValidator(req: Request, res: Response, next: NextFunction) {}

module.exports = { signValidator };
