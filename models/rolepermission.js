"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "roles",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permissions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  RolePermission.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      permission_id: {
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
      modelName: "RolePermission",
      tableName: "RolePermissions",
      timestamps: true,
    }
  );

  return RolePermission;
};
