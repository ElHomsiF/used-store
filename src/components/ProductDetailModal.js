/* ==========================================================================
   ProductDetailModal Component - Full Product Details & Bidding History Stream
   ========================================================================== */

import { auctionEngine } from '../services/auctionEngine.js';

export function renderProductDetailModal(container, productId, { onClose, onPlaceBid, onBuyNow, onToggleWatch, isWatched }) {
  const product = auctionEngine.products.find(p => p.id === productId);
  if (!product) return;

  const timerInfo = auctionEngine.formatTimeLeft(product.endsAt);
  const minIncrement = auctionEngine.calculateMinIncrement(product.currentBid);
  const minRequiredBid = +(product.currentBid + minIncrement).toFixed(2);

  const images = [product.imageUrl, ...(product.additionalImages || [])];

  const modalHtml = `
    <div class="modal-overlay" id="product-detail-modal">
      <div class="modal-card" style="max-width: 880px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="condition-badge" style="position: static;">${product.condition}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Item #${product.id}</span>
          </div>
          <button class="modal-close-btn" id="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <!-- Left Column: Gallery -->
          <div class="gallery-col">
            <div style="width: 100%; aspect-ratio: 4/3; background: var(--bg-secondary); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem; border: 1px solid var(--border-color);">
              <img src="${images[0]}" alt="${product.title}" id="main-detail-img" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <div style="display: flex; gap: 0.5rem; overflow-x: auto;" id="gallery-thumbs">
              ${images.map((img, idx) => `
                <img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" style="width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius-sm); border: 2px solid ${idx === 0 ? 'var(--brand-blue)' : 'var(--border-color)'}; cursor: pointer;" />
              `).join('')}
            </div>

            <!-- Seller Box -->
            <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 700; font-size: 0.95rem;">Seller Information</span>
                <span style="color: var(--accent-success); font-size: 0.8rem; font-weight: 600;">✓ Verified</span>
              </div>
              <div style="font-size: 0.9rem; font-weight: 600; color: var(--brand-blue);">${product.seller.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${product.seller.rating}% positive feedback (${product.seller.salesCount} items sold)</div>
              <button class="btn btn-outline btn-sm" id="btn-contact-seller" style="width: 100%;">💬 Ask Seller a Question</button>
            </div>
          </div>

          <!-- Right Column: Bidding Controls & Stream -->
          <div class="info-col" style="display: flex; flex-direction: column;">
            <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; line-height: 1.3; margin-bottom: 0.75rem;">
              ${product.title}
            </h2>

            <!-- Countdown Timer Card -->
            <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">Time Remaining:</span>
              <span style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: ${timerInfo.isUrgent ? 'var(--brand-red)' : 'var(--brand-blue)'};">
                ⏱️ ${timerInfo.string}
              </span>
            </div>

            <!-- Price & Bid Status -->
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Current Bid</div>
              <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: var(--text-primary); margin: 0.2rem 0;">
                $${product.currentBid.toFixed(2)}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">
                [ ${product.bidsCount} bid${product.bidsCount === 1 ? '' : 's'} ] &bull; 
                <span style="color: ${product.reserveMet ? 'var(--accent-success)' : 'var(--accent-gold)'}; font-weight: 600;">
                  ${product.reserveMet ? 'Reserve met' : 'Reserve not met'}
                </span>
              </div>
            </div>

            <!-- Bid Input Form -->
            ${product.isEnded ? `
              <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); text-align: center; font-weight: 700; color: var(--brand-red);">
                This auction has concluded.
              </div>
            ` : `
              <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">Place Your Bid (Min: $${minRequiredBid.toFixed(2)})</label>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <input type="number" id="custom-bid-input" step="0.50" value="${minRequiredBid.toFixed(2)}" style="flex: 1; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);" />
                  <button class="btn btn-brand-blue" id="btn-submit-bid">Place Bid</button>
                </div>

                <!-- Quick Increment Buttons -->
                <div style="display: flex; gap: 0.4rem;">
                  <button class="btn btn-outline btn-sm quick-add-btn" data-add="5">+ $5</button>
                  <button class="btn btn-outline btn-sm quick-add-btn" data-add="25">+ $25</button>
                  <button class="btn btn-outline btn-sm quick-add-btn" data-add="100">+ $100</button>
                </div>

                <!-- Instant Buy It Now -->
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Instant Purchase</span>
                    <strong style="font-size: 1.1rem; color: var(--text-primary);">$${product.buyItNowPrice.toFixed(2)}</strong>
                  </div>
                  <button class="btn btn-primary" id="btn-detail-buy-now">⚡ Buy It Now</button>
                </div>
              </div>
            `}

            <!-- Bidding History Stream -->
            <div style="flex: 1; display: flex; flex-direction: column;">
              <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem;">Bidding History (${product.bidsCount})</h4>
              <div style="max-height: 160px; overflow-y: auto; background: var(--bg-secondary); border-radius: var(--radius-md); padding: 0.75rem; border: 1px solid var(--border-color);">
                ${product.biddingHistory.length === 0 ? `
                  <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center;">No bids placed yet. Be the first!</div>
                ` : `
                  <table style="width: 100%; font-size: 0.8rem; text-align: left; border-collapse: collapse;">
                    <thead>
                      <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-color);">
                        <th style="padding-bottom: 0.35rem;">Bidder</th>
                        <th style="padding-bottom: 0.35rem;">Amount</th>
                        <th style="padding-bottom: 0.35rem; text-align: right;">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${product.biddingHistory.map(b => `
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); ${b.bidder === 'You' ? 'font-weight: 700; color: var(--brand-blue);' : ''}">
                          <td style="padding: 0.35rem 0;">${b.bidder === 'You' ? '⭐ You' : b.bidder}</td>
                          <td style="padding: 0.35rem 0;">$${b.amount.toFixed(2)}</td>
                          <td style="padding: 0.35rem 0; text-align: right; color: var(--text-muted);">${new Date(b.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  // Event Handlers
  const modal = container.querySelector('#product-detail-modal');
  const closeBtn = container.querySelector('#modal-close-btn');

  const close = () => {
    container.innerHTML = '';
    onClose();
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  // Gallery Thumbnail Switcher
  const mainImg = container.querySelector('#main-detail-img');
  const thumbs = container.querySelectorAll('.thumb-img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.src;
      thumbs.forEach(t => t.style.borderColor = 'var(--border-color)');
      thumb.style.borderColor = 'var(--brand-blue)';
    });
  });

  // Bid Form Submissions
  const customBidInput = container.querySelector('#custom-bid-input');
  const submitBidBtn = container.querySelector('#btn-submit-bid');
  const detailBuyNowBtn = container.querySelector('#btn-detail-buy-now');

  if (submitBidBtn) {
    submitBidBtn.addEventListener('click', () => {
      const val = parseFloat(customBidInput.value);
      onPlaceBid(productId, val);
    });
  }

  if (detailBuyNowBtn) {
    detailBuyNowBtn.addEventListener('click', () => {
      onBuyNow(productId);
      close();
    });
  }

  // Quick increment buttons
  container.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const add = parseFloat(btn.dataset.add);
      const currentVal = parseFloat(customBidInput.value) || minRequiredBid;
      customBidInput.value = (currentVal + add).toFixed(2);
    });
  });
}
