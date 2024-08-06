"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // You can define associations with other models here if needed
    }
  }

  Session.init(
    {
      session_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "Sessions",
      modelName: "Session",
      timestamps: true, // Include automatic timestamps
    }
  );

  return Session;
};
