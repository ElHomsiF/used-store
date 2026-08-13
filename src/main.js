/* ==========================================================================
   Main Application Entry Point & State Orchestrator
   ========================================================================== */

import './style.css';
import { auctionEngine } from './services/auctionEngine.js';
import { renderHeader } from './components/Header.js';
import { renderCategoryNav } from './components/CategoryNav.js';
import { renderHeroBanner } from './components/HeroBanner.js';
import { renderFilterBar } from './components/FilterBar.js';
import { createProductCardElement, updateProductCardTimer } from './components/ProductCard.js';
import { renderProductDetailModal } from './components/ProductDetailModal.js';
import { renderSellerStudioModal } from './components/SellerStudioModal.js';
import { renderWatchlistCartDrawer } from './components/WatchlistCartDrawer.js';
import { renderCheckoutModal } from './components/CheckoutModal.js';
import { BiddingFrenzyGame } from './components/BiddingFrenzyGame.js';

class App {
  constructor() {
    this.user = { name: 'Alex' };
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.activeCondition = 'all';
    this.isWatchlistOnly = false;
    this.currentSort = 'ending-soon';
    this.theme = localStorage.getItem('ebazaar_theme') || 'light';
    this.isArcadeMode = false;

    this.arcadeGame = null;
    this.cardElements = new Map();
  }

  init() {
    // Set theme
    document.documentElement.setAttribute('data-theme', this.theme);

    // Initialize Auction Engine
    auctionEngine.init();

    // Render Initial UI Shell
    this.renderAll();

    // Subscribe to Auction Engine events
    auctionEngine.subscribe((eventType, data) => this.handleEngineEvent(eventType, data));
  }

  renderAll() {
    this.renderHeader();
    this.renderCategoryNav();

    if (this.isArcadeMode) {
      document.getElementById('hero-banner').classList.add('hidden');
      document.getElementById('marketplace-section').classList.add('hidden');
      
      const arcadeSec = document.getElementById('bidding-arcade-section');
      arcadeSec.classList.remove('hidden');
      
      if (!this.arcadeGame) {
        this.arcadeGame = new BiddingFrenzyGame(arcadeSec, {
          onExit: () => this.toggleArcadeMode(false)
        });
        this.arcadeGame.start();
      }
    } else {
      if (this.arcadeGame) {
        this.arcadeGame.stopTimers();
        this.arcadeGame = null;
      }

      document.getElementById('bidding-arcade-section').classList.add('hidden');
      document.getElementById('hero-banner').classList.remove('hidden');
      document.getElementById('marketplace-section').classList.remove('hidden');

      this.renderHero();
      this.renderFilterBar();
      this.renderProductGrid();
    }
  }

  renderHeader() {
    const container = document.getElementById('main-header');
    renderHeader(container, {
      user: this.user,
      watchlistCount: auctionEngine.watchlist.size,
      cartCount: auctionEngine.cart.length,
      notificationCount: auctionEngine.notifications.length,
      activeCategory: this.activeCategory,
      onSearch: (query, cat) => {
        this.searchQuery = query;
        this.activeCategory = cat;
        this.renderAll();
      },
      onCategoryChange: (cat) => {
        this.activeCategory = cat;
        this.renderAll();
      },
      onOpenWatchlist: () => this.openDrawer('watchlist'),
      onOpenCart: () => this.openDrawer('cart'),
      onOpenSellerStudio: () => this.openSellerStudio(),
      onToggleTheme: () => this.toggleTheme(),
      onToggleArcadeMode: () => this.toggleArcadeMode(!this.isArcadeMode),
      isArcadeMode: this.isArcadeMode,
      currentTheme: this.theme
    });
  }

  renderCategoryNav() {
    const container = document.getElementById('category-nav');
    renderCategoryNav(container, {
      activeCategory: this.activeCategory,
      onSelectCategory: (cat) => {
        this.activeCategory = cat;
        this.renderAll();
      }
    });
  }

  renderHero() {
    const container = document.getElementById('hero-banner');
    renderHeroBanner(container, {
      onOpenArcade: () => this.toggleArcadeMode(true),
      onOpenSellerStudio: () => this.openSellerStudio()
    });
  }

  renderFilterBar() {
    const container = document.getElementById('filter-bar');
    const products = this.getFilteredProducts();

    renderFilterBar(container, {
      activeCondition: this.activeCondition,
      isWatchlistOnly: this.isWatchlistOnly,
      currentSort: this.currentSort,
      totalResults: products.length,
      onConditionChange: (cond) => {
        this.activeCondition = cond;
        this.renderFilterBar();
        this.renderProductGrid();
      },
      onWatchlistToggle: () => {
        this.isWatchlistOnly = !this.isWatchlistOnly;
        this.renderFilterBar();
        this.renderProductGrid();
      },
      onSortChange: (sort) => {
        this.currentSort = sort;
        this.renderProductGrid();
      }
    });
  }

  getFilteredProducts() {
    let products = auctionEngine.getProducts({
      category: this.activeCategory,
      search: this.searchQuery,
      watchlistOnly: this.isWatchlistOnly,
      sort: this.currentSort
    });

    if (this.activeCondition !== 'all') {
      products = products.filter(p => p.condition.includes(this.activeCondition));
    }
    return products;
  }

  renderProductGrid() {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    grid.innerHTML = '';
    this.cardElements.clear();

    const products = this.getFilteredProducts();

    if (products.length === 0) {
      emptyState.classList.remove('hidden');
      emptyState.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">No Listings Match Your Search</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your filters, searching for something else, or creating a new listing!</p>
        <button class="btn btn-primary" id="btn-empty-reset" style="margin-top: 1.25rem;">Reset Filters</button>
      `;

      emptyState.querySelector('#btn-empty-reset').addEventListener('click', () => {
        this.searchQuery = '';
        this.activeCategory = 'all';
        this.activeCondition = 'all';
        this.isWatchlistOnly = false;
        this.renderAll();
      });
      return;
    }

    emptyState.classList.add('hidden');

    products.forEach(product => {
      const isWatched = auctionEngine.watchlist.has(product.id);
      const card = createProductCardElement(product, {
        isWatched,
        onQuickBid: (id) => this.handleQuickBid(id),
        onBuyNow: (id) => this.handleBuyNow(id),
        onViewDetails: (id) => this.openProductDetail(id),
        onToggleWatch: (id) => {
          auctionEngine.toggleWatchlist(id);
          this.renderHeader();
          this.renderProductGrid();
        }
      });

      this.cardElements.set(product.id, card);
      grid.appendChild(card);
    });
  }

  handleQuickBid(productId) {
    const res = auctionEngine.placeUserBid(productId);
    if (!res.success) {
      this.showToast(res.error, 'danger');
    }
  }

  handleBuyNow(productId) {
    const res = auctionEngine.buyItNow(productId);
    if (res.success) {
      this.openDrawer('cart');
    } else {
      this.showToast(res.error, 'danger');
    }
  }

  openProductDetail(productId) {
    const container = document.getElementById('modal-container');
    const isWatched = auctionEngine.watchlist.has(productId);

    renderProductDetailModal(container, productId, {
      onClose: () => {},
      onPlaceBid: (id, amount) => {
        const res = auctionEngine.placeUserBid(id, amount);
        if (res.success) {
          this.openProductDetail(id); // refresh modal view
        } else {
          this.showToast(res.error, 'danger');
        }
      },
      onBuyNow: (id) => this.handleBuyNow(id),
      onToggleWatch: (id) => {
        auctionEngine.toggleWatchlist(id);
        this.openProductDetail(id);
      },
      isWatched
    });
  }

  openSellerStudio() {
    const container = document.getElementById('modal-container');
    renderSellerStudioModal(container, {
      onClose: () => {},
      onSubmitListing: (data) => {
        const newProd = auctionEngine.addNewProduct(data);
        this.showToast(`Listing "${newProd.title.substring(0, 30)}..." published!`, 'success');
        this.renderAll();
      }
    });
  }

  openDrawer(tab = 'cart') {
    const container = document.getElementById('drawer-container');
    renderWatchlistCartDrawer(container, {
      activeTab: tab,
      onClose: () => {},
      onProceedCheckout: () => this.openCheckoutModal(),
      onViewDetails: (id) => this.openProductDetail(id)
    });
  }

  openCheckoutModal() {
    const container = document.getElementById('modal-container');
    renderCheckoutModal(container, {
      onClose: () => {},
      onOrderPlaced: (total) => {
        this.showToast(`Order confirmed! Thank you for buying on eBazaar.`, 'success');
        this.renderHeader();
      }
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('ebazaar_theme', this.theme);
    this.renderHeader();
  }

  toggleArcadeMode(enable) {
    this.isArcadeMode = enable;
    this.renderAll();
  }

  handleEngineEvent(eventType, data) {
    if (eventType === 'tick') {
      // Fast DOM update for timer countdowns without re-creating cards
      auctionEngine.products.forEach(product => {
        const card = this.cardElements.get(product.id);
        if (card) {
          updateProductCardTimer(card, product.endsAt);
        }
      });
    } else if (eventType === 'bot_bid' || eventType === 'user_bid' || eventType === 'product_added') {
      this.renderHeader();
      this.renderProductGrid();
    } else if (eventType === 'notification') {
      this.showToast(data.message, data.type);
      this.renderHeader();
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="font-size: 1.25rem;">
        ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️'}
      </div>
      <div style="flex: 1; font-size: 0.85rem; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
