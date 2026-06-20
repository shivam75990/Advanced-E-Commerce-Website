import store from './store.js';
import { showToast } from './ui.js';

export default function renderSellerPage() {
  const app = document.getElementById('app');
  const state = store.getState();

  app.innerHTML = `
    <div class="seller-page">
      <section class="seller-hero">
        <div class="container">
          <div class="seller-hero__content">
            <span class="seller-hero__tag"><i class="fas fa-store-alt"></i> Seller Program</span>
            <h1 class="seller-hero__title">Start Selling on <span class="seller-hero__accent">Svadesh</span></h1>
            <p class="seller-hero__subtitle">Join 10,000+ sellers across India. Reach millions of customers, grow your business, and earn more with Svadesh's powerful marketplace platform.</p>
            <div class="seller-hero__stats">
              <div class="seller-hero__stat">
                <span class="seller-hero__stat-value">10M+</span>
                <span class="seller-hero__stat-label">Monthly Visitors</span>
              </div>
              <div class="seller-hero__stat">
                <span class="seller-hero__stat-value">0%</span>
                <span class="seller-hero__stat-label">Setup Fee</span>
              </div>
              <div class="seller-hero__stat">
                <span class="seller-hero__stat-value">3 Days</span>
                <span class="seller-hero__stat-label">Payout Cycle</span>
              </div>
              <div class="seller-hero__stat">
                <span class="seller-hero__stat-value">24/7</span>
                <span class="seller-hero__stat-label">Seller Support</span>
              </div>
            </div>
            <button class="btn btn-gold btn-lg" id="startSellingBtn"><i class="fas fa-rocket"></i> Start Selling Today</button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header text-center" style="justify-content:center;text-align:center;margin-bottom:3rem">
            <h2 class="section-header__title">Why Sell on Svadesh?</h2>
          </div>
          <div class="seller-benefits">
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-users"></i></div>
              <h4>Large Customer Base</h4>
              <p class="text-sm text-secondary">Access millions of active shoppers across India looking for quality products.</p>
            </div>
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-bolt"></i></div>
              <h4>Easy Onboarding</h4>
              <p class="text-sm text-secondary">List your first product in minutes. Simple dashboard to manage everything.</p>
            </div>
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-truck"></i></div>
              <h4>Pan-India Logistics</h4>
              <p class="text-sm text-secondary">We handle pick-up, packaging and delivery across 29,000+ pin codes.</p>
            </div>
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-chart-line"></i></div>
              <h4>Marketing Support</h4>
              <p class="text-sm text-secondary">Get featured in campaigns, deals and promotional events to boost sales.</p>
            </div>
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-shield"></i></div>
              <h4>Seller Protection</h4>
              <p class="text-sm text-secondary">Comprehensive seller protection policy and secure payment gateway.</p>
            </div>
            <div class="seller-benefit-card glass-card" style="padding:2rem;text-align:center">
              <div class="seller-benefit-card__icon"><i class="fas fa-mobile-screen"></i></div>
              <h4>Seller App</h4>
              <p class="text-sm text-secondary">Manage your store on the go with our dedicated seller mobile app.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background:var(--bg-card);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color)">
        <div class="container">
          <div class="section-header text-center" style="justify-content:center;text-align:center;margin-bottom:3rem">
            <h2 class="section-header__title">How It Works</h2>
            <p class="text-secondary" style="margin-top:0.5rem">Get started in 3 simple steps</p>
          </div>
          <div class="seller-steps">
            <div class="seller-step">
              <div class="seller-step__number">1</div>
              <div class="seller-step__content">
                <h4>Register Your Account</h4>
                <p class="text-sm text-secondary">Create your seller account with basic business details and verify your identity.</p>
              </div>
            </div>
            <div class="seller-step">
              <div class="seller-step__number">2</div>
              <div class="seller-step__content">
                <h4>List Your Products</h4>
                <p class="text-sm text-secondary">Upload product photos, set prices, and manage inventory from your dashboard.</p>
              </div>
            </div>
            <div class="seller-step">
              <div class="seller-step__number">3</div>
              <div class="seller-step__content">
                <h4>Start Selling & Earning</h4>
                <p class="text-sm text-secondary">Receive orders, we handle delivery, and get paid directly to your bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="seller-cta" style="text-align:center;padding:3rem 1rem">
            <h2 style="margin-bottom:0.75rem">Ready to Grow Your Business?</h2>
            <p class="text-secondary" style="margin-bottom:1.5rem;max-width:500px;margin-left:auto;margin-right:auto">Join thousands of sellers who trust Svadesh to grow their business online.</p>
            <button class="btn btn-gold btn-lg" id="registerSellerBtn"><i class="fas fa-store"></i> Register as Seller</button>
          </div>
        </div>
      </section>
    </div>

    <div class="seller-register-modal" id="sellerRegisterModal">
      <div class="seller-register-modal__content">
        <button class="seller-register-modal__close" id="closeSellerModal"><i class="fas fa-xmark"></i></button>
        <h3 style="margin-bottom:0.5rem"><i class="fas fa-store-alt"></i> Register as Seller</h3>
        <p class="text-sm text-secondary" style="margin-bottom:1.5rem">Fill in your details to get started</p>
        <form id="sellerForm">
          <div class="form-row form-row--2">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="sellerName" placeholder="Your full name" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="sellerPhone" placeholder="+91 98765 43210" required />
            </div>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="sellerEmail" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Business Name</label>
            <input type="text" id="sellerBusiness" placeholder="Your store / business name" required />
          </div>
          <div class="form-group">
            <label>Product Category</label>
            <select id="sellerCategory" required>
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion & Clothing</option>
              <option value="jewelry">Jewelry</option>
              <option value="home">Home & Furniture</option>
              <option value="books">Books & Media</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:0.75rem">
            <i class="fas fa-paper-plane"></i> Submit Application
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('startSellingBtn')?.addEventListener('click', () => {
    document.getElementById('sellerRegisterModal').classList.add('visible');
  });

  document.getElementById('registerSellerBtn')?.addEventListener('click', () => {
    document.getElementById('sellerRegisterModal').classList.add('visible');
  });

  document.getElementById('closeSellerModal')?.addEventListener('click', () => {
    document.getElementById('sellerRegisterModal').classList.remove('visible');
  });

  document.getElementById('sellerRegisterModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.target.classList.remove('visible');
    }
  });

  document.getElementById('sellerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('sellerName').value.trim();
    const business = document.getElementById('sellerBusiness').value.trim();
    if (!name || !business) return;

    document.getElementById('sellerRegisterModal').classList.remove('visible');

    if (!state.isLoggedIn) {
      store.toggleAuth('signup');
      showToast('Please create an account first!', 'info');
      return;
    }

    showToast('Application submitted! We will contact you within 48 hours. 🎉', 'success');
    document.getElementById('sellerForm').reset();
  });
}
