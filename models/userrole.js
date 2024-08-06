"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      UserRole.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserRole.belongsTo(models.Role, {
        foreignKey: "role_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  UserRole.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "UserRoles",
      timestamps: true,
    }
  );

  return UserRole;
};
