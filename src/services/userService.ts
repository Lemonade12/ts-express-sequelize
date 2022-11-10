import bcrypt from "bcrypt";

const userRepo = require("../repository/userRepository");

class apiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message?: string) {
    super(message); // 반드시 호출해야함
    this.name = `HTTPError`;
    this.statusCode = statusCode;
  }
}

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(password, salt);
  return result;
}

async function signup(email: string, password: string) {
  const isExistedUser = await userRepo.readUserByEmail(email);
  if (isExistedUser) {
    // 이메일 중복여부 체크
    const error = new apiError(400, "이미 사용중인 이메일 입니다.");
    throw error;
  }
  userRepo.createUser(email, await encryptPassword(password));
}

module.exports = { signup };
