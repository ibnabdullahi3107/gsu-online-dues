"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        as: "roles",
        foreignKey: "permission_id",
      });
    }
  }

  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "Permissions",
      timestamps: true,
    }
  );

  return Permission;
};
