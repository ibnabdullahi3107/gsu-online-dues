"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DepartmentAdmin extends Model {
    static associate(models) {
      // Define associations
      DepartmentAdmin.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      DepartmentAdmin.belongsTo(models.Department, {
        foreignKey: "department_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  DepartmentAdmin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "DepartmentAdmin",
      tableName: "DepartmentAdmins",
      timestamps: true,
    }
  );

  return DepartmentAdmin;
};
