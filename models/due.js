"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Due extends Model {
    static associate(models) {
      // Due belongs to an Association
      Due.belongsTo(models.Association, {
        foreignKey: "reference_id",
        constraints: false,
        as: "association",
      });

      // Due belongs to a Department
      Due.belongsTo(models.Department, {
        foreignKey: "reference_id",
        constraints: false,
        as: "department",
      });

      // Define a method to fetch the related model dynamically
      Due.prototype.getReference = function (options) {
        if (!this.due_type) return Promise.resolve(null);
        const mixinMethodName = `get${this.due_type
          .charAt(0)
          .toUpperCase()}${this.due_type.slice(1)}`;
        return this[mixinMethodName](options);
      };
    }
  }

  Due.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      due_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      due_type: {
        type: DataTypes.ENUM("Department", "Association"),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Due",
      tableName: "Dues",
      timestamps: true,
    }
  );

  return Due;
};
