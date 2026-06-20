import { fetchProduct, delay } from './api.js';
import { formatCurrency, renderStars, getInitials } from './helpers.js';
import { showToast } from './ui.js';
import store from './store.js';

const FAKE_REVIEWS = [
  { name: 'Arun Sharma', rating: 5, text: 'Absolutely love the quality! The fabric is premium and the fit is perfect. Delivered right on time.', date: '2026-06-12' },
  { name: 'Priya Mehta', rating: 4, text: 'Great product for the price. Packaging was excellent and shipping was faster than expected.', date: '2026-06-08' },
  { name: 'Rahul Verma', rating: 5, text: 'Best purchase I have made this month. The product exceeded my expectations. Will buy again!', date: '2026-05-28' },
  { name: 'Ananya Patel', rating: 3, text: 'Good quality but the color was slightly different from what was shown. Still a decent buy overall.', date: '2026-05-15' },
];

export default async function renderProductDetailPage(params) {
  const productId = parseInt(params.id);
  if (!productId) return navigateToProducts();

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div style="margin-bottom:1.5rem">
          <button class="btn btn-ghost" id="backBtn"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
        <div class="detail-layout">
          <div>
            <div class="skeleton" style="width:100%; height:450px; border-radius:var(--radius-lg)"></div>
            <div style="display:flex; gap:0.5rem; margin-top:0.75rem">
              ${Array(4).fill('<div class="skeleton" style="width:64px;height:64px;border-radius:var(--radius-sm)"></div>').join('')}
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem">
            <div class="skeleton" style="height:1rem; width:30%"></div>
            <div class="skeleton" style="height:2rem; width:80%"></div>
            <div class="skeleton" style="height:1.5rem; width:40%"></div>
            <div class="skeleton" style="height:2.5rem; width:25%"></div>
            <div class="skeleton" style="height:6rem; width:100%"></div>
            <div class="skeleton" style="height:3rem; width:60%"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    const product = await fetchProduct(productId);
    await delay(300);
    renderProductDetail(product);
  } catch {
    app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-triangle-exclamation"></i></div>
            <h3 class="empty-state__title">Product not found</h3>
            <p class="empty-state__text">This product may no longer be available.</p>
            <a href="#/products" class="btn btn-primary">Browse Products</a>
          </div>
        </div>
      </div>
    `;
  }
}

function renderProductDetail(product) {
  const inWishlist = store.isInWishlist(product.id);
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div style="margin-bottom:1.5rem">
          <button class="btn btn-ghost" id="backBtn"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
        <div class="detail-layout reveal">
          <div class="product-gallery reveal-left">
            <div class="product-gallery__main" id="galleryMain">
              <img src="${product.image}" alt="${product.title}" id="mainImage" />
              <div class="product-gallery__zoom-lens" id="zoomLens"></div>
            </div>
            <div class="product-gallery__thumbs" id="galleryThumbs">
              ${[product.image, ...(Array.isArray(product.images) ? product.images.slice(1) : [])]
                .slice(0, 5)
                .map(
                  (img, idx) => `
                <div class="product-gallery__thumb ${idx === 0 ? 'active' : ''}" data-img="${img}">
                  <img src="${img}" alt="Thumbnail ${idx + 1}" />
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="detail-info reveal-right">
            <span class="detail-info__category">${product.category || ''}</span>
            <h1 class="detail-info__title">${product.title}</h1>
            <div class="detail-info__rating">
              ${renderStars(product.rating?.rate || 0)}
              <span class="text-sm text-muted">${product.rating?.rate || 'N/A'} (${product.rating?.count || 0} reviews)</span>
            </div>
            <div class="detail-info__price">${formatCurrency(product.price)}</div>
            <p class="detail-info__desc">${product.description}</p>

            <div class="detail-info__actions">
              <div class="qty-selector">
                <button class="qty-selector__btn" id="qtyMinus"><i class="fas fa-minus"></i></button>
                <span class="qty-selector__value" id="qtyValue">1</span>
                <button class="qty-selector__btn" id="qtyPlus"><i class="fas fa-plus"></i></button>
              </div>
              <button class="btn btn-primary btn-lg" id="addToCartBtn"><i class="fas fa-cart-plus"></i> Add to Cart</button>
              <button class="btn btn-ghost btn-icon" id="wishlistBtn" title="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}" style="font-size:1.5rem">
                <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="reviews reveal" style="margin-top:3rem">
          <h2 class="reviews__title"><i class="fas fa-star" style="color:var(--rating)"></i> Customer Reviews</h2>
          ${FAKE_REVIEWS.map(
            r => `
            <div class="review-card">
              <div class="review-card__header">
                <div class="review-card__avatar">${getInitials(r.name)}</div>
                <div>
                  <div class="review-card__name">${r.name}</div>
                  <div class="review-card__date">${r.date}</div>
                </div>
                <div style="margin-left:auto; color:var(--rating)">
                  ${'<i class="fas fa-star"></i>'.repeat(r.rating)}
                  ${'<i class="far fa-star"></i>'.repeat(5 - r.rating)}
                </div>
              </div>
              <p class="review-card__text">${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  let quantity = 1;

  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById('qtyValue').textContent = quantity;
    }
  });

  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    quantity++;
    document.getElementById('qtyValue').textContent = quantity;
  });

  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    store.addToCart(product, quantity);
    showToast(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`, 'success');
  });

  document.getElementById('wishlistBtn')?.addEventListener('click', () => {
    const added = store.toggleWishlist(product);
    const btn = document.getElementById('wishlistBtn');
    btn.innerHTML = `<i class="${added ? 'fas' : 'far'} fa-heart"></i>`;
    btn.title = added ? 'Remove from wishlist' : 'Add to wishlist';
    showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
  });

  document.getElementById('backBtn')?.addEventListener('click', e => {
    e.preventDefault();
    window.history.back();
  });

  document.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const imgSrc = thumb.dataset.img;
      document.getElementById('mainImage').src = imgSrc;
    });
  });

  const main = document.getElementById('galleryMain');
  const lens = document.getElementById('zoomLens');
  const imgEl = document.getElementById('mainImage');

  main?.addEventListener('mousemove', e => {
    const rect = main.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPerc = (x / rect.width) * 100;
    const yPerc = (y / rect.height) * 100;

    lens.style.left = `${x - 75}px`;
    lens.style.top = `${y - 75}px`;
    imgEl.style.transformOrigin = `${xPerc}% ${yPerc}%`;
    imgEl.style.transform = 'scale(1.8)';
  });

  main?.addEventListener('mouseleave', () => {
    imgEl.style.transform = 'scale(1)';
    imgEl.style.transformOrigin = 'center center';
  });
}

function navigateToProducts() {
  window.location.hash = '#/products';
}
