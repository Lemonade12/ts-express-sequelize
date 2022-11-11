import { body } from "express-validator";

async function validate(method: any) {
  switch (method) {
    case "createUser": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("password", "userName doesn't exists").exists().isLength({ min: 5 }),
      ];
    }
  }
}

module.exports = { validate };
