import { fetchProducts, fetchCategories, delay } from './api.js';
import { createProductCard, renderSkeletonGrid, showToast } from './ui.js';
import { debounce, formatCategory } from './helpers.js';
import { attachProductCardEvents } from './home.js';
import store from './store.js';

const ITEMS_PER_PAGE = 12;

let currentFilters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: Infinity,
  sort: '',
  page: 1,
};

export default async function renderProductsPage(params = {}) {
  currentFilters = {
    search: params.search || '',
    category: params.category || '',
    minPrice: 0,
    maxPrice: Infinity,
    sort: params.sort || '',
    page: parseInt(params.page) || 1,
  };

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <div class="page-header reveal">
          <h1 class="page-header__title">Our Collection</h1>
          <p class="page-header__subtitle">Browse handpicked products from across India</p>
        </div>

        <div class="products-toolbar reveal">
          <div class="products-toolbar__left">
            <div class="search-bar">
              <i class="fas fa-search search-bar__icon"></i>
              <input
                type="text"
                class="search-bar__input"
                id="searchInput"
                placeholder="Search products..."
                value="${currentFilters.search}"
              />
            </div>
          </div>
          <div class="products-toolbar__right">
            <button class="btn btn-secondary btn-sm mobile-filter-toggle" id="filterToggle">
              <i class="fas fa-filter"></i> Filters
            </button>
            <select class="sort-dropdown" id="sortSelect">
              <option value="">Default</option>
              <option value="price-asc" ${currentFilters.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${currentFilters.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${currentFilters.sort === 'rating' ? 'selected' : ''}>Top Rated</option>
            </select>
          </div>
        </div>

        <div class="products-layout">
          <aside class="filter-sidebar reveal-left" id="filterSidebar">
            <h3 class="filter-sidebar__title"><i class="fas fa-filter"></i> Filters</h3>

            <div class="filter-group">
              <span class="filter-group__label">Category</span>
              <div id="categoryFilters">
                <label class="filter-group__option">
                  <input type="radio" name="category" value="" class="filter-group__checkbox" ${!currentFilters.category ? 'checked' : ''} />
                  All Categories
                </label>
              </div>
            </div>

            <div class="filter-group">
              <span class="filter-group__label"><i class="fas fa-indian-rupee-sign"></i> Price Range</span>
              <div class="price-range">
                <div class="price-range__inputs">
                  <input type="number" class="price-range__input" id="minPrice" placeholder="Min" value="${currentFilters.minPrice || ''}" min="0" />
                  <span>—</span>
                  <input type="number" class="price-range__input" id="maxPrice" placeholder="Max" value="${currentFilters.maxPrice === Infinity ? '' : currentFilters.maxPrice}" min="0" />
                </div>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" id="clearFilters"><i class="fas fa-rotate-left"></i> Clear Filters</button>
          </aside>

          <div>
            <div class="product-grid reveal-stagger" id="productGrid">
              ${renderSkeletonGrid(8)}
            </div>
            <div class="pagination" id="pagination"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-filter-drawer" id="mobileFilterDrawer">
      <div class="mobile-filter-drawer__content">
        <div class="mobile-filter-drawer__header">
          <h3><i class="fas fa-filter"></i> Filters</h3>
          <button class="btn btn-ghost" id="closeMobileFilter"><i class="fas fa-xmark"></i></button>
        </div>
        <div id="mobileFilterContent"></div>
      </div>
    </div>
  `;

  loadCategories();
  await loadProducts();
  attachEventListeners();
}

async function loadCategories() {
  try {
    const cats = await fetchCategories();
    const container = document.getElementById('categoryFilters');
    container.innerHTML = `
      <label class="filter-group__option">
        <input type="radio" name="category" value="" class="filter-group__checkbox" ${!currentFilters.category ? 'checked' : ''} />
        All Categories
      </label>
      ${cats
        .map(
          cat => `
        <label class="filter-group__option">
          <input type="radio" name="category" value="${cat}" class="filter-group__checkbox" ${currentFilters.category === cat ? 'checked' : ''} />
          ${formatCategory(cat)}
        </label>`
        )
        .join('')}
    `;

    container.querySelectorAll('input[name="category"]').forEach(input => {
      input.addEventListener('change', () => {
        currentFilters.category = input.value;
        currentFilters.page = 1;
        loadProducts();
      });
    });
  } catch {
    // fallback
  }
}

async function loadProducts() {
  const grid = document.getElementById('productGrid');
  const pagination = document.getElementById('pagination');

  grid.innerHTML = renderSkeletonGrid(8);

  try {
    let products = store.getState().products;

    if (products.length === 0) {
      products = await fetchProducts();
      store.dispatch({ products });
    }

    await delay(200);

    let filtered = [...products];

    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (currentFilters.category) {
      filtered = filtered.filter(p => p.category === currentFilters.category);
    }

    const minP = parseFloat(currentFilters.minPrice) || 0;
    const maxP = parseFloat(currentFilters.maxPrice) || Infinity;
    filtered = filtered.filter(p => p.price >= minP && p.price <= maxP);

    switch (currentFilters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
    }

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    const page = Math.min(currentFilters.page, totalPages);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

    if (paged.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state__icon"><i class="fas fa-box-open"></i></div>
          <h3 class="empty-state__title">No products found</h3>
          <p class="empty-state__text">Try adjusting your filters or search terms</p>
          <button class="btn btn-primary" id="clearFiltersBtn"><i class="fas fa-rotate-left"></i> Clear Filters</button>
        </div>
      `;
      document.getElementById('clearFiltersBtn')?.addEventListener('click', clearAllFilters);
    } else {
      grid.innerHTML = paged.map(p => createProductCard(p)).join('');
      attachProductCardEvents(grid);
    }

    renderPagination(totalPages, page, pagination);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon"><i class="fas fa-circle-exclamation"></i></div>
        <h3 class="empty-state__title">Something went wrong</h3>
        <p class="empty-state__text">Could not load products. Please try again.</p>
        <button class="btn btn-primary" id="retryBtn"><i class="fas fa-rotate-right"></i> Retry</button>
      </div>
    `;
    document.getElementById('retryBtn')?.addEventListener('click', loadProducts);
  }
}

function renderPagination(totalPages, currentPage, container) {
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  html += `<button class="pagination__btn ${currentPage <= 1 ? 'pagination__btn--disabled' : ''}" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="pagination__btn" data-page="1">1</button>`;
    if (startPage > 2) html += `<span class="pagination__btn pagination__btn--disabled" style="border:none;background:transparent;box-shadow:none">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination__btn ${i === currentPage ? 'pagination__btn--active' : ''}" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="pagination__btn pagination__btn--disabled" style="border:none;background:transparent;box-shadow:none">...</span>`;
    html += `<button class="pagination__btn" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="pagination__btn ${currentPage >= totalPages ? 'pagination__btn--disabled' : ''}" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;

  container.innerHTML = html;

  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page >= 1 && page <= totalPages) {
        currentFilters.page = page;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function attachEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const debouncedSearch = debounce(value => {
    currentFilters.search = value;
    currentFilters.page = 1;
    loadProducts();
  }, 400);

  searchInput?.addEventListener('input', e => debouncedSearch(e.target.value));

  document.getElementById('sortSelect')?.addEventListener('change', e => {
    currentFilters.sort = e.target.value;
    currentFilters.page = 1;
    loadProducts();
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    params.set('sort', e.target.value);
    if (!e.target.value) params.delete('sort');
    const qs = params.toString();
    window.location.hash = qs ? `#/products?${qs}` : '#/products';
  });

  document.getElementById('minPrice')?.addEventListener('change', e => {
    currentFilters.minPrice = e.target.value || 0;
    currentFilters.page = 1;
    loadProducts();
  });

  document.getElementById('maxPrice')?.addEventListener('change', e => {
    currentFilters.maxPrice = e.target.value || Infinity;
    currentFilters.page = 1;
    loadProducts();
  });

  document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);

  document.getElementById('filterToggle')?.addEventListener('click', () => {
    const drawer = document.getElementById('mobileFilterDrawer');
    const content = document.getElementById('mobileFilterContent');
    content.innerHTML = document.getElementById('filterSidebar').innerHTML;
    drawer.classList.toggle('visible');

    content.querySelectorAll('input[name="category"]').forEach(input => {
      input.addEventListener('change', () => {
        currentFilters.category = input.value;
        currentFilters.page = 1;
        loadProducts();
        drawer.classList.remove('visible');
      });
    });

    content.querySelectorAll('#clearFilters').forEach(btn => {
      btn.addEventListener('click', () => {
        clearAllFilters();
        drawer.classList.remove('visible');
      });
    });

    content.querySelector('#minPrice')?.addEventListener('change', e => {
      currentFilters.minPrice = e.target.value || 0;
      currentFilters.page = 1;
      loadProducts();
    });

    content.querySelector('#maxPrice')?.addEventListener('change', e => {
      currentFilters.maxPrice = e.target.value || Infinity;
      currentFilters.page = 1;
      loadProducts();
    });
  });

  document.getElementById('closeMobileFilter')?.addEventListener('click', () => {
    document.getElementById('mobileFilterDrawer').classList.remove('visible');
  });

  document.getElementById('mobileFilterDrawer')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.target.classList.remove('visible');
    }
  });
}

function clearAllFilters() {
  currentFilters = {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    sort: '',
    page: 1,
  };
  document.getElementById('searchInput').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('sortSelect').value = '';
  document.querySelectorAll('input[name="category"]').forEach(r => {
    if (r.value === '') r.checked = true;
  });
  loadProducts();
}
