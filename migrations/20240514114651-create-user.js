"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50], // Username must be between 3 and 50 characters
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Ensures the value is a valid email address
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [8, 100], // Password must be between 8 and 100 characters
          isStrongPassword(value) {
            // Custom validation for a strong password
            const strongPasswordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            if (!strongPasswordRegex.test(value)) {
              throw new Error(
                "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character."
              );
            }
          },
        },
      },
      "2faEnable": {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      "2faSecret": {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("Users");
  },
};
