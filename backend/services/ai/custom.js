const axios = require('axios');
const BaseProvider = require('./baseProvider');

class CustomProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('custom', 'Custom OpenAI-compatible API', apiKey, options);
    this.baseUrl = options.baseUrl || 'http://localhost:8000/v1';
  }

  async getModels() {
    try {
      const res = await axios.get(`${this.baseUrl}/models`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        timeout: 5000
      });
      const data = res.data.data || [];
      return data.map(m => ({ id: m.id, name: m.id }));
    } catch (err) {
      return [{ id: 'custom-model', name: 'Custom Model' }];
    }
  }

  async testConnection(model = 'custom-model') {
    try {
      const res = await axios.post(`${this.baseUrl}/chat/completions`, {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        timeout: 10000
      });
      if (res.data?.choices?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from Custom Endpoint.');
    } catch (err) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'custom-model') {
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        timeout: 30000
      });

      const resultText = response.data?.choices?.[0]?.message?.content;
      if (!resultText) throw new Error('Empty response from Custom API.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = CustomProvider;
