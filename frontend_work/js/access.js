/* =========================================================
   DMTools Access + Redirect Rules
   Phase 2 rule:
     - After login/register -> portal.html
   ========================================================= */

window.DMTOOLS = window.DMTOOLS || {};

DMTOOLS.redirectTo = function (path) {
  // keep absolute-style routing consistent with your existing pages
  window.location.href = path.startsWith('/') ? path : `/${path}`;
};

DMTOOLS.redirectToPortal = function () {
  DMTOOLS.redirectTo('/portal.html');
};

DMTOOLS.requireAuthOrRedirect = async function (returnTo = '/portal.html') {
  const ok = await DMTOOLS.verifyToken();
  if (!ok) {
    const rt = encodeURIComponent(returnTo);
    DMTOOLS.redirectTo(`/login.html?returnTo=${rt}`);
    return false;
  }
  return true;
};

DMTOOLS.redirectIfLoggedIn = async function () {
  const ok = await DMTOOLS.verifyToken();
  if (ok) DMTOOLS.redirectToPortal();
};

DMTOOLS.getReturnTo = function (fallback = '/portal.html') {
  const rt = DMTOOLS.getQueryParam('returnTo');
  if (!rt) return fallback;

  // Basic safety: only allow same-site paths
  if (rt.startsWith('http')) return fallback;
  if (!rt.startsWith('/')) return `/${rt}`;
  return rt;
};
