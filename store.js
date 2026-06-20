/* ============================================================
   STORE - Global State Management (mini Redux pattern)
   Manages: cart, wishlist, theme, products, ui
   ============================================================ */

import { getStorage, setStorage } from './storage.js';

/* ----- Initial State ----- */
const initialState = {
  cart: getStorage('ecomm_cart', []),
  wishlist: getStorage('ecomm_wishlist', []),
  theme: getStorage('ecomm_theme', 'light'),
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  isLoggedIn: getStorage('ecomm_loggedin', false),
  user: getStorage('ecomm_user', null),
  walletBalance: getStorage('ecomm_wallet_balance', 0),
  walletTransactions: getStorage('ecomm_wallet_txns', []),
  ui: {
    cartOpen: false,
    wishlistOpen: false,
    mobileMenuOpen: false,
    mobileFilterOpen: false,
    authOpen: false,
    authMode: 'login',
  },
};

/* ----- Store Class ----- */
class Store {
  constructor(initial) {
    this.state = { ...initial };
    this.listeners = new Set();
  }

  /** Get current state snapshot */
  getState() {
    return {
      ...this.state,
      cart: [...this.state.cart],
      wishlist: [...this.state.wishlist],
      walletTransactions: [...this.state.walletTransactions],
    };
  }

  /** Subscribe to state changes */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Notify all listeners */
  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  /** Update state and persist to localStorage where needed */
  dispatch(updates) {
    const prev = this.state;
    this.state = { ...prev, ...updates };

    // Auto-persist cart and wishlist
    if ('cart' in updates) setStorage('ecomm_cart', this.state.cart);
    if ('wishlist' in updates) setStorage('ecomm_wishlist', this.state.wishlist);
    if ('theme' in updates) setStorage('ecomm_theme', this.state.theme);
    if ('isLoggedIn' in updates) setStorage('ecomm_loggedin', this.state.isLoggedIn);
    if ('user' in updates) setStorage('ecomm_user', this.state.user);
    if ('walletBalance' in updates) setStorage('ecomm_wallet_balance', this.state.walletBalance);
    if ('walletTransactions' in updates) setStorage('ecomm_wallet_txns', this.state.walletTransactions);

    this.notify();
  }

  /* ----- Cart Actions ----- */

  addToCart(product, quantity = 1) {
    if (!product || !product.id) return;
    const cart = [...this.state.cart];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    this.dispatch({ cart });
  }

  removeFromCart(productId) {
    const cart = this.state.cart.filter(item => item.id !== productId);
    this.dispatch({ cart });
  }

  updateCartQuantity(productId, quantity) {
    if (quantity < 1) return this.removeFromCart(productId);
    const cart = this.state.cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    this.dispatch({ cart });
  }

  clearCart() {
    this.dispatch({ cart: [] });
  }

  getCartTotal() {
    return this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getCartCount() {
    return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  /* ----- Wishlist Actions ----- */

  toggleWishlist(product) {
    if (!product || !product.id) return;
    const exists = this.state.wishlist.some(item => item.id === product.id);
    const wishlist = exists
      ? this.state.wishlist.filter(item => item.id !== product.id)
      : [...this.state.wishlist, product];
    this.dispatch({ wishlist });
    return !exists; // returns true if added
  }

  isInWishlist(productId) {
    return this.state.wishlist.some(item => item.id === productId);
  }

  removeFromWishlist(productId) {
    const wishlist = this.state.wishlist.filter(item => item.id !== productId);
    this.dispatch({ wishlist });
  }

  moveToCart(productId) {
    const product = this.state.wishlist.find(item => item.id === productId);
    if (product) {
      this.addToCart(product);
      this.removeFromWishlist(productId);
    }
  }

  /* ----- Theme Actions ----- */

  toggleTheme() {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';
    this.dispatch({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* ----- Auth Actions ----- */

  login(userData) {
    this.dispatch({ isLoggedIn: true, user: userData });
  }

  logout() {
    this.dispatch({ isLoggedIn: false, user: null });
  }

  signup(userData) {
    this.dispatch({ isLoggedIn: true, user: userData });
  }

  /* ----- Wallet Actions ----- */

  addWalletFunds(amount) {
    if (amount <= 0) return;
    const balance = this.state.walletBalance + amount;
    const txns = [
      {
        id: Date.now(),
        type: 'credit',
        amount,
        description: 'Added money to wallet',
        date: new Date().toLocaleDateString('en-IN'),
      },
      ...this.state.walletTransactions,
    ];
    this.dispatch({ walletBalance: balance, walletTransactions: txns });
  }

  deductWallet(amount, description = 'Purchase') {
    if (amount > this.state.walletBalance) return false;
    const balance = this.state.walletBalance - amount;
    const txns = [
      {
        id: Date.now(),
        type: 'debit',
        amount,
        description,
        date: new Date().toLocaleDateString('en-IN'),
      },
      ...this.state.walletTransactions,
    ];
    this.dispatch({ walletBalance: balance, walletTransactions: txns });
    return true;
  }

  toggleAuth(mode) {
    const current = this.state.ui;
    const alreadyOpen = current.authOpen;
    if (mode) {
      this.dispatch({ ui: { ...current, authOpen: alreadyOpen || true, authMode: mode } });
    } else {
      this.dispatch({ ui: { ...current, authOpen: !alreadyOpen } });
    }
  }

  closeAllModals() {
    this.dispatch({
      ui: { ...this.state.ui, cartOpen: false, wishlistOpen: false, mobileMenuOpen: false, mobileFilterOpen: false, authOpen: false },
    });
  }

  /* ----- UI Actions ----- */

  toggleCart() {
    const cartOpen = !this.state.ui.cartOpen;
    this.dispatch({ ui: { ...this.state.ui, cartOpen } });
  }

  toggleWishlistUI() {
    const wishlistOpen = !this.state.ui.wishlistOpen;
    this.dispatch({ ui: { ...this.state.ui, wishlistOpen } });
  }

  toggleMobileMenu() {
    const mobileMenuOpen = !this.state.ui.mobileMenuOpen;
    this.dispatch({ ui: { ...this.state.ui, mobileMenuOpen } });
  }

  toggleMobileFilter() {
    const mobileFilterOpen = !this.state.ui.mobileFilterOpen;
    this.dispatch({ ui: { ...this.state.ui, mobileFilterOpen } });
  }

}

/* ----- Singleton Export ----- */
const store = new Store(initialState);
export default store;
