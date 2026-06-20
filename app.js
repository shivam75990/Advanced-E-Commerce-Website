import store from './store.js';
import router from './router.js';
import { renderHeader, renderFooter, renderCartSidebar, renderWishlistSidebar, renderBackToTop, renderAuthModal } from './layout.js';
import renderHomePage from './home.js';
import renderProductsPage from './products.js';
import renderProductDetailPage from './detail.js';
import renderCartPage from './cartPage.js';
import renderWishlistPage from './wishlistPage.js';
import renderCheckoutPage from './checkout.js';
import renderWalletPage from './walletPage.js';
import renderSellerPage from './sellerPage.js';

function init() {
  const savedTheme = localStorage.getItem('ecomm_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  store.dispatch({ theme: savedTheme });

  renderHeader();
  renderFooter();
  renderCartSidebar();
  renderWishlistSidebar();
  renderBackToTop();

  router.addRoute('/', renderHomePage);
  router.addRoute('/products', renderProductsPage);
  router.addRoute('/product/:id', renderProductDetailPage);
  router.addRoute('/cart', renderCartPage);
  router.addRoute('/wishlist', renderWishlistPage);
  router.addRoute('/checkout', renderCheckoutPage);
  router.addRoute('/wallet', renderWalletPage);
  router.addRoute('/sell', renderSellerPage);
  router.addRoute('/orders', () => {
    const s = store.getState();
    document.getElementById('app').innerHTML = `
      <div class="page-content">
        <div class="container">
          ${!s.isLoggedIn ? `
            <div class="empty-state">
              <div class="empty-state__icon"><i class="fas fa-box"></i></div>
              <h3 class="empty-state__title">Please Login</h3>
              <p class="empty-state__text">Login to view your orders.</p>
              <button class="btn btn-primary" id="ordersLoginBtn"><i class="fas fa-right-to-bracket"></i> Login</button>
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state__icon"><i class="fas fa-box-open"></i></div>
              <h3 class="empty-state__title">No Orders Yet</h3>
              <p class="empty-state__text">Looks like you haven't placed any orders yet. Start shopping!</p>
              <a href="#/products" class="btn btn-primary"><i class="fas fa-store"></i> Browse Products</a>
            </div>
          `}
        </div>
      </div>
    `;
    document.getElementById('ordersLoginBtn')?.addEventListener('click', () => store.toggleAuth('login'));
  });
  router.addRoute('/profile', () => {
    const s = store.getState();
    document.getElementById('app').innerHTML = `
      <div class="page-content">
        <div class="container">
          ${!s.isLoggedIn ? `
            <div class="empty-state">
              <div class="empty-state__icon"><i class="fas fa-user-gear"></i></div>
              <h3 class="empty-state__title">Please Login</h3>
              <p class="empty-state__text">Login to view your profile.</p>
              <button class="btn btn-primary" id="profileLoginBtn"><i class="fas fa-right-to-bracket"></i> Login</button>
            </div>
          ` : `
            <div class="profile-page" style="max-width:600px;margin:0 auto">
              <h1 style="margin-bottom:0.5rem"><i class="fas fa-user-gear"></i> My Profile</h1>
              <p class="text-secondary" style="margin-bottom:2rem">Manage your account details</p>
              <div class="glass-card" style="padding:2rem">
                <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
                  <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700">${(s.user?.name || 'U').charAt(0)}</div>
                  <div>
                    <h3>${s.user?.name || 'User'}</h3>
                    <p class="text-secondary" style="font-size:0.875rem">${s.user?.email || ''}</p>
                  </div>
                </div>
                <div class="form-group" style="margin-bottom:1rem">
                  <label>Full Name</label>
                  <input type="text" value="${s.user?.name || ''}" disabled style="opacity:0.7" />
                </div>
                <div class="form-group" style="margin-bottom:1rem">
                  <label>Email</label>
                  <input type="email" value="${s.user?.email || ''}" disabled style="opacity:0.7" />
                </div>
                <button class="btn btn-danger" id="logoutFromProfile"><i class="fas fa-right-from-bracket"></i> Logout</button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
    document.getElementById('profileLoginBtn')?.addEventListener('click', () => store.toggleAuth('login'));
    document.getElementById('logoutFromProfile')?.addEventListener('click', () => { store.logout(); router.navigate('/'); });
  });
  router.addRoute('/404', () => {
    document.getElementById('app').innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-compass"></i></div>
            <h3 class="empty-state__title">Page Not Found</h3>
            <p class="empty-state__subtitle">The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn-primary"><i class="fas fa-house"></i> Go Home</a>
          </div>
        </div>
      </div>
    `;
  });

  router.navigate(router.getPath() || '/');

  store.subscribe(() => {
    const state = store.getState();

    if (state.theme) {
      document.documentElement.setAttribute('data-theme', state.theme);
    }

    if (state.ui.cartOpen !== undefined || state.ui.wishlistOpen !== undefined) {
      renderCartSidebar();
      renderWishlistSidebar();
    }

    if (state.cart !== undefined || state.wishlist !== undefined || state.isLoggedIn !== undefined) {
      renderHeader();
    }

    if (state.ui?.authOpen !== undefined) {
      renderAuthModal();
    }
  });

  initScrollObserver();
}

function initScrollObserver() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('> *').forEach(el => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            });
          } else {
            entry.target.classList.add('visible');
          }
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  function observeReveals() {
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up, .reveal-rotate, .reveal-stagger'
    ).forEach(el => observer.observe(el));
  }

  observeReveals();

  const appObserver = new MutationObserver(() => {
    observeReveals();
  });

  const app = document.getElementById('app');
  if (app) {
    appObserver.observe(app, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', init);
