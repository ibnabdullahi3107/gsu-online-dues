"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class InvalidToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvalidToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  InvalidToken.init(
    {
      token: {
        type: DataTypes.TEXT,
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
      expiration_time: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: "InvalidToken",
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

  return InvalidToken;
};
