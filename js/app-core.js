/* =========================================================
   DMTools Frontend Core Helpers
   - API calls
   - Token storage
   ========================================================= */

window.DMTOOLS = window.DMTOOLS || {};

DMTOOLS.API_BASE = 'https://dmtools-backend-production.up.railway.app/api';
DMTOOLS.TOKEN_KEY = 'authToken';

/** Token helpers */
DMTOOLS.getToken = function () {
  return localStorage.getItem(DMTOOLS.TOKEN_KEY);
};

DMTOOLS.setToken = function (token) {
  localStorage.setItem(DMTOOLS.TOKEN_KEY, token);
};

DMTOOLS.clearToken = function () {
  localStorage.removeItem(DMTOOLS.TOKEN_KEY);
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

  const res = await fetch(`${DMTOOLS.API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
    throw new Error(msg);
  }

  return data;
};

/** Verify token is valid */
DMTOOLS.verifyToken = async function () {
  const token = DMTOOLS.getToken();
  if (!token) return false;

  try {
    await DMTOOLS.apiCall('/user/profile', { method: 'GET' });
    return true;
  } catch (e) {
    DMTOOLS.clearToken();
    return false;
  }
};
