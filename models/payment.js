// models/Payment.js

"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Define associations here
      Payment.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Payment.belongsTo(models.Due, {
        foreignKey: "due_id",
        as: "due",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Payment.belongsTo(models.Session, {
        foreignKey: "session_id",
        as: "session",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Payment.belongsTo(models.Receipt, {
        foreignKey: "receipt_id",
        as: "receipt",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Payment.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Payment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      due_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      amount_paid: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
        },
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
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true, 
    }
  );

  return Payment;
};
