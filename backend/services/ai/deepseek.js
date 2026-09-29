const axios = require('axios');
const BaseProvider = require('./baseProvider');

class DeepSeekProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('deepseek', 'DeepSeek AI', apiKey, options);
  }

  async getModels() {
    return [
      { id: 'deepseek-chat', name: 'DeepSeek-V3 (Chat)' },
      { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (Reasoner)' }
    ];
  }

  async testConnection(model = 'deepseek-chat') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://api.deepseek.com/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      if (res.data?.choices?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from DeepSeek.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'deepseek-chat') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 25000
      });

      const resultText = response.data?.choices?.[0]?.message?.content;
      if (!resultText) throw new Error('Empty response from DeepSeek.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = DeepSeekProvider;
