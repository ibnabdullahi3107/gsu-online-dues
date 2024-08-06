"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssociationAdmin extends Model {
    static associate(models) {
      // Define associations
      AssociationAdmin.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      AssociationAdmin.belongsTo(models.Association, {
        foreignKey: "association_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  AssociationAdmin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      association_id: {
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
      modelName: "AssociationAdmin",
      tableName: "AssociationAdmins",
      timestamps: true,
    }
  );

  return AssociationAdmin;
};
