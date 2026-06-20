import store from './store.js';
import router from './router.js';
import { showToast } from './ui.js';
import { formatCurrency, getInitials } from './helpers.js';

let scrollListenerAttached = false;

export function renderHeader() {
  const state = store.getState();
  const cartCount = store.getCartCount();
  const wishlistCount = state.wishlist.length;
  const themeIcon = state.theme === 'dark' ? 'fa-sun' : 'fa-moon';
  const currentPath = router.getPath();
  const { isLoggedIn, user, walletBalance } = state;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/sell', label: 'Become a Seller' },
  ];

  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = `
    <header class="header">
      <div class="header__inner">
        <a href="#/" class="header__logo">
          <span class="header__logo-icon">
            <i class="fas fa-store"></i>
          </span>
          <span>Svadesh</span>
        </a>

        <nav class="header__nav">
          <div class="header__nav-links" id="navLinks">
            ${navLinks
              .map(
                l => `
              <a
                href="#${l.href}"
                class="header__nav-link ${currentPath === l.href ? 'active' : ''}"
                data-nav
              >${l.label}</a>`
              )
              .join('')}
            ${isLoggedIn
              ? `<a href="#/wallet" class="header__nav-link ${currentPath === '/wallet' ? 'active' : ''}" data-nav><i class="fas fa-wallet"></i> Wallet</a>`
              : ''}
          </div>

          <div class="header__actions">
            ${isLoggedIn
              ? `<button class="header__action-btn" id="userMenuBtn" aria-label="Account" style="width:auto;padding:0 0.75rem;gap:0.375rem">
                  <span class="header__user-avatar">${getInitials(user?.name || 'User')}</span>
                  <span class="header__user-name">${user?.name?.split(' ')[0] || 'User'}</span>
                </button>`
              : `<button class="header__action-btn" id="loginBtn" aria-label="Login" title="Login / Sign Up">
                  <i class="fas fa-user"></i>
                </button>`
            }
            ${isLoggedIn
              ? `<a href="#/wallet" class="header__action-btn" aria-label="Wallet" title="Wallet: ${formatCurrency(walletBalance)}">
                  <i class="fas fa-wallet"></i>
                  ${walletBalance > 0 ? `<span class="header__badge header__badge--wallet">${walletBalance > 999 ? '₹' + (walletBalance/1000).toFixed(1) + 'K' : walletBalance}</span>` : ''}
                </a>`
              : ''
            }
            <button class="header__action-btn" id="wishlistToggle" aria-label="Wishlist">
              <i class="fas fa-heart"></i>
              ${wishlistCount > 0 ? `<span class="header__badge">${wishlistCount > 99 ? '99+' : wishlistCount}</span>` : ''}
            </button>
            <button class="header__action-btn" id="cartToggle" aria-label="Cart">
              <i class="fas fa-bag-shopping"></i>
              ${cartCount > 0 ? `<span class="header__badge">${cartCount > 99 ? '99+' : cartCount}</span>` : ''}
            </button>
            <button class="header__action-btn" id="themeToggle" aria-label="Toggle theme">
              <i class="fas ${themeIcon}"></i>
            </button>
            <button class="header__hamburger" id="hamburger" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  document.getElementById('cartToggle')?.addEventListener('click', () => {
    store.toggleCart();
  });

  document.getElementById('wishlistToggle')?.addEventListener('click', () => {
    store.toggleWishlistUI();
  });

  document.getElementById('hamburger')?.addEventListener('click', () => {
    store.toggleMobileMenu();
  });

  document.getElementById('loginBtn')?.addEventListener('click', () => {
    store.toggleAuth('login');
  });

  document.getElementById('userMenuBtn')?.addEventListener('click', () => {
    const menu = document.getElementById('userDropdown');
    if (menu) {
      menu.classList.toggle('visible');
    } else {
      renderUserDropdown();
    }
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      store.closeAllModals();
    });
  });

  // scroll shadow (attach only once)
  if (!scrollListenerAttached) {
    scrollListenerAttached = true;
    const onScroll = () => {
      const el = document.querySelector('.header');
      if (el) el.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

function renderUserDropdown() {
  const state = store.getState();
  const existing = document.getElementById('userDropdown');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'userDropdown';
  div.className = 'user-dropdown visible';
  div.innerHTML = `
    <div class="user-dropdown__header">
      <span class="user-dropdown__avatar">${getInitials(state.user?.name || 'User')}</span>
      <div>
        <div class="user-dropdown__name">${state.user?.name || 'User'}</div>
        <div class="user-dropdown__email">${state.user?.email || ''}</div>
      </div>
    </div>
    <div class="user-dropdown__links">
      <a href="#/wallet" class="user-dropdown__link" data-nav><i class="fas fa-wallet"></i> Wallet</a>
      <a href="#/orders" class="user-dropdown__link" data-nav><i class="fas fa-box"></i> Orders</a>
      <a href="#/profile" class="user-dropdown__link" data-nav><i class="fas fa-user-gear"></i> Profile</a>
      <button class="user-dropdown__link user-dropdown__link--danger" id="logoutBtn"><i class="fas fa-right-from-bracket"></i> Logout</button>
    </div>
  `;

  const headerActions = document.querySelector('.header__actions');
  if (headerActions) {
    headerActions.appendChild(div);
  }

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    store.logout();
    router.navigate('/');
    closeUserDropdown();
  });

  document.addEventListener('click', function closeHandler(e) {
    if (!e.target.closest('#userMenuBtn') && !e.target.closest('#userDropdown')) {
      closeUserDropdown();
      document.removeEventListener('click', closeHandler);
    }
  });
}

function closeUserDropdown() {
  const menu = document.getElementById('userDropdown');
  if (menu) menu.remove();
}

export function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <h4 class="footer__col-title"><i class="fas fa-store"></i> Shop</h4>
            <div class="footer__links">
              <a href="#/products" class="footer__link">All Products</a>
              <a href="#/products?category=electronics" class="footer__link">Electronics</a>
              <a href="#/products?category=jewelery" class="footer__link">Jewelry</a>
              <a href="#/products?category=men's clothing" class="footer__link">Men's Clothing</a>
              <a href="#/products?category=women's clothing" class="footer__link">Women's Clothing</a>
              <a href="#/products?sort=price-desc" class="footer__link">Trending Products</a>
              <a href="#/products?sort=price-asc" class="footer__link">Budget Picks</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title"><i class="fas fa-user"></i> My Account</h4>
            <div class="footer__links">
              <a href="#/" class="footer__link" id="footerLoginBtn"><i class="fas fa-right-to-bracket fa-fw"></i> Login / Register</a>
              <a href="#/wallet" class="footer__link"><i class="fas fa-wallet fa-fw"></i> My Wallet</a>
              <a href="#/cart" class="footer__link"><i class="fas fa-bag-shopping fa-fw"></i> My Cart</a>
              <a href="#/wishlist" class="footer__link"><i class="fas fa-heart fa-fw"></i> Wishlist</a>
              <a href="#/orders" class="footer__link"><i class="fas fa-box fa-fw"></i> My Orders</a>
              <a href="#/sell" class="footer__link"><i class="fas fa-store-alt fa-fw"></i> Sell on Svadesh</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title"><i class="fas fa-circle-info"></i> Support</h4>
            <div class="footer__links">
              <a href="#" class="footer__link"><i class="fas fa-envelope fa-fw"></i> Contact Us</a>
              <a href="#" class="footer__link"><i class="fas fa-circle-question fa-fw"></i> FAQs</a>
              <a href="#" class="footer__link"><i class="fas fa-truck fa-fw"></i> Shipping Info</a>
              <a href="#" class="footer__link"><i class="fas fa-rotate-left fa-fw"></i> Returns & Exchanges</a>
              <a href="#" class="footer__link"><i class="fas fa-clipboard-list fa-fw"></i> Order Tracking</a>
              <a href="#" class="footer__link"><i class="fas fa-gift fa-fw"></i> Gift Cards</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title"><i class="fas fa-building"></i> Company</h4>
            <div class="footer__links">
              <a href="#" class="footer__link">About Svadesh</a>
              <a href="#" class="footer__link">Careers <span class="badge badge-success" style="font-size:0.6rem;padding:0.1rem 0.4rem;vertical-align:middle">Hiring</span></a>
              <a href="#" class="footer__link">Blog</a>
              <a href="#" class="footer__link">Affiliate Program</a>
              <a href="#" class="footer__link">Privacy Policy</a>
              <a href="#" class="footer__link">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title"><i class="fas fa-credit-card"></i> Payments</h4>
            <div class="footer__links">
              <span class="footer__link"><i class="fas fa-bolt fa-fw"></i> UPI (GPay, PhonePe, Paytm)</span>
              <span class="footer__link"><i class="fas fa-credit-card fa-fw"></i> Credit / Debit Cards</span>
              <span class="footer__link"><i class="fas fa-building-columns fa-fw"></i> Net Banking</span>
              <span class="footer__link"><i class="fas fa-money-bill-wave fa-fw"></i> Cash on Delivery</span>
              <span class="footer__link"><i class="fas fa-shield-halved fa-fw"></i> 100% Secure Payments</span>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title"><i class="fas fa-headset"></i> Connect</h4>
            <div class="footer__links">
              <span class="footer__link"><i class="fas fa-envelope fa-fw"></i> hello@svadesh.in</span>
              <span class="footer__link"><i class="fas fa-phone fa-fw"></i> +91 1800-123-4567</span>
              <span class="footer__link"><i class="fas fa-clock fa-fw"></i> Mon–Sat, 9 AM – 9 PM</span>
              <span class="footer__link"><i class="fas fa-location-dot fa-fw"></i> Uttar Pradesh, India</span>
            </div>
            <div style="margin-top:1rem">
              <h4 class="footer__col-title"><i class="fas fa-share-nodes"></i> Follow Us</h4>
              <div class="footer__social">
                <a href="#" class="footer__social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" class="footer__social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="footer__social-link" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
                <a href="#" class="footer__social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                <a href="#" class="footer__social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer__trust">
          <div class="footer__trust-item">
            <i class="fas fa-truck-fast"></i>
            <span>Free delivery on orders above ₹499</span>
          </div>
          <div class="footer__trust-item">
            <i class="fas fa-arrows-rotate"></i>
            <span>15-day easy returns</span>
          </div>
          <div class="footer__trust-item">
            <i class="fas fa-shield-halved"></i>
            <span>100% secure checkout</span>
          </div>
          <div class="footer__trust-item">
            <i class="fas fa-indian-rupee-sign"></i>
            <span>Pay in INR</span>
          </div>
        </div>

        <div class="footer__bottom">
          <span>&copy; ${new Date().getFullYear()} <strong>Svadesh</strong>. Made with <i class="fas fa-heart" style="color:var(--error);font-size:0.75rem"></i> in India</span>
          <span><i class="fas fa-code"></i> Vanilla JS SPA</span>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('footerLoginBtn')?.addEventListener('click', e => {
    e.preventDefault();
    store.toggleAuth('login');
  });
}

export function renderCartSidebar() {
  const state = store.getState();
  const { cartOpen } = state.ui;

  let overlay = document.getElementById('cartOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.className = 'cart-overlay';
    document.body.appendChild(overlay);
  }
  overlay.className = `cart-overlay${cartOpen ? ' visible' : ''}`;

  let sidebar = document.getElementById('cartSidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'cartSidebar';
    sidebar.className = 'cart-sidebar';
    document.body.appendChild(sidebar);
  }
  sidebar.className = `cart-sidebar${cartOpen ? ' open' : ''}`;

  const { cart } = state;
  const total = store.getCartCount();

  if (cart.length === 0) {
    sidebar.innerHTML = `
      <div class="cart-sidebar__header">
        <h3 class="cart-sidebar__title"><i class="fas fa-bag-shopping" style="font-size:1rem"></i> Shopping Bag</h3>
        <button class="cart-sidebar__close" id="closeCart"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="cart-sidebar__items">
        <div class="cart-sidebar__empty">
          <div class="cart-sidebar__empty-icon"><i class="fas fa-bag-shopping"></i></div>
          <p>Your bag is empty</p>
          <a href="#/products" class="btn btn-primary btn-sm">Start Shopping</a>
        </div>
      </div>
    `;
  } else {
    sidebar.innerHTML = `
      <div class="cart-sidebar__header">
        <h3 class="cart-sidebar__title"><i class="fas fa-bag-shopping" style="font-size:1rem"></i> Shopping Bag (${total})</h3>
        <button class="cart-sidebar__close" id="closeCart"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="cart-sidebar__items" id="cartItems">
        ${cart
          .map(
            item => `
          <div class="cart-item" data-cart-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item__image" loading="lazy" />
            <div class="cart-item__info">
              <div class="cart-item__title">${item.title}</div>
              <div class="cart-item__price">${formatCurrency(item.price * item.quantity)}</div>
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
        `
          )
          .join('')}
      </div>
      <div class="cart-sidebar__footer">
        <div class="cart-sidebar__total">
          <span>Total</span>
          <span>${formatCurrency(store.getCartTotal())}</span>
        </div>
        <button class="btn btn-primary btn-block" id="checkoutBtn"><i class="fas fa-arrow-right"></i> Checkout</button>
      </div>
    `;
  }

  document.getElementById('closeCart')?.addEventListener('click', () => store.toggleCart());
  overlay.addEventListener('click', () => store.toggleCart());

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    store.toggleCart();
    router.navigate('/checkout');
  });

  sidebar.querySelectorAll('[data-qty-plus]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.qtyPlus);
      const item = state.cart.find(i => i.id === id);
      if (item) store.updateCartQuantity(id, item.quantity + 1);
    });
  });

  sidebar.querySelectorAll('[data-qty-minus]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.qtyMinus);
      const item = state.cart.find(i => i.id === id);
      if (item) store.updateCartQuantity(id, item.quantity - 1);
    });
  });

  sidebar.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.cartRemove);
      store.removeFromCart(id);
      showToast('Item removed from bag', 'info');
    });
  });
}

export function renderWishlistSidebar() {
  const state = store.getState();
  const { wishlistOpen } = state.ui;
  const { wishlist } = state;

  let overlay = document.getElementById('wishlistOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wishlistOverlay';
    overlay.className = 'cart-overlay';
    document.body.appendChild(overlay);
  }
  overlay.className = `cart-overlay${wishlistOpen ? ' visible' : ''}`;

  let sidebar = document.getElementById('wishlistSidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'wishlistSidebar';
    sidebar.className = 'cart-sidebar';
    document.body.appendChild(sidebar);
  }
  sidebar.className = `cart-sidebar${wishlistOpen ? ' open' : ''}`;

  if (wishlist.length === 0) {
    sidebar.innerHTML = `
      <div class="cart-sidebar__header">
        <h3 class="cart-sidebar__title"><i class="fas fa-heart" style="font-size:1rem"></i> Wishlist</h3>
        <button class="cart-sidebar__close" id="closeWishlist"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="cart-sidebar__items">
        <div class="cart-sidebar__empty">
          <div class="cart-sidebar__empty-icon"><i class="fas fa-heart"></i></div>
          <p>Your wishlist is empty</p>
          <a href="#/products" class="btn btn-primary btn-sm">Browse Products</a>
        </div>
      </div>
    `;
  } else {
    sidebar.innerHTML = `
      <div class="cart-sidebar__header">
        <h3 class="cart-sidebar__title"><i class="fas fa-heart" style="font-size:1rem"></i> Wishlist (${wishlist.length})</h3>
        <button class="cart-sidebar__close" id="closeWishlist"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="cart-sidebar__items" id="wishlistItems">
        ${wishlist
          .map(
            item => `
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
        `
          )
          .join('')}
      </div>
    `;
  }

  document.getElementById('closeWishlist')?.addEventListener('click', () => store.toggleWishlistUI());
  overlay.addEventListener('click', () => store.toggleWishlistUI());

  sidebar.querySelectorAll('[data-move-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.moveCart);
      store.moveToCart(id);
      showToast('Item moved to bag', 'success');
    });
  });

  sidebar.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.wishlistRemove);
      store.removeFromWishlist(id);
      showToast('Removed from wishlist', 'info');
    });
  });
}

export function renderAuthModal() {
  const state = store.getState();
  const { authOpen, authMode } = state.ui;

  let overlay = document.getElementById('authOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.className = 'auth-overlay';
    document.body.appendChild(overlay);
  }
  overlay.className = `auth-overlay${authOpen ? ' visible' : ''}`;

  if (!authOpen) return;

  const isLogin = authMode === 'login';
  overlay.innerHTML = `
    <div class="auth-modal">
      <button class="auth-modal__close" id="closeAuth"><i class="fas fa-xmark"></i></button>
      <div class="auth-modal__tabs">
        <button class="auth-modal__tab ${isLogin ? 'active' : ''}" data-auth-tab="login">Sign In</button>
        <button class="auth-modal__tab ${!isLogin ? 'active' : ''}" data-auth-tab="signup">Create Account</button>
      </div>
      <form id="authForm" class="auth-form">
        <div class="auth-form__fields">
          ${isLogin ? `
            <div class="form-group">
              <label for="authEmail">Email Address</label>
              <input type="email" id="authEmail" placeholder="you@example.com" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label for="authPassword">Password</label>
              <input type="password" id="authPassword" placeholder="••••••••" required minlength="6" autocomplete="current-password" />
            </div>
            <div class="auth-form__options">
              <label class="auth-form__checkbox">
                <input type="checkbox" checked /> Remember me
              </label>
              <a href="#" class="auth-form__forgot">Forgot password?</a>
            </div>
          ` : `
            <div class="form-group">
              <label for="authName">Full Name</label>
              <input type="text" id="authName" placeholder="Your Name" required />
            </div>
            <div class="form-group">
              <label for="authEmail">Email Address</label>
              <input type="email" id="authEmail" placeholder="you@example.com" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label for="authPhone">Phone Number</label>
              <input type="tel" id="authPhone" placeholder="+91 98765 43210" pattern="[0-9+\s]{10,15}" />
            </div>
            <div class="form-group">
              <label for="authPassword">Password</label>
              <input type="password" id="authPassword" placeholder="••••••••" required minlength="6" autocomplete="new-password" />
            </div>
            <div class="form-group">
              <label for="authConfirmPassword">Confirm Password</label>
              <input type="password" id="authConfirmPassword" placeholder="••••••••" required minlength="6" autocomplete="new-password" />
            </div>
          `}
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg auth-form__submit">
          <i class="fas ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'}"></i>
          ${isLogin ? 'Sign In' : 'Create Account'}
        </button>
        <p class="auth-form__alt">
          ${isLogin ? "Don't have an account?" : 'Already have an account?'}
          <a href="#" id="authSwitch">${isLogin ? 'Sign Up' : 'Sign In'}</a>
        </p>
      </form>
      <div class="auth-modal__divider"><span>or continue with</span></div>
      <div class="auth-modal__social">
        <button class="auth-modal__social-btn" data-social="google"><i class="fab fa-google"></i> Google</button>
        <button class="auth-modal__social-btn" data-social="github"><i class="fab fa-github"></i> GitHub</button>
      </div>
    </div>
  `;

  const closeModal = () => {
    store.dispatch({ ui: { ...store.getState().ui, authOpen: false } });
    overlay.className = 'auth-overlay';
  };

  document.getElementById('closeAuth')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.querySelectorAll('[data-auth-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.toggleAuth(btn.dataset.authTab);
      renderAuthModal();
    });
  });

  document.getElementById('authSwitch')?.addEventListener('click', e => {
    e.preventDefault();
    store.toggleAuth(isLogin ? 'signup' : 'login');
    renderAuthModal();
  });

  document.getElementById('authForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (isLogin) {
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value.trim();
      if (!email || !password) return;
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      store.login({ name, email });
    } else {
      const name = document.getElementById('authName').value.trim();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value.trim();
      const confirm = document.getElementById('authConfirmPassword').value.trim();
      if (!name || !email || !password) return;
      if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
      }
      store.signup({ name, email });
      store.addWalletFunds(100);
    }
    closeModal();
    showToast(isLogin ? 'Welcome back!' : 'Account created! 🎉', 'success');
  });

  document.querySelectorAll('[data-social]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.social === 'google' ? 'Google User' : 'GitHub User';
      const email = `${btn.dataset.social}@example.com`;
      store.login({ name, email });
      closeModal();
      showToast(`Signed in with ${btn.dataset.social}!`, 'success');
    });
  });
}

let backToTopListenerAttached = false;

export function renderBackToTop() {
  let btn = document.getElementById('backToTop');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (!backToTopListenerAttached) {
    backToTopListenerAttached = true;
    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
