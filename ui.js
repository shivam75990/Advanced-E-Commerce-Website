import { formatCurrency, renderStars } from './helpers.js';
import store from './store.js';

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };
  toast.innerHTML = `<span class="toast__icon"><i class="fas ${icons[type] || icons.info}"></i></span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function renderSkeletonGrid(count = 8) {
  return Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-card__image"></div>
      <div class="skeleton-card__body">
        <div class="skeleton skeleton-card__line skeleton-card__line--short"></div>
        <div class="skeleton skeleton-card__line skeleton-card__line--long"></div>
        <div class="skeleton skeleton-card__line skeleton-card__line--medium"></div>
      </div>
    </div>
  `).join('');
}

export function createProductCard(product) {
  if (!product) return '';

  const inWishlist = store.isInWishlist(product.id);

  return `
    <article class="product-card" data-id="${product.id}">
      <a href="#/product/${product.id}" class="product-card__image-wrapper">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="product-card__image"
          loading="lazy"
        />
      </a>
      <button
        class="product-card__wishlist-btn ${inWishlist ? 'active' : ''}"
        data-wishlist-btn="${product.id}"
        title="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}"
        aria-label="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}"
      >
        <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <div class="product-card__body">
        <span class="product-card__category">${product.category || ''}</span>
        <a href="#/product/${product.id}" class="product-card__title">${product.title}</a>
        <div class="product-card__rating">
          <span class="product-card__stars">${renderStars(product.rating?.rate || product.rating || 0)}</span>
          <span class="text-xs text-muted">(${product.rating?.count || 0})</span>
        </div>
        <div class="product-card__price">${formatCurrency(product.price)}</div>
        <div class="product-card__actions">
          <button class="btn btn-primary btn-sm" data-add-cart="${product.id}"><i class="fas fa-cart-plus"></i> Add</button>
        </div>
      </div>
    </article>
  `;
}

export function ratingHTML(rating, count, showCount = true) {
  return `
    <span class="rating-stars">${renderStars(rating || 0)}</span>
    ${showCount ? `<span class="text-xs text-muted">(${count || 0} reviews)</span>` : ''}
  `;
}

export function reviewCardHTML(review) {
  return `
    <div class="review-card">
      <div class="review-card__header">
        <div class="review-card__avatar">${review.avatar || review.name?.charAt(0) || 'U'}</div>
        <div>
          <div class="review-card__name">${review.name || 'Anonymous'}</div>
          <div class="review-card__date">${review.date || ''}</div>
        </div>
        <div style="margin-left:auto; color:var(--rating)">
          ${'<i class="fas fa-star"></i>'.repeat(Math.round(review.rating || 0))}
          ${'<i class="far fa-star"></i>'.repeat(5 - Math.round(review.rating || 0))}
        </div>
      </div>
      <p class="review-card__text">${review.text || ''}</p>
    </div>
  `;
}

export function categoryCardHTML(category, icon, imgUrl) {
  const bgContent = imgUrl
    ? `<img src="${imgUrl}" alt="${category}" loading="lazy" />`
    : `<i class="fas ${icon || 'fa-store'}"></i>`;
  return `
    <a href="#/products?category=${encodeURIComponent(category)}" class="category-card">
      <div class="category-card__bg">
        ${bgContent}
      </div>
      <div class="category-card__body">
        <h3 class="category-card__title">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <span class="category-card__count"><i class="fas fa-arrow-right"></i> Explore</span>
      </div>
    </a>
  `;
}

export function cartItemHTML(item) {
  return `
    <div class="cart-item" data-cart-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="cart-item__image" loading="lazy" />
      <div class="cart-item__info">
        <div class="cart-item__title">${item.title}</div>
        <div class="cart-item__price">${formatCurrency(item.price)}</div>
        <div class="cart-item__actions">
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" data-qty-minus="${item.id}"><i class="fas fa-minus"></i></button>
            <span class="cart-item__qty-value">${item.quantity}</span>
            <button class="cart-item__qty-btn" data-qty-plus="${item.id}"><i class="fas fa-plus"></i></button>
          </div>
          <button class="cart-item__remove" data-cart-remove="${item.id}"><i class="fas fa-trash-can"></i></button>
        </div>
      </div>
    </div>
  `;
}

export function wishlistItemHTML(item) {
  return `
    <div class="wishlist-item" data-wishlist-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="wishlist-item__image" loading="lazy" />
      <div class="wishlist-item__info">
        <a href="#/product/${item.id}" class="wishlist-item__title">${item.title}</a>
        <div class="wishlist-item__price">${formatCurrency(item.price)}</div>
      </div>
      <div class="wishlist-item__actions">
        <button class="btn btn-primary btn-sm" data-move-cart="${item.id}"><i class="fas fa-cart-plus"></i></button>
        <button class="btn btn-ghost btn-sm" data-wishlist-remove="${item.id}"><i class="fas fa-xmark"></i></button>
      </div>
    </div>
  `;
}
