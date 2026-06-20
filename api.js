/* ============================================================
   API - Mock API layer using Fake Store API
   ============================================================ */

const BASE_URL = 'https://fakestoreapi.com';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint
 * @param {object} [options]
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetch all products
 * @returns {Promise<Array>}
 */
export async function fetchProducts() {
  return request('/products');
}

/**
 * Fetch a single product by ID
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function fetchProduct(id) {
  return request(`/products/${id}`);
}

/**
 * Fetch all product categories
 * @returns {Promise<string[]>}
 */
export async function fetchCategories() {
  return request('/products/categories');
}

/**
 * Fetch products in a specific category
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function fetchProductsByCategory(category) {
  return request(`/products/category/${category}`);
}

/**
 * Simulate a delay for loading states (useful for demonstrating skeletons)
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms = 600) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
