import { formatCurrency } from './helpers.js';
import { showToast } from './ui.js';
import store from './store.js';

export default function renderWishlistPage() {
  const state = store.getState();
  const { wishlist } = state;
  const app = document.getElementById('app');

  if (wishlist.length === 0) {
    app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <h1 class="page-header__title">Your Wishlist</h1>
            <p class="page-header__subtitle">Items you love, saved for later</p>
          </div>
          <div class="empty-state reveal">
            <div class="empty-state__icon"><i class="fas fa-heart"></i></div>
            <h3 class="empty-state__title">Your wishlist is empty</h3>
            <p class="empty-state__text">Save your favorite items here and come back to them anytime.</p>
            <a href="#/products" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Browse Products</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div class="page-header reveal">
          <h1 class="page-header__title"><i class="fas fa-heart" style="color:var(--error)"></i> Your Wishlist</h1>
          <p class="page-header__subtitle">${wishlist.length} item${wishlist.length > 1 ? 's' : ''} saved</p>
        </div>
        <div class="product-grid reveal-stagger">
          ${wishlist
            .map(
              item => `
            <div class="product-card" data-id="${item.id}">
              <a href="#/product/${item.id}" class="product-card__image-wrapper">
                <img src="${item.image}" alt="${item.title}" class="product-card__image" loading="lazy" />
              </a>
              <button
                class="product-card__wishlist-btn active"
                data-remove-wishlist="${item.id}"
                title="Remove from wishlist"
              ><i class="fas fa-heart"></i></button>
              <div class="product-card__body">
                <span class="product-card__category">${item.category || ''}</span>
                <a href="#/product/${item.id}" class="product-card__title">${item.title}</a>
                <div class="product-card__price">${formatCurrency(item.price)}</div>
                <div class="product-card__actions">
                  <button class="btn btn-primary btn-sm" data-move-cart="${item.id}"><i class="fas fa-cart-plus"></i> Move to Cart</button>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

  app.querySelectorAll('[data-remove-wishlist]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = Number(btn.dataset.removeWishlist);
      store.removeFromWishlist(id);
      showToast('Removed from wishlist', 'info');
    });
  });

  app.querySelectorAll('[data-move-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = Number(btn.dataset.moveCart);
      store.moveToCart(id);
      showToast('Item moved to cart', 'success');
    });
  });
}
