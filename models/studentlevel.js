"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentLevel extends Model {
    static associate(models) {
      // Define associations here
      
    }
  }
  StudentLevel.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StudentLevel",
    }
  );
  return StudentLevel;
};
