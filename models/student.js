"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Student belongs to a User
      Student.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      // Student belongs to a Faculty
      Student.belongsTo(models.Faculty, {
        foreignKey: "faculty_id",
        as: "faculty",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      // Student belongs to a Department
      Student.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Student.init(
    {
      reg_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDate: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      state_origin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      local_government_area: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
        references: {
          model: "Faculties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
        references: {
          model: "Departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Student",
      tableName: "Students",
    }
  );

  return Student;
};
