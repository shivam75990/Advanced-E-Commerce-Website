/* ============================================================
   ROUTER - Hash-based SPA Router
   Maps URL hash → page render function
   ============================================================ */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.beforeHooks = [];

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  /** Register a route */
  addRoute(pattern, renderFn) {
    this.routes[pattern] = renderFn;
    return this;
  }

  /** Add a before-each hook */
  beforeEach(fn) {
    this.beforeHooks.push(fn);
    return this;
  }

  /** Parse current hash and execute matching route */
  async resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = {};

    // Parse query string
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, val] = pair.split('=');
        if (key) params[key] = decodeURIComponent(val || '');
      });
    }

    // Find matching route
    let matched = false;
    for (const [pattern, renderFn] of Object.entries(this.routes)) {
      const match = this.matchPattern(pattern, path);
      if (match) {
        // Run before hooks
        for (const hook of this.beforeHooks) {
          hook({ path, params: { ...match.params, ...params } });
        }

        this.currentRoute = pattern;
        const routeParams = { ...match.params, ...params };
        await renderFn(routeParams);
        matched = true;
        break;
      }
    }

    if (!matched && this.routes['/404']) {
      this.routes['/404']();
    }
  }

  /** Match a route pattern against a path (supports :param) */
  matchPattern(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return { params };
  }

  /** Navigate to a new route */
  navigate(path, params = {}) {
    const query = Object.entries(params)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    const hash = query ? `${path}?${query}` : path;
    window.location.hash = hash;
  }

  /** Get the current path without hash */
  getPath() {
    return window.location.hash.slice(1).split('?')[0] || '/';
  }
}

const router = new Router();
export default router;
