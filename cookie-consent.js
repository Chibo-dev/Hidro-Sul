/*
 * Hidro Sul — Banner de consentimento de cookies (LGPD)
 * --------------------------------------------------------------------------
 * Componente único, compartilhado por todas as páginas do site.
 * Inclua antes de </body> em cada página:
 *   <script src="cookie-consent.js" defer></script>
 *
 * O componente injeta o próprio CSS, o aviso de cookies e o painel de
 * preferências. A escolha do usuário fica registrada em localStorage.
 *
 * PONTO DE INTEGRAÇÃO: quando adicionar ferramentas que dependem de
 * consentimento (ex.: Google Analytics), carregue-as dentro de applyConsent(),
 * verificando as flags data.desempenho e data.funcionalidade.
 */
(function () {
  'use strict';

  if (window.HidroSulCookies) return; // evita inicialização dupla

  var CONSENT_KEY = 'hidrosul_cookie_consent';
  var CONSENT_VERSION = 1;

  /* ============================ ARMAZENAMENTO ============================ */
  function getConsent() {
    try {
      var raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(desempenho, funcionalidade) {
    var data = {
      v: CONSENT_VERSION,
      necessarios: true,
      desempenho: !!desempenho,
      funcionalidade: !!funcionalidade,
      data: new Date().toISOString()
    };
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    } catch (e) {}
    applyConsent(data);
    return data;
  }

  function applyConsent(data) {
    window.HidroSulCookieConsent = data;
    // >>> Carregue aqui ferramentas que dependem de consentimento:
    //   if (data.desempenho)    { /* inicializar analytics */ }
    //   if (data.funcionalidade) { /* inicializar recursos opcionais */ }
    try {
      document.dispatchEvent(new CustomEvent('hidrosul:cookieconsent', { detail: data }));
    } catch (e) {}
  }

  /* =============================== ESTILOS =============================== */
  function injectStyles() {
    if (document.getElementById('hs-cc-styles')) return;
    var css =
      '.hs-cc-banner,.hs-cc-overlay,.hs-cc-modal,.hs-cc-btn{box-sizing:border-box;}' +
      '.hs-cc-banner{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);' +
        'width:calc(100% - 40px);max-width:1060px;background:#0f1d35;color:#e8edf3;' +
        'border:1px solid rgba(255,255,255,0.12);border-radius:8px;' +
        'box-shadow:0 18px 48px rgba(15,29,53,0.45);z-index:2147483000;padding:22px 26px;' +
        "font-family:'IBM Plex Sans',system-ui,sans-serif;animation:hs-cc-up .3s ease;}" +
      '@keyframes hs-cc-up{from{opacity:0;transform:translateX(-50%) translateY(16px);}' +
        'to{opacity:1;transform:translateX(-50%) translateY(0);}}' +
      '.hs-cc-banner-inner{display:flex;align-items:center;gap:28px;}' +
      '.hs-cc-banner-text{flex:1;font-size:13.5px;line-height:1.6;color:#c5cdd6;}' +
      ".hs-cc-banner-text strong{display:block;font-family:'Archivo',sans-serif;font-size:15px;" +
        'font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:-0.01em;}' +
      '.hs-cc-banner-text a{color:#25D366;text-decoration:none;}' +
      '.hs-cc-banner-text a:hover{text-decoration:underline;}' +
      '.hs-cc-banner-actions{display:flex;gap:10px;flex-shrink:0;}' +
      ".hs-cc-btn{font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13.5px;" +
        'font-weight:600;padding:11px 18px;border-radius:4px;cursor:pointer;' +
        'border:1px solid transparent;transition:all .18s;white-space:nowrap;}' +
      '.hs-cc-btn-primary{background:#25D366;color:#0f1d35;}' +
      '.hs-cc-btn-primary:hover{background:#1aa84d;color:#fff;}' +
      '.hs-cc-btn-ghost{background:transparent;color:#e8edf3;border-color:rgba(255,255,255,0.25);}' +
      '.hs-cc-btn-ghost:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.5);}' +
      '.hs-cc-btn-ghost-dark{background:transparent;color:#1a2942;border-color:#d8dde4;}' +
      '.hs-cc-btn-ghost-dark:hover{background:#f7f8fa;border-color:#8a93a0;}' +
      '.hs-cc-overlay{position:fixed;inset:0;background:rgba(15,29,53,0.6);z-index:2147483100;' +
        'display:flex;align-items:center;justify-content:center;padding:24px;}' +
      ".hs-cc-modal{background:#fff;border-radius:8px;width:100%;max-width:560px;" +
        'max-height:calc(100vh - 48px);overflow-y:auto;' +
        "font-family:'IBM Plex Sans',system-ui,sans-serif;" +
        'box-shadow:0 24px 64px rgba(15,29,53,0.35);animation:hs-cc-pop .25s ease;}' +
      '@keyframes hs-cc-pop{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}' +
      '.hs-cc-modal:focus{outline:none;}' +
      '.hs-cc-modal-head{display:flex;align-items:center;justify-content:space-between;' +
        'padding:24px 26px;border-bottom:1px solid rgba(15,29,53,0.08);}' +
      ".hs-cc-modal-head h2{margin:0;font-family:'Archivo',sans-serif;font-size:20px;" +
        'font-weight:700;color:#0f1d35;letter-spacing:-0.015em;}' +
      '.hs-cc-modal-close{background:none;border:none;cursor:pointer;font-size:26px;' +
        'line-height:1;color:#8a93a0;padding:0 4px;}' +
      '.hs-cc-modal-close:hover{color:#0f1d35;}' +
      '.hs-cc-modal-body{padding:22px 26px;}' +
      '.hs-cc-modal-intro{margin:0 0 18px;font-size:14px;line-height:1.6;color:#404956;}' +
      '.hs-cc-modal-intro a{color:#15722f;font-weight:500;}' +
      '.hs-cc-cat{padding:16px 0;border-top:1px solid rgba(15,29,53,0.08);}' +
      '.hs-cc-cat:first-of-type{border-top:none;}' +
      '.hs-cc-cat-head{display:flex;align-items:center;justify-content:space-between;gap:16px;}' +
      ".hs-cc-cat-name{font-family:'Archivo',sans-serif;font-weight:600;font-size:15px;color:#0f1d35;}" +
      '.hs-cc-cat-desc{margin:6px 0 0;font-size:13px;line-height:1.55;color:#404956;}' +
      '.hs-cc-switch{position:relative;width:42px;height:24px;flex-shrink:0;}' +
      '.hs-cc-switch input{position:absolute;opacity:0;width:0;height:0;}' +
      '.hs-cc-track{position:absolute;inset:0;background:#d8dde4;border-radius:50px;' +
        'cursor:pointer;transition:background .2s;}' +
      ".hs-cc-track::before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;" +
        'background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(15,29,53,0.4);}' +
      '.hs-cc-switch input:checked + .hs-cc-track{background:#25D366;}' +
      '.hs-cc-switch input:checked + .hs-cc-track::before{transform:translateX(18px);}' +
      '.hs-cc-switch input:disabled + .hs-cc-track{cursor:not-allowed;opacity:0.55;}' +
      '.hs-cc-switch input:focus-visible + .hs-cc-track{box-shadow:0 0 0 3px rgba(37,211,102,0.35);}' +
      '.hs-cc-modal-foot{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;' +
        'padding:20px 26px;border-top:1px solid rgba(15,29,53,0.08);}' +
      '.hs-cc-prefs-link{background:none;border:none;padding:0;margin:0;' +
        "font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:12px;color:#c5cdd6;cursor:pointer;}" +
      '.hs-cc-prefs-link:hover{color:#fff;}' +
      '@media (max-width:720px){' +
        '.hs-cc-banner-inner{flex-direction:column;align-items:stretch;gap:16px;}' +
        '.hs-cc-banner-actions{flex-direction:column;}' +
        '.hs-cc-btn{width:100%;}' +
        '.hs-cc-modal-foot{flex-direction:column;}' +
        '.hs-cc-modal-foot .hs-cc-btn{width:100%;}}';
    var style = document.createElement('style');
    style.id = 'hs-cc-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* =============================== BANNER ================================ */
  var bannerEl = null;

  function buildBanner() {
    bannerEl = document.createElement('div');
    bannerEl.className = 'hs-cc-banner';
    bannerEl.setAttribute('role', 'region');
    bannerEl.setAttribute('aria-label', 'Aviso de cookies');
    bannerEl.innerHTML =
      '<div class="hs-cc-banner-inner">' +
        '<div class="hs-cc-banner-text">' +
          '<strong>Este site usa cookies</strong>' +
          'Utilizamos cookies para garantir o funcionamento do site e melhorar a sua ' +
          'experiência. Você pode aceitar todos, recusar os não essenciais ou personalizar ' +
          'as suas preferências. Veja a <a href="politica-de-cookies.html">Política de Cookies</a>.' +
        '</div>' +
        '<div class="hs-cc-banner-actions">' +
          '<button type="button" class="hs-cc-btn hs-cc-btn-ghost" data-cc="customize">Personalizar</button>' +
          '<button type="button" class="hs-cc-btn hs-cc-btn-ghost" data-cc="reject">Recusar</button>' +
          '<button type="button" class="hs-cc-btn hs-cc-btn-primary" data-cc="accept">Aceitar todos</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bannerEl);
  }

  function removeBanner() {
    if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }

  /* =============================== MODAL ================================= */
  var overlayEl = null, modalEl = null;

  function buildModal() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'hs-cc-overlay';
    overlayEl.style.display = 'none';
    modalEl = document.createElement('div');
    modalEl.className = 'hs-cc-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-labelledby', 'hs-cc-modal-title');
    modalEl.setAttribute('tabindex', '-1');
    modalEl.innerHTML =
      '<div class="hs-cc-modal-head">' +
        '<h2 id="hs-cc-modal-title">Preferências de cookies</h2>' +
        '<button type="button" class="hs-cc-modal-close" data-cc="close" aria-label="Fechar">&times;</button>' +
      '</div>' +
      '<div class="hs-cc-modal-body">' +
        '<p class="hs-cc-modal-intro">Escolha quais categorias de cookies deseja permitir. ' +
        'Os cookies estritamente necessários estão sempre ativos. Saiba mais na ' +
        '<a href="politica-de-cookies.html">Política de Cookies</a>.</p>' +
        '<div class="hs-cc-cat">' +
          '<div class="hs-cc-cat-head">' +
            '<span class="hs-cc-cat-name">Estritamente necessários</span>' +
            '<label class="hs-cc-switch"><input type="checkbox" checked disabled ' +
              'aria-label="Cookies estritamente necessarios, sempre ativos"><span class="hs-cc-track"></span></label>' +
          '</div>' +
          '<p class="hs-cc-cat-desc">Essenciais para o funcionamento e a segurança do site, ' +
          'incluindo o registro desta preferência. Não podem ser desativados.</p>' +
        '</div>' +
        '<div class="hs-cc-cat">' +
          '<div class="hs-cc-cat-head">' +
            '<span class="hs-cc-cat-name">Desempenho e análise</span>' +
            '<label class="hs-cc-switch"><input type="checkbox" data-cat="desempenho" ' +
              'aria-label="Cookies de desempenho e analise"><span class="hs-cc-track"></span></label>' +
          '</div>' +
          '<p class="hs-cc-cat-desc">Ajudam a entender, de forma agregada e anônima, como os ' +
          'visitantes utilizam o site, para que possamos melhorá-lo.</p>' +
        '</div>' +
        '<div class="hs-cc-cat">' +
          '<div class="hs-cc-cat-head">' +
            '<span class="hs-cc-cat-name">Funcionalidade</span>' +
            '<label class="hs-cc-switch"><input type="checkbox" data-cat="funcionalidade" ' +
              'aria-label="Cookies de funcionalidade"><span class="hs-cc-track"></span></label>' +
          '</div>' +
          '<p class="hs-cc-cat-desc">Permitem que o site lembre escolhas feitas por você, ' +
          'oferecendo uma experiência de navegação mais personalizada.</p>' +
        '</div>' +
      '</div>' +
      '<div class="hs-cc-modal-foot">' +
        '<button type="button" class="hs-cc-btn hs-cc-btn-ghost-dark" data-cc="reject">Recusar</button>' +
        '<button type="button" class="hs-cc-btn hs-cc-btn-ghost-dark" data-cc="accept">Aceitar todos</button>' +
        '<button type="button" class="hs-cc-btn hs-cc-btn-primary" data-cc="save">Salvar preferências</button>' +
      '</div>';
    overlayEl.appendChild(modalEl);
    document.body.appendChild(overlayEl);
  }

  function setToggle(cat, value) {
    var inp = modalEl.querySelector('input[data-cat="' + cat + '"]');
    if (inp) inp.checked = !!value;
  }

  function getToggle(cat) {
    var inp = modalEl.querySelector('input[data-cat="' + cat + '"]');
    return inp ? inp.checked : false;
  }

  function openModal() {
    var c = getConsent() || { desempenho: false, funcionalidade: false };
    setToggle('desempenho', c.desempenho);
    setToggle('funcionalidade', c.funcionalidade);
    overlayEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modalEl.focus();
  }

  function closeModal() {
    overlayEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  function finish() {
    closeModal();
    removeBanner();
  }

  /* =========================== LINK NO RODAPÉ ============================ */
  function injectFooterLink() {
    var span = document.querySelector('.footer-bottom span');
    if (!span || span.querySelector('.hs-cc-prefs-link')) return;
    span.appendChild(document.createTextNode(' · '));
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hs-cc-prefs-link';
    btn.setAttribute('data-cc', 'customize');
    btn.textContent = 'Preferências de cookies';
    span.appendChild(btn);
  }

  /* ============================== EVENTOS ================================ */
  function handleAction(action) {
    if (action === 'accept') { saveConsent(true, true); finish(); }
    else if (action === 'reject') { saveConsent(false, false); finish(); }
    else if (action === 'save') { saveConsent(getToggle('desempenho'), getToggle('funcionalidade')); finish(); }
    else if (action === 'customize') { openModal(); }
    else if (action === 'close') { closeModal(); }
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      if (e.target === overlayEl) { closeModal(); return; }
      var node = e.target;
      if (!node || node.nodeType !== 1 || !node.closest) return;
      var trigger = node.closest('[data-cc]');
      if (trigger) handleAction(trigger.getAttribute('data-cc'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlayEl && overlayEl.style.display !== 'none') closeModal();
    });
  }

  /* =============================== INIT ================================== */
  window.HidroSulCookies = {
    open: openModal,
    get: getConsent,
    reset: function () {
      try { window.localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    }
  };

  function init() {
    injectStyles();
    buildModal();
    injectFooterLink();
    bindEvents();
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      buildBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ==========================================================================
 * Menu de navegação responsivo (hambúrguer)
 * ========================================================================== */
(function () {
  function initNav() {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    var root = document.documentElement;

    function setOpen(open) {
      root.classList.toggle('hs-nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }

    btn.addEventListener('click', function () {
      setOpen(!root.classList.contains('hs-nav-open'));
    });

    /* Fecha o menu ao tocar num link de navegação (mas não no item "Serviços"). */
    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link && !e.target.closest('.nav-link.has-dropdown')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('hs-nav-open')) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
