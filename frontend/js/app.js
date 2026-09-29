/**
 * Application Entry Point & Event Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const sourceLangSelect = document.getElementById('source-lang-select');
  const targetLangSelect = document.getElementById('target-lang-select');
  const btnSwapLang = document.getElementById('btn-swap-lang');
  const inputText = document.getElementById('input-text');
  const btnTranslate = document.getElementById('btn-translate');
  const activeProviderName = document.getElementById('active-provider-name');

  // API Modal Elements
  const btnApiModal = document.getElementById('btn-api-modal');
  const btnCloseApiModal = document.getElementById('btn-close-api-modal');
  const btnCloseWordModal = document.getElementById('btn-close-word-modal');
  const apiProviderSelect = document.getElementById('api-provider-select');
  const apiModelSelect = document.getElementById('api-model-select');
  const apiKeyInput = document.getElementById('api-key-input');
  const btnTestApi = document.getElementById('btn-test-api');
  const btnSaveApi = document.getElementById('btn-save-api');
  const apiStatusMsg = document.getElementById('api-status-msg');

  let activeProvider = 'gemini';
  let activeModel = 'gemini-1.5-flash';

  // 1. Swap Languages
  if (btnSwapLang) {
    btnSwapLang.addEventListener('click', () => {
      const temp = sourceLangSelect.value;
      sourceLangSelect.value = targetLangSelect.value;
      targetLangSelect.value = temp;
    });
  }

  // 2. Fetch Active Settings on Boot
  async function initSettings() {
    try {
      const res = await API.getSettings();
      if (res.settings) {
        activeProvider = res.settings.active_provider || 'gemini';
        activeModel = res.settings.active_model || 'gemini-1.5-flash';
        updateBadge();
      }
    } catch (err) {
      console.warn('Using default settings on boot:', err.message);
    }
  }

  function updateBadge() {
    if (activeProviderName) {
      activeProviderName.textContent = `Provider: ${activeProvider.toUpperCase()} (${activeModel})`;
    }
  }

  // 3. Dynamic Model Discovery in Modal
  async function populateModalModels(provider, apiKey = '') {
    if (!apiModelSelect) return;
    apiModelSelect.innerHTML = '<option value="">Loading models...</option>';
    try {
      const res = await API.getModels(provider, apiKey);
      const models = res.models || [];
      apiModelSelect.innerHTML = '';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name || m.id;
        apiModelSelect.appendChild(opt);
      });
      if (models.length > 0) {
        apiModelSelect.value = models[0].id;
      }
    } catch (err) {
      apiModelSelect.innerHTML = '<option value="default">Default Model</option>';
    }
  }

  // 4. Modal Event Listeners
  if (btnApiModal) {
    btnApiModal.addEventListener('click', async () => {
      apiProviderSelect.value = activeProvider;
      await populateModalModels(activeProvider);
      apiModelSelect.value = activeModel;
      apiStatusMsg.style.display = 'none';
      UI.openModal('api-modal');
    });
  }

  if (btnCloseApiModal) {
    btnCloseApiModal.addEventListener('click', () => UI.closeModal('api-modal'));
  }

  if (btnCloseWordModal) {
    btnCloseWordModal.addEventListener('click', () => UI.closeModal('word-detail-modal'));
  }

  if (apiProviderSelect) {
    apiProviderSelect.addEventListener('change', () => {
      populateModalModels(apiProviderSelect.value, apiKeyInput.value);
    });
  }

  // Test Connection
  if (btnTestApi) {
    btnTestApi.addEventListener('click', async () => {
      apiStatusMsg.style.display = 'block';
      apiStatusMsg.style.color = 'var(--text-secondary)';
      apiStatusMsg.textContent = 'Testing connection...';

      try {
        const res = await API.testConnection({
          provider: apiProviderSelect.value,
          model: apiModelSelect.value,
          api_key: apiKeyInput.value
        });
        apiStatusMsg.style.color = '#00FF66';
        apiStatusMsg.textContent = res.message || 'Connection successful!';
      } catch (err) {
        apiStatusMsg.style.color = '#FF4444';
        apiStatusMsg.textContent = err.message || 'Connection failed.';
      }
    });
  }

  // Save Settings from Modal
  if (btnSaveApi) {
    btnSaveApi.addEventListener('click', async () => {
      try {
        activeProvider = apiProviderSelect.value;
        activeModel = apiModelSelect.value;

        await API.updateSettings({
          active_provider: activeProvider,
          active_model: activeModel,
          api_key: apiKeyInput.value
        });

        updateBadge();
        UI.closeModal('api-modal');
      } catch (err) {
        alert('Failed to save settings: ' + err.message);
      }
    });
  }

  // 5. Execute Translation
  if (btnTranslate) {
    btnTranslate.addEventListener('click', async () => {
      const text = inputText.value.trim();
      if (!text) {
        alert('Masukkan kalimat terlebih dahulu.');
        inputText.focus();
        return;
      }

      UI.startLoadingAnimation();

      try {
        const res = await API.translate({
          text,
          source_language: sourceLangSelect.value,
          target_language: targetLangSelect.value,
          provider: activeProvider,
          model: activeModel
        });

        UI.stopLoadingAnimation();

        if (res.data) {
          TranslatorView.renderAlignment(res.data);
        } else {
          alert('Invalid translation response.');
        }
      } catch (err) {
        UI.stopLoadingAnimation();
        alert(`Translation Error: ${err.message}`);
      }
    });
  }

  // Boot initialization
  await initSettings();
});
