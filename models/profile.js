"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.user);
    }
  }
  profile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            message: "userId can not be empty.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            message: "invalid email address format",
          },
        },
      },
      position: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "profile",
    }
  );
  return profile;
};
