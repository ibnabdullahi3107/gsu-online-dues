"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    static associate(models) {
      // define association here
       Faculty.hasMany(models.Department, {
         foreignKey: "faculty_id",
         as: "departments",
       });
        Faculty.hasMany(models.Student, {
          foreignKey: "faculty_id",
          as: "students",
        });
    }
  }
  Faculty.init(
    {
      faculty_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50], // Permission name must be between 3 and 50 characters
        },
      },
    },
    {
      sequelize,
      modelName: "Faculty",
      timestamps: true,
    }
  );
  return Faculty;
};
