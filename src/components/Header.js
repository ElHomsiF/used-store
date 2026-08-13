/* ==========================================================================
   Header Component - eBazaar Navigation & Controls
   ========================================================================== */

import { CATEGORIES } from '../data/mockProducts.js';

export function renderHeader(container, {
  user,
  watchlistCount,
  cartCount,
  notificationCount,
  activeCategory,
  onSearch,
  onCategoryChange,
  onOpenWatchlist,
  onOpenCart,
  onOpenSellerStudio,
  onToggleTheme,
  onToggleArcadeMode,
  isArcadeMode,
  currentTheme
}) {
  container.innerHTML = `
    <!-- Top Utility Bar -->
    <div class="top-user-bar">
      <div class="user-greeting">
        <span>Hi <strong>${user.name}</strong>!</span>
        <span>|</span>
        <a href="#" class="top-nav-link" id="btn-daily-deals">🔥 Daily Deals</a>
        <a href="#" class="top-nav-link" id="btn-brand-outlet">🏷️ Brand Outlet</a>
      </div>
      <div class="top-nav-links">
        <button class="top-nav-link" id="btn-sell-item">
          ✨ <strong>Sell Item</strong>
        </button>
        <button class="top-nav-link" id="btn-arcade-toggle">
          ${isArcadeMode ? '🏪 Back to Shop' : '⚡ Bidding Frenzy Arcade'}
        </button>
        <button class="top-nav-link" id="btn-theme-toggle" title="Toggle Theme">
          ${currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>

    <!-- Main Header Row -->
    <div class="header-main-row">
      <!-- Logo -->
      <a href="#" class="brand-logo" id="brand-logo-btn">
        <span>e</span><span>B</span><span>a</span><span>z</span><span>a</span><span>a</span><span>r</span>
        <span class="badge-tag">LIVE</span>
      </a>

      <!-- Search Bar -->
      <div class="search-container">
        <input 
          type="text" 
          id="search-input" 
          class="search-input" 
          placeholder="Search for anything (e.g. PS5 Pro, Jordan 1, Rolex)..." 
          aria-label="Search Marketplace"
        />
        <select id="header-category-select" class="category-select" aria-label="Select Category">
          ${CATEGORIES.map(cat => `
            <option value="${cat.id}" ${activeCategory === cat.id ? 'selected' : ''}>
              ${cat.name}
            </option>
          `).join('')}
        </select>
        <button id="search-btn" class="search-btn">
          🔍 Search
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="header-actions">
        <button class="action-icon-btn" id="header-watchlist-btn" title="Watchlist">
          ❤️
          ${watchlistCount > 0 ? `<span class="badge-count">${watchlistCount}</span>` : ''}
        </button>

        <button class="action-icon-btn" id="header-cart-btn" title="Shopping Cart">
          🛒
          ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ''}
        </button>

        <button class="action-icon-btn" id="header-notif-btn" title="Notifications">
          🔔
          ${notificationCount > 0 ? `<span class="badge-count">${notificationCount}</span>` : ''}
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  const searchInput = container.querySelector('#search-input');
  const searchBtn = container.querySelector('#search-btn');
  const categorySelect = container.querySelector('#header-category-select');

  const executeSearch = () => {
    onSearch(searchInput.value.trim(), categorySelect.value);
  };

  searchBtn.addEventListener('click', executeSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
  });
  categorySelect.addEventListener('change', () => {
    onCategoryChange(categorySelect.value);
  });

  container.querySelector('#btn-sell-item').addEventListener('click', (e) => {
    e.preventDefault();
    onOpenSellerStudio();
  });

  container.querySelector('#btn-arcade-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    onToggleArcadeMode();
  });

  container.querySelector('#btn-theme-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    onToggleTheme();
  });

  container.querySelector('#header-watchlist-btn').addEventListener('click', onOpenWatchlist);
  container.querySelector('#header-cart-btn').addEventListener('click', onOpenCart);
  container.querySelector('#brand-logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    onCategoryChange('all');
  });
}
