/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ride', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    libId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    parkId: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
    tableName: 'ride'
  });
};
