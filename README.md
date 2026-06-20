# Svadesh — Premium Indian E-Commerce Marketplace

A modern, fully responsive e-commerce frontend built with vanilla HTML, CSS, and JavaScript. Features an Indian-inspired design with warm terracotta palette, INR currency support, and scroll-triggered animations.

## Features

- **Homepage** — Hero section with Indian aesthetic, featured products, category browsing, trust badges
- **Product Listing** — Search with debounce, category/price filters, sorting (price, rating), pagination
- **Product Detail** — Image gallery with mouse-zoom lens, ratings, Indian review names, quantity selector
- **Shopping Cart** — Add/remove, quantity updates, GST (12%) + shipping calculation, persistent via localStorage
- **Wishlist** — Add/remove items, move to cart, persistent via localStorage
- **Checkout** — Indian address form (states, PIN code), UPI/Cards/Netbanking/COD payment UI, order summary
- **Dark/Light Mode** — Toggle with persistent preference
- **Scroll Animations** — Intersection Observer-powered reveal animations (fade, slide, scale)
- **Loading Skeletons** — Smooth shimmer animations while data loads
- **Toast Notifications** — Non-intrusive feedback for user actions
- **Fully Responsive** — Mobile-first design, all screen sizes
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation, reduced motion support

## Project Structure

```
ecommerce-app/
├── index.html              # Entry point
├── README.md
├── css/
│   ├── base.css            # Reset, variables (Indian palette), typography, buttons
│   ├── components.css      # Cards, forms, hero, modals, skeletons
│   ├── layout.css          # Header, footer, grids, page layouts
│   ├── animations.css      # Scroll reveals, glass morphism, hover effects
│   └── responsive.css      # Mobile-first breakpoints, touch targets
├── js/
│   ├── app.js              # Main entry, store/router init, scroll observer
│   ├── store.js            # Global state (mini Redux) — cart, wishlist, theme, UI
│   ├── router.js           # Hash-based SPA router with param support
│   ├── components/
│   │   ├── layout.js       # Header, Footer, Cart/Wishlist sidebars, Auth modal
│   │   └── ui.js           # Toast, skeletons, ProductCard, ratings helpers
│   ├── pages/
│   │   ├── home.js         # Homepage with hero + featured + categories
│   │   ├── products.js     # Product listing with search/filter/sort/page
│   │   ├── detail.js       # Product detail with gallery + reviews
│   │   ├── cartPage.js     # Full cart page with summary
│   │   ├── wishlistPage.js # Full wishlist page
│   │   ├── checkout.js     # Checkout with address form + payment
│   │   ├── walletPage.js   # Wallet page with balance + transactions
│   │   └── sellerPage.js   # Seller registration page
│   └── utils/
│       ├── api.js          # Fake Store API wrapper
│       ├── helpers.js      # INR formatting, debounce, stars, truncation
│       └── storage.js      # localStorage wrapper
└── assets/
    └── images/
```

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch
2. Go to repo **Settings → Pages**
3. Under **Branch**, select `main` and folder `/ (root)`
4. Click **Save**
5. Your site will be live at `https://<username>.github.io/<repo-name>/` in a few minutes

The app uses hash-based routing (`#/products`, `#/cart`, etc.) so it works on GitHub Pages without any server configuration — no 404 issues on page reload.

## How to Run Locally

### Option 1: VS Code Live Server (Recommended)
1. Open the `ecommerce-app` folder in VS Code
2. Install **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**

### Option 2: Python
```bash
cd ecommerce-app
python -m http.server 8080
# http://localhost:8080
```

### Option 3: Node.js
```bash
npx http-server ecommerce-app -p 8080
```

### Option 4: Any Static Server
Serve the `ecommerce-app` directory with any HTTP server. ES modules require HTTP protocol (not `file://`).

## Tech Stack

- **Zero dependencies** — Pure vanilla HTML/CSS/JS
- **ES Modules** — Native JavaScript modules (no bundler)
- **Fake Store API** — Product data from [fakestoreapi.com](https://fakestoreapi.com)
- **Intersection Observer** — Performant scroll-triggered animations
- **CSS Custom Properties** — Dynamic theming (light/dark mode)
- **Intl API** — Indian Rupee formatting (en-IN locale)

## Browser Support

Chrome, Firefox, Safari, Edge (latest 2 versions). ES module support required.
