const axios = require('axios');
const BaseProvider = require('./baseProvider');

class OpenAIProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('openai', 'OpenAI (ChatGPT)', apiKey, options);
  }

  async getModels() {
    if (!this.apiKey) {
      return [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
      ];
    }
    try {
      const res = await axios.get('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      const data = res.data.data || [];
      return data
        .filter(m => m.id.startsWith('gpt-'))
        .map(m => ({ id: m.id, name: m.id }))
        .sort((a, b) => a.id.localeCompare(b.id));
    } catch (err) {
      return [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4o', name: 'GPT-4o' }
      ];
    }
  }

  async testConnection(model = 'gpt-4o-mini') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      if (res.data?.choices?.length) {
        return { success: true, message: 'Connection successful!' };
      }
      throw new Error('Invalid response from OpenAI API.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'gpt-4o-mini') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
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
      if (!resultText) throw new Error('Empty response from OpenAI.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = OpenAIProvider;
