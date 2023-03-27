import ApiError from "../src/modules/api.error";
const { signup } = require("../src/services/userService");

jest.mock("../src/repository/userRepository");
const userRepo = require("../src/repository/userRepository");

describe("signup", () => {
  const email = "test2@naver.com";
  const password = "12344@";
  const name = "test2";

  test("존재하는 유저이면", async () => {
    try {
      userRepo.readUserByEmail.mockReturnValue(true);
      await signup(email, password, name);
    } catch (error) {
      const err = error as ApiError;
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe("이미 사용중인 이메일 입니다.");
    }
  });

  test("존재하지 않는 유저이면", async () => {
    userRepo.readUserByEmail.mockReturnValue(null);
    userRepo.createUser.mockReturnValue(
      Promise.resolve({
        email: email,
        name: name,
      })
    );
    const userInfo = await signup(email, password, name);
    expect(userInfo.email).toBe(email);
  });
});
