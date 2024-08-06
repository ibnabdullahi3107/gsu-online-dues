"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        as: "users",
        foreignKey: "role_id",
      });
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        as: "permissions",
        foreignKey: "role_id",
      });
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
      timestamps: true,
    }
  );

  return Role;
};
