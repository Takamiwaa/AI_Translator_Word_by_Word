const { DataTypes } = require('sequelize');
const { sequelize, initDatabase: rawInitDatabase } = require('../config/database');

let activeSeq = sequelize;

const User = activeSeq.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(255), allowNull: false, unique: true, defaultValue: 'default_user' }
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Provider = activeSeq.define('Provider', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  display_name: { type: DataTypes.STRING(100), allowNull: false },
  supports_dynamic_models: { type: DataTypes.BOOLEAN, defaultValue: true },
  default_model: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'providers', timestamps: true, createdAt: 'created_at', updatedAt: false });

const UserApiKey = activeSeq.define('UserApiKey', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  provider: { type: DataTypes.STRING(100), allowNull: false },
  api_key: { type: DataTypes.STRING(512), allowNull: false }
}, { tableName: 'user_api_keys', timestamps: true, createdAt: false, updatedAt: 'updated_at' });

const TranslationHistory = activeSeq.define('TranslationHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  source_language: { type: DataTypes.STRING(50), allowNull: false },
  target_language: { type: DataTypes.STRING(50), allowNull: false },
  source_text: { type: DataTypes.TEXT, allowNull: false },
  target_text: { type: DataTypes.TEXT, allowNull: false },
  alignment_json: { type: DataTypes.JSON, allowNull: false },
  grammar_json: { type: DataTypes.JSON, allowNull: true },
  provider: { type: DataTypes.STRING(100), allowNull: false },
  model: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'translation_history', timestamps: true, createdAt: 'created_at', updatedAt: false });

const UserSetting = activeSeq.define('UserSetting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, unique: true },
  active_provider: { type: DataTypes.STRING(100), defaultValue: 'gemini' },
  active_model: { type: DataTypes.STRING(100), defaultValue: 'gemini-1.5-flash' },
  theme: { type: DataTypes.STRING(50), defaultValue: 'dark' }
}, { tableName: 'user_settings', timestamps: true, createdAt: false, updatedAt: 'updated_at' });

// Associations
User.hasMany(UserApiKey, { foreignKey: 'user_id' });
UserApiKey.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(TranslationHistory, { foreignKey: 'user_id' });
TranslationHistory.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserSetting, { foreignKey: 'user_id' });
UserSetting.belongsTo(User, { foreignKey: 'user_id' });

async function initDatabase() {
  await rawInitDatabase();
  await activeSeq.sync({ alter: true });

  try {
    await User.findOrCreate({ where: { id: 1 }, defaults: { username: 'default_user' } });
    await UserSetting.findOrCreate({
      where: { user_id: 1 },
      defaults: { active_provider: 'gemini', active_model: 'gemini-1.5-flash', theme: 'dark' }
    });
  } catch (err) {
    // Ignore seed error
  }

  return activeSeq;
}

module.exports = {
  sequelize: activeSeq,
  initDatabase,
  User,
  Provider,
  UserApiKey,
  TranslationHistory,
  UserSetting
};
