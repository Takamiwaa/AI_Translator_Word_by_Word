const axios = require('axios');
const BaseProvider = require('./baseProvider');

class OpenRouterProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('openrouter', 'OpenRouter', apiKey, options);
  }

  async getModels() {
    if (!this.apiKey) {
      return [
        { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta Llama 3.3 70B' },
        { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1' }
      ];
    }
    try {
      const res = await axios.get('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      const data = res.data.data || [];
      return data.slice(0, 30).map(m => ({ id: m.id, name: m.name || m.id }));
    } catch (err) {
      return [
        { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta Llama 3.3 70B' },
        { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' }
      ];
    }
  }

  async testConnection(model = 'meta-llama/llama-3.3-70b-instruct') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      if (res.data?.choices?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from OpenRouter.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'meta-llama/llama-3.3-70b-instruct') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
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
      if (!resultText) throw new Error('Empty response from OpenRouter.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = OpenRouterProvider;
