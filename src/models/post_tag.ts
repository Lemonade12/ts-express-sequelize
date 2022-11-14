import { Sequelize, DataTypes } from "sequelize";

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    "post_tag",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "post_tag",
      charset: "utf8mb4",
    }
  );
};
