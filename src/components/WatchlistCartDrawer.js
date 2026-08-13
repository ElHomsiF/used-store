/* ==========================================================================
   WatchlistCartDrawer Component - Side Drawer for Watchlist & Cart
   ========================================================================== */

import { auctionEngine } from '../services/auctionEngine.js';

export function renderWatchlistCartDrawer(container, { activeTab = 'cart', onClose, onProceedCheckout, onViewDetails }) {
  const cartItems = auctionEngine.cart;
  const watchedIds = Array.from(auctionEngine.watchlist);
  const watchedProducts = auctionEngine.products.filter(p => watchedIds.includes(p.id));

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const drawerHtml = `
    <div class="drawer-overlay" id="drawer-overlay">
      <div class="drawer-panel">
        <div class="modal-header">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn ${activeTab === 'cart' ? 'btn-brand-blue' : 'btn-outline'} btn-sm" id="drawer-tab-cart">
              🛒 Cart (${cartItems.length})
            </button>
            <button class="btn ${activeTab === 'watchlist' ? 'btn-brand-blue' : 'btn-outline'} btn-sm" id="drawer-tab-watchlist">
              ❤️ Watchlist (${watchedProducts.length})
            </button>
          </div>
          <button class="modal-close-btn" id="drawer-close-btn">&times;</button>
        </div>

        <div class="modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
          ${activeTab === 'cart' ? renderCartList(cartItems) : renderWatchlist(watchedProducts)}
        </div>

        ${activeTab === 'cart' && cartItems.length > 0 ? `
          <div style="padding: 1.25rem; border-top: 1px solid var(--border-color); background: var(--bg-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: 500;">Subtotal</span>
              <strong style="font-family: var(--font-heading); font-size: 1.3rem; color: var(--text-primary);">$${subtotal.toFixed(2)}</strong>
            </div>
            <button class="btn btn-primary" id="btn-checkout-proceed" style="width: 100%;">
              💳 Proceed to Checkout
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  container.innerHTML = drawerHtml;

  const overlay = container.querySelector('#drawer-overlay');
  const closeBtn = container.querySelector('#drawer-close-btn');

  const close = () => {
    container.innerHTML = '';
    onClose();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const cartTabBtn = container.querySelector('#drawer-tab-cart');
  const watchlistTabBtn = container.querySelector('#drawer-tab-watchlist');

  cartTabBtn.addEventListener('click', () => {
    renderWatchlistCartDrawer(container, { activeTab: 'cart', onClose, onProceedCheckout, onViewDetails });
  });

  watchlistTabBtn.addEventListener('click', () => {
    renderWatchlistCartDrawer(container, { activeTab: 'watchlist', onClose, onProceedCheckout, onViewDetails });
  });

  const checkoutBtn = container.querySelector('#btn-checkout-proceed');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      close();
      onProceedCheckout();
    });
  }

  // Item Remove & View Buttons
  container.querySelectorAll('.btn-remove-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      auctionEngine.removeFromCart(id);
      renderWatchlistCartDrawer(container, { activeTab: 'cart', onClose, onProceedCheckout, onViewDetails });
    });
  });

  container.querySelectorAll('.drawer-item-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        const id = row.dataset.id;
        close();
        onViewDetails(id);
      }
    });
  });
}

function renderCartList(cartItems) {
  if (cartItems.length === 0) {
    return `
      <div style="text-align: center; margin: auto; padding: 2rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <h4 style="font-size: 1.1rem; font-weight: 700;">Your Cart is Empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Win an auction or click 'Buy It Now' to add items!</p>
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${cartItems.map(item => `
        <div class="drawer-item-row" data-id="${item.id}" style="display: flex; gap: 0.85rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;">
          <img src="${item.imageUrl}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem; line-height: 1.3; margin-bottom: 0.25rem;">${item.title}</div>
            <strong style="color: var(--brand-blue); font-size: 0.95rem;">$${item.price.toFixed(2)}</strong>
          </div>
          <button class="btn-remove-cart" data-id="${item.id}" style="color: var(--brand-red); font-size: 1.1rem;" title="Remove">&times;</button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderWatchlist(watchedProducts) {
  if (watchedProducts.length === 0) {
    return `
      <div style="text-align: center; margin: auto; padding: 2rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">❤️</div>
        <h4 style="font-size: 1.1rem; font-weight: 700;">No Watched Items</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Click the heart icon on any listing to track live bids!</p>
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${watchedProducts.map(p => `
        <div class="drawer-item-row" data-id="${p.id}" style="display: flex; gap: 0.85rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;">
          <img src="${p.imageUrl}" alt="${p.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem; line-height: 1.3; margin-bottom: 0.25rem;">${p.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Current: <strong style="color: var(--text-primary);">$${p.currentBid.toFixed(2)}</strong> (${p.bidsCount} bids)</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
