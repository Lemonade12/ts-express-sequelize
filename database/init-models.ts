import { Sequelize, DataTypes } from "sequelize";
var userModel = require("../src/models/user");
var user2Model = require("../src/models/user2");

function initModels(sequelize: Sequelize) {
  var user = userModel(sequelize);
  var user2 = user2Model(sequelize);

  return {
    user,
    user2,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
