"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association to User model
      Staff.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Staff.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      psn_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state_origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      local_government_area: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Staff",
      timestamps: true, // Ensure timestamps are enabled if you want createdAt and updatedAt
    }
  );
  return Staff;
};
