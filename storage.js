/* ============================================================
   STORAGE - LocalStorage wrapper with JSON serialization
   ============================================================ */

/**
 * Save data to localStorage
 * @param {string} key
 * @param {*} value
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e.message);
  }
}

/**
 * Read data from localStorage
 * @param {string} key
 * @param {*} fallback - default value if key doesn't exist
 * @returns {*}
 */
export function getStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Remove a key from localStorage
 * @param {string} key
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // silent
  }
}
