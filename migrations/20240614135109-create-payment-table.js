"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      due_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Dues",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount_paid: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      receipt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Receipts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Transactions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("Payments");
  },
};
