/**
 * History Manager Page Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const historyListContainer = document.getElementById('history-list-container');
  const historySearchInput = document.getElementById('history-search-input');

  if (!historyListContainer) return; // Only runs on history.html

  async function loadHistory(search = '') {
    try {
      historyListContainer.innerHTML = '<div class="loading-step-text">Loading history records...</div>';
      const res = await API.getHistory(search);
      const items = res.history || [];

      if (items.length === 0) {
        historyListContainer.innerHTML = '<div style="color: var(--text-secondary); padding: 20px; text-align: center;">No translation history found.</div>';
        return;
      }

      historyListContainer.innerHTML = '';
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card fade-in';
        card.style.padding = '16px 20px';
        card.style.marginBottom = '8px';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';

        const formattedDate = new Date(item.created_at).toLocaleString();

        card.innerHTML = `
          <div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">
              ${item.source_language} &rarr; ${item.target_language} &bull; ${item.provider} (${item.model}) &bull; ${formattedDate}
            </div>
            <div style="font-weight: 600; font-size: 1rem; color: var(--text-primary);">${item.source_text}</div>
            <div style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 2px;">${item.target_text}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="nav-btn btn-delete-item" data-id="${item.id}" style="color: #FF4444; border-color: var(--border-color);">
              Delete
            </button>
          </div>
        `;

        // Delete button listener
        const deleteBtn = card.querySelector('.btn-delete-item');
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (confirm('Delete this history item?')) {
            try {
              await API.deleteHistoryItem(item.id);
              loadHistory(historySearchInput.value);
            } catch (err) {
              alert('Failed to delete history item.');
            }
          }
        });

        historyListContainer.appendChild(card);
      });
    } catch (err) {
      historyListContainer.innerHTML = `<div style="color: #FF4444; padding: 16px;">Failed to load history: ${err.message}</div>`;
    }
  }

  let searchTimeout = null;
  historySearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadHistory(e.target.value);
    }, 300);
  });

  loadHistory();
});
