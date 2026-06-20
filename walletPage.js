import store from './store.js';
import { formatCurrency } from './helpers.js';
import { showToast } from './ui.js';

export default function renderWalletPage() {
  const app = document.getElementById('app');
  const state = store.getState();

  if (!state.isLoggedIn) {
    app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fas fa-wallet"></i></div>
            <h3 class="empty-state__title">Please Login</h3>
            <p class="empty-state__text">Login to access your wallet.</p>
            <button class="btn btn-primary" id="walletLoginBtn"><i class="fas fa-right-to-bracket"></i> Login</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('walletLoginBtn')?.addEventListener('click', () => {
      store.toggleAuth('login');
    });
    return;
  }

  const { walletBalance, walletTransactions, user } = state;

  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div class="wallet-page">
          <div class="wallet-page__header">
            <div>
              <h1 class="wallet-page__title"><i class="fas fa-wallet"></i> My Wallet</h1>
              <p class="text-secondary">Manage your Svadesh wallet balance</p>
            </div>
          </div>

          <div class="wallet-grid">
            <div class="wallet-card wallet-card--balance">
              <div class="wallet-card__icon"><i class="fas fa-indian-rupee-sign"></i></div>
              <div class="wallet-card__label">Available Balance</div>
              <div class="wallet-card__amount">${formatCurrency(walletBalance)}</div>
              <div class="wallet-card__user">${user?.name || 'User'}</div>
              <button class="btn btn-primary" id="addFundsBtn"><i class="fas fa-plus"></i> Add Money</button>
            </div>

            <div class="wallet-card wallet-card--stats">
              <div class="wallet-card__stat">
                <span class="wallet-card__stat-value">${walletTransactions.filter(t => t.type === 'credit').length}</span>
                <span class="wallet-card__stat-label">Deposits</span>
              </div>
              <div class="wallet-card__stat">
                <span class="wallet-card__stat-value">${walletTransactions.filter(t => t.type === 'debit').length}</span>
                <span class="wallet-card__stat-label">Purchases</span>
              </div>
              <div class="wallet-card__stat">
                <span class="wallet-card__stat-value">${formatCurrency(walletTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0))}</span>
                <span class="wallet-card__stat-label">Total Deposited</span>
              </div>
            </div>
          </div>

          <div class="wallet-actions">
            <div class="wallet-quick-amounts">
              <span style="font-weight:600;font-size:0.875rem;color:var(--text-secondary)">Quick Add:</span>
              <button class="wallet-quick-btn" data-amount="100">₹100</button>
              <button class="wallet-quick-btn" data-amount="500">₹500</button>
              <button class="wallet-quick-btn" data-amount="1000">₹1,000</button>
              <button class="wallet-quick-btn" data-amount="2000">₹2,000</button>
              <button class="wallet-quick-btn" data-amount="5000">₹5,000</button>
            </div>
          </div>

          <div class="wallet-transactions">
            <div class="wallet-transactions__header">
              <h3><i class="fas fa-clock-rotate"></i> Transaction History</h3>
            </div>
            ${walletTransactions.length === 0 ? `
              <div class="wallet-transactions__empty">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet. Add money to your wallet to get started!</p>
              </div>
            ` : `
              <div class="wallet-transactions__list">
                ${walletTransactions.map(t => `
                  <div class="wallet-txn ${t.type === 'credit' ? 'wallet-txn--credit' : 'wallet-txn--debit'}">
                    <div class="wallet-txn__icon">
                      <i class="fas ${t.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    </div>
                    <div class="wallet-txn__info">
                      <div class="wallet-txn__desc">${t.description}</div>
                      <div class="wallet-txn__date">${t.date}</div>
                    </div>
                    <div class="wallet-txn__amount ${t.type === 'credit' ? 'wallet-txn__amount--credit' : 'wallet-txn__amount--debit'}">
                      ${t.type === 'credit' ? '+' : '-'}${formatCurrency(t.amount)}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('addFundsBtn')?.addEventListener('click', () => {
    const amount = prompt('Enter amount to add (₹):', '500');
    const num = parseInt(amount);
    if (!isNaN(num) && num > 0) {
      store.addWalletFunds(num);
      renderWalletPage();
      showToast(`₹${num} added to wallet!`, 'success');
    }
  });

  document.querySelectorAll('.wallet-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount);
      store.addWalletFunds(amount);
      renderWalletPage();
      showToast(`₹${amount} added to wallet!`, 'success');
    });
  });
}
