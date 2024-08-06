"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define potential associations here
      // For example: Level.hasMany(models.Course, { foreignKey: 'level_id', as: 'courses' });
    }
  }

  Level.init(
    {
      level_name: {
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
      modelName: "Level",
      tableName: "Levels",
      timestamps: true, // for createdAt and updatedAt
    }
  );

  return Level;
};
