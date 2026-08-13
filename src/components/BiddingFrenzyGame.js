/* ==========================================================================
   BiddingFrenzyGame Component - Arcade Live Bidding Frenzy Mode
   ========================================================================== */

import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects.js';

export class BiddingFrenzyGame {
  constructor(container, { onExit }) {
    this.container = container;
    this.onExit = onExit;

    this.balance = 5000.00;
    this.score = 0;
    this.streak = 0;
    this.timeRemaining = 60; // 60 seconds round
    this.winsCount = 0;

    this.gameTimer = null;
    this.botTimer = null;
    this.isGameOver = false;

    this.items = [
      { id: 'arc-1', title: 'Rare Vintage Arcade Cabinet 1982', marketValue: 2400, currentBid: 450, highBidder: 'Bot_Omega', endsAtSec: 12, img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
      { id: 'arc-2', title: 'Autographed Cyberpunk 2077 GPU', marketValue: 1800, currentBid: 320, highBidder: 'Gamer_X', endsAtSec: 8, img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
      { id: 'arc-3', title: 'Mint 1996 Holographic Charizard', marketValue: 3500, currentBid: 950, highBidder: 'PokeMaster', endsAtSec: 15, img: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=600&q=80' },
      { id: 'arc-4', title: 'Limited Edition Retro Mechanical Watch', marketValue: 1200, currentBid: 280, highBidder: 'Chronos', endsAtSec: 10, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' }
    ];

    this.botNames = ['Viper_Bot', 'Collector99', 'AuctionShark', 'BidMaster', 'Speedy_9'];
  }

  start() {
    this.isGameOver = false;
    this.renderShell();
    this.startTimers();
  }

  renderShell() {
    this.container.innerHTML = `
      <div class="arcade-header-bar">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="arcade-stat-box">
            <span class="arcade-stat-label">⏱️ Time Left</span>
            <span class="arcade-stat-value" id="arc-timer" style="color: ${this.timeRemaining < 15 ? '#ef4444' : '#38bdf8'};">${this.timeRemaining}s</span>
          </div>
          <div class="arcade-stat-box">
            <span class="arcade-stat-label">💰 Remaining Budget</span>
            <span class="arcade-stat-value" style="color: #10b981;">$${this.balance.toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div class="arcade-stat-box">
            <span class="arcade-stat-label">🏆 Total Score</span>
            <span class="arcade-stat-value" style="color: #f59e0b;" id="arc-score">${this.score} pts</span>
          </div>
          <div class="arcade-stat-box">
            <span class="arcade-stat-label">🔥 Win Streak</span>
            <span class="arcade-stat-value" style="color: #ec4899;" id="arc-streak">${this.streak}x</span>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-arc-exit">❌ Exit Arcade</button>
        </div>
      </div>

      <div id="arc-arena-container" class="arcade-arena-grid">
        ${this.items.map(item => this.renderItemCard(item)).join('')}
      </div>
    `;

    this.container.querySelector('#btn-arc-exit').addEventListener('click', () => {
      this.stopTimers();
      this.onExit();
    });

    this.attachBidHandlers();
  }

  renderItemCard(item) {
    const isUserHigh = item.highBidder === 'You';

    return `
      <div class="product-card" id="card-${item.id}" style="background: rgba(15, 23, 42, 0.85); border: 2px solid ${isUserHigh ? '#10b981' : '#3b82f6'}; border-radius: var(--radius-lg);">
        <div class="product-image-wrap">
          <img src="${item.img}" alt="${item.title}" class="product-img" />
          <span class="condition-badge" style="background: #3b82f6; color: white;">Est. Value: $${item.marketValue}</span>
          <span class="live-timer-badge urgent" style="right: 0.75rem; left: auto;">
            ⏱️ <span id="timer-${item.id}">${item.endsAtSec}s</span>
          </span>
        </div>

        <div class="product-body" style="padding: 1.25rem;">
          <h3 class="product-title" style="color: white; font-size: 1.1rem; font-weight: 700;">${item.title}</h3>
          
          <div style="margin: 0.75rem 0; padding: 0.75rem; background: rgba(30, 41, 59, 0.8); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
              <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Current Bid</span>
              <span style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 900; color: #38bdf8;" id="price-${item.id}">$${item.currentBid.toFixed(2)}</span>
            </div>
            <div style="font-size: 0.8rem; color: ${isUserHigh ? '#10b981' : '#f87171'}; font-weight: 700;" id="bidder-${item.id}">
              ${isUserHigh ? '👑 High Bidder: You' : `⚠️ High Bidder: ${item.highBidder}`}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <button class="btn btn-brand-blue btn-sm arc-bid-btn" data-id="${item.id}" data-add="25">
              + $25
            </button>
            <button class="btn btn-primary btn-sm arc-slam-btn" data-id="${item.id}">
              🔨 Slam Bid (+$50)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachBidHandlers() {
    this.container.querySelectorAll('.arc-bid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const add = parseFloat(btn.dataset.add);
        this.placeArcadeBid(id, add);
      });
    });

    this.container.querySelectorAll('.arc-slam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.placeArcadeBid(id, 50);
      });
    });
  }

  placeArcadeBid(itemId, addAmount) {
    if (this.isGameOver) return;
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const newBid = item.currentBid + addAmount;
    if (newBid > this.balance) {
      soundFx.playOutbidSound();
      return;
    }

    item.currentBid = newBid;
    item.highBidder = 'You';
    
    soundFx.playBidSound();
    this.updateCardUi(item);
  }

  updateCardUi(item) {
    const card = this.container.querySelector(`#card-${item.id}`);
    if (!card) return;

    const priceEl = card.querySelector(`#price-${item.id}`);
    const bidderEl = card.querySelector(`#bidder-${item.id}`);
    const isUserHigh = item.highBidder === 'You';

    card.style.borderColor = isUserHigh ? '#10b981' : '#3b82f6';
    if (priceEl) priceEl.textContent = `$${item.currentBid.toFixed(2)}`;
    if (bidderEl) {
      bidderEl.textContent = isUserHigh ? '👑 High Bidder: You' : `⚠️ High Bidder: ${item.highBidder}`;
      bidderEl.style.color = isUserHigh ? '#10b981' : '#f87171';
    }
  }

  startTimers() {
    // 1. Overall round timer & item countdowns
    this.gameTimer = setInterval(() => {
      this.timeRemaining -= 1;

      const timerEl = this.container.querySelector('#arc-timer');
      if (timerEl) {
        timerEl.textContent = `${this.timeRemaining}s`;
        if (this.timeRemaining < 15) timerEl.style.color = '#ef4444';
      }

      // Decrement item timers
      this.items.forEach(item => {
        item.endsAtSec -= 1;
        const itemTimerEl = this.container.querySelector(`#timer-${item.id}`);
        if (itemTimerEl) itemTimerEl.textContent = `${item.endsAtSec}s`;

        if (item.endsAtSec <= 0) {
          this.resolveArcadeAuction(item);
        }
      });

      if (this.timeRemaining <= 0) {
        this.finishGame();
      }
    }, 1000);

    // 2. AI Bot Counter-bidder logic (Triggers fast every 1.5s)
    this.botTimer = setInterval(() => {
      if (this.isGameOver) return;

      const userHighItems = this.items.filter(i => i.highBidder === 'You');
      if (userHighItems.length > 0 && Math.random() < 0.65) {
        const target = userHighItems[Math.floor(Math.random() * userHighItems.length)];
        const botName = this.botNames[Math.floor(Math.random() * this.botNames.length)];
        
        target.currentBid += Math.floor(Math.random() * 30) + 15;
        target.highBidder = botName;

        soundFx.playOutbidSound();
        this.updateCardUi(target);
      }
    }, 1500);
  }

  resolveArcadeAuction(item) {
    if (item.highBidder === 'You') {
      const profit = item.marketValue - item.currentBid;
      this.balance -= item.currentBid;
      this.score += Math.max(100, Math.floor(profit * 2));
      this.streak += 1;
      this.winsCount += 1;

      soundFx.playHammerWinSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }

    // Respawn new mystery item for continuous frenzy
    item.marketValue = Math.floor(Math.random() * 3000) + 1000;
    item.currentBid = Math.floor(item.marketValue * 0.25);
    item.highBidder = this.botNames[Math.floor(Math.random() * this.botNames.length)];
    item.endsAtSec = Math.floor(Math.random() * 10) + 8;

    this.updateCardUi(item);

    // Update scoreboard
    const scoreEl = this.container.querySelector('#arc-score');
    const streakEl = this.container.querySelector('#arc-streak');
    if (scoreEl) scoreEl.textContent = `${this.score} pts`;
    if (streakEl) streakEl.textContent = `${this.streak}x`;
  }

  stopTimers() {
    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.botTimer) clearInterval(this.botTimer);
  }

  finishGame() {
    this.isGameOver = true;
    this.stopTimers();

    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });

    this.container.innerHTML = `
      <div style="text-align: center; max-width: 520px; margin: 3rem auto; background: rgba(15, 23, 42, 0.9); padding: 3rem 2rem; border-radius: var(--radius-xl); border: 2px solid #38bdf8; box-shadow: 0 0 40px rgba(56, 189, 248, 0.3);">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🏆</div>
        <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: white;">Arcade Round Complete!</h2>
        
        <div style="margin: 1.5rem 0; padding: 1.25rem; background: rgba(30, 41, 59, 0.8); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem;">
            <span style="color: #94a3b8;">Final Score</span>
            <strong style="color: #f59e0b; font-size: 1.3rem;">${this.score} pts</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem;">
            <span style="color: #94a3b8;">Auctions Won</span>
            <strong style="color: #10b981;">${this.winsCount} items</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem;">
            <span style="color: #94a3b8;">Remaining Balance</span>
            <strong style="color: #38bdf8;">$${this.balance.toFixed(2)}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-outline" id="btn-arc-home" style="flex: 1; border-color: #64748b; color: white;">
            🏪 Return to Shop
          </button>
          <button class="btn btn-primary" id="btn-arc-restart" style="flex: 1.5;">
            🔄 Play Again
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-arc-home').addEventListener('click', () => {
      this.onExit();
    });

    this.container.querySelector('#btn-arc-restart').addEventListener('click', () => {
      this.balance = 5000.00;
      this.score = 0;
      this.streak = 0;
      this.timeRemaining = 60;
      this.winsCount = 0;
      this.start();
    });
  }
}
