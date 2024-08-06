"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InvalidTokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Assumes you have a Users table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      expiration_time: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notEmpty: true,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("InvalidTokens");
  },
};
