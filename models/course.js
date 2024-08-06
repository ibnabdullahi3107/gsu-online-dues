"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Define association here
      Course.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Course.init(
    {
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
        },
      },
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "Courses",
      timestamps: true, // for createdAt and updatedAt
    }
  );

  return Course;
};
