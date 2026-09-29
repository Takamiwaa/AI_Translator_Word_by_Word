/**
 * Interactive Word-by-Word Alignment Renderer
 */
const TranslatorView = {
  renderAlignment(data) {
    const viewport = document.getElementById('alignment-viewport');
    if (!viewport) return;

    viewport.innerHTML = '';

    const alignment = data.alignment || [];
    const wordDetailsMap = new Map();

    if (data.word_details && Array.isArray(data.word_details)) {
      data.word_details.forEach(detail => {
        if (detail.word) wordDetailsMap.set(detail.word.toLowerCase(), detail);
      });
    }

    alignment.forEach((unit, index) => {
      const sourceText = Array.isArray(unit.source) ? unit.source.join(' ') : unit.source;
      const targetText = Array.isArray(unit.target) ? unit.target.join(' ') : unit.target;
      const unitType = unit.type || 'direct';

      // Create Unit Container
      const unitEl = document.createElement('div');
      unitEl.className = 'alignment-unit fade-in';
      unitEl.style.animationDelay = `${index * 0.05}s`;
      unitEl.dataset.index = index;

      // Source Block
      const sourceBlock = document.createElement('div');
      sourceBlock.className = 'alignment-block source-block';
      sourceBlock.textContent = sourceText;

      // Connector
      const connector = document.createElement('div');
      connector.className = 'alignment-connector';
      connector.innerHTML = '↓';

      // Target Block
      const targetBlock = document.createElement('div');
      targetBlock.className = 'alignment-block target-block';
      targetBlock.textContent = targetText;

      // Type tag (if multi-word or idiom)
      if (unitType !== 'direct') {
        const tag = document.createElement('div');
        tag.className = 'unit-type-tag';
        tag.textContent = unitType;
        unitEl.appendChild(tag);
      }

      unitEl.appendChild(sourceBlock);
      unitEl.appendChild(connector);
      unitEl.appendChild(targetBlock);

      // Interactive Pair Hover Events
      unitEl.addEventListener('mouseenter', () => {
        unitEl.classList.add('highlighted');
      });

      unitEl.addEventListener('mouseleave', () => {
        unitEl.classList.remove('highlighted');
      });

      // Click to open floating detail modal
      unitEl.addEventListener('click', () => {
        const detailKey = sourceText.toLowerCase();
        let detail = wordDetailsMap.get(detailKey);

        if (!detail) {
          // Dynamic fallback if detail item was missing
          detail = {
            word: sourceText,
            translation: targetText,
            base_word: sourceText,
            pos: 'word / phrase',
            pronunciation_ipa: `/${targetText}/`,
            pronunciation_simple: targetText,
            literal_meaning: targetText,
            contextual_meaning: `Aligned translation for "${sourceText}"`,
            example_source: data.source_sentence || sourceText,
            example_target: data.natural_translation || targetText,
            grammar_note: `Alignment type: ${unitType}`,
            vocab_level: 'A2'
          };
        }

        UI.showWordDetail(detail);
      });

      viewport.appendChild(unitEl);
    });

    // Populate Natural & Literal Translations
    const naturalEl = document.getElementById('natural-trans-text');
    const literalEl = document.getElementById('literal-trans-text');
    const literalWrapper = document.getElementById('literal-trans-wrapper');

    if (naturalEl) naturalEl.textContent = data.natural_translation || data.source_sentence;
    if (literalEl) {
      if (data.literal_translation && data.literal_translation !== data.natural_translation) {
        literalEl.textContent = data.literal_translation;
        if (literalWrapper) literalWrapper.style.display = 'block';
      } else {
        if (literalWrapper) literalWrapper.style.display = 'none';
      }
    }

    // Populate Grammar Analysis
    const tenseEl = document.getElementById('grammar-tense');
    const formulaEl = document.getElementById('grammar-formula');
    const explanationEl = document.getElementById('grammar-explanation');

    if (data.grammar) {
      if (tenseEl) tenseEl.textContent = data.grammar.tense || 'Standard Structure';
      if (formulaEl) formulaEl.textContent = data.grammar.formula || 'Subject + Verb + Object';
      if (explanationEl) explanationEl.textContent = data.grammar.explanation || 'Analyzed sentence structure.';
    }

    // Populate CEFR Vocab Tags
    const tagsContainer = document.getElementById('vocab-level-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      const levels = data.vocabulary_levels || [];
      if (levels.length === 0 && data.word_details) {
        data.word_details.forEach(w => {
          levels.push({ word: w.word, level: w.vocab_level || 'A1' });
        });
      }

      levels.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'alignment-block';
        badge.style.padding = '4px 10px';
        badge.style.fontSize = '0.8rem';
        badge.innerHTML = `<strong>${item.word}</strong> <span class="vocab-tag">${item.level}</span>`;
        tagsContainer.appendChild(badge);
      });
    }

    // Show Results Card
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

window.TranslatorView = TranslatorView;
