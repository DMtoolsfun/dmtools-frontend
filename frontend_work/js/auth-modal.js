/* =========================================================
   DMTools Auth Modal (shared)
   - Consistent login/register modal across the site
   - Depends on /js/app-core.js (DMTOOLS.API_BASE + token helpers)

   Minimal wiring:
     1) Include after app-core.js on any page:
          <script src="/js/app-core.js"></script>
          <script src="/js/auth-modal.js"></script>
     2) Add attributes to any link/button you want to open the modal:
          <a href="/login.html" data-auth="login">Sign In</a>
          <a href="/register.html" data-auth="register">Sign Up</a>

   Optional:
     - Pass a return path:
          DMTOOLS.openAuthModal('login', { returnTo: '/portal.html' })
========================================================= */

(function () {
  window.DMTOOLS = window.DMTOOLS || {};

  const MODAL_ID = 'dmtools-auth-modal';
  const STYLE_ID = 'dmtools-auth-modal-style';

  const DEFAULTS = {
    returnTo: '/portal.html'
  };

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .dmtools-auth-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);z-index:9999;padding:16px}
      .dmtools-auth-modal.show{display:flex}
      .dmtools-auth-modal__card{width:100%;max-width:440px;background:rgba(30,41,59,.97);border:1px solid #374151;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,.6);padding:22px;color:#e5e7eb}
      .dmtools-auth-modal__header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      .dmtools-auth-modal__title{font-size:1.35rem;font-weight:800;margin:0;background:linear-gradient(135deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .dmtools-auth-modal__subtitle{margin:6px 0 0 0;color:#9ca3af;font-size:.95rem}
      .dmtools-auth-modal__close{background:transparent;border:1px solid #374151;color:#e5e7eb;border-radius:10px;width:36px;height:36px;cursor:pointer;font-size:18px;line-height:0}
      .dmtools-auth-modal__close:hover{border-color:#8b5cf6;color:#8b5cf6}
      .dmtools-auth-modal__error{display:none;margin:10px 0 12px 0;padding:10px 12px;border-radius:10px;border:1px solid #ef4444;background:rgba(239,68,68,.12);color:#fecaca;font-size:.92rem}
      .dmtools-auth-modal__error.show{display:block}
      .dmtools-auth-modal__row{margin-bottom:12px}
      .dmtools-auth-modal__label{display:block;color:#d1d5db;font-weight:600;margin-bottom:6px;font-size:.9rem}
      .dmtools-auth-modal__input{width:100%;padding:12px 12px;background:#1f2937;border:1px solid #4b5563;border-radius:10px;color:#fff;font-size:1rem;outline:none}
      .dmtools-auth-modal__input:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.12)}
      .dmtools-auth-modal__namegrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .dmtools-auth-modal__btn{width:100%;margin-top:4px;padding:12px 14px;border:0;border-radius:12px;font-weight:800;cursor:pointer;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed)}
      .dmtools-auth-modal__btn:disabled{opacity:.65;cursor:not-allowed}
      .dmtools-auth-modal__footer{margin-top:12px;text-align:center;color:#9ca3af;font-size:.95rem}
      .dmtools-auth-modal__linkbtn{background:none;border:0;color:#8b5cf6;text-decoration:underline;cursor:pointer;font-weight:700;padding:0 4px}
      @media (max-width:520px){.dmtools-auth-modal__namegrid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = document.getElementById(MODAL_ID);
    if (modal) return modal;

    ensureStyles();

    modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'dmtools-auth-modal';
    modal.innerHTML = `
      <div class="dmtools-auth-modal__card" role="dialog" aria-modal="true" aria-labelledby="dmtools-auth-title">
        <div class="dmtools-auth-modal__header">
          <div>
            <h2 class="dmtools-auth-modal__title" id="dmtools-auth-title">Sign In</h2>
            <p class="dmtools-auth-modal__subtitle" id="dmtools-auth-subtitle">Access your account</p>
          </div>
          <button class="dmtools-auth-modal__close" type="button" aria-label="Close">×</button>
        </div>

        <div class="dmtools-auth-modal__error" id="dmtools-auth-error"></div>

        <div class="dmtools-auth-modal__row dmtools-auth-modal__namegrid" id="dmtools-auth-names" style="display:none">
          <div>
            <label class="dmtools-auth-modal__label" for="dmtools-auth-first">First name</label>
            <input class="dmtools-auth-modal__input" id="dmtools-auth-first" autocomplete="given-name" />
          </div>
          <div>
            <label class="dmtools-auth-modal__label" for="dmtools-auth-last">Last name</label>
            <input class="dmtools-auth-modal__input" id="dmtools-auth-last" autocomplete="family-name" />
          </div>
        </div>

        <div class="dmtools-auth-modal__row">
          <label class="dmtools-auth-modal__label" for="dmtools-auth-email">Email</label>
          <input class="dmtools-auth-modal__input" id="dmtools-auth-email" type="email" autocomplete="email" placeholder="you@example.com" />
        </div>
        <div class="dmtools-auth-modal__row">
          <label class="dmtools-auth-modal__label" for="dmtools-auth-pass">Password</label>
          <input class="dmtools-auth-modal__input" id="dmtools-auth-pass" type="password" autocomplete="current-password" placeholder="Your password" />
        </div>

        <button class="dmtools-auth-modal__btn" type="button" id="dmtools-auth-submit">Sign In</button>

        <div class="dmtools-auth-modal__footer">
          <span id="dmtools-auth-switch-text">Don't have an account?</span>
          <button class="dmtools-auth-modal__linkbtn" type="button" id="dmtools-auth-switch-btn">Sign Up</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    modal.querySelector('.dmtools-auth-modal__close').addEventListener('click', () => hide());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hide();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    // Switch + submit handlers
    modal.querySelector('#dmtools-auth-switch-btn').addEventListener('click', () => {
      setMode(state.mode === 'login' ? 'register' : 'login');
    });
    modal.querySelector('#dmtools-auth-submit').addEventListener('click', () => submit());

    return modal;
  }

  const state = {
    mode: 'login',
    returnTo: DEFAULTS.returnTo
  };

  function setMode(mode) {
    const modal = ensureModal();
    state.mode = mode === 'register' ? 'register' : 'login';

    const title = modal.querySelector('#dmtools-auth-title');
    const subtitle = modal.querySelector('#dmtools-auth-subtitle');
    const names = modal.querySelector('#dmtools-auth-names');
    const submitBtn = modal.querySelector('#dmtools-auth-submit');
    const switchText = modal.querySelector('#dmtools-auth-switch-text');
    const switchBtn = modal.querySelector('#dmtools-auth-switch-btn');
    const pass = modal.querySelector('#dmtools-auth-pass');

    if (state.mode === 'register') {
      title.textContent = 'Create Account';
      subtitle.textContent = 'Start generating AI responses today';
      names.style.display = '';
      submitBtn.textContent = 'Create Account';
      switchText.textContent = 'Already have an account?';
      switchBtn.textContent = 'Sign In';
      pass.autocomplete = 'new-password';
    } else {
      title.textContent = 'Sign In';
      subtitle.textContent = 'Access your account';
      names.style.display = 'none';
      submitBtn.textContent = 'Sign In';
      switchText.textContent = "Don't have an account?";
      switchBtn.textContent = 'Sign Up';
      pass.autocomplete = 'current-password';
    }

    clearError();
  }

  function showError(message) {
    const modal = ensureModal();
    const el = modal.querySelector('#dmtools-auth-error');
    el.textContent = message || 'Something went wrong. Please try again.';
    el.classList.add('show');
  }

  function clearError() {
    const modal = ensureModal();
    const el = modal.querySelector('#dmtools-auth-error');
    el.textContent = '';
    el.classList.remove('show');
  }

  function setBusy(isBusy) {
    const modal = ensureModal();
    const btn = modal.querySelector('#dmtools-auth-submit');
    btn.disabled = !!isBusy;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = isBusy ? 'Working…' : (btn.dataset.originalText || btn.textContent);
  }

  async function submit() {
    const modal = ensureModal();
    clearError();
    setBusy(true);

    const email = (modal.querySelector('#dmtools-auth-email').value || '').trim();
    const password = modal.querySelector('#dmtools-auth-pass').value || '';
    const firstName = (modal.querySelector('#dmtools-auth-first').value || '').trim();
    const lastName = (modal.querySelector('#dmtools-auth-last').value || '').trim();

    try {
      if (!email) throw new Error('Please enter your email.');
      if (!password) throw new Error('Please enter your password.');

      let data;
      if (state.mode === 'register') {
        data = await DMTOOLS.apiCall('/user/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            first_name: firstName || null,
            last_name: lastName || null
          })
        });
      } else {
        data = await DMTOOLS.apiCall('/user/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      }

      if (data && data.token) DMTOOLS.setToken(data.token);

      hide();
      const returnTo = state.returnTo || DEFAULTS.returnTo;
      DMTOOLS.redirectTo ? DMTOOLS.redirectTo(returnTo) : (window.location.href = returnTo);
    } catch (err) {
      showError(err?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  }

  function show(mode = 'login', options = {}) {
    const modal = ensureModal();
    state.returnTo = options.returnTo || DEFAULTS.returnTo;
    setMode(mode);
    modal.classList.add('show');

    // focus email field
    setTimeout(() => {
      const email = modal.querySelector('#dmtools-auth-email');
      if (email) email.focus();
    }, 0);
  }

  function hide() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove('show');
  }

  // Public API
  DMTOOLS.openAuthModal = function (mode = 'login', options = {}) {
    show(mode, options);
  };
  DMTOOLS.closeAuthModal = hide;

  // Auto-wire: elements with data-auth="login" or data-auth="register"
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-auth]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const mode = (el.getAttribute('data-auth') || '').toLowerCase();
        if (mode !== 'login' && mode !== 'register') return;
        e.preventDefault();
        const returnTo = el.getAttribute('data-return-to') || DEFAULTS.returnTo;
        show(mode, { returnTo });
      });
    });
  });
})();
