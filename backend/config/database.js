const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'ai_word_translator';

const isVercel = Boolean(process.env.VERCEL);
const dbDir = isVercel ? '/tmp' : path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Create fallback connection instance (uses /tmp on Vercel for writable filesystem)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbDir, 'app.sqlite'),
  logging: false
});

let isInitialized = false;

async function initDatabase() {
  if (isInitialized) return sequelize;

  try {
    if (process.env.DB_HOST && !isVercel) {
      const mysqlTest = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
        logging: false,
        dialectOptions: { connectTimeout: 1000 }
      });
      await mysqlTest.authenticate();
      console.log(`✅ Connected to MySQL database (${dbName}@${dbHost}:${dbPort})`);
    }
  } catch (error) {
    console.warn(`⚠️ MySQL server unavailable (${error.message}). Running with SQLite storage.`);
  }

  await sequelize.authenticate();
  isInitialized = true;
  return sequelize;
}

module.exports = {
  sequelize,
  initDatabase
};
