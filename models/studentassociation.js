"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentAssociation extends Model {
    static associate(models) {
      // Define association with the Student model
      StudentAssociation.belongsTo(models.Student, {
        foreignKey: "student_id",
        onDelete: "CASCADE", // Cascade delete when a student is deleted
        onUpdate: "CASCADE", // Cascade update when a student is updated
      });

      // Define association with the Association model
      StudentAssociation.belongsTo(models.Association, {
        foreignKey: "association_id",
        onDelete: "CASCADE", // Cascade delete when an association is deleted
        onUpdate: "CASCADE", // Cascade update when an association is updated
      });
    }
  }

  StudentAssociation.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      association_id: {
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
      modelName: "StudentAssociation",
    }
  );

  return StudentAssociation;
};
