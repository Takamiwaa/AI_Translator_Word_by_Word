const GeminiProvider = require('./gemini');
const OpenAIProvider = require('./openai');
const ClaudeProvider = require('./claude');
const DeepSeekProvider = require('./deepseek');
const MistralProvider = require('./mistral');
const GroqProvider = require('./groq');
const OpenRouterProvider = require('./openrouter');
const OllamaProvider = require('./ollama');
const CustomProvider = require('./custom');

const PROVIDERS = {
  gemini: { displayName: 'Google Gemini', class: GeminiProvider, envKey: 'GEMINI_API_KEY', defaultModel: 'gemini-1.5-flash' },
  openai: { displayName: 'OpenAI / ChatGPT', class: OpenAIProvider, envKey: 'OPENAI_API_KEY', defaultModel: 'gpt-4o-mini' },
  claude: { displayName: 'Anthropic Claude', class: ClaudeProvider, envKey: 'ANTHROPIC_API_KEY', defaultModel: 'claude-3-5-sonnet-20241022' },
  deepseek: { displayName: 'DeepSeek AI', class: DeepSeekProvider, envKey: 'DEEPSEEK_API_KEY', defaultModel: 'deepseek-chat' },
  mistral: { displayName: 'Mistral AI', class: MistralProvider, envKey: 'MISTRAL_API_KEY', defaultModel: 'mistral-small-latest' },
  groq: { displayName: 'Groq LPU', class: GroqProvider, envKey: 'GROQ_API_KEY', defaultModel: 'llama-3.3-70b-versatile' },
  openrouter: { displayName: 'OpenRouter', class: OpenRouterProvider, envKey: 'OPENROUTER_API_KEY', defaultModel: 'meta-llama/llama-3.3-70b-instruct' },
  cohere: { displayName: 'Cohere', class: OpenAIProvider, envKey: 'COHERE_API_KEY', defaultModel: 'command-r-plus' },
  xai: { displayName: 'xAI (Grok)', class: OpenAIProvider, envKey: 'XAI_API_KEY', defaultModel: 'grok-2-latest' },
  together: { displayName: 'Together AI', class: OpenAIProvider, envKey: 'TOGETHER_API_KEY', defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' },
  ollama: { displayName: 'Ollama (Local)', class: OllamaProvider, envKey: '', defaultModel: 'llama3' },
  lmstudio: { displayName: 'LM Studio (Local)', class: CustomProvider, envKey: '', defaultModel: 'local-model' },
  custom: { displayName: 'Custom OpenAI API', class: CustomProvider, envKey: '', defaultModel: 'custom-model' }
};

function getProviderInstance(providerName, apiKey = '', options = {}) {
  const meta = PROVIDERS[providerName.toLowerCase()];
  if (!meta) {
    throw new Error(`Provider "${providerName}" is not supported.`);
  }

  // Use provided key, fallback to env key
  const finalApiKey = apiKey || (meta.envKey ? process.env[meta.envKey] : '');
  return new meta.class(finalApiKey, options);
}

function listSupportedProviders() {
  return Object.keys(PROVIDERS).map(key => ({
    name: key,
    display_name: PROVIDERS[key].displayName,
    default_model: PROVIDERS[key].defaultModel
  }));
}

module.exports = {
  PROVIDERS,
  getProviderInstance,
  listSupportedProviders
};
