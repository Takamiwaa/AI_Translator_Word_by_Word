/**
 * API Wrapper for Express backend
 */
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'API request failed.');
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  translate(payload) {
    return this.request('/translate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getProviders() {
    return this.request('/providers');
  },

  getModels(provider, apiKey = '') {
    const query = apiKey ? `?api_key=${encodeURIComponent(apiKey)}` : '';
    return this.request(`/providers/${provider}/models${query}`);
  },

  testConnection(payload) {
    return this.request('/providers/test', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getHistory(search = '', page = 1) {
    return this.request(`/history?search=${encodeURIComponent(search)}&page=${page}`);
  },

  getHistoryItem(id) {
    return this.request(`/history/${id}`);
  },

  deleteHistoryItem(id) {
    return this.request(`/history/${id}`, { method: 'DELETE' });
  },

  getSettings() {
    return this.request('/settings');
  },

  updateSettings(payload) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }
};

window.API = API;
