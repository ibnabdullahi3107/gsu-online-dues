"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns to Departments table
    await queryInterface.addColumn("Departments", "flutterwave_subaccount_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(
      "Departments",
      "flutterwave_subaccount_account_number",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      "Departments",
      "flutterwave_subaccount_bank",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    // Add head details columns to Departments table
    await queryInterface.addColumn("Departments", "head_first_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Departments", "head_last_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Departments", "head_phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Departments", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    });

    // Add columns to Associations table
    await queryInterface.addColumn(
      "Associations",
      "flutterwave_subaccount_id",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      "Associations",
      "flutterwave_subaccount_account_number",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      "Associations",
      "flutterwave_subaccount_bank",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    // Add head details columns to Associations table
    await queryInterface.addColumn("Associations", "head_first_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Associations", "head_last_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Associations", "head_phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Associations", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    // Remove columns from Departments table
    await queryInterface.removeColumn(
      "Departments",
      "flutterwave_subaccount_id"
    );
    await queryInterface.removeColumn(
      "Departments",
      "flutterwave_subaccount_account_number"
    );
    await queryInterface.removeColumn(
      "Departments",
      "flutterwave_subaccount_bank"
    );

    // Remove head details columns from Departments table
    await queryInterface.removeColumn("Departments", "head_first_name");
    await queryInterface.removeColumn("Departments", "head_last_name");
    await queryInterface.removeColumn("Departments", "head_phone");
    await queryInterface.removeColumn("Departments", "email");

    // Remove columns from Associations table
    await queryInterface.removeColumn(
      "Associations",
      "flutterwave_subaccount_id"
    );
    await queryInterface.removeColumn(
      "Associations",
      "flutterwave_subaccount_account_number"
    );
    await queryInterface.removeColumn(
      "Associations",
      "flutterwave_subaccount_bank"
    );

    // Remove head details columns from Associations table
    await queryInterface.removeColumn("Associations", "head_first_name");
    await queryInterface.removeColumn("Associations", "head_last_name");
    await queryInterface.removeColumn("Associations", "head_phone");
    await queryInterface.removeColumn("Associations", "email");
  },
};
