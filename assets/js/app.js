// CollectClock App - Daily Bonus Links Manager
(function() {
  'use strict';

  // State
  let bonusData = [];
  let filteredData = [];
  let favorites = new Set();
  let showFavoritesOnly = false;

  // DOM Elements
  const searchInput = document.getElementById('search-input');
  const themeToggle = document.getElementById('theme-toggle');
  const favoritesToggle = document.getElementById('favorites-toggle');
  const sortSelect = document.getElementById('sort-select');
  const bonusGrid = document.getElementById('bonus-grid');
  const lastUpdatedEl = document.getElementById('last-updated');
  const bonusCount = document.getElementById('bonus-count');

  // Initialize app
  function init() {
    loadTheme();
    loadFavorites();
    loadBonusData();
    attachEventListeners();
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
      filterAndRenderBonuses();
      updateLastUpdated();
    } catch (error) {
      console.error('Error loading bonus data:', error);
      showError('Failed to load bonus data. Please refresh the page.');
    }
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

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
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

  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
