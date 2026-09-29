const axios = require('axios');
const BaseProvider = require('./baseProvider');

class ClaudeProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('claude', 'Anthropic Claude', apiKey, options);
  }

  async getModels() {
    return [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
    ];
  }

  async testConnection(model = 'claude-3-5-haiku-20241022') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://api.anthropic.com/v1/messages', {
        model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Respond OK.' }]
      }, {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 10000
      });
      if (res.data?.content?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from Claude.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'claude-3-5-sonnet-20241022') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      }, {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 25000
      });

      const resultText = response.data?.content?.[0]?.text;
      if (!resultText) throw new Error('Empty response from Claude.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = ClaudeProvider;
