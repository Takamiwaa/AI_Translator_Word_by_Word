/**
 * Settings Page Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
  const providerSelect = document.getElementById('settings-provider-select');
  const modelSelect = document.getElementById('settings-model-select');
  const saveBtn = document.getElementById('btn-save-settings');

  if (!providerSelect) return; // Only runs on settings.html

  async function loadModels(provider) {
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    try {
      const res = await API.getModels(provider);
      const models = res.models || [];
      modelSelect.innerHTML = '';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name || m.id;
        modelSelect.appendChild(opt);
      });
    } catch (err) {
      modelSelect.innerHTML = '<option value="default-model">Default Model</option>';
    }
  }

  // Load current settings
  try {
    const res = await API.getSettings();
    if (res.settings) {
      providerSelect.value = res.settings.active_provider || 'gemini';
      await loadModels(providerSelect.value);
      if (res.settings.active_model) {
        modelSelect.value = res.settings.active_model;
      }
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }

  providerSelect.addEventListener('change', () => {
    loadModels(providerSelect.value);
  });

  saveBtn.addEventListener('click', async () => {
    try {
      await API.updateSettings({
        active_provider: providerSelect.value,
        active_model: modelSelect.value,
        theme: 'dark'
      });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  });
});
