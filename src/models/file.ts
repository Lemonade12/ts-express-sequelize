import { Sequelize, DataTypes } from "sequelize";

module.exports = function (sequelize: Sequelize) {
  return sequelize.define(
    "file",
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      origin_file_nm: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "원본파일명",
      },
      save_file_nm: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "저장파일명",
      },
      file_extension: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: "파일 확장자",
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "file",
      charset: "utf8mb4",
    }
  );
};
