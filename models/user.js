"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        as: "roles",
        foreignKey: "user_id",
      });
      User.hasOne(models.Student, {
        foreignKey: "user_id",
        as: "student",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100],
          isStrongPassword(value) {
            const strongPasswordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
            if (!strongPasswordRegex.test(value)) {
              throw new Error(
                "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character."
              );
            }
          },
        },
      },
      "2faEnable": {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      "2faSecret": {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
