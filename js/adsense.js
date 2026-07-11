(function(window, document) {
  'use strict';

  var CLIENT_ID = 'ca-pub-6880722421565428';
  var SCRIPT_ID = 'dmtools-adsense-script';
  var SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT_ID;

  var UNITS = {
    responsive: {
      slot: '2762064128',
      format: 'auto',
      fullWidthResponsive: true,
      className: 'ad-placement--display'
    },
    inArticle: {
      slot: '4122834560',
      format: 'fluid',
      layout: 'in-article',
      className: 'ad-placement--article'
    },
    related: {
      slot: '9247581421',
      format: 'autorelaxed',
      className: 'ad-placement--related'
    }
  };

  function toBool(value) {
    return value === true || value === 'true';
  }

  function unitFromName(name) {
    if (name === 'in-article' || name === 'inArticle') return UNITS.inArticle;
    if (name === 'related' || name === 'autorelaxed') return UNITS.related;
    return UNITS.responsive;
  }

  function mergeConfig(base, overrides) {
    var config = {};
    Object.keys(base || {}).forEach(function(key) {
      config[key] = base[key];
    });
    Object.keys(overrides || {}).forEach(function(key) {
      if (overrides[key] !== undefined && overrides[key] !== null && overrides[key] !== '') {
        config[key] = overrides[key];
      }
    });
    return config;
  }

  function configFromElement(element) {
    var base = unitFromName(element.getAttribute('data-dmtools-ad'));
    return mergeConfig(base, {
      slot: element.getAttribute('data-ad-slot'),
      format: element.getAttribute('data-ad-format'),
      layout: element.getAttribute('data-ad-layout'),
      label: element.getAttribute('data-ad-label'),
      className: element.getAttribute('data-ad-class'),
      fullWidthResponsive: element.hasAttribute('data-full-width-responsive')
        ? toBool(element.getAttribute('data-full-width-responsive'))
        : base.fullWidthResponsive
    });
  }

  function ensureScript() {
    var existing = document.getElementById(SCRIPT_ID) ||
      document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"][src*="client=' + CLIENT_ID + '"]');

    if (existing) {
      if (!existing.id) existing.id = SCRIPT_ID;
      return existing;
    }

    var script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
    return script;
  }

  function createAd(config) {
    var wrapper = document.createElement('aside');
    wrapper.className = ['ad-placement', config.className].filter(Boolean).join(' ');
    wrapper.setAttribute('aria-label', config.label || 'Advertisement');

    var label = document.createElement('div');
    label.className = 'ad-placement__label';
    label.textContent = config.label || 'Advertisement';

    var ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.setAttribute('data-ad-client', CLIENT_ID);
    ad.setAttribute('data-ad-slot', config.slot);

    if (config.format) {
      ad.setAttribute('data-ad-format', config.format);
    }

    if (config.layout) {
      ad.setAttribute('data-ad-layout', config.layout);
    }

    if (config.fullWidthResponsive !== undefined) {
      ad.setAttribute('data-full-width-responsive', String(!!config.fullWidthResponsive));
    }

    wrapper.appendChild(label);
    wrapper.appendChild(ad);
    return wrapper;
  }

  function initialize(wrapper) {
    var ad = wrapper && wrapper.querySelector ? wrapper.querySelector('ins.adsbygoogle') : null;
    if (!ad || ad.getAttribute('data-adsense-initialized') === 'true') return;

    ensureScript();

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ad.setAttribute('data-adsense-initialized', 'true');
      wrapper.setAttribute('data-adsense-initialized', 'true');
    } catch (error) {
      wrapper.setAttribute('data-adsense-initialized', 'failed');
      if (window.console && typeof window.console.warn === 'function') {
        window.console.warn('DMTools AdSense placement failed to initialize.', error);
      }
    }
  }

  function render(container, props) {
    var target = typeof container === 'string' ? document.querySelector(container) : container;
    if (!target || target.getAttribute('data-ad-rendered') === 'true') return null;

    var config = mergeConfig(unitFromName(props && props.unit), props || {});
    if (!config.slot) return null;

    var ad = createAd(config);
    target.appendChild(ad);
    target.setAttribute('data-ad-rendered', 'true');
    initialize(ad);
    return ad;
  }

  function renderAll(root) {
    var scope = root || document;
    var placements = scope.querySelectorAll('[data-dmtools-ad]');

    Array.prototype.forEach.call(placements, function(placement) {
      if (placement.getAttribute('data-ad-rendered') === 'true') return;

      var config = configFromElement(placement);
      if (!config.slot) return;

      var ad = createAd(config);
      placement.appendChild(ad);
      placement.setAttribute('data-ad-rendered', 'true');
      initialize(ad);
    });
  }

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  window.DMTOOLS = window.DMTOOLS || {};

  // AdSense is intentionally limited to public content and marketing surfaces,
  // never auth, checkout, account, admin, extension onboarding, or generator flows.
  window.DMTOOLS.ads = {
    units: UNITS,
    createAd: createAd,
    initialize: initialize,
    render: render,
    renderAll: renderAll
  };

  onReady(function() {
    renderAll(document);
  });
})(window, document);
