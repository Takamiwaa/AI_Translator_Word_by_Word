/**
 * UI Utilities & Modal Controllers
 */
const UI = {
  // Modal Handlers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // Show floating word detail modal with full linguistic breakdown
  showWordDetail(wordDetail) {
    if (!wordDetail) return;

    document.getElementById('modal-word-title').textContent = wordDetail.word || '-';
    document.getElementById('modal-word-trans').textContent = wordDetail.translation || '-';
    document.getElementById('modal-vocab-level').textContent = wordDetail.vocab_level || 'A1';
    document.getElementById('modal-base-word').textContent = wordDetail.base_word || '-';
    document.getElementById('modal-pos').textContent = wordDetail.pos || 'noun';
    document.getElementById('modal-ipa').textContent = wordDetail.pronunciation_ipa || '-';
    document.getElementById('modal-phonetic').textContent = wordDetail.pronunciation_simple || '-';
    document.getElementById('modal-literal-meaning').textContent = wordDetail.literal_meaning || '-';
    document.getElementById('modal-context-meaning').textContent = wordDetail.contextual_meaning || '-';
    document.getElementById('modal-example-source').textContent = wordDetail.example_source ? `"${wordDetail.example_source}"` : '-';
    document.getElementById('modal-example-target').textContent = wordDetail.example_target ? `"${wordDetail.example_target}"` : '-';
    document.getElementById('modal-grammar-note').textContent = wordDetail.grammar_note || '-';

    this.openModal('word-detail-modal');
  },

  // Dynamic step loading text animation
  startLoadingAnimation() {
    const loadingContainer = document.getElementById('loading-container');
    const loadingStepText = document.getElementById('loading-step-text');
    const resultsContainer = document.getElementById('results-container');

    if (!loadingContainer || !loadingStepText) return;

    resultsContainer.style.display = 'none';
    loadingContainer.style.display = 'flex';

    const steps = [
      "Analyzing text structure...",
      "Aligning words & phrases...",
      "Translating with AI provider...",
      "Generating grammar & phonetic explanation..."
    ];

    let currentStep = 0;
    loadingStepText.textContent = steps[0];

    if (window._loadingInterval) clearInterval(window._loadingInterval);
    window._loadingInterval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      loadingStepText.textContent = steps[currentStep];
    }, 1200);
  },

  stopLoadingAnimation() {
    if (window._loadingInterval) clearInterval(window._loadingInterval);
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) loadingContainer.style.display = 'none';
  }
};

window.UI = UI;
