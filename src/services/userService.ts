import bcrypt from "bcrypt";
import ApiError from "../modules/api.error";
import jwt from "jsonwebtoken";
const secret_key = process.env.SECRET_KEY!;
const redisClient = require("../../database/redis");
const userRepo = require("../repository/userRepository");

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(password, salt);
  return result;
}

async function createKeyForTodayVisitor(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  let date_str = String(date);
  let month_str = String(month);
  if (month < 10) {
    month_str = "0".concat(month_str);
  }
  if (date < 10) {
    date_str = "0".concat(date_str);
  }
  const key: string = String(year).concat(month_str, date_str);
  return key;
}

async function signup(email: string, password: string, name: string) {
  const isExistedUser = await userRepo.readUserByEmail(email);
  if (isExistedUser) {
    // 이메일 중복여부 체크
    const error = new ApiError(400, "이미 사용중인 이메일 입니다.");
    throw error;
  }
  const userInfo = await userRepo.createUser(email, await encryptPassword(password), name);
  return userInfo;
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

    // redis 일일방문자 업데이트
    //20220213 과 같이 날짜로 bitmaps 키값 결정
    const key: string = await createKeyForTodayVisitor();
    await redisClient.setBit(key, isExistedUser.id, 1);

    return { access_token };
  } else {
    const error = new ApiError(401, "비밀번호가 틀렸습니다.");
    throw error;
  }
}

// redis bitmap 자료형 이용
async function readTodayVisitorService(): Promise<number> {
  const key: string = await createKeyForTodayVisitor();
  const numOfVisitor: number = await redisClient.bitCount(key);
  return numOfVisitor;
}

module.exports = { signup, signin, readTodayVisitorService };
