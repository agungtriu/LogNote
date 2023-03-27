'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projectUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      projectUser.belongsTo(models.project)
      projectUser.belongsTo(models.user)
    }
  }
  projectUser.init({
    projectId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          message: "projectId can not be empty.",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          message: "userId can not be empty.",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'projectUser',
  });
  return projectUser;
};