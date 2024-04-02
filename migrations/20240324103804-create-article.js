"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Article",
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal("uuid_generate_v4()"),
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        cover_img: {
          type: Sequelize.STRING,
        },
        is_published: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        categeory: {
          defaultValue: "general",
          type: Sequelize.STRING,
        },
        tags: {
          type: Sequelize.ARRAY(Sequelize.STRING),
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: "User",
            key: "id",
          },
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
    await queryInterface.dropTable("Article");
  },
};
