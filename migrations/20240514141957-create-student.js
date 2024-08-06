"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reg_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state_origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      local_government_area: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Students");
  },
};
