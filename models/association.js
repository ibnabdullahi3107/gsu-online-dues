"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Association extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
    }
  }
  Association.init(
    {
      association_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 100],
        },
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 100],
        },
      },
      head_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      head_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      head_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      flutterwave_subaccount_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flutterwave_subaccount_account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flutterwave_subaccount_bank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Association",
      tableName: "Associations",
      timestamps: true, // for createdAt and updatedAt
    }
  );
  return Association;
};
