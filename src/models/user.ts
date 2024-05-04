import { Sequelize, DataTypes } from "sequelize";

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      auth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      refresh: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      tableName: "user",
      charset: "utf8mb4",
    }
  );
};
