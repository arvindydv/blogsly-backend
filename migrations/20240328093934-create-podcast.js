"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Podcast", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      tumbnail: {
        type: Sequelize.STRING,
      },
      podcast: {
        type: Sequelize.STRING,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "User",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Podcast");
  },
};
