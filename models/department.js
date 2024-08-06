"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      // Define association here
      Department.belongsTo(models.Faculty, {
        foreignKey: "faculty_id",
        as: "faculty",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Department.hasMany(models.Course, {
        foreignKey: "department_id",
        as: "courses",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Department.hasMany(models.Student, {
        foreignKey: "department_id",
        as: "students",
      });
    }
  }

  Department.init(
    {
      faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Faculties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      department_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 100],
        },
      },
      head_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      head_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      head_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      flutterwave_subaccount_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flutterwave_subaccount_account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flutterwave_subaccount_bank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "Departments",
      timestamps: true, // for createdAt and updatedAt
      hooks: {
        beforeCreate: (department, options) => {
          department.department_name = department.department_name.toUpperCase();
        },
        beforeUpdate: (department, options) => {
          department.department_name = department.department_name.toUpperCase();
        },
      },
    }
  );

  return Department;
};
