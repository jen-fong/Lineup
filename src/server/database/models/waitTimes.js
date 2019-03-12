/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('waitTimes', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parkId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'park',
        key: 'id'
      }
    },
    rideId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ride',
        key: 'id'
      }
    },
    wait: {
      type: DataTypes.INTEGER(5),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fastPassStart: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fastPassEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    temperature: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    conditions: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    humidity: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'waitTimes'
  });
};
