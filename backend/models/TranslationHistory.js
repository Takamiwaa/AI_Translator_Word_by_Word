const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TranslationHistory = sequelize.define('TranslationHistory', {
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
  source_language: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  target_language: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  source_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  target_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  alignment_json: {
    type: DataTypes.JSON,
    allowNull: false
  },
  grammar_json: {
    type: DataTypes.JSON,
    allowNull: true
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'translation_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id', 'created_at']
    },
    {
      fields: ['source_language', 'target_language']
    }
  ]
});

module.exports = TranslationHistory;
