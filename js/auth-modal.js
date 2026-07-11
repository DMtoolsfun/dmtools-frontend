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

  function getDefaultReturnTo() {
    try {
      const path = `${window.location.pathname || ''}${window.location.search || ''}${window.location.hash || ''}`;
      if (path && path !== '/' && path !== '/index.html') return path;
    } catch (e) {}
    return DEFAULTS.returnTo;
  }

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
      .dmtools-auth-modal__password-wrap{position:relative}
      .dmtools-auth-modal__password-wrap .dmtools-auth-modal__input{padding-right:68px}
      .dmtools-auth-modal__password-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#c4b5fd;font-weight:700;cursor:pointer;padding:6px}
      .dmtools-auth-modal__hint{margin:6px 0 0;color:#9ca3af;font-size:.82rem}
      .dmtools-auth-modal__btn{width:100%;margin-top:4px;padding:12px 14px;border:0;border-radius:12px;font-weight:800;cursor:pointer;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed)}
      .dmtools-auth-modal__btn:disabled{opacity:.65;cursor:not-allowed}
      .dmtools-auth-modal__footer{margin-top:12px;text-align:center;color:#9ca3af;font-size:.95rem}
      .dmtools-auth-modal__linkbtn{background:none;border:0;color:#8b5cf6;text-decoration:underline;cursor:pointer;font-weight:700;padding:0 4px}
      .dmtools-auth-modal__terms{display:flex;align-items:flex-start;gap:8px;font-size:.88rem;color:#d1d5db}
      .dmtools-auth-modal__terms input{margin-top:2px}
      .dmtools-auth-modal__terms a{color:#a78bfa}
      .dmtools-auth-modal__terms a:hover{color:#c4b5fd}
    `;
    document.head.appendChild(style);
  }

  function trackAuthEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag !== 'function') return;
      const payload = {
        page_path: window.location.pathname || '',
        page_location: window.location.href || '',
        auth_mode: state.mode,
        return_to: state.returnTo,
        ...params
      };
      window.gtag('event', eventName, payload);
    } catch (e) {
      // no-op when analytics is not available
    }
  }

  function getStatusCode(err) {
    const status = Number(err?.status);
    return Number.isInteger(status) ? status : null;
  }

  function getSignupBackendStatus(err) {
    const status = getStatusCode(err);
    if (status === 400) return 'validation_error';
    if (status === 409) return 'duplicate_email';
    if (status === 429) return 'rate_limited';
    if (status >= 500) return 'server_error';
    return status ? 'request_failed' : 'request_error';
  }

  function getPostAuthReturnTo(isRegister) {
    const requestedReturnTo = state.returnTo || DEFAULTS.returnTo;
    if (!isRegister) return requestedReturnTo;
    if (requestedReturnTo.includes('sample=1')) return requestedReturnTo;
    if (requestedReturnTo === '/account.html?source=checkout_success') return requestedReturnTo;
    return '/app.html?source=signup_activation&sample=1';
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

        <div class="dmtools-auth-modal__row">
          <label class="dmtools-auth-modal__label" for="dmtools-auth-email">Email</label>
          <input class="dmtools-auth-modal__input" id="dmtools-auth-email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />
        </div>
        <div class="dmtools-auth-modal__row">
          <label class="dmtools-auth-modal__label" for="dmtools-auth-pass">Password</label>
          <div class="dmtools-auth-modal__password-wrap">
            <input class="dmtools-auth-modal__input" id="dmtools-auth-pass" type="password" autocomplete="current-password" placeholder="Your password" required />
            <button class="dmtools-auth-modal__password-toggle" type="button" id="dmtools-auth-password-toggle" aria-label="Show password" aria-pressed="false">Show</button>
          </div>
          <p class="dmtools-auth-modal__hint" id="dmtools-auth-password-hint" hidden>Use at least 6 characters.</p>
        </div>
        <div class="dmtools-auth-modal__row" id="dmtools-auth-terms-row" style="display:none">
          <label class="dmtools-auth-modal__terms">
            <input id="dmtools-auth-terms" type="checkbox" />
            <span>
              I agree to the <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
            </span>
          </label>
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
    modal.querySelector('#dmtools-auth-password-toggle').addEventListener('click', () => {
      const pass = modal.querySelector('#dmtools-auth-pass');
      const toggle = modal.querySelector('#dmtools-auth-password-toggle');
      const isVisible = pass.type === 'text';
      pass.type = isVisible ? 'password' : 'text';
      toggle.textContent = isVisible ? 'Show' : 'Hide';
      toggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
      toggle.setAttribute('aria-pressed', String(!isVisible));
      pass.focus();
    });
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      if (e.target.closest('a, button')) return;
      e.preventDefault();
      submit();
    });

    return modal;
  }

  const state = {
    mode: 'login',
    returnTo: DEFAULTS.returnTo,
    submitting: false
  };

  function setMode(mode) {
    const modal = ensureModal();
    state.mode = mode === 'register' ? 'register' : 'login';

    const title = modal.querySelector('#dmtools-auth-title');
    const subtitle = modal.querySelector('#dmtools-auth-subtitle');
    const submitBtn = modal.querySelector('#dmtools-auth-submit');
    const switchText = modal.querySelector('#dmtools-auth-switch-text');
    const switchBtn = modal.querySelector('#dmtools-auth-switch-btn');
    const pass = modal.querySelector('#dmtools-auth-pass');
    const passHint = modal.querySelector('#dmtools-auth-password-hint');
    const passToggle = modal.querySelector('#dmtools-auth-password-toggle');
    const termsRow = modal.querySelector('#dmtools-auth-terms-row');
    const terms = modal.querySelector('#dmtools-auth-terms');

    if (state.mode === 'register') {
      title.textContent = 'Create Account';
      subtitle.textContent = 'Try your first reply free';
      termsRow.style.display = '';
      terms.checked = false;
      submitBtn.textContent = 'Create Account';
      switchText.textContent = 'Already have an account?';
      switchBtn.textContent = 'Sign In';
      pass.autocomplete = 'new-password';
      pass.minLength = 6;
      passHint.hidden = false;
    } else {
      title.textContent = 'Sign In';
      subtitle.textContent = 'Access your account';
      termsRow.style.display = 'none';
      terms.checked = false;
      submitBtn.textContent = 'Sign In';
      switchText.textContent = "Don't have an account?";
      switchBtn.textContent = 'Sign Up';
      pass.autocomplete = 'current-password';
      pass.removeAttribute('minlength');
      passHint.hidden = true;
    }

    pass.type = 'password';
    passToggle.textContent = 'Show';
    passToggle.setAttribute('aria-label', 'Show password');
    passToggle.setAttribute('aria-pressed', 'false');
    submitBtn.dataset.originalText = submitBtn.textContent;

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
    if (state.submitting) return;
    state.submitting = true;
    const modal = ensureModal();
    clearError();
    setBusy(true);

    const emailInput = modal.querySelector('#dmtools-auth-email');
    const email = (emailInput.value || '').trim();
    const password = modal.querySelector('#dmtools-auth-pass').value || '';
    const termsAccepted = !!modal.querySelector('#dmtools-auth-terms')?.checked;
    const isRegister = state.mode === 'register';
    let signupRequestStarted = false;

    try {
      if (!email) throw new Error('Please enter your email.');
      if (!emailInput.validity.valid) throw new Error('Please enter a valid email address.');
      if (!password) throw new Error('Please enter your password.');
      if (isRegister && password.length < 6) throw new Error('Use at least 6 characters for your password.');
      if (isRegister && !termsAccepted) {
        throw new Error('Please agree to the Terms and Conditions to continue.');
      }

      const attemptParams = {
        surface: 'auth_modal',
        source: 'auth_modal'
      };
      if (isRegister) {
        attemptParams.plan = 'free';
        attemptParams.signup_fields = 2;
      }
      trackAuthEvent(isRegister ? 'sign_up_attempt' : 'login_attempt', attemptParams);

      if (!window.DMTOOLS || typeof DMTOOLS.apiCall !== 'function') {
        throw new Error('Authentication service is not ready.');
      }

      let data;
      if (isRegister) {
        signupRequestStarted = true;
        data = await DMTOOLS.apiCall('/user/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            terms_accepted: true
          })
        });
      } else {
        data = await DMTOOLS.apiCall('/user/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      }

      if (isRegister && data?.accountCreated !== true) {
        throw new Error('Your account could not be confirmed. Please try again.');
      }

      if (data && data.token) DMTOOLS.setToken(data.token);

      if (!isRegister) {
        trackAuthEvent('login_success', {
          user_plan: data?.user?.plan || 'free'
        });
      }

      hide();
      const returnTo = getPostAuthReturnTo(isRegister);
      DMTOOLS.redirectTo ? DMTOOLS.redirectTo(returnTo) : (window.location.href = returnTo);
    } catch (err) {
      const statusCode = getStatusCode(err);
      const accountCreated = isRegister && err?.data?.accountCreated === true;
      const authErrorParams = {
        auth_mode: state.mode,
        return_to: state.returnTo,
        backend_status: isRegister ? getSignupBackendStatus(err) : 'auth_failed'
      };
      if (statusCode) authErrorParams.status_code = statusCode;

      if (isRegister && signupRequestStarted && accountCreated) {
        trackAuthEvent('signup_recovery_required', {
          surface: 'auth_modal',
          source: 'auth_modal',
          plan: 'free',
          backend_status: getSignupBackendStatus(err),
          account_created: true,
          ...(statusCode ? { status_code: statusCode } : {})
        });
      } else if (isRegister && signupRequestStarted) {
        trackAuthEvent('free_account_create_error', {
          surface: 'auth_modal',
          source: 'auth_modal',
          plan: 'free',
          backend_status: getSignupBackendStatus(err),
          account_created: false,
          ...(statusCode ? { status_code: statusCode } : {})
        });
      }

      trackAuthEvent('auth_error', authErrorParams);
      if (accountCreated) {
        setMode('login');
        showError(err?.message || 'Your account was created, but automatic sign-in failed. Sign in with the same email and password.');
      } else {
        showError(err?.message || 'Authentication failed.');
      }
    } finally {
      state.submitting = false;
      setBusy(false);
    }
  }

  function show(mode = 'login', options = {}) {
    const modal = ensureModal();
    state.returnTo = options.returnTo || getDefaultReturnTo();
    setMode(mode);
    const email = modal.querySelector('#dmtools-auth-email');
    const password = modal.querySelector('#dmtools-auth-pass');
    const prefillEmail = options.email || options.prefillEmail || '';
    if (email && prefillEmail) email.value = String(prefillEmail);
    if (password && prefillEmail) password.value = '';
    modal.classList.add('show');

    // focus email field
    setTimeout(() => {
      if (email) email.focus();
    }, 0);
  }

  function hide() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove('show');
    const email = modal.querySelector('#dmtools-auth-email');
    const password = modal.querySelector('#dmtools-auth-pass');
    const terms = modal.querySelector('#dmtools-auth-terms');
    if (email) email.value = '';
    if (password) password.value = '';
    if (terms) terms.checked = false;
    clearError();
  }

  // Public API
  DMTOOLS.openAuthModal = function (mode = 'login', options = {}) {
    show(mode, options);
  };
  DMTOOLS.closeAuthModal = hide;

  // Auto-wire: elements with data-auth="login" or data-auth="register"
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-auth]');
    if (!el) return;
    const mode = (el.getAttribute('data-auth') || '').toLowerCase();
    if (mode !== 'login' && mode !== 'register') return;
    e.preventDefault();
    const returnTo = el.getAttribute('data-return-to') || getDefaultReturnTo();
    trackAuthEvent('auth_modal_open', {
      auth_mode: mode,
      return_to: returnTo,
      trigger_text: String(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 60)
    });
    show(mode, { returnTo });
  });
})();
