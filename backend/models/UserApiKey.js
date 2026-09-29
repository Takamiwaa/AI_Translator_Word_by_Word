const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserApiKey = sequelize.define('UserApiKey', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  api_key: {
    type: DataTypes.STRING(512),
    allowNull: false
  }
}, {
  tableName: 'user_api_keys',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'provider']
    }
  ]
});

module.exports = UserApiKey;
