'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      note.belongsTo(models.project)
    }
  }
  note.init({
    imageType: DataTypes.STRING,
    imageName: DataTypes.STRING,
    imageData: DataTypes.BLOB('long'),
    text: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          message: "Text can not be empty.",
        },
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          message: "projectId can not be empty.",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'note',
  });
  return note;
};