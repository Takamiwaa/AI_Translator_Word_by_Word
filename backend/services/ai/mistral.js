const axios = require('axios');
const BaseProvider = require('./baseProvider');

class MistralProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('mistral', 'Mistral AI', apiKey, options);
  }

  async getModels() {
    if (!this.apiKey) {
      return [
        { id: 'mistral-small-latest', name: 'Mistral Small' },
        { id: 'mistral-medium-latest', name: 'Mistral Medium' },
        { id: 'mistral-large-latest', name: 'Mistral Large' }
      ];
    }
    try {
      const res = await axios.get('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      const data = res.data.data || [];
      return data.map(m => ({ id: m.id, name: m.id }));
    } catch (err) {
      return [
        { id: 'mistral-small-latest', name: 'Mistral Small' },
        { id: 'mistral-large-latest', name: 'Mistral Large' }
      ];
    }
  }

  async testConnection(model = 'mistral-small-latest') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      if (res.data?.choices?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from Mistral.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'mistral-small-latest') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
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
      if (!resultText) throw new Error('Empty response from Mistral.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = MistralProvider;
