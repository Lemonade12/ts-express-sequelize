import bcrypt from "bcrypt";
import ApiError from "../modules/api.error";
import jwt from "jsonwebtoken";
import { Json } from "sequelize/types/utils";
const secret_key = process.env.SECRET_KEY!;

const userRepo = require("../repository/userRepository");

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(password, salt);
  return result;
}

async function signup(email: string, password: string) {
  const isExistedUser = await userRepo.readUserByEmail(email);
  if (isExistedUser) {
    // 이메일 중복여부 체크
    const error = new ApiError(400, "이미 사용중인 이메일 입니다.");
    throw error;
  }
  userRepo.createUser(email, await encryptPassword(password));
}

async function signin(
  email: string,
  password: string
): Promise<{
  access_token: string;
}> {
  const isExistedUser = await userRepo.readUserByEmail(email);
  if (!isExistedUser) {
    // 존재하는 유저인지 체크
    const error = new ApiError(400, "존재하지 않는 ID 입니다.");
    throw error;
  }
  const isValidPassword = await bcrypt.compare(password, isExistedUser.password);

  if (isValidPassword) {
    // password 맞으면 access token 발급
    const payload = {
      id: isExistedUser.id,
    };
    const access_token = jwt.sign(payload, secret_key, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    return { access_token };
  } else {
    const error = new ApiError(401, "비밀번호가 틀렸습니다.");
    throw error;
  }
}

module.exports = { signup, signin };
