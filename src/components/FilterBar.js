/* ==========================================================================
   FilterBar Component - Filtering & Sorting Controls
   ========================================================================== */

export function renderFilterBar(container, {
  activeCondition,
  isWatchlistOnly,
  currentSort,
  totalResults,
  onConditionChange,
  onWatchlistToggle,
  onSortChange
}) {
  container.innerHTML = `
    <div class="filter-left-group">
      <span style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">
        Catalog (${totalResults} items)
      </span>
      
      <button class="filter-chip ${activeCondition === 'all' && !isWatchlistOnly ? 'active' : ''}" data-cond="all">
        All Items
      </button>
      <button class="filter-chip ${activeCondition === 'Brand New' ? 'active' : ''}" data-cond="Brand New">
        Brand New
      </button>
      <button class="filter-chip ${activeCondition === 'Used' ? 'active' : ''}" data-cond="Used">
        Pre-Owned
      </button>

      <button class="filter-chip ${isWatchlistOnly ? 'active' : ''}" id="filter-watchlist-chip">
        ❤️ Watchlist Only
      </button>
    </div>

    <div class="filter-right-group">
      <label for="sort-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">Sort By:</label>
      <select id="sort-select" class="sort-select" aria-label="Sort Catalog">
        <option value="ending-soon" ${currentSort === 'ending-soon' ? 'selected' : ''}>⏱️ Ending Soonest</option>
        <option value="most-bids" ${currentSort === 'most-bids' ? 'selected' : ''}>🔥 Most Bids</option>
        <option value="price-low" ${currentSort === 'price-low' ? 'selected' : ''}>💲 Price: Low to High</option>
        <option value="price-high" ${currentSort === 'price-high' ? 'selected' : ''}>💲 Price: High to Low</option>
      </select>
    </div>
  `;

  container.querySelectorAll('.filter-chip[data-cond]').forEach(chip => {
    chip.addEventListener('click', () => {
      onConditionChange(chip.dataset.cond);
    });
  });

  container.querySelector('#filter-watchlist-chip').addEventListener('click', () => {
    onWatchlistToggle();
  });

  container.querySelector('#sort-select').addEventListener('change', (e) => {
    onSortChange(e.target.value);
  });
}
