'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Seat.init({
    seat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    row_number: DataTypes.INTEGER,
    is_reserved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};