import { fetchProducts, delay } from './api.js';
import { createProductCard, renderSkeletonGrid, showToast } from './ui.js';
import store from './store.js';

const CTG = {
  electronics:     { icon: 'fa-microchip',      color: '#1a365d', img: '' },
  jewelery:        { icon: 'fa-gem',             color: '#5b2e6e', img: '' },
  "men's clothing": { icon: 'fa-vest',            color: '#2d5a27', img: '' },
  "women's clothing": { icon: 'fa-handbag',        color: '#7c2d4f', img: '' },
};

export default async function renderHomePage() {
  const app = document.getElementById('app');

  // Reset category images on each visit to avoid flash
  Object.keys(CTG).forEach(k => { CTG[k].img = ''; });
  app.innerHTML = `
    <section class="hero">
      <div class="hero__decor">
        <div class="hero__decor-circle"></div>
        <div class="hero__decor-circle hero__decor-circle--2"></div>
        <div class="hero__decor-circle hero__decor-circle--3"></div>
      </div>
      <div class="hero__products" id="heroProducts"></div>
      <div class="container">
        <div class="hero__content reveal-left">
          <span class="hero__tag">
            <i class="fas fa-star"></i>
            Premium Indian Marketplace
          </span>
          <h1 class="hero__title">Discover <span class="hero__title-accent">Authentic</span> Shopping</h1>
          <p class="hero__subtitle">Curated collections from India's finest artisans and brands. Premium quality, delivered to your doorstep.</p>
          <div class="hero__actions">
            <a href="#/products" class="hero__cta">
              Explore Collection <i class="fas fa-arrow-right"></i>
            </a>
            <a href="#/products?category=women's clothing" class="hero__cta-secondary">
              <i class="fas fa-fire"></i> Shop Trending
            </a>
          </div>
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-value">10K+</span>
              <span class="hero__stat-label">Products</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-value">5K+</span>
              <span class="hero__stat-label">Happy Customers</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-value">All India</span>
              <span class="hero__stat-label">Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title"><i class="fas fa-star" style="color:var(--rating)"></i> Featured Products</h2>
          <a href="#/products" class="section-header__link">
            View All <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="product-grid reveal-stagger" id="featuredGrid">
          ${renderSkeletonGrid(4)}
        </div>
      </div>
    </section>

    <section class="section" id="categorySection">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title"><i class="fas fa-tag"></i> Shop by Category</h2>
        </div>
        <div class="category-grid" id="categoryGrid">
          ${renderCategoryCards()}
        </div>
      </div>
    </section>

    <section class="section reveal" style="background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div class="section-header text-center" style="justify-content:center;text-align:center;margin-bottom:2rem">
          <h2 class="section-header__title">Why Svadesh?</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem">
          <div class="glass-card" style="padding:1.5rem;text-align:center">
            <div class="feature-icon"><i class="fas fa-shield-halved"></i></div>
            <h4 style="margin-bottom:0.375rem">Genuine Products</h4>
            <p class="text-sm text-secondary">100% authentic products sourced directly from trusted brands and verified sellers.</p>
          </div>
          <div class="glass-card" style="padding:1.5rem;text-align:center">
            <div class="feature-icon"><i class="fas fa-truck-fast"></i></div>
            <h4 style="margin-bottom:0.375rem">Free Delivery</h4>
            <p class="text-sm text-secondary">Free shipping on orders above Rs. 499. Delivered across India with tracking.</p>
          </div>
          <div class="glass-card" style="padding:1.5rem;text-align:center">
            <div class="feature-icon"><i class="fas fa-arrows-rotate"></i></div>
            <h4 style="margin-bottom:0.375rem">Easy Returns</h4>
            <p class="text-sm text-secondary">Hassle-free returns within 15 days of delivery. No questions asked.</p>
          </div>
          <div class="glass-card" style="padding:1.5rem;text-align:center">
            <div class="feature-icon"><i class="fas fa-lock"></i></div>
            <h4 style="margin-bottom:0.375rem">Secure Payments</h4>
            <p class="text-sm text-secondary">100% secure transactions with UPI, cards and net banking options.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  try {
    const products = await fetchProducts();
    await delay(300);
    const featured = products.slice(0, 4);
    const grid = document.getElementById('featuredGrid');
    grid.innerHTML = featured.map(p => createProductCard(p)).join('');
    attachProductCardEvents(grid);
    store.dispatch({ products });

    // Hero product images
    const heroProductsEl = document.getElementById('heroProducts');
    if (heroProductsEl) {
      heroProductsEl.innerHTML = products.slice(4, 8)
        .map(p => `<img src="${p.image}" alt="" class="hero__product-img" loading="lazy" />`)
        .join('');
    }

    // Use product images as category backgrounds (non-flash update)
    const cats = [...new Set(products.map(p => p.category))];
    cats.forEach(cat => {
      const p = products.find(x => x.category === cat);
      if (p && CTG[cat] && !CTG[cat].img) {
        CTG[cat].img = p.image;
        const card = document.querySelector(`.category-card[data-category="${CSS.escape(cat)}"]`);
        if (card) {
          const bg = card.querySelector('.category-card__bg');
          if (bg) {
            const img = document.createElement('img');
            img.src = p.image;
            img.alt = cat;
            img.loading = 'lazy';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:brightness(0.45) saturate(1.3) contrast(1.1);opacity:0;transition:opacity 0.6s ease';
            bg.appendChild(img);
            requestAnimationFrame(() => { img.style.opacity = '1'; });
          }
        }
      }
    });
  } catch (err) {
    document.getElementById('featuredGrid').innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted)">
        <i class="fas fa-circle-exclamation" style="font-size:1.5rem;margin-bottom:0.5rem"></i><br/>
        Failed to load products. Please try again later.
      </div>`;
  }
}

function renderCategoryCards() {
  return Object.entries(CTG).map(([key, val]) => {
    const label = key === "men's clothing" ? "Men's Wear"
      : key === "women's clothing" ? "Women's Wear"
      : key.charAt(0).toUpperCase() + key.slice(1);
    return `
      <a href="#/products?category=${encodeURIComponent(key)}" class="category-card" style="background:${val.color}" data-category="${key}">
        <div class="category-card__bg">
          <i class="fas ${val.icon}" style="font-size:4rem;opacity:0.12;color:${val.color};position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none"></i>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${label}</h3>
          <span class="category-card__count"><i class="fas fa-arrow-right"></i> Explore</span>
        </div>
      </a>
    `;
  }).join('');
}

export function attachProductCardEvents(container) {
  container.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = Number(btn.dataset.addCart);
      const state = store.getState();
      const product = state.products.find(p => p.id === id);
      if (product) {
        store.addToCart(product);
        showToast('Added to bag!', 'success');
      }
    });
  });

  container.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.wishlistBtn);
      const state = store.getState();
      const product = state.products.find(p => p.id === id);
      if (product) {
        const added = store.toggleWishlist(product);
        btn.innerHTML = `<i class="${added ? 'fas' : 'far'} fa-heart"></i>`;
        btn.classList.toggle('active', added);
        btn.title = added ? 'Remove from wishlist' : 'Add to wishlist';
        showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
      }
    });
  });
}
