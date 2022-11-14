const db = require("../../database/index");
const user = db.user;
import sequelize from "sequelize";
//const Op = sequelize.Op;

async function readUserByEmail(email: string) {
  const data = await user.findOne({
    where: { email: email },
  });
  return data;
}

async function createUser(email: string, password: string, name: string) {
  return user.create({
    email: email,
    password: password,
    name: name,
  });
}

module.exports = {
  readUserByEmail,
  createUser,
};
