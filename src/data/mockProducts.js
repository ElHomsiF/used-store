/* ==========================================================================
   Mock Products Data for eBazaar Marketplace
   ========================================================================== */

export const INITIAL_PRODUCTS = [
  {
    id: "item-101",
    title: "Sony PlayStation 5 Pro Console - Limited 30th Anniversary Edition (Factory Sealed)",
    category: "Electronics",
    condition: "Brand New",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 699.99,
    currentBid: 950.00,
    buyItNowPrice: 1299.99,
    bidsCount: 14,
    reserveMet: true,
    freeShipping: true,
    seller: {
      name: "CyberVault_Deals",
      rating: 99.8,
      salesCount: 1420,
      verifiedSeller: true
    },
    endsAt: Date.now() + 180 * 1000, // 3 mins from load for high urgency testing
    description: "Brand new, unopened factory sealed Sony PS5 Pro 30th Anniversary Limited Collector Edition. Includes dual sense controller, vertical stand, and exclusive certificate of authenticity.",
    biddingHistory: [
      { bidder: "g***9", amount: 950.00, time: Date.now() - 45000 },
      { bidder: "k***2", amount: 920.00, time: Date.now() - 120000 },
      { bidder: "b***4", amount: 850.00, time: Date.now() - 300000 }
    ],
    isFeatured: true
  },
  {
    id: "item-102",
    title: "Air Jordan 1 Retro High OG 'Chicago 1985' Vintage - Men Size 10.5",
    category: "Fashion",
    condition: "Used - Very Good",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 1200.00,
    currentBid: 2450.00,
    buyItNowPrice: 3100.00,
    bidsCount: 22,
    reserveMet: true,
    freeShipping: false,
    seller: {
      name: "SneakerGrail_HQ",
      rating: 100.0,
      salesCount: 840,
      verifiedSeller: true
    },
    endsAt: Date.now() + 420 * 1000, // 7 mins
    description: "Authentic original 1985 Nike Air Jordan 1 Chicago colorway. Verified by eBay Authenticity Guarantee. Comes with original box and extra laces.",
    biddingHistory: [
      { bidder: "x***1", amount: 2450.00, time: Date.now() - 90000 },
      { bidder: "m***8", amount: 2300.00, time: Date.now() - 240000 }
    ],
    isFeatured: true
  },
  {
    id: "item-103",
    title: "Charizard 1st Edition Shadowless Holographic Pokémon Card #4/102 (PSA 9 Mint)",
    category: "Collectibles",
    condition: "Certified Refurbished",
    imageUrl: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 5000.00,
    currentBid: 8900.00,
    buyItNowPrice: 12500.00,
    bidsCount: 31,
    reserveMet: true,
    freeShipping: true,
    seller: {
      name: "ApexGradedCards",
      rating: 99.5,
      salesCount: 3200,
      verifiedSeller: true
    },
    endsAt: Date.now() + 600 * 1000, // 10 mins
    description: "Iconic 1999 Base Set 1st Edition Shadowless Charizard Holo. Graded PSA 9 MINT. Encased in tamper-proof slab.",
    biddingHistory: [
      { bidder: "p***0", amount: 8900.00, time: Date.now() - 150000 },
      { bidder: "r***7", amount: 8500.00, time: Date.now() - 400000 }
    ],
    isFeatured: true
  },
  {
    id: "item-104",
    title: "Apple MacBook Pro 16\" M3 Max 64GB RAM 2TB SSD Space Black",
    category: "Electronics",
    condition: "Brand New",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 2200.00,
    currentBid: 2800.00,
    buyItNowPrice: 3499.00,
    bidsCount: 8,
    reserveMet: false,
    freeShipping: true,
    seller: {
      name: "TechOutlet_Direct",
      rating: 98.9,
      salesCount: 15400,
      verifiedSeller: true
    },
    endsAt: Date.now() + 900 * 1000, // 15 mins
    description: "Brand new unopened Apple MacBook Pro 16 inch powered by M3 Max chip with 16-core CPU, 40-core GPU, 64GB Unified Memory, and 2TB SSD storage.",
    biddingHistory: [
      { bidder: "a***5", amount: 2800.00, time: Date.now() - 60000 }
    ],
    isFeatured: false
  },
  {
    id: "item-105",
    title: "Vintage Rolex Submariner Date Reference 16610 - Circa 1998 (With Papers)",
    category: "Collectibles",
    condition: "Used - Excellent",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 6500.00,
    currentBid: 8200.00,
    buyItNowPrice: 9800.00,
    bidsCount: 19,
    reserveMet: true,
    freeShipping: true,
    seller: {
      name: "GenevaWatchHouse",
      rating: 100.0,
      salesCount: 480,
      verifiedSeller: true
    },
    endsAt: Date.now() + 1200 * 1000, // 20 mins
    description: "Classic Rolex Submariner Date ref 16610 in stainless steel. Serviced in 2024, keeping precision time (+1s/day). Includes box and punch papers.",
    biddingHistory: [
      { bidder: "w***3", amount: 8200.00, time: Date.now() - 180000 }
    ],
    isFeatured: false
  },
  {
    id: "item-106",
    title: "Custom Custom Gasket-Mount Wireless Mechanical Keyboard (Lubed Holy Pandas)",
    category: "Electronics",
    condition: "Brand New",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 120.00,
    currentBid: 185.00,
    buyItNowPrice: 249.99,
    bidsCount: 6,
    reserveMet: true,
    freeShipping: true,
    seller: {
      name: "CustomClacks_Studio",
      rating: 99.2,
      salesCount: 310,
      verifiedSeller: false
    },
    endsAt: Date.now() + 240 * 1000, // 4 mins
    description: "Handcrafted CNC aluminum keyboard with brass weight plate, hand-lubed Krytox 205g0 Holy Panda switches, and PBT double-shot keycaps.",
    biddingHistory: [
      { bidder: "c***8", amount: 185.00, time: Date.now() - 30000 }
    ],
    isFeatured: false
  },
  {
    id: "item-107",
    title: "Tesla Cyberquad for Kids - Electric 36V ATV (Brand New Sealed Box)",
    category: "Motors",
    condition: "Brand New",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 1100.00,
    currentBid: 1650.00,
    buyItNowPrice: 2200.00,
    bidsCount: 12,
    reserveMet: true,
    freeShipping: false,
    seller: {
      name: "EV_Gear_Mart",
      rating: 98.4,
      salesCount: 620,
      verifiedSeller: true
    },
    endsAt: Date.now() + 1500 * 1000,
    description: "Official Tesla Cyberquad featuring full steel frame, cushioned seat, adjustable suspension, and rear disc braking.",
    biddingHistory: [
      { bidder: "t***9", amount: 1650.00, time: Date.now() - 360000 }
    ],
    isFeatured: false
  },
  {
    id: "item-108",
    title: "Hermès Birkin 30 Bag in Black Togo Leather with Gold Hardware",
    category: "Fashion",
    condition: "Brand New",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    startingBid: 14000.00,
    currentBid: 18200.00,
    buyItNowPrice: 23500.00,
    bidsCount: 27,
    reserveMet: true,
    freeShipping: true,
    seller: {
      name: "CoutureLuxe_Paris",
      rating: 100.0,
      salesCount: 290,
      verifiedSeller: true
    },
    endsAt: Date.now() + 1800 * 1000,
    description: "Holy grail Hermès Birkin 30 in rich Black Togo leather with gleaming 18k gold-plated hardware. Includes raincoat, lock, key, and receipt.",
    biddingHistory: [
      { bidder: "h***3", amount: 18200.00, time: Date.now() - 50000 }
    ],
    isFeatured: true
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "grid" },
  { id: "Electronics", name: "Electronics", icon: "laptop" },
  { id: "Fashion", name: "Fashion & Sneakers", icon: "shirt" },
  { id: "Collectibles", name: "Collectibles & Cards", icon: "gem" },
  { id: "Motors", name: "Motors & Auto", icon: "car" },
  { id: "Home & Garden", name: "Home & Garden", icon: "home" },
  { id: "Deals", name: "Super Deals", icon: "zap" }
];
