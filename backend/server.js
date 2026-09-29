const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDatabase } = require('./models');
const translateRoutes = require('./routes/translate');
const providersRoutes = require('./routes/providers');
const historyRoutes = require('./routes/history');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts/styles and Google Fonts
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Rate limit reached. Please try again later.' }
});

app.use('/api/', apiLimiter);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize DB middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/translate', translateRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/settings', settingsRoutes);

// SPA Fallback for clean routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  
  let safeMessage = err.message || 'An internal server error occurred.';
  if (safeMessage.toLowerCase().includes('api_key') || safeMessage.toLowerCase().includes('bearer')) {
    safeMessage = 'Authentication error with AI provider.';
  }

  res.status(err.status || 500).json({
    success: false,
    error: safeMessage
  });
});

// Start Server locally if not running on Vercel
if (require.main === module) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 AI Word Translator server running on port ${PORT}`);
      console.log(`🌐 Local URL: http://localhost:${PORT}`);
      console.log(`==================================================`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
  });
}

module.exports = app;
