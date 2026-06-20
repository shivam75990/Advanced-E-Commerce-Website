import { formatCurrency } from './helpers.js';
import { showToast } from './ui.js';
import store from './store.js';
import router from './router.js';

const FREE_SHIPPING_THRESHOLD = 499;

export default function renderCartPage() {
  const state = store.getState();
  const { cart } = state;
  const app = document.getElementById('app');

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="page-header">
            <h1 class="page-header__title">Your Bag</h1>
            <p class="page-header__subtitle">Items waiting for you</p>
          </div>
          <div class="empty-state reveal">
            <div class="empty-state__icon"><i class="fas fa-bag-shopping"></i></div>
            <h3 class="empty-state__title">Your bag is empty</h3>
            <p class="empty-state__text">Looks like you haven't added anything yet.</p>
            <a href="#/products" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Start Shopping</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const subtotal = store.getCartTotal();
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div class="page-header reveal">
          <h1 class="page-header__title"><i class="fas fa-bag-shopping" style="font-size:1.5rem"></i> Shopping Bag</h1>
          <p class="page-header__subtitle">${store.getCartCount()} item${store.getCartCount() !== 1 ? 's' : ''} in your bag</p>
        </div>
        <div class="cart-page-layout reveal">
          <div style="display:flex; flex-direction:column; gap:0.5rem">
            ${cart
              .map(
                item => `
              <div class="cart-item" data-cart-id="${item.id}" style="border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; background:var(--bg-card)">
                <img src="${item.image}" alt="${item.title}" class="cart-item__image" style="width:80px;height:80px" loading="lazy" />
                <div class="cart-item__info">
                  <a href="#/product/${item.id}" class="cart-item__title" style="font-size:1rem">${item.title}</a>
                  <div class="cart-item__price" style="font-size:1.125rem">${formatCurrency(item.price)}</div>
                  <div class="cart-item__actions">
                    <div class="cart-item__qty">
                      <button class="cart-item__qty-btn" data-qty-minus="${item.id}"><i class="fas fa-minus"></i></button>
                      <span class="cart-item__qty-value">${item.quantity}</span>
                      <button class="cart-item__qty-btn" data-qty-plus="${item.id}"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="btn btn-danger btn-sm" data-cart-remove="${item.id}"><i class="fas fa-trash-can"></i> Remove</button>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <div>
            <div class="order-summary">
              <h3 class="order-summary__title">Order Summary</h3>
              <div class="order-summary__item">
                <span>Subtotal (${store.getCartCount()} items)</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              <div class="order-summary__item">
                <span>Shipping</span>
                <span>${shipping === 0 ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Free</span>' : formatCurrency(shipping)}</span>
              </div>
              <div class="order-summary__item">
                <span>GST (12%)</span>
                <span>${formatCurrency(tax)}</span>
              </div>
              ${subtotal < FREE_SHIPPING_THRESHOLD ? `<div class="order-summary__item" style="color:var(--primary); font-size:0.8125rem">
                <span><i class="fas fa-truck"></i> Add ${formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!</span>
                <span></span>
              </div>` : ''}
              <div class="order-summary__item order-summary__item--total">
                <span>Total</span>
                <span>${formatCurrency(total)}</span>
              </div>
              <button class="btn btn-primary btn-block btn-lg" id="checkoutFromCart" style="margin-top:1rem">
                <i class="fas fa-arrow-right"></i> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  app.querySelectorAll('[data-qty-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.qtyPlus);
      const item = cart.find(i => i.id === id);
      if (item) store.updateCartQuantity(id, item.quantity + 1);
    });
  });

  app.querySelectorAll('[data-qty-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.qtyMinus);
      const item = cart.find(i => i.id === id);
      if (item) store.updateCartQuantity(id, item.quantity - 1);
    });
  });

  app.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.cartRemove);
      store.removeFromCart(id);
      showToast('Item removed from bag', 'info');
    });
  });

  document.getElementById('checkoutFromCart')?.addEventListener('click', () => {
    router.navigate('/checkout');
  });
}
