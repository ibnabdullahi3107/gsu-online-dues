"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Transaction belongs to a Student
      Transaction.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Transaction.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "paid", "failed"]],
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "Transactions",
      timestamps: true,
    }
  );

  return Transaction;
};
