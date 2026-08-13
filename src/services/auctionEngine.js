/* ==========================================================================
   Auction Engine Service - Real-Time Bidding & AI Bot Sim
   ========================================================================== */

import { INITIAL_PRODUCTS } from '../data/mockProducts.js';
import { soundFx } from './soundEffects.js';

class AuctionEngine {
  constructor() {
    this.products = [];
    this.watchlist = new Set();
    this.cart = [];
    this.notifications = [];
    this.timerId = null;
    this.subscribers = new Set();
    this.userBalance = 5000.00;

    // AI Bot Bidders Database
    this.botNames = ['b***4', 'x***9', 'm***2', 's***7', 'k***1', 'v***8', 'z***5', 'r***0'];
  }

  init() {
    // Load from localStorage or initialize with mock data
    const savedProducts = localStorage.getItem('ebazaar_products');
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts);
      } catch (e) {
        this.products = [...INITIAL_PRODUCTS];
      }
    } else {
      this.products = [...INITIAL_PRODUCTS];
    }

    const savedWatchlist = localStorage.getItem('ebazaar_watchlist');
    if (savedWatchlist) {
      try {
        this.watchlist = new Set(JSON.parse(savedWatchlist));
      } catch (e) {
        this.watchlist = new Set();
      }
    }

    const savedCart = localStorage.getItem('ebazaar_cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }

    // Start Real-Time Ticker
    this.startTicker();
  }

  save() {
    localStorage.setItem('ebazaar_products', JSON.stringify(this.products));
    localStorage.setItem('ebazaar_watchlist', JSON.stringify(Array.from(this.watchlist)));
    localStorage.setItem('ebazaar_cart', JSON.stringify(this.cart));
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(eventType, data = {}) {
    this.save();
    this.subscribers.forEach(cb => cb(eventType, data));
  }

  startTicker() {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      const now = Date.now();
      let stateChanged = false;

      // 1. Update countdowns & check finished auctions
      this.products.forEach(product => {
        if (!product.isEnded && product.endsAt <= now) {
          product.isEnded = true;
          stateChanged = true;
          this.handleAuctionEnded(product);
        }
      });

      // 2. Random AI Bot Bidder logic (Occurs ~20% of tick cycles)
      if (Math.random() < 0.22) {
        const activeAuctions = this.products.filter(p => !p.isEnded && (p.endsAt - now > 5000));
        if (activeAuctions.length > 0) {
          const target = activeAuctions[Math.floor(Math.random() * activeAuctions.length)];
          this.simulateBotBid(target);
          stateChanged = true;
        }
      }

      // Always notify tick for live countdown clock UI refresh
      this.notifySubscribers('tick', { now });
    }, 1000);
  }

  simulateBotBid(product) {
    const minIncrement = this.calculateMinIncrement(product.currentBid);
    const botBidAmount = +(product.currentBid + minIncrement).toFixed(2);
    const randomBot = this.botNames[Math.floor(Math.random() * this.botNames.length)];

    const lastBidder = product.biddingHistory[0]?.bidder;
    
    product.currentBid = botBidAmount;
    product.bidsCount += 1;
    product.biddingHistory.unshift({
      bidder: randomBot,
      amount: botBidAmount,
      time: Date.now()
    });

    if (product.currentBid >= (product.startingBid * 1.25)) {
      product.reserveMet = true;
    }

    // Check if user was outbid on this item!
    if (lastBidder === 'You') {
      soundFx.playOutbidSound();
      this.addNotification({
        id: 'outbid-' + Date.now(),
        type: 'warning',
        title: 'You were outbid!',
        message: `A new bid of $${botBidAmount.toFixed(2)} was placed on "${product.title.substring(0, 30)}..."`,
        productId: product.id,
        time: Date.now()
      });
    }

    this.notifySubscribers('bot_bid', { productId: product.id, amount: botBidAmount, bot: randomBot });
  }

  calculateMinIncrement(currentPrice) {
    if (currentPrice < 15) return 0.50;
    if (currentPrice < 50) return 1.00;
    if (currentPrice < 250) return 5.00;
    if (currentPrice < 1000) return 15.00;
    if (currentPrice < 5000) return 50.00;
    return 100.00;
  }

  placeUserBid(productId, customAmount = null) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.isEnded) {
      return { success: false, error: 'Auction has ended or is unavailable.' };
    }

    const minIncrement = this.calculateMinIncrement(product.currentBid);
    const minRequired = +(product.currentBid + minIncrement).toFixed(2);
    const bidAmount = customAmount !== null ? +customAmount : minRequired;

    if (bidAmount < minRequired) {
      return { success: false, error: `Minimum bid required is $${minRequired.toFixed(2)}` };
    }

    product.currentBid = bidAmount;
    product.bidsCount += 1;
    product.reserveMet = true;
    product.biddingHistory.unshift({
      bidder: 'You',
      amount: bidAmount,
      time: Date.now()
    });

    // Auto-add to watchlist if not already
    this.watchlist.add(productId);

    soundFx.playBidSound();
    
    this.addNotification({
      id: 'bid-placed-' + Date.now(),
      type: 'success',
      title: 'High Bidder!',
      message: `You are now the highest bidder at $${bidAmount.toFixed(2)} on "${product.title.substring(0, 30)}..."`,
      productId: product.id,
      time: Date.now()
    });

    this.notifySubscribers('user_bid', { productId, amount: bidAmount });
    return { success: true, amount: bidAmount };
  }

  buyItNow(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.isEnded) {
      return { success: false, error: 'Item is no longer available.' };
    }

    product.isEnded = true;
    product.winner = 'You';
    
    // Add to cart
    this.addToCart(product, product.buyItNowPrice);

    soundFx.playHammerWinSound();

    this.addNotification({
      id: 'buy-now-' + Date.now(),
      type: 'success',
      title: 'Item Purchased!',
      message: `You purchased "${product.title.substring(0, 35)}..." for $${product.buyItNowPrice.toFixed(2)}!`,
      productId: product.id,
      time: Date.now()
    });

    this.notifySubscribers('buy_now', { productId });
    return { success: true };
  }

  handleAuctionEnded(product) {
    const winningBid = product.biddingHistory[0];
    if (winningBid && winningBid.bidder === 'You') {
      product.winner = 'You';
      this.addToCart(product, product.currentBid);
      soundFx.playHammerWinSound();
      
      this.addNotification({
        id: 'win-' + Date.now(),
        type: 'success',
        title: 'Auction Won! 🏆',
        message: `Congratulations! You won "${product.title.substring(0, 30)}..." for $${product.currentBid.toFixed(2)}!`,
        productId: product.id,
        time: Date.now()
      });
    }
  }

  addToCart(product, finalPrice) {
    const existing = this.cart.find(c => c.id === product.id);
    if (!existing) {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: finalPrice,
        imageUrl: product.imageUrl,
        freeShipping: product.freeShipping,
        addedAt: Date.now()
      });
      this.notifySubscribers('cart_updated');
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(c => c.id !== productId);
    this.notifySubscribers('cart_updated');
  }

  toggleWatchlist(productId) {
    if (this.watchlist.has(productId)) {
      this.watchlist.delete(productId);
    } else {
      this.watchlist.add(productId);
    }
    soundFx.playClickSound();
    this.notifySubscribers('watchlist_updated', { productId });
  }

  addNewProduct(newProductData) {
    const newProduct = {
      id: 'item-' + (100 + this.products.length + 1) + '-' + Math.floor(Math.random() * 1000),
      title: newProductData.title,
      category: newProductData.category,
      condition: newProductData.condition || 'Brand New',
      imageUrl: newProductData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      startingBid: +newProductData.startingBid,
      currentBid: +newProductData.startingBid,
      buyItNowPrice: newProductData.buyItNowPrice ? +newProductData.buyItNowPrice : +newProductData.startingBid * 1.5,
      bidsCount: 0,
      reserveMet: true,
      freeShipping: newProductData.freeShipping ?? true,
      seller: {
        name: 'You (Seller)',
        rating: 100.0,
        salesCount: 1,
        verifiedSeller: true
      },
      endsAt: Date.now() + (newProductData.durationMinutes || 10) * 60 * 1000,
      description: newProductData.description || 'Quality item listed via eBazaar Seller Studio.',
      biddingHistory: [],
      isFeatured: false
    };

    this.products.unshift(newProduct);
    this.notifySubscribers('product_added', { product: newProduct });
    return newProduct;
  }

  addNotification(notif) {
    this.notifications.unshift(notif);
    if (this.notifications.length > 20) this.notifications.pop();
    this.notifySubscribers('notification', notif);
  }

  getProducts(filter = {}) {
    let result = [...this.products];
    if (filter.category && filter.category !== 'all') {
      result = result.filter(p => p.category === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filter.watchlistOnly) {
      result = result.filter(p => this.watchlist.has(p.id));
    }
    if (filter.sort === 'price-low') {
      result.sort((a, b) => a.currentBid - b.currentBid);
    } else if (filter.sort === 'price-high') {
      result.sort((a, b) => b.currentBid - a.currentBid);
    } else if (filter.sort === 'ending-soon') {
      result.sort((a, b) => a.endsAt - b.endsAt);
    } else if (filter.sort === 'most-bids') {
      result.sort((a, b) => b.bidsCount - a.bidsCount);
    }
    return result;
  }

  formatTimeLeft(endsAt) {
    const diff = endsAt - Date.now();
    if (diff <= 0) return { string: 'Ended', isUrgent: false, isEnded: true };

    const totalSecs = Math.floor(diff / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hours = Math.floor(mins / 60);

    const isUrgent = totalSecs < 180; // less than 3 minutes left

    if (hours > 0) {
      const remainingMins = mins % 60;
      return { string: `${hours}h ${remainingMins}m`, isUrgent: false, isEnded: false };
    }

    const mStr = String(mins).padStart(2, '0');
    const sStr = String(secs).padStart(2, '0');
    return { string: `${mStr}m ${sStr}s`, isUrgent, isEnded: false };
  }
}

export const auctionEngine = new AuctionEngine();
