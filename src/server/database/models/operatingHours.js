/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('operatingHours', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parkOpen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    parkClose: {
      type: DataTypes.DATE,
      allowNull: true
    },
    specialHours: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    specialHoursOpen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    specialHoursClose: {
      type: DataTypes.DATE,
      allowNull: true
    },
    theDate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    parkId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'park',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'operatingHours'
  });
};
