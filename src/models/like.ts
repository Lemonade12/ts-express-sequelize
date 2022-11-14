import { Sequelize, DataTypes } from "sequelize";

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    "like",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "like",
      charset: "utf8mb4",
    }
  );
};
