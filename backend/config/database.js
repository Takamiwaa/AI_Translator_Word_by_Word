const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'ai_word_translator';

const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Create fallback SQLite connection instance directly so models bind cleanly
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbDir, 'app.sqlite'),
  logging: false
});

async function initDatabase() {
  try {
    // Attempt MySQL test if mysql password or host configured
    const mysqlTest = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      dialectOptions: { connectTimeout: 1000 }
    });
    await mysqlTest.authenticate();
    console.log(`✅ Connected to MySQL database (${dbName}@${dbHost}:${dbPort})`);
  } catch (error) {
    console.warn(`⚠️ MySQL server unavailable (${error.message}). Running with SQLite storage.`);
  }

  await sequelize.authenticate();
  console.log('✅ SQLite storage initialized successfully.');
  return sequelize;
}

module.exports = {
  sequelize,
  initDatabase
};
