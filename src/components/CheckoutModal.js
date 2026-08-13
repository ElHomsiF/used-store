/* ==========================================================================
   CheckoutModal Component - Checkout & Order Celebration
   ========================================================================== */

import confetti from 'canvas-confetti';
import { auctionEngine } from '../services/auctionEngine.js';

export function renderCheckoutModal(container, { onClose, onOrderPlaced }) {
  const items = auctionEngine.cart;
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08;
  const shipping = items.some(i => !i.freeShipping) ? 14.99 : 0.00;
  const grandTotal = subtotal + tax + shipping;

  const modalHtml = `
    <div class="modal-overlay" id="checkout-modal">
      <div class="modal-card" style="max-width: 720px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">🔒</span>
            <h3 class="modal-title">eBazaar Secure Checkout</h3>
          </div>
          <button class="modal-close-btn" id="checkout-close-btn">&times;</button>
        </div>

        <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- Left Column: Shipping & Payment Form -->
          <form id="checkout-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.35rem;">1. Shipping Address</h4>
            
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Full Name *</label>
              <input type="text" required value="Alex Mercer" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Street Address *</label>
              <input type="text" required value="742 Evergreen Terrace" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">City *</label>
                <input type="text" required value="Springfield" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">ZIP Code *</label>
                <input type="text" required value="97477" style="width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface);" />
              </div>
            </div>

            <h4 style="font-size: 0.95rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.35rem; margin-top: 0.5rem;">2. Payment Method</h4>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: var(--bg-secondary);">
                <input type="radio" name="payment" value="ebazaar" checked />
                <span>💳 <strong>eBazaar Pay</strong> (Instant Balance)</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: var(--bg-secondary);">
                <input type="radio" name="payment" value="card" />
                <span>💳 Credit / Debit Card</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: var(--bg-secondary);">
                <input type="radio" name="payment" value="paypal" />
                <span>🅿️ PayPal</span>
              </label>
            </div>
          </form>

          <!-- Right Column: Order Summary & Place Order -->
          <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Order Summary (${items.length} items)</h4>

            <div style="flex: 1; overflow-y: auto; max-height: 180px; margin-bottom: 1rem;">
              ${items.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 0.35rem 0; border-bottom: 1px dashed var(--border-color);">
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${item.title}</span>
                  <strong>$${item.price.toFixed(2)}</strong>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Items Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Estimated Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Shipping</span>
                <span>${shipping === 0 ? '<strong style="color: var(--accent-success);">FREE</strong>' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; border-top: 2px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem;">
                <span>Total</span>
                <span style="color: var(--brand-blue);">$${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button class="btn btn-primary" id="btn-place-order" style="width: 100%; margin-top: 1.25rem;">
              🎉 Complete Order ($${grandTotal.toFixed(2)})
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = modalHtml;

  const modal = container.querySelector('#checkout-modal');
  const closeBtn = container.querySelector('#checkout-close-btn');
  const placeOrderBtn = container.querySelector('#btn-place-order');

  const close = () => {
    container.innerHTML = '';
    onClose();
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Trigger Celebration Confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Clear cart and notify
    auctionEngine.cart = [];
    auctionEngine.save();
    auctionEngine.notifySubscribers('cart_updated');

    onOrderPlaced(grandTotal);
    close();
  });
}
