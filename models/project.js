'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project.hasMany(models.note)
      project.belongsToMany(models.user, {through: models.projectUser})
    }
  }
  project.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          message: "name can not be empty.",
        },
      },
    },
    description: DataTypes.TEXT,
    repository: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'project',
  });
  return project;
};