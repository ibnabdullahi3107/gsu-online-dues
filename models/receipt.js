"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    static associate(models) {
      // Define associations here, e.g.:
      Receipt.belongsTo(models.Student, {
        foreignKey: "student_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });    }
  }
  Receipt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      receipt_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Student",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Receipt",
      tableName: "Receipts",
    }
  );
  return Receipt;
};
