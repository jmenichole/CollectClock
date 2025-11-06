// CollectClock App - Daily Bonus Links Manager
(function() {
  'use strict';

  // State
  let bonusData = [];
  let filteredData = [];
  let favorites = new Set();
  let showFavoritesOnly = false;
  let userSubmissions = [];
  let bonusMeta = {};

  // DOM Elements
  const searchInput = document.getElementById('search-input');
  const themeToggle = document.getElementById('theme-toggle');
  const favoritesToggle = document.getElementById('favorites-toggle');
  const sortSelect = document.getElementById('sort-select');
  const bonusGrid = document.getElementById('bonus-grid');
  const lastUpdatedEl = document.getElementById('last-updated');
  const bonusCount = document.getElementById('bonus-count');
  const submitCasinoBtn = document.getElementById('submit-casino-btn');
  const submitCasinoModal = document.getElementById('submit-casino-modal');
  const submitCasinoForm = document.getElementById('submit-casino-form');
  const submitCasinoSuccess = document.getElementById('submit-casino-success');
  const helpTrigger = document.getElementById('help-trigger');
  const helpPopover = document.getElementById('help-popover');

  // Initialize app
  function init() {
    loadTheme();
    loadFavorites();
    loadUserSubmissions();
    loadBonusMeta();
    loadBonusData();
    attachEventListeners();
    toggleHelpPopover(false);
  }

  // Load theme preference from localStorage
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  // Update theme toggle icon
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Load favorites from localStorage
  function loadFavorites() {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        favorites = new Set(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      favorites = new Set();
    }
  }

  // Load locally saved submissions
  function loadUserSubmissions() {
    try {
      const savedSubmissions = localStorage.getItem('userSubmissions');
      if (savedSubmissions) {
        userSubmissions = JSON.parse(savedSubmissions);
      }
    } catch (error) {
      console.error('Error loading user submissions:', error);
      userSubmissions = [];
    }
  }

  function saveUserSubmissions() {
    try {
      localStorage.setItem('userSubmissions', JSON.stringify(userSubmissions));
    } catch (error) {
      console.error('Error saving user submissions:', error);
    }
  }

  // Load stored bonus metadata (amount + window)
  function loadBonusMeta() {
    try {
      const savedMeta = localStorage.getItem('bonusMeta');
      if (savedMeta) {
        bonusMeta = JSON.parse(savedMeta);
      }
    } catch (error) {
      console.error('Error loading bonus metadata:', error);
      bonusMeta = {};
    }
  }

  function saveBonusMeta() {
    try {
      localStorage.setItem('bonusMeta', JSON.stringify(bonusMeta));
    } catch (error) {
      console.error('Error saving bonus metadata:', error);
    }
  }

  // Save favorites to localStorage
  function saveFavorites() {
    try {
      localStorage.setItem('favorites', JSON.stringify([...favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  // Toggle favorite
  function toggleFavorite(brand) {
    if (favorites.has(brand)) {
      favorites.delete(brand);
    } else {
      favorites.add(brand);
    }
    saveFavorites();
    renderBonuses();
  }

  // Toggle favorites filter
  function toggleFavoritesFilter() {
    showFavoritesOnly = !showFavoritesOnly;
    if (favoritesToggle) {
      favoritesToggle.classList.toggle('btn-primary', showFavoritesOnly);
      favoritesToggle.classList.toggle('btn-secondary', !showFavoritesOnly);
    }
    filterAndRenderBonuses();
  }

  // Load bonus data from JSON
  async function loadBonusData() {
    try {
      const response = await fetch('bonus-data.json');
      if (!response.ok) {
        throw new Error('Failed to load bonus data');
      }
      bonusData = await response.json();
      mergeUserSubmissions();
      filterAndRenderBonuses();
      updateLastUpdated();
    } catch (error) {
      console.error('Error loading bonus data:', error);
      showError('Failed to load bonus data. Please refresh the page.');
    }
  }

  function mergeUserSubmissions() {
    if (userSubmissions.length === 0) return;
    bonusData = [...bonusData, ...userSubmissions];
  }

  // Filter and render bonuses
  function filterAndRenderBonuses() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const sortBy = sortSelect ? sortSelect.value : 'verified';

    // Filter by search term
    filteredData = bonusData.filter(bonus => {
      const matchesSearch = bonus.brand.toLowerCase().includes(searchTerm) ||
                          bonus.bonus.toLowerCase().includes(searchTerm);
      const matchesFavorites = !showFavoritesOnly || favorites.has(bonus.brand);
      return matchesSearch && matchesFavorites;
    });

    // Sort data
    if (sortBy === 'verified') {
      filteredData.sort((a, b) => new Date(b.verified) - new Date(a.verified));
    } else if (sortBy === 'brand') {
      filteredData.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    renderBonuses();
  }

  // Render bonuses to the grid
  function renderBonuses() {
    if (!bonusGrid) return;

    // Update count
    if (bonusCount) {
      bonusCount.textContent = `${filteredData.length} bonus${filteredData.length !== 1 ? 'es' : ''}`;
    }

    // Clear grid
    bonusGrid.innerHTML = '';

    // Show empty state if no bonuses
    if (filteredData.length === 0) {
      bonusGrid.innerHTML = `
        <div class="empty-state">
          <h2>No bonuses found</h2>
          <p>${showFavoritesOnly ? 'You haven\'t favorited any bonuses yet.' : 'Try adjusting your search.'}</p>
        </div>
      `;
      return;
    }

    // Create cards for each bonus
    filteredData.forEach(bonus => {
      const card = createBonusCard(bonus);
      bonusGrid.appendChild(card);
    });
  }

  // Create a bonus card element
  function createBonusCard(bonus) {
    const card = document.createElement('div');
    card.className = 'bonus-card';

    const isFavorite = favorites.has(bonus.brand);
    const formattedDate = formatDate(bonus.verified);
    
    card.innerHTML = `
      <div class="card-header">
        <div class="brand-name">${escapeHtml(bonus.brand)}</div>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                data-brand="${escapeHtml(bonus.brand)}"
                aria-label="${isFavorite ? 'Remove from' : 'Add to'} favorites">
          ${isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <div class="bonus-title">${escapeHtml(bonus.bonus)}</div>
      ${bonus.code ? `
        <div class="bonus-code">
          <span class="code-text">${escapeHtml(bonus.code)}</span>
          <button class="copy-btn" data-code="${escapeHtml(bonus.code)}" aria-label="Copy bonus code">
            📋
          </button>
        </div>
      ` : ''}
      <div class="verified-date">
        ✓ Verified ${formattedDate}
      </div>
      <div class="card-actions">
        <a href="${escapeHtml(bonus.url)}"
           target="_blank"
           rel="noopener noreferrer"
           class="visit-btn">
          Visit Site →
        </a>
      </div>
    `;

    const actions = card.querySelector('.card-actions');
    const metaSection = createMetaSection(bonus);
    if (actions) {
      card.insertBefore(metaSection, actions);
    } else {
      card.appendChild(metaSection);
    }

    // Attach event listeners
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
      toggleFavorite(bonus.brand);
    });

    const copyBtn = card.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyToClipboard(bonus.code);
      });
    }

    return card;
  }

  function getMetaForBonus(bonus) {
    const storedMeta = bonusMeta[bonus.brand] || {};
    return {
      amount: storedMeta.amount || bonus.bonusAmount || '',
      collectWindow: storedMeta.collectWindow || bonus.collectWindow || ''
    };
  }

  function createMetaSection(bonus) {
    const metaSection = document.createElement('div');
    metaSection.className = 'bonus-meta';
    metaSection.dataset.brand = bonus.brand;

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'meta-items';
    metaSection.appendChild(itemsContainer);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'meta-edit-btn';
    editBtn.textContent = '✏️ Update bonus';
    editBtn.setAttribute('aria-label', `Update bonus details for ${bonus.brand}`);
    editBtn.setAttribute('aria-expanded', 'false');
    metaSection.appendChild(editBtn);

    const form = buildMetaForm(bonus, metaSection);
    metaSection.appendChild(form);

    updateMetaItems(metaSection, bonus);

    editBtn.addEventListener('click', () => {
      const isVisible = form.dataset.visible === 'true';
      if (isVisible) {
        toggleMetaForm(form, false);
        return;
      }
      closeAllMetaForms();
      const meta = getMetaForBonus(bonus);
      const amountInput = form.querySelector('input[name="metaAmount"]');
      const windowInput = form.querySelector('input[name="metaWindow"]');
      if (amountInput) amountInput.value = meta.amount;
      if (windowInput) windowInput.value = meta.collectWindow;
      toggleMetaForm(form, true);
      editBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        amountInput?.focus();
      }, 0);
    });

    return metaSection;
  }

  function buildMetaForm(bonus, metaSection) {
    const form = document.createElement('form');
    form.className = 'meta-form';
    form.dataset.brand = bonus.brand;

    const amountGroup = document.createElement('label');
    amountGroup.textContent = 'Bonus amount';
    const amountInput = document.createElement('input');
    amountInput.type = 'text';
    amountInput.name = 'metaAmount';
    amountInput.placeholder = 'e.g. 10,000 GC';
    amountGroup.appendChild(amountInput);

    const windowGroup = document.createElement('label');
    windowGroup.textContent = 'Collecting window';
    const windowInput = document.createElement('input');
    windowInput.type = 'text';
    windowInput.name = 'metaWindow';
    windowInput.placeholder = 'e.g. Every 24 hours';
    windowGroup.appendChild(windowInput);

    const actions = document.createElement('div');
    actions.className = 'meta-form-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'meta-save-btn';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'meta-cancel-btn';
    cancelBtn.textContent = 'Cancel';

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    form.appendChild(amountGroup);
    form.appendChild(windowGroup);
    form.appendChild(actions);

    cancelBtn.addEventListener('click', () => {
      toggleMetaForm(form, false);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amountValue = amountInput.value.trim();
      const windowValue = windowInput.value.trim();
      saveMetaForBrand(bonus.brand, amountValue, windowValue);
      updateMetaItems(metaSection, bonus);
      toggleMetaForm(form, false);
      showToast('Bonus details updated');
    });

    return form;
  }

  function saveMetaForBrand(brand, amount, collectWindow) {
    if (!amount && !collectWindow) {
      delete bonusMeta[brand];
    } else {
      bonusMeta[brand] = { amount, collectWindow };
    }
    saveBonusMeta();
  }

  function updateMetaItems(metaSection, bonus) {
    const items = metaSection.querySelector('.meta-items');
    if (!items) return;
    const meta = getMetaForBonus(bonus);
    items.innerHTML = '';
    items.appendChild(buildMetaItem('Bonus amount', meta.amount));
    items.appendChild(buildMetaItem('Collecting window', meta.collectWindow));
  }

  function buildMetaItem(label, value) {
    const item = document.createElement('div');
    item.className = 'meta-item';
    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    const valueEl = document.createElement('span');
    if (value) {
      valueEl.textContent = value;
    } else {
      valueEl.className = 'meta-empty';
      valueEl.textContent = 'Not set';
    }
    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function toggleMetaForm(form, show) {
    form.dataset.visible = show ? 'true' : 'false';
    const editBtn = form.parentElement?.querySelector('.meta-edit-btn');
    if (editBtn) {
      editBtn.setAttribute('aria-expanded', show ? 'true' : 'false');
    }
  }

  function closeAllMetaForms() {
    document.querySelectorAll('.meta-form[data-visible="true"]').forEach(form => {
      form.dataset.visible = 'false';
      const editBtn = form.parentElement?.querySelector('.meta-edit-btn');
      editBtn?.setAttribute('aria-expanded', 'false');
    });
  }

  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Update last updated timestamp
  function updateLastUpdated() {
    if (!lastUpdatedEl || bonusData.length === 0) return;

    // Find the most recent verified date
    const mostRecent = bonusData.reduce((latest, bonus) => {
      const bonusDate = new Date(bonus.verified);
      return bonusDate > latest ? bonusDate : latest;
    }, new Date(0));

    const formatted = mostRecent.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    lastUpdatedEl.textContent = `Last updated: ${formatted}`;
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(`Copied: ${text}`);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy code');
    }
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Show error message
  function showError(message) {
    if (bonusGrid) {
      bonusGrid.innerHTML = `
        <div class="empty-state">
          <h2>⚠️ Error</h2>
          <p>${escapeHtml(message)}</p>
        </div>
      `;
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Attach event listeners
  function attachEventListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', filterAndRenderBonuses);
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    if (favoritesToggle) {
      favoritesToggle.addEventListener('click', toggleFavoritesFilter);
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', filterAndRenderBonuses);
    }

    if (submitCasinoBtn) {
      submitCasinoBtn.addEventListener('click', openSubmitCasinoModal);
    }

    if (submitCasinoModal) {
      submitCasinoModal.querySelectorAll('[data-close="true"]').forEach(el => {
        el.addEventListener('click', closeSubmitCasinoModal);
      });
    }

    if (submitCasinoForm) {
      submitCasinoForm.addEventListener('submit', handleSubmitCasino);
    }

    if (helpTrigger) {
      helpTrigger.addEventListener('click', () => toggleHelpPopover());
    }

    document.addEventListener('click', (event) => {
      if (helpPopover && helpTrigger) {
        const target = event.target;
        if (helpPopover.dataset.visible === 'true' && !helpPopover.contains(target) && target !== helpTrigger) {
          toggleHelpPopover(false);
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isSubmitModalOpen()) {
          closeSubmitCasinoModal();
        }
        toggleHelpPopover(false);
        closeAllMetaForms();
        return;
      }

      // Focus search with '/'
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInput?.focus();
        }
      }
    });
  }

  function openSubmitCasinoModal() {
    if (!submitCasinoModal) return;
    submitCasinoModal.dataset.open = 'true';
    submitCasinoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    toggleHelpPopover(false);
    closeAllMetaForms();
    setTimeout(() => {
      submitCasinoForm?.querySelector('input')?.focus();
    }, 0);
  }

  function closeSubmitCasinoModal() {
    if (!submitCasinoModal) return;
    submitCasinoModal.dataset.open = 'false';
    submitCasinoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    submitCasinoForm?.reset();
    if (submitCasinoSuccess) {
      submitCasinoSuccess.textContent = '';
    }
  }

  function isSubmitModalOpen() {
    return submitCasinoModal?.dataset.open === 'true';
  }

  function handleSubmitCasino(event) {
    event.preventDefault();
    if (!submitCasinoForm) return;

    const formData = new FormData(submitCasinoForm);
    const brand = formData.get('casinoName')?.toString().trim();
    const url = formData.get('casinoUrl')?.toString().trim();
    const bonus = formData.get('casinoBonus')?.toString().trim();
    const bonusAmount = formData.get('casinoAmount')?.toString().trim();
    const collectWindow = formData.get('casinoWindow')?.toString().trim();
    const code = formData.get('casinoCode')?.toString().trim();

    if (!brand || !url || !bonus) {
      showToast('Please fill in the required fields');
      return;
    }

    const submission = {
      brand,
      bonus,
      url,
      verified: new Date().toISOString().split('T')[0],
      code: code || null,
      bonusAmount: bonusAmount || '',
      collectWindow: collectWindow || ''
    };

    userSubmissions.push(submission);
    saveUserSubmissions();
    bonusData.push(submission);
    filterAndRenderBonuses();
    updateLastUpdated();

    submitCasinoForm.reset();
    if (submitCasinoSuccess) {
      submitCasinoSuccess.textContent = 'Submission saved! You can now find it in your list.';
    }
    showToast('Casino submitted');

    setTimeout(() => {
      if (submitCasinoSuccess) {
        submitCasinoSuccess.textContent = '';
      }
      closeSubmitCasinoModal();
    }, 1800);
  }

  function toggleHelpPopover(forceState) {
    if (!helpPopover) return;
    const shouldShow = typeof forceState === 'boolean'
      ? forceState
      : helpPopover.dataset.visible !== 'true';
    helpPopover.dataset.visible = shouldShow ? 'true' : 'false';
    helpPopover.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    if (helpTrigger) {
      helpTrigger.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
    }
  }

  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
