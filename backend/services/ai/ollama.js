const axios = require('axios');
const BaseProvider = require('./baseProvider');

class OllamaProvider extends BaseProvider {
  constructor(apiKey = '', options = {}) {
    super('ollama', 'Ollama (Local)', apiKey, options);
    this.baseUrl = options.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  async getModels() {
    try {
      const res = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      const models = res.data.models || [];
      return models.map(m => ({ id: m.name, name: m.name }));
    } catch (err) {
      return [
        { id: 'llama3', name: 'Llama 3' },
        { id: 'mistral', name: 'Mistral 7B' },
        { id: 'gemma', name: 'Gemma' }
      ];
    }
  }

  async testConnection(model = 'llama3') {
    try {
      const res = await axios.post(`${this.baseUrl}/api/generate`, {
        model,
        prompt: 'Respond OK.',
        stream: false
      }, { timeout: 10000 });
      if (res.data?.response) return { success: true, message: 'Connected to Ollama!' };
      throw new Error('No response from Ollama.');
    } catch (err) {
      throw new Error(`Failed to connect to Ollama at ${this.baseUrl}: ${err.message}`);
    }
  }

  async translate(text, sourceLang, targetLang, model = 'llama3') {
    const systemPrompt = this.getSystemPrompt(sourceLang, targetLang);
    const prompt = `${systemPrompt}\n\nInput Sentence: "${text}"`;

    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model,
        prompt,
        format: 'json',
        stream: false,
        options: { temperature: 0.2 }
      }, { timeout: 45000 });

      const resultText = response.data?.response;
      if (!resultText) throw new Error('Empty response from Ollama.');
      return this.parseJSONResponse(resultText);
    } catch (err) {
      if (err.code === 'ECONNABORTED') throw new Error('AI request timed out.');
      throw new Error(err.response?.data?.error || err.message);
    }
  }
}

module.exports = OllamaProvider;
