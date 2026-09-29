const { listSupportedProviders, getProviderInstance } = require('../services/ai/providerRegistry');
const { UserApiKey } = require('../models');

exports.getProviders = async (req, res, next) => {
  try {
    const providers = listSupportedProviders();
    return res.json({ success: true, providers });
  } catch (err) {
    next(err);
  }
};

exports.getProviderModels = async (req, res, next) => {
  try {
    const { provider } = req.params;
    let apiKey = req.query.api_key || '';

    if (!apiKey) {
      const stored = await UserApiKey.findOne({ where: { user_id: 1, provider } });
      if (stored) apiKey = stored.api_key;
    }

    const instance = getProviderInstance(provider, apiKey);
    const models = await instance.getModels();
    return res.json({ success: true, provider, models });
  } catch (err) {
    next(err);
  }
};

exports.testProviderConnection = async (req, res, next) => {
  try {
    const { provider, model, api_key } = req.body;
    if (!provider) {
      return res.status(400).json({ success: false, error: 'Provider is required.' });
    }

    let keyToUse = api_key;
    if (!keyToUse) {
      const stored = await UserApiKey.findOne({ where: { user_id: 1, provider } });
      if (stored) keyToUse = stored.api_key;
    }

    const instance = getProviderInstance(provider, keyToUse);
    const result = await instance.testConnection(model);

    // Save or update key in database if test succeeded and key was explicitly passed
    if (api_key) {
      await UserApiKey.upsert({
        user_id: 1,
        provider,
        api_key
      });
    }

    return res.json({ success: true, message: result.message || 'Connection successful!' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message || 'Connection failed.' });
  }
};
