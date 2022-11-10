import { Sequelize, DataTypes } from "sequelize";

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    "user2",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email2: {
        type: DataTypes.STRING,
      },
      password2: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      tableName: "user2",
      charset: "utf8mb4",
    }
  );
};
