const axios = require('axios');
const BaseProvider = require('./baseProvider');

class GroqProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('groq', 'Groq LPU', apiKey, options);
  }

  async getModels() {
    if (!this.apiKey) {
      return [
        { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
        { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b' }
      ];
    }
    try {
      const res = await axios.get('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      const data = res.data.data || [];
      return data.map(m => ({ id: m.id, name: m.id }));
    } catch (err) {
      return [
        { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
        { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' }
      ];
    }
  }

  async testConnection(model = 'llama-3.3-70b-versatile') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    try {
      const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Respond OK.' }],
        max_tokens: 5
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000
      });
      if (res.data?.choices?.length) return { success: true, message: 'Connection successful!' };
      throw new Error('Invalid response from Groq.');
    } catch (err) {
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message || 'Connection failed.');
    }
  }

  async translate(text, sourceLang, targetLang, model = 'llama-3.3-70b-versatile') {
    if (!this.apiKey) throw new Error('Invalid API key.');
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const userPrompt = `Input Sentence: "${text}"`;

    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
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
      if (!resultText) throw new Error('Empty response from Groq.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      if (err.response?.status === 429) throw new Error('Rate limit reached. Please try again later.');
      if (err.response?.status === 401) throw new Error('Invalid API key.');
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = GroqProvider;
