"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Podcast extends Model {
    /*
     *
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "User",
      });
    }
  }
  Podcast.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      tumbnail: {
        type: DataTypes.STRING,
      },
      podcast: {
        type: DataTypes.STRING,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Podcast",
      tableName: "Podcast",
      paranoid: true,
    }
  );
  return Podcast;
};
