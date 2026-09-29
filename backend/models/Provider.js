const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  display_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  supports_dynamic_models: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  default_model: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'providers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Provider;
