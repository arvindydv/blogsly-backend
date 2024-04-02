"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "User",
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal("uuid_generate_v4()"),
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },

        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        about: {
          type: Sequelize.STRING,
        },
        coverImg: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        avatar: {
          type: Sequelize.STRING,
        },
        otp: {
          type: Sequelize.INTEGER,
        },
        refresh_token: {
          type: Sequelize.STRING,
        },

        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      { underscored: true }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User");
  },
};
