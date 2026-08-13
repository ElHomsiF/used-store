/* ==========================================================================
   HeroBanner Component - Highlighting Top Deals & Bidding Arcade Launcher
   ========================================================================== */

export function renderHeroBanner(container, { onOpenArcade, onOpenSellerStudio }) {
  container.innerHTML = `
    <!-- Main Banner Card -->
    <div class="hero-main-card">
      <div class="hero-tag">⚡ Live Auction Spotlight</div>
      <h1 class="hero-title">Discover Rare Finds & Real-Time Auctions</h1>
      <p class="hero-description">
        Bid live against automated collector bots or list your high-value items with zero fee starter credits! Guaranteed buyer protection.
      </p>
      <div class="hero-actions-row">
        <button class="btn btn-primary" id="hero-btn-arcade">
          🔥 Launch Bidding Arcade
        </button>
        <button class="btn btn-secondary" id="hero-btn-sell">
          ✨ List Item for Sale
        </button>
      </div>
    </div>

    <!-- Side Arcade Mini Card -->
    <div class="hero-arcade-card">
      <div>
        <div class="arcade-card-badge">🎮 Bidding Arcade Mode</div>
        <h2 class="arcade-card-title">Outbid The AI Bots</h2>
        <ul class="arcade-features-list">
          <li>⏱️ Fast-paced 60s rounds</li>
          <li>💰 $5,000 starting budget</li>
          <li>🏆 Live profit leaderboard</li>
        </ul>
      </div>
      <button class="btn btn-primary btn-sm" id="hero-btn-play-now" style="width: 100%;">
        Play Arcade Frenzy
      </button>
    </div>
  `;

  container.querySelector('#hero-btn-arcade').addEventListener('click', onOpenArcade);
  container.querySelector('#hero-btn-play-now').addEventListener('click', onOpenArcade);
  container.querySelector('#hero-btn-sell').addEventListener('click', onOpenSellerStudio);
}
