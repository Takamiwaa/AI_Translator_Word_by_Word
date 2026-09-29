const axios = require('axios');
const BaseProvider = require('./baseProvider');

class GeminiProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('gemini', 'Google Gemini', apiKey, options);
  }

  async getModels() {
    if (!this.apiKey) {
      return [
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' }
      ];
    }
    try {
      const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`, {
        timeout: 10000
      });
      const models = res.data.models || [];
      return models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => ({
          id: m.name.replace('models/', ''),
          name: m.displayName || m.name.replace('models/', '')
        }));
    } catch (err) {
      return [
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
      ];
    }
  }

  async testConnection(model = 'gemini-1.5-flash') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const res = await axios.post(url, {
        contents: [{ parts: [{ text: 'Respond with OK.' }] }]
      }, { timeout: 10000 });
      if (res.data && res.data.candidates) {
        return { success: true, message: 'Connection successful!' };
      }
      throw new Error('Invalid response from Gemini API.');
    } catch (err) {
      if (err.response && err.response.status === 400) throw new Error('Invalid API key.');
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'gemini-1.5-flash') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    try {
      const response = await axios.post(url, {
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      }, { timeout: 25000 });

      const candidate = response.data?.candidates?.[0];
      const resultText = candidate?.content?.parts?.[0]?.text;

      if (!resultText) {
        throw new Error('Empty response received from Gemini.');
      }

      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 400 || err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = GeminiProvider;
