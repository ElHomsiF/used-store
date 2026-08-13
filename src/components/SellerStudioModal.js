/* ==========================================================================
   SellerStudioModal Component - List New Item for Sale Wizard
   ========================================================================== */

import { CATEGORIES } from '../data/mockProducts.js';

const PRESET_IMAGES = [
  { name: "Electronics / Tech", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" },
  { name: "Sneakers / Apparel", url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" },
  { name: "Gaming Console", url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80" },
  { name: "Luxury Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  { name: "Vintage Collectible", url: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80" }
];

export function renderSellerStudioModal(container, { onClose, onSubmitListing }) {
  const modalHtml = `
    <div class="modal-overlay" id="seller-studio-modal">
      <div class="modal-card" style="max-width: 640px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✨</span>
            <h3 class="modal-title">Create New eBazaar Listing</h3>
          </div>
          <button class="modal-close-btn" id="seller-modal-close">&times;</button>
        </div>

        <form id="seller-form" class="modal-body" style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Item Title -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Item Title *</label>
            <input 
              type="text" 
              name="title" 
              required 
              placeholder="e.g. Sony Wireless Noise-Canceling Headphones WH-1000XM5" 
              style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);"
            />
          </div>

          <!-- Category & Condition Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Category *</label>
              <select name="category" required style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);">
                ${CATEGORIES.filter(c => c.id !== 'all').map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Condition *</label>
              <select name="condition" required style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);">
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Very Good">Used - Very Good</option>
                <option value="Certified Refurbished">Certified Refurbished</option>
              </select>
            </div>
          </div>

          <!-- Starting Price & Buy Now Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Starting Bid ($) *</label>
              <input 
                type="number" 
                name="startingBid" 
                min="0.99" 
                step="0.50" 
                value="49.99" 
                required 
                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);"
              />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Buy It Now Price ($)</label>
              <input 
                type="number" 
                name="buyItNowPrice" 
                min="1.00" 
                step="0.50" 
                value="99.99" 
                style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);"
              />
            </div>
          </div>

          <!-- Auction Duration -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Auction Duration *</label>
            <select name="durationMinutes" style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);">
              <option value="3">3 Minutes (Fast Test)</option>
              <option value="5" selected>5 Minutes</option>
              <option value="15">15 Minutes</option>
              <option value="60">1 Hour</option>
            </select>
          </div>

          <!-- Image Selector Presets -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Item Photo Preset</label>
            <select id="preset-img-select" style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); margin-bottom: 0.5rem;">
              ${PRESET_IMAGES.map(p => `<option value="${p.url}">${p.name}</option>`).join('')}
            </select>
            <input 
              type="url" 
              name="imageUrl" 
              id="custom-img-url" 
              value="${PRESET_IMAGES[0].url}" 
              placeholder="Or enter custom image URL..." 
              style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);"
            />
          </div>

          <!-- Description -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Item Description</label>
            <textarea 
              name="description" 
              rows="3" 
              placeholder="Describe your item's condition, features, packaging..." 
              style="width: 100%; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);"
            >Brand new item in pristine condition. Fast shipping guaranteed.</textarea>
          </div>

          <!-- Submit Button -->
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
            <button type="button" class="btn btn-outline" id="btn-cancel-seller" style="flex: 1;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex: 2;">🚀 Publish Listing</button>
          </div>
        </form>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  const modal = container.querySelector('#seller-studio-modal');
  const closeBtn = container.querySelector('#seller-modal-close');
  const cancelBtn = container.querySelector('#btn-cancel-seller');
  const form = container.querySelector('#seller-form');
  const presetSelect = container.querySelector('#preset-img-select');
  const customUrlInput = container.querySelector('#custom-img-url');

  const close = () => {
    container.innerHTML = '';
    onClose();
  };

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);

  presetSelect.addEventListener('change', () => {
    customUrlInput.value = presetSelect.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    onSubmitListing(data);
    close();
  });
}
