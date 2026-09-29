const { translateText } = require('../services/translatorService');
const { TranslationHistory, UserSetting } = require('../models');

exports.handleTranslate = async (req, res, next) => {
  try {
    const { text, source_language, target_language, provider, model, api_key } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text input cannot be empty.' });
    }

    let activeProvider = provider;
    let activeModel = model;

    // Fetch defaults from user_settings if not provided
    if (!activeProvider || !activeModel) {
      const setting = await UserSetting.findOne({ where: { user_id: 1 } });
      if (setting) {
        if (!activeProvider) activeProvider = setting.active_provider;
        if (!activeModel) activeModel = setting.active_model;
      }
    }

    activeProvider = activeProvider || 'gemini';
    activeModel = activeModel || 'gemini-1.5-flash';

    const sourceLang = source_language || 'Indonesian';
    const targetLang = target_language || 'English';

    const translationResult = await translateText({
      text,
      sourceLang,
      targetLang,
      providerName: activeProvider,
      modelName: activeModel,
      userApiKey: api_key
    });

    // Save history record to database
    let savedRecord = null;
    try {
      savedRecord = await TranslationHistory.create({
        user_id: 1,
        source_language: sourceLang,
        target_language: targetLang,
        source_text: text,
        target_text: translationResult.natural_translation || translationResult.target_sentence || '',
        alignment_json: translationResult.alignment || [],
        grammar_json: translationResult.grammar || {},
        provider: activeProvider,
        model: activeModel
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not save history to DB:', dbErr.message);
    }

    return res.json({
      success: true,
      history_id: savedRecord ? savedRecord.id : null,
      provider: activeProvider,
      model: activeModel,
      data: translationResult
    });
  } catch (err) {
    next(err);
  }
};
