const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSetting = sequelize.define('UserSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    unique: true
  },
  active_provider: {
    type: DataTypes.STRING(100),
    defaultValue: 'gemini'
  },
  active_model: {
    type: DataTypes.STRING(100),
    defaultValue: 'gemini-1.5-flash'
  },
  theme: {
    type: DataTypes.STRING(50),
    defaultValue: 'dark'
  }
}, {
  tableName: 'user_settings',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = UserSetting;
