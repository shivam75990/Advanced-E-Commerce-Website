import { formatCurrency } from './helpers.js';
import { showToast } from './ui.js';
import store from './store.js';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const FREE_SHIPPING_THRESHOLD = 499;

export default function renderCheckoutPage() {
  const state = store.getState();
  const { cart } = state;
  const app = document.getElementById('app');

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-bag-shopping"></i></div>
            <h3 class="empty-state__title">Your bag is empty</h3>
            <p class="empty-state__text">Add some products first before checking out.</p>
            <a href="#/products" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Browse Products</a>
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
          <h1 class="page-header__title"><i class="fas fa-truck" style="font-size:1.5rem"></i> Checkout</h1>
          <p class="page-header__subtitle">Complete your order — it takes just 2 minutes</p>
        </div>

        <div class="checkout-layout reveal">
          <div>
            <form class="checkout-form" id="checkoutForm" novalidate>
              <h3 style="font-size:1.125rem"><i class="fas fa-location-dot" style="color:var(--primary)"></i> Shipping Address</h3>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name *</label>
                  <input type="text" id="firstName" required placeholder="First Name Here" />
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name *</label>
                  <input type="text" id="lastName" required placeholder="Last Name Here" />
                </div>
              </div>

              <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Email Address *</label>
                <input type="email" id="email" required placeholder="xyz@example.com" />
              </div>

              <div class="form-group">
                <label for="phone"><i class="fas fa-phone"></i> Mobile Number *</label>
                <input type="tel" id="phone" required placeholder="+91 98765 43210" />
              </div>

              <div class="form-group">
                <label for="address"><i class="fas fa-house"></i> Street Address / House No. *</label>
                <input type="text" id="address" required placeholder="XYZ, Street Name, Area" />
              </div>

              <div class="form-row form-row--2">
                <div class="form-group">
                  <label for="city">City *</label>
                  <input type="text" id="city" required placeholder="City Here" />
                </div>
                <div class="form-group">
                  <label for="state">State *</label>
                  <select id="state" required>
                    <option value="">Select state</option>
                    ${INDIAN_STATES.map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-row form-row--2">
                <div class="form-group">
                  <label for="zip">PIN Code *</label>
                  <input type="text" id="zip" required placeholder="PIN Code" maxlength="6" />
                </div>
                <div class="form-group">
                  <label for="country">Country</label>
                  <select id="country">
                    <option value="India" selected>India</option>
                  </select>
                </div>
              </div>

              <h3 style="font-size:1.125rem; margin-top:0.75rem"><i class="fas fa-credit-card" style="color:var(--primary)"></i> Payment Method</h3>
              <div class="payment-options" id="paymentOptions">
                <div class="payment-option selected" data-method="upi">
                  <div class="payment-option__icon"><i class="fas fa-mobile-screen-button"></i></div>
                  <div>UPI</div>
                </div>
                <div class="payment-option" data-method="card">
                  <div class="payment-option__icon"><i class="fas fa-credit-card"></i></div>
                  <div>Card</div>
                </div>
                <div class="payment-option" data-method="netbanking">
                  <div class="payment-option__icon"><i class="fas fa-building-columns"></i></div>
                  <div>Net Banking</div>
                </div>
                <div class="payment-option" data-method="cod">
                  <div class="payment-option__icon"><i class="fas fa-money-bill-wave"></i></div>
                  <div>Cash on Delivery</div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-block" id="placeOrderBtn" style="margin-top:0.75rem">
                <i class="fas fa-check-circle"></i> Place Order — ${formatCurrency(total)}
              </button>
            </form>
          </div>

          <div class="reveal-right">
            <div class="order-summary">
              <h3 class="order-summary__title"><i class="fas fa-receipt"></i> Order Summary</h3>
              ${cart
                .map(
                  item => `
                <div class="order-summary__item">
                  <span style="flex:1">${item.title.slice(0, 40)}${item.title.length > 40 ? '...' : ''} x ${item.quantity}</span>
                  <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
              `
                )
                .join('')}
              <div class="order-summary__item" style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border-color)">
                <span>Subtotal</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  document.getElementById('checkoutForm')?.addEventListener('submit', e => {
    e.preventDefault();

    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    let valid = true;

    required.forEach(id => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        field.style.borderColor = 'var(--border-color)';
      }
    });

    if (!valid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    setTimeout(() => {
      store.clearCart();
      showToast('<i class="fas fa-check-circle"></i> Order placed successfully! Thank you for shopping with Svadesh.', 'success');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    }, 2000);
  });
}
