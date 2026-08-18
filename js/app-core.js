/* =========================================================
   DMTools Frontend Core Helpers
   - API calls
   - Token storage
   ========================================================= */

window.DMTOOLS = window.DMTOOLS || {};

DMTOOLS.API_BASE = 'https://dmtools-backend-production.up.railway.app/api';
DMTOOLS.TOKEN_KEY = 'authToken';
DMTOOLS.GA4_MEASUREMENT_ID = 'G-YFTZBVLQHF';

let analyticsContextPromise = null;
let analyticsContextLastAttemptAt = 0;

function isValidGaClientId(value) {
  return typeof value === 'string' && /^[1-9]\d{0,19}\.[1-9]\d{0,19}$/.test(value.trim());
}

function isValidGaSessionId(value) {
  return (typeof value === 'string' || typeof value === 'number') && /^[1-9]\d{0,19}$/.test(String(value).trim());
}

/**
 * Read the GA4 browser identity used by the backend Measurement Protocol stream.
 * Missing or blocked analytics never prevents an API request.
 */
DMTOOLS.getAnalyticsContext = function () {
  if (analyticsContextPromise) return analyticsContextPromise;

  const now = Date.now();
  if (now - analyticsContextLastAttemptAt < 30000) return Promise.resolve({});
  analyticsContextLastAttemptAt = now;

  if (typeof window.gtag !== 'function') return Promise.resolve({});

  analyticsContextPromise = new Promise((resolve) => {
    const context = {};
    let pending = 2;
    let settled = false;
    let timeout = null;

    const finish = () => {
      pending -= 1;
      if (pending > 0 || settled) return;
      settled = true;
      if (timeout !== null) window.clearTimeout(timeout);
      resolve(context);
    };

    timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(context);
    }, 500);

    try {
      window.gtag('get', DMTOOLS.GA4_MEASUREMENT_ID, 'client_id', (value) => {
        if (isValidGaClientId(value)) context.clientId = value.trim();
        finish();
      });
      window.gtag('get', DMTOOLS.GA4_MEASUREMENT_ID, 'session_id', (value) => {
        if (isValidGaSessionId(value)) context.sessionId = String(value).trim();
        finish();
      });
    } catch (_) {
      if (!settled) {
        settled = true;
        if (timeout !== null) window.clearTimeout(timeout);
        resolve({});
      }
    }
  }).then((context) => {
    if (!context.clientId) analyticsContextPromise = null;
    return context;
  });

  return analyticsContextPromise;
};

/** Set or clear GA4's reserved User-ID after authentication state changes. */
DMTOOLS.setAnalyticsUserId = function (userId) {
  try {
    if (typeof window.gtag !== 'function') return;
    const normalized = userId === null || userId === undefined ? null : String(userId).trim();
    if (normalized !== null && !/^[1-9]\d{0,19}$/.test(normalized)) return;
    window.gtag('set', { user_id: normalized });
  } catch (_) {
    // no-op when analytics is unavailable
  }
};

/** Token helpers */
DMTOOLS.getToken = function () {
  return localStorage.getItem(DMTOOLS.TOKEN_KEY);
};

DMTOOLS.setToken = function (token, userId) {
  localStorage.setItem(DMTOOLS.TOKEN_KEY, token);
  if (userId !== undefined && userId !== null) DMTOOLS.setAnalyticsUserId(userId);
};

DMTOOLS.clearToken = function () {
  localStorage.removeItem(DMTOOLS.TOKEN_KEY);
  DMTOOLS.setAnalyticsUserId(null);
};

/** URL helpers */
DMTOOLS.getQueryParam = function (name) {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  } catch (e) {
    return null;
  }
};

/** Basic API wrapper */
DMTOOLS.apiCall = async function (path, options = {}) {
  const token = DMTOOLS.getToken();
  const analyticsContext = await DMTOOLS.getAnalyticsContext();

  const res = await fetch(`${DMTOOLS.API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(analyticsContext.clientId ? { 'X-GA-Client-ID': analyticsContext.clientId } : {}),
      ...(analyticsContext.sessionId ? { 'X-GA-Session-ID': analyticsContext.sessionId } : {}),
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (_) { data = { raw: text }; }

  if (!res.ok) {
    const msg = (data && (data.error || data.message))
      ? (data.error || data.message)
      : `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

/** Verify token is valid */
DMTOOLS.verifyToken = async function () {
  const token = DMTOOLS.getToken();
  if (!token) return false;

  try {
    const profile = await DMTOOLS.apiCall('/user/profile', { method: 'GET' });
    DMTOOLS.setAnalyticsUserId(profile?.user?.id || profile?.id || null);
    return true;
  } catch (e) {
    DMTOOLS.clearToken();
    return false;
  }
};
