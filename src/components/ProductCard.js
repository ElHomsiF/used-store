/* ==========================================================================
   ProductCard Component - Card Rendering & Quick Actions
   ========================================================================== */

import { auctionEngine } from '../services/auctionEngine.js';

export function createProductCardElement(product, { isWatched, onQuickBid, onBuyNow, onViewDetails, onToggleWatch }) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.id = product.id;

  const timerInfo = auctionEngine.formatTimeLeft(product.endsAt);

  card.innerHTML = `
    <!-- Product Image & Badges -->
    <div class="product-image-wrap">
      <img src="${product.imageUrl}" alt="${product.title}" class="product-img" loading="lazy" />
      
      <button class="watch-btn ${isWatched ? 'active' : ''}" title="${isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}" aria-label="Toggle Watchlist">
        ❤️
      </button>

      <span class="condition-badge">${product.condition}</span>

      <span class="live-timer-badge ${timerInfo.isUrgent ? 'urgent' : ''}">
        ⏱️ <span class="timer-text">${timerInfo.string}</span>
      </span>
    </div>

    <!-- Product Body -->
    <div class="product-body">
      <h3 class="product-title" title="${product.title}">${product.title}</h3>
      
      <div class="seller-mini-info">
        <span>Seller: <strong>${product.seller.name}</strong></span>
        <span>(${product.seller.rating}% positive)</span>
      </div>

      <div class="price-container">
        <div class="bid-info-row">
          <span class="price-label">${product.isEnded ? 'Final Price' : 'Current Bid'}</span>
          <span class="price-amount">$${product.currentBid.toFixed(2)}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="bids-count">${product.bidsCount} bid${product.bidsCount === 1 ? '' : 's'}</span>
          ${product.freeShipping ? '<span style="font-size: 0.75rem; color: var(--accent-success); font-weight: 600;">Free Shipping</span>' : ''}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="product-card-actions">
        ${product.isEnded ? `
          <button class="btn btn-outline btn-sm btn-view" style="grid-column: span 2;">
            Auction Ended
          </button>
        ` : `
          <button class="btn btn-brand-blue btn-sm btn-quick-bid">
            🔨 Bid $${(product.currentBid + auctionEngine.calculateMinIncrement(product.currentBid)).toFixed(2)}
          </button>
          <button class="btn btn-primary btn-sm btn-buy-now">
            ⚡ Buy Now $${product.buyItNowPrice.toFixed(0)}
          </button>
        `}
      </div>
    </div>
  `;

  // Attach Handlers
  const watchBtn = card.querySelector('.watch-btn');
  watchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onToggleWatch(product.id);
  });

  const quickBidBtn = card.querySelector('.btn-quick-bid');
  if (quickBidBtn) {
    quickBidBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onQuickBid(product.id);
    });
  }

  const buyNowBtn = card.querySelector('.btn-buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onBuyNow(product.id);
    });
  }

  card.addEventListener('click', () => {
    onViewDetails(product.id);
  });

  return card;
}

export function updateProductCardTimer(cardElement, endsAt) {
  const timerBadge = cardElement.querySelector('.live-timer-badge');
  const timerText = cardElement.querySelector('.timer-text');
  if (!timerBadge || !timerText) return;

  const timerInfo = auctionEngine.formatTimeLeft(endsAt);
  timerText.textContent = timerInfo.string;

  if (timerInfo.isUrgent) {
    timerBadge.classList.add('urgent');
  } else {
    timerBadge.classList.remove('urgent');
  }
}
