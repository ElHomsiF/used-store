/* ==========================================================================
   CategoryNav Component - Category Navigation Bar
   ========================================================================== */

import { CATEGORIES } from '../data/mockProducts.js';

export function renderCategoryNav(container, { activeCategory, onSelectCategory }) {
  container.innerHTML = `
    <ul class="category-list">
      ${CATEGORIES.map(cat => `
        <li class="category-item">
          <a href="#" class="category-link ${activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            ${cat.name}
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  container.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catId = link.dataset.cat;
      onSelectCategory(catId);
    });
  });
}
