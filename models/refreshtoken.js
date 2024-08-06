"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      // Define associations
      RefreshToken.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  RefreshToken.init(
    {
      // Define model attributes
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      // Define model options
      indexes: [
        // Index for faster lookup by token
        {
          unique: true,
          fields: ["token"],
        },
      ],
      validate: {
        // Custom validation for token format or other constraints if needed
      },
    }
  );

  return RefreshToken;
};
