const { UserSetting, UserApiKey } = require('../models');

exports.getSettings = async (req, res, next) => {
  try {
    let [setting] = await UserSetting.findOrCreate({
      where: { user_id: 1 },
      defaults: {
        active_provider: process.env.DEFAULT_PROVIDER || 'gemini',
        active_model: process.env.DEFAULT_MODEL || 'gemini-1.5-flash',
        theme: 'dark'
      }
    });

    const userKeys = await UserApiKey.findAll({ where: { user_id: 1 } });
    const keysMap = {};
    userKeys.forEach(k => {
      // Mask key for security
      const raw = k.api_key;
      const masked = raw.length > 8 ? `${raw.slice(0, 4)}...${raw.slice(-4)}` : '••••••••';
      keysMap[k.provider] = { masked, configured: true };
    });

    return res.json({
      success: true,
      settings: {
        active_provider: setting.active_provider,
        active_model: setting.active_model,
        theme: setting.theme,
        keys: keysMap
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { active_provider, active_model, theme, api_key } = req.body;

    let setting = await UserSetting.findOne({ where: { user_id: 1 } });
    if (!setting) {
      setting = await UserSetting.create({ user_id: 1 });
    }

    if (active_provider) setting.active_provider = active_provider;
    if (active_model) setting.active_model = active_model;
    if (theme) setting.theme = theme;

    await setting.save();

    // If an API key was included in the settings save request
    if (api_key && active_provider) {
      await UserApiKey.upsert({
        user_id: 1,
        provider: active_provider,
        api_key
      });
    }

    return res.json({
      success: true,
      message: 'Settings updated successfully.',
      settings: setting
    });
  } catch (err) {
    next(err);
  }
};
