/* ==========================================================================
   Jefes a Punto — comportamiento de la maqueta (sin backend)
   Componentes compartidos, estados de maqueta, menú lámina, formularios.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Datos ---------- */

  const MODULES = [
    { n: 1, slug: 'bienvenida', es: 'Bienvenida e introducción', en: 'Welcome and introduction' },
    { n: 2, slug: 'comunicacion', es: 'Comunicación con el equipo', en: 'Communicating with the team' },
    { n: 3, slug: 'delegacion', es: 'Delegación efectiva', en: 'Effective delegation' },
    { n: 4, slug: 'feedback', es: 'Feedback y conversaciones difíciles', en: 'Feedback and difficult conversations' },
    { n: 5, slug: 'prioridades', es: 'Prioridades y gestión del tiempo', en: 'Priorities and time management' },
    { n: 6, slug: 'cierre', es: 'Cierre y plan de acción', en: 'Closing and action plan' }
  ];

  const SCREENS = [
    { n: '00', file: '00-componentes.html', name: 'Componentes', route: 'Biblioteca de la maqueta', states: [] },
    { n: '01', file: '01-home.html', name: 'Home pública', route: '/ (ruta pendiente)', states: [['dos-opiniones', 'Con dos opiniones'], ['sin-opiniones', 'Sin opiniones'], ['sesion', 'Sesión iniciada']] },
    { n: '02', file: '02-registro.html', name: 'Registro', route: '/accounts/register/', states: [['vacio', 'Vacío'], ['error', 'Email usado y sin consentimiento'], ['exito', 'Éxito']] },
    { n: '03', file: '03-ingreso.html', name: 'Ingreso', route: '/accounts/login/', states: [['vacio', 'Vacío'], ['error', 'Credenciales incorrectas']] },
    { n: '04', file: '04-recuperar.html', name: 'Recuperar contraseña', route: '/accounts/password-reset/', states: [['paso-1', '1 · Pedir correo'], ['paso-2', '2 · Correo enviado'], ['paso-3', '3 · Nueva contraseña'], ['paso-4', '4 · Listo']] },
    { n: '05', file: '05-acceso-denegado.html', name: 'Acceso denegado', route: '/accounts/access-denied/', states: [['sin-acceso', 'Sin matrícula'], ['caducada', 'Matrícula caducada']] },
    { n: '06', file: '06-perfil.html', name: 'Perfil', route: '/accounts/profile/', states: [['sin-matricula', 'Sin matrícula'], ['vigente', 'Vigente'], ['caducada', 'Caducada']] },
    { n: '07', file: '07-mis-cursos.html', name: 'Mis cursos', route: '/curso/', states: [['con-curso', 'Con curso'], ['vacio', 'Vacío']] },
    { n: '08', file: '08-modulos.html', name: 'Módulos del curso', route: '/curso/jefes-a-punto/', states: [['algunos', 'Algunos completados'], ['ninguno', 'Todos pendientes'], ['todos', 'Los seis completados']] },
    { n: '09', file: '09-modulo.html', name: 'Detalle de módulo', route: '/curso/jefes-a-punto/<slug>/', states: [['completo', 'Recursos completos'], ['sin-recursos', 'Sin vídeo ni PDF'], ['completado', 'Módulo completado'], ['staff', 'Staff · no publicado']] },
    { n: '10', file: '10-opinion.html', name: 'Opinión', route: 'Opinión (ruta pendiente)', states: [['no-enviada', 'No enviada'], ['pendiente', 'Pendiente de revisión'], ['publicada', 'Publicada']] },
    { n: '11', file: '11-legal.html', name: 'Legales', route: 'Legal (ruta pendiente)', states: [], links: [['?doc=privacidad&ambito=latam', 'Privacidad · LATAM'], ['?doc=terminos&ambito=espana', 'Términos · España'], ['?doc=consentimiento&ambito=espana', 'Consentimiento · España']] },
    { n: '12', file: '12-curso-completado.html', name: 'Curso completado', route: 'Estado de /curso/jefes-a-punto/', states: [] }
  ];

  const I18N = {
    es: {
      home: 'Inicio', login: 'Entrar', register: 'Crear cuenta', course: 'Curso', account: 'Mi cuenta', logout: 'Salir',
      menu: 'Menú', closeMenu: 'Cerrar menú', navigation: 'Navegación', mainNav: 'Navegación principal',
      faq: 'Preguntas frecuentes', privacy: 'Privacidad', terms: 'Términos', consent: 'Consentimiento',
      legal: 'Legal', scope: 'Ámbito legal', latam: 'LATAM', espana: 'España',
      tagline: 'Curso virtual para quienes dirigen equipos.', footerNote: 'El pago se gestiona fuera de esta plataforma.',
      module: 'Módulo', modules: 'Módulos', courseModules: 'Módulos del curso', closeModules: 'Cerrar índice de módulos',
      anyOrder: 'Seis módulos, en el orden que prefieras', youAreHere: 'Estás aquí',
      completed: 'Completado', pending: 'Pendiente', moduleText: 'Introducción, vídeo, texto de apoyo y PDF.',
      homeModuleText: 'Introducción, vídeo, texto y PDF. Contenido pendiente del cliente.',
      progress: (c) => `<strong>${c} de 6</strong> módulos completados`,
      missing: (m) => m === 1 ? 'Falta 1 módulo por aprobación del equipo.' : `Faltan ${m} módulos por aprobación del equipo.`,
      prev: 'Anterior', next: 'Siguiente', prevOpinion: 'Opinión anterior', nextOpinion: 'Opinión siguiente', es: 'Español'
    }
  };

  const BADGES = {
    vigente: 'Vigente', caducada: 'Caducada', 'sin-acceso': 'Sin acceso', completado: 'Completado',
    pendiente: 'Pendiente', 'no-publicado': 'No publicado', 'en-revision': 'En revisión', publicada: 'Publicada'
  };

  const LEGAL_DOCS = {
    privacidad: 'Política de privacidad',
    terminos: 'Términos y condiciones',
    consentimiento: 'Consentimiento de datos'
  };
  const SCOPES = { latam: 'LATAM', espana: 'España' };

  const USER = { name: 'Ana María Torres', greet: 'Ana María' };

  const ICONS = {
    close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M7.5 16.5l9-9M9 7.5h7.5V15"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14.5 5.5L8 12l6.5 6.5"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9.5 5.5L16 12l-6.5 6.5"/></svg>'
  };

  /* ---------- Utilidades ---------- */

  const STORE = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* file:// sin storage */ } }
  };

  const lang = 'es';
  let scope = STORE.get('jap-scope', 'latam');
  if (!SCOPES[scope]) scope = 'latam';
  let currentState = null;
  let lastTrigger = null;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, '0');
  const t = (k, ...a) => {
    const v = (I18N[lang] && I18N[lang][k] !== undefined) ? I18N[lang][k] : I18N.es[k];
    return typeof v === 'function' ? v(...a) : (v !== undefined ? v : k);
  };
  const modTitle = (m) => m[lang] || m.es;
  const params = new URLSearchParams(location.search);

  function badge(kind, label) {
    const text = label || (kind === 'completado' ? t('completed') : kind === 'pendiente' ? t('pending') : BADGES[kind]);
    return `<span class="badge badge--${kind}">${text}</span>`;
  }

  function currentModule() {
    const host = $('[data-module-page]');
    const slug = params.get('m') || (host && host.dataset.defaultModule) || 'delegacion';
    return MODULES.find((m) => m.slug === slug) || MODULES[2];
  }

  function completedSet() {
    const host = $('[data-completed]');
    if (!host) return [];
    let map;
    try { map = JSON.parse(host.dataset.completed); } catch (e) { return []; }
    let list = map[currentState] || map.default || [];
    if ($('[data-module-page]')) {
      const cur = currentModule().n;
      const includesCurrent = list.includes('current');
      list = list.filter((n) => n !== 'current' && n !== cur);
      if (includesCurrent) list.push(cur);
    }
    return list;
  }

  /* ---------- Cabecera, menú lámina y pie ---------- */

  function navItems(links, current, session) {
    return links.map((l) => {
      const item = `<li><a class="site-nav__link${l.cta ? ' site-nav__link--cta' : ''}" href="${l.href}"${l.id === current ? ' aria-current="page"' : ''}>${t(l.k)}</a></li>`;
      if (session === 'user' && l.id === 'cuenta') {
        return `${item}<li><p class="site-nav__hello">Hola, ${USER.greet}</p></li>`;
      }
      return item;
    }).join('');
  }

  function renderHeader(el, idx) {
    const session = el.dataset.session || 'anon';
    const current = el.dataset.current || '';
    const dark = el.dataset.variant === 'dark';
    const id = `menu-${idx}`;
    const links = session === 'user'
      ? [
          { k: 'home', href: '01-home.html?estado=sesion', id: 'inicio' },
          { k: 'course', href: el.dataset.courseHref || '07-mis-cursos.html', id: 'curso' },
          { k: 'account', href: el.dataset.accountHref || '06-perfil.html?estado=vigente', id: 'cuenta' },
          { k: 'logout', href: '01-home.html', id: 'salir' }
        ]
      : [
          { k: 'home', href: '01-home.html', id: 'inicio' },
          { k: 'login', href: '03-ingreso.html', id: 'entrar' },
          { k: 'register', href: '02-registro.html', id: 'registro', cta: true }
        ];
    const cur = (l) => (l.id === current ? ' aria-current="page"' : '');

    el.innerHTML = `
      <header class="site-header${dark ? ' site-header--dark on-dark' : ''}">
        <div class="container site-header__inner">
          <a class="brand" href="${links[0].href}" aria-label="Jefes a Punto, ${t('home')}">
            <span class="brand__mark" aria-hidden="true">J</span>
          </a>
          <nav class="site-nav" aria-label="${t('mainNav')}">
            <ul class="site-nav__list">
              ${navItems(links, current, session)}
            </ul>
          </nav>
          <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="${id}" data-sheet-open="${id}">
            <span class="menu-toggle__icon" aria-hidden="true"></span>${t('menu')}
          </button>
        </div>
      </header>
      <div class="sheet" id="${id}" role="dialog" aria-modal="true" aria-label="${t('menu')}" hidden>
        <div class="sheet__paper">
          <div class="sheet__inner">
            <button type="button" class="sheet__close" data-sheet-close aria-label="${t('closeMenu')}">${ICONS.close}</button>
            <p class="sheet__divider"><span>${t('navigation')}</span></p>
            ${session === 'user' ? `<p class="sheet__user">Hola, ${USER.greet}</p>` : ''}
            <ul class="sheet-list">
              ${links.map((l) => `<li><a class="sheet-link" href="${l.href}"${cur(l)}>${t(l.k)}</a></li>`).join('')}
            </ul>
            <p class="sheet__foot"><a href="01-home.html#faq">${t('faq')}</a></p>
          </div>
        </div>
      </div>`;
  }

  function renderFooter(el, idx) {
    const from = el.dataset.from || 'papel';
    const legal = (doc) => `11-legal.html?doc=${doc}&amp;ambito=${scope}`;
    el.innerHTML = `
      <footer class="site-footer">
        <div class="tear" style="--from:var(--${from});--to:var(--silver)" aria-hidden="true"></div>
        <div class="site-footer__body">
          <div class="container site-footer__grid">
            <div class="site-footer__brand">
              <p class="brand brand--footer"><span class="brand__mark" aria-hidden="true">J</span><span class="brand__name">Jefes a Punto</span></p>
              <p>${t('tagline')}</p>
              <p class="meta">${t('footerNote')}</p>
            </div>
            <nav class="site-footer__group" aria-label="${t('legal')}">
              <h2 class="footer-title">${t('legal')}</h2>
              <ul class="footer-links">
                <li><a href="${legal('privacidad')}">${t('privacy')}</a></li>
                <li><a href="${legal('terminos')}">${t('terms')}</a></li>
                <li><a href="${legal('consentimiento')}">${t('consent')}</a></li>
                <li><a href="01-home.html#faq">${t('faq')}</a></li>
              </ul>
              <label class="footer-label" for="scope-${idx}">${t('scope')}</label>
              <select id="scope-${idx}" class="input input--select" data-scope-select>
                ${Object.keys(SCOPES).map((k) => `<option value="${k}"${k === scope ? ' selected' : ''}>${t(k)}</option>`).join('')}
              </select>
            </nav>
          </div>
          <div class="container site-footer__base">
            <p class="meta">© 2026 Suma Claridad · Jefes a Punto</p>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Módulos ---------- */

  function renderModuleList(el) {
    const variant = el.dataset.variant || 'course';
    const done = completedSet();
    const sessionOn = el.dataset.sessionState ? currentState === el.dataset.sessionState : true;
    el.innerHTML = MODULES.map((m) => {
      const isDone = done.includes(m.n);
      const href = variant === 'home' && !sessionOn
        ? `03-ingreso.html?next=${m.slug}`
        : `09-modulo.html?m=${m.slug}&amp;estado=${isDone ? 'completado' : 'completo'}`;
      const status = variant === 'home' ? '' : `. ${isDone ? t('completed') : t('pending')}`;
      return `
        <li class="module-row">
          <a class="module-row__link" href="${href}" aria-label="${t('module')} ${pad(m.n)}: ${modTitle(m)}${status}">
            <span class="module-row__num" aria-hidden="true">${pad(m.n)}</span>
            <span class="module-row__head" aria-hidden="true">
              <span class="module-row__title">${modTitle(m)}</span>
              <span class="module-row__sub">${t('module')} ${pad(m.n)}</span>
            </span>
            <span class="module-row__text" aria-hidden="true">${variant === 'home' ? t('homeModuleText') : t('moduleText')}</span>
            ${variant === 'home' ? '' : `<span class="module-row__badge" aria-hidden="true">${badge(isDone ? 'completado' : 'pendiente')}</span>`}
            <span class="circle-arrow" aria-hidden="true">${ICONS.arrow}</span>
          </a>
        </li>`;
    }).join('');
  }

  function renderProgress() {
    const done = completedSet().length;
    $$('[data-component="progress"]').forEach((el) => {
      el.innerHTML = `
        <p class="progress__label">${t('progress', done)}</p>
        <div class="progress__bar" role="progressbar" aria-label="${t('courseModules')}" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${done}">
          <span style="--p:${(done / 6) * 100}%"></span>
        </div>`;
    });
    $$('[data-missing-text]').forEach((el) => { el.textContent = t('missing', 6 - done); });
  }

  function renderModuleSheet(el) {
    const id = el.dataset.id || 'modules-sheet';
    const cur = currentModule();
    const done = completedSet();
    el.innerHTML = `
      <div class="sheet" id="${id}" role="dialog" aria-modal="true" aria-label="${t('courseModules')}" hidden>
        <div class="sheet__paper">
          <div class="sheet__inner sheet__inner--left">
            <button type="button" class="sheet__close" data-sheet-close aria-label="${t('closeModules')}">${ICONS.close}</button>
            <p class="sheet__divider"><span>Jefes a Punto</span></p>
            <p class="sheet__sub">${t('anyOrder')}</p>
            <ul class="sheet-mods">
              ${MODULES.map((m) => {
                const isCur = m.n === cur.n;
                const isDone = done.includes(m.n);
                return `<li><a class="sheet-mod" href="09-modulo.html?m=${m.slug}&amp;estado=${isDone ? 'completado' : 'completo'}"${isCur ? ' aria-current="page"' : ''}>
                  <span class="sheet-mod__num" aria-hidden="true">${pad(m.n)}</span>
                  <span class="sheet-mod__title">${isCur ? `<span class="sheet-mod__here">${t('youAreHere')}</span>` : ''}<span class="sr-only">${t('module')} ${pad(m.n)}: </span>${modTitle(m)}</span>
                  <span class="status-dot${isDone ? ' status-dot--done' : ''}">${isDone ? ICONS.check : ''}<span class="sr-only">${isDone ? t('completed') : t('pending')}</span></span>
                </a></li>`;
              }).join('')}
            </ul>
          </div>
        </div>
      </div>`;
  }

  function renderModuleIndex(el) {
    const cur = currentModule();
    const done = completedSet();
    el.innerHTML = `
      <ol class="module-index__list">
        ${MODULES.map((m) => `<li><a class="module-index__link" href="09-modulo.html?m=${m.slug}&amp;estado=${done.includes(m.n) ? 'completado' : 'completo'}"${m.n === cur.n ? ' aria-current="page"' : ''}>
          <span class="module-index__num">${pad(m.n)}${done.includes(m.n) ? ` <span class="module-index__done">${ICONS.check}<span class="sr-only">${t('completed')}</span></span>` : ''}</span>
          <span class="module-index__title">${modTitle(m)}</span>
        </a></li>`).join('')}
      </ol>`;
  }

  function bindModulePage() {
    if (!$('[data-module-page]')) return;
    const m = currentModule();
    const i = MODULES.indexOf(m);
    $$('[data-bind="num"]').forEach((el) => { el.textContent = pad(m.n); });
    $$('[data-bind="title"]').forEach((el) => { el.textContent = modTitle(m); });
    document.title = `${pad(m.n)} · ${modTitle(m)} · Jefes a Punto`;
    const setPager = (sel, mod) => {
      const a = $(sel);
      if (!a) return;
      if (!mod) { a.hidden = true; return; }
      a.hidden = false;
      a.href = `09-modulo.html?m=${mod.slug}`;
      $('.pager__title', a).textContent = `${pad(mod.n)} · ${modTitle(mod)}`;
    };
    setPager('[data-bind="prev"]', MODULES[i - 1]);
    setPager('[data-bind="next"]', MODULES[i + 1]);
  }

  /* ---------- Render global ---------- */

  function renderDynamic() {
    $$('[data-component="module-list"]').forEach(renderModuleList);
    $$('[data-component="module-sheet"]').forEach(renderModuleSheet);
    $$('[data-component="module-index"]').forEach(renderModuleIndex);
    renderProgress();
    bindModulePage();
  }

  function renderAll() {
    const openSheet = $('.sheet:not([hidden])');
    const openId = openSheet ? openSheet.id : null;
    document.documentElement.lang = 'es';
    $$('[data-component="header"]').forEach(renderHeader);
    $$('[data-component="footer"]').forEach(renderFooter);
    renderDynamic();
    $$('[data-lang-label]').forEach((el) => { el.textContent = t('es'); });
    initCarousels();
    if (openId) openSheetById(openId, $(`[data-sheet-open="${openId}"]`), false);
  }

  /* ---------- Estados de maqueta ---------- */

  function screenForPage() {
    const n = document.body.dataset.screen;
    return SCREENS.find((s) => s.n === n);
  }

  function initialState() {
    const screen = screenForPage();
    if (!screen || !screen.states.length) return null;
    const asked = params.get('estado');
    return screen.states.some(([k]) => k === asked) ? asked : screen.states[0][0];
  }

  function renderMockbar() {
    const bar = $('.mockbar');
    const screen = screenForPage();
    if (!bar || !screen || !screen.states.length) { if (bar) bar.hidden = true; return; }
    bar.innerHTML = `
      <details class="mockbar__box">
        <summary>Estado de maqueta: <strong data-mock-current></strong></summary>
        <div class="mockbar__list" role="group" aria-label="Estados de la maqueta">
          ${screen.states.map(([k, l]) => `<button type="button" data-mock-state="${k}">${l}</button>`).join('')}
          <a class="mockbar__index" href="index.html">← Índice de pantallas</a>
        </div>
      </details>`;
  }

  function applyPresets() {
    $$('form[data-preset]').forEach((form) => {
      let presets;
      try { presets = JSON.parse(form.dataset.preset); } catch (e) { return; }
      clearErrors(form);
      const p = presets[currentState];
      if (!p) { form.reset(); return; }
      Object.entries(p.values || {}).forEach(([name, val]) => {
        const input = form.elements[name];
        if (!input) return;
        if (input.type === 'checkbox') input.checked = !!val; else input.value = val;
      });
      const errors = [];
      Object.entries(p.errors || {}).forEach(([name, msg]) => {
        const input = form.elements[name];
        if (input) { setError(input, msg); errors.push([input, msg]); }
      });
      if (errors.length > 1) showSummary(form, errors, false);
    });
  }

  function setState(k, opts = {}) {
    if (!k) return;
    currentState = k;
    document.body.dataset.estado = k;
    $$('[data-estado]').forEach((el) => {
      const toks = el.dataset.estado.split(/\s+/).filter(Boolean);
      const neg = toks.filter((x) => x.startsWith('!')).map((x) => x.slice(1));
      const pos = toks.filter((x) => !x.startsWith('!'));
      let show = pos.length ? pos.includes(k) : true;
      if (neg.includes(k)) show = false;
      el.hidden = !show;
    });
    $$('[data-estado-disabled]').forEach((el) => {
      el.disabled = el.dataset.estadoDisabled.split(/\s+/).includes(k);
    });
    $$('[data-mock-state]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mockState === k)));
    const screen = screenForPage();
    const label = screen && screen.states.find(([key]) => key === k);
    $$('[data-mock-current]').forEach((el) => { el.textContent = label ? label[1] : k; });
    if (opts.push !== false) {
      try {
        const u = new URL(location.href);
        u.searchParams.set('estado', k);
        history.replaceState(null, '', u);
      } catch (e) { /* algunos navegadores bloquean replaceState en file:// */ }
    }
    renderDynamic();
    initCarousels();
    applyPresets();
    if (opts.focus) {
      window.scrollTo({ top: 0 });
      const h = $$('main h1').find((x) => !x.closest('[hidden]'));
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  /* ---------- Hojas (menú y módulos) ---------- */

  function focusables(root) {
    return $$('a[href], button:not([disabled]), select, input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter((el) => !el.closest('[hidden]'));
  }

  function openSheetById(id, trigger, focus = true) {
    const s = document.getElementById(id);
    if (!s) return;
    s.hidden = false;
    document.body.classList.add('is-locked');
    lastTrigger = trigger || lastTrigger;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (focus) { const c = $('[data-sheet-close]', s); if (c) c.focus(); }
  }

  function closeSheet(s) {
    if (!s) return;
    s.hidden = true;
    document.body.classList.remove('is-locked');
    $$(`[data-sheet-open="${s.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    lastTrigger = null;
  }

  /* ---------- Formularios ---------- */

  function setError(input, msg) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.add('field--error');
    input.setAttribute('aria-invalid', 'true');
    const errorId = `${input.id || input.name}-error`;
    let e = document.getElementById(errorId);
    if (!e) {
      e = document.createElement('p');
      e.className = 'field__error';
      e.id = errorId;
      field.appendChild(e);
    }
    e.textContent = msg;
    const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (!ids.includes(e.id)) { ids.push(e.id); input.setAttribute('aria-describedby', ids.join(' ')); }
  }

  function clearErrors(form) {
    $$('.field__error', form).forEach((e) => {
      $$(`[aria-describedby~="${e.id}"]`, form).forEach((i) => {
        const ids = i.getAttribute('aria-describedby').split(' ').filter((x) => x !== e.id);
        if (ids.length) i.setAttribute('aria-describedby', ids.join(' ')); else i.removeAttribute('aria-describedby');
      });
      e.remove();
    });
    $$('.field--error', form).forEach((f) => f.classList.remove('field--error'));
    $$('[aria-invalid]', form).forEach((i) => i.removeAttribute('aria-invalid'));
    const s = $('[data-error-summary]', form);
    if (s) s.hidden = true;
  }

  function showSummary(form, errors, focus = true) {
    const s = $('[data-error-summary]', form);
    if (!s) return;
    $('.alert__title', s).textContent = `Revisa ${errors.length} campos antes de continuar`;
    $('ul', s).innerHTML = errors.map(([i, m]) => `<li><a href="#${i.id}">${m}</a></li>`).join('');
    s.hidden = false;
    if (focus) s.focus();
  }

  function validate(form) {
    clearErrors(form);
    const errors = [];
    $$('input, select, textarea', form).forEach((i) => {
      if (i.disabled || i.type === 'hidden' || i.type === 'submit') return;
      let msg = '';
      if (i.type === 'checkbox') {
        if (i.required && !i.checked) msg = i.dataset.msgRequired || 'Marca esta casilla para continuar.';
      } else {
        const v = i.value.trim();
        if (i.required && !v) msg = i.dataset.msgRequired || 'Completa este campo.';
        else if (v && i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Escribe un email válido, por ejemplo nombre@empresa.com.';
        else if (v && i.minLength > 0 && v.length < i.minLength) msg = `Usa al menos ${i.minLength} caracteres.`;
        else if (i.dataset.match) {
          const other = $(i.dataset.match, form);
          if (other && other.value !== i.value) msg = 'Las contraseñas no coinciden.';
        }
      }
      if (msg) { setError(i, msg); errors.push([i, msg]); }
    });
    if (errors.length === 1) errors[0][0].focus();
    else if (errors.length > 1) showSummary(form, errors);
    return errors.length === 0;
  }

  function onFormSuccess(form) {
    const action = form.dataset.onSuccess || '';
    if (form.id === 'opinion-form') {
      const text = form.elements.opinion.value.trim();
      $$('[data-bind="opinion-text"]').forEach((el) => { el.textContent = text; });
    }
    if (action.startsWith('state:')) setState(action.slice(6), { focus: true });
    else if (action.startsWith('go:')) location.href = action.slice(3);
    else if (action === 'lang') {
      const flash = $('[data-flash]');
      if (flash) {
        flash.hidden = false;
        flash.setAttribute('tabindex', '-1');
        flash.focus();
      }
    }
  }

  /* ---------- Carrusel de opiniones ---------- */

  function initCarousels() {
    $$('[data-carousel]').forEach((root) => {
      const slides = $$('[data-carousel-slide]', root);
      const nav = $('[data-carousel-nav]', root);
      const dots = $('[data-carousel-dots]', root);
      if (slides.length <= 1) {
        if (nav) nav.hidden = true;
        slides.forEach((s) => { s.hidden = false; });
        return;
      }
      if (nav) nav.hidden = false;
      let i = Number(root.dataset.index || 0);
      if (dots && !dots.dataset.ready) {
        dots.innerHTML = slides.map((_, n) =>
          `<button type="button" class="carousel__dot" data-carousel-goto="${n}" aria-label="Ir a la opinión ${n + 1}"></button>`
        ).join('');
        dots.dataset.ready = '1';
      }
      const go = (n) => {
        i = ((n % slides.length) + slides.length) % slides.length;
        root.dataset.index = String(i);
        slides.forEach((s, k) => { s.hidden = k !== i; });
        $$('[data-carousel-goto]', root).forEach((d, k) => {
          if (k === i) d.setAttribute('aria-current', 'true');
          else d.removeAttribute('aria-current');
        });
      };
      root._carouselGo = go;
      go(i);
    });
  }

  /* ---------- Idioma y ámbito legal ---------- */

  function consentScope() {
    return (navigator.language || '').toLowerCase() === 'es-es' ? 'espana' : 'latam';
  }

  function syncConsentLinks() {
    $$('[data-consent-link]').forEach((a) => { a.href = `11-legal.html?doc=consentimiento&ambito=${consentScope()}`; });
  }

  /* ---------- Legales ---------- */

  function initLegal() {
    const root = $('[data-legal]');
    if (!root) return;
    let doc = LEGAL_DOCS[params.get('doc')] ? params.get('doc') : 'privacidad';
    let amb = SCOPES[params.get('ambito')] ? params.get('ambito') : (SCOPES[scope] ? scope : 'latam');
    const update = () => {
      $$('[data-bind="doc-title"]').forEach((el) => { el.textContent = LEGAL_DOCS[doc]; });
      $$('[data-bind="scope-label"]').forEach((el) => { el.textContent = SCOPES[amb]; });
      $$('[data-doc]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.doc === doc)));
      $$('[data-scope]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scope === amb)));
      document.title = `${LEGAL_DOCS[doc]} · ${SCOPES[amb]} · Jefes a Punto`;
      try {
        const u = new URL(location.href);
        u.searchParams.set('doc', doc);
        u.searchParams.set('ambito', amb);
        history.replaceState(null, '', u);
      } catch (e) { /* file:// */ }
    };
    root.addEventListener('click', (e) => {
      const d = e.target.closest('[data-doc]');
      const s = e.target.closest('[data-scope]');
      if (d) { doc = d.dataset.doc; update(); }
      if (s) { amb = s.dataset.scope; update(); }
    });
    update();
  }

  /* ---------- Vídeo simulado ---------- */

  function fmt(sec) { return `${pad(Math.floor(sec / 60))}:${pad(Math.floor(sec % 60))}`; }

  function toggleVideo(btn) {
    const frame = btn.closest('.video__frame');
    const playing = frame.classList.toggle('is-playing');
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pausar vídeo' : 'Reproducir vídeo');
    const total = Number(frame.dataset.duration || 1450);
    const tick = () => {
      let p = parseFloat(getComputedStyle(frame).getPropertyValue('--pn')) || 0;
      p = p >= 1 ? 0 : p + 0.004;
      frame.style.setProperty('--pn', p.toFixed(4));
      const time = $('[data-video-time]', frame);
      if (time) time.textContent = `${fmt(p * total)} / ${fmt(total)}`;
    };
    if (playing) frame._timer = setInterval(tick, 200);
    else clearInterval(frame._timer);
  }

  /* ---------- Eventos delegados ---------- */

  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-sheet-open]');
    if (open) { e.preventDefault(); openSheetById(open.dataset.sheetOpen, open); return; }

    const close = e.target.closest('[data-sheet-close]');
    if (close) { closeSheet(close.closest('.sheet')); return; }

    if (e.target.classList && e.target.classList.contains('sheet')) { closeSheet(e.target); return; }

    const carouselRoot = e.target.closest('[data-carousel]');
    if (carouselRoot && carouselRoot._carouselGo) {
      if (e.target.closest('[data-carousel-prev]')) { e.preventDefault(); carouselRoot._carouselGo(Number(carouselRoot.dataset.index || 0) - 1); return; }
      if (e.target.closest('[data-carousel-next]')) { e.preventDefault(); carouselRoot._carouselGo(Number(carouselRoot.dataset.index || 0) + 1); return; }
      const goto = e.target.closest('[data-carousel-goto]');
      if (goto) { e.preventDefault(); carouselRoot._carouselGo(Number(goto.dataset.carouselGoto)); return; }
    }

    const ms = e.target.closest('[data-mock-state]');
    if (ms) { setState(ms.dataset.mockState, { focus: !ms.closest('.mockbar') }); return; }

    const v = e.target.closest('[data-video-play]');
    if (v) { toggleVideo(v); return; }

    const pw = e.target.closest('[data-toggle-password]');
    if (pw) {
      const input = $(pw.dataset.togglePassword);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      pw.textContent = show ? 'Ocultar' : 'Mostrar';
      pw.setAttribute('aria-pressed', String(show));
      return;
    }

    const dismiss = e.target.closest('[data-dismiss]');
    if (dismiss) { const m = dismiss.closest('.sysmsg'); if (m) m.hidden = true; }
  });

  document.addEventListener('keydown', (e) => {
    const open = $('.sheet:not([hidden])');
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(open); return; }
    if (e.key === 'Tab') {
      const f = focusables(open);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    if (validate(form)) onFormSuccess(form);
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-scope-select]')) {
      scope = e.target.value;
      STORE.set('jap-scope', scope);
      const id = e.target.id;
      $$('[data-component="footer"]').forEach(renderFooter);
      const again = document.getElementById(id);
      if (again) again.focus();
    }
    if (e.target.matches('[data-consent-source]')) syncConsentLinks();
  });

  document.addEventListener('input', (e) => {
    const ta = e.target.closest('[data-counter]');
    if (!ta) return;
    const out = document.getElementById(ta.dataset.counter);
    if (out) out.textContent = `${ta.value.length} / ${ta.maxLength}`;
  });

  // Acordeón FAQ: una pregunta abierta a la vez.
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.open) return;
    const group = d.closest('[data-single]');
    if (!group) return;
    $$('details[open]', group).forEach((o) => { if (o !== d) o.open = false; });
  }, true);

  /* ---------- Arranque ---------- */

  window.JAP = { MODULES, SCREENS, setState };

  document.addEventListener('DOMContentLoaded', () => {
    currentState = initialState();
    renderMockbar();
    renderAll();
    if (currentState) setState(currentState, { push: false });
    initLegal();
    syncConsentLinks();
  });
})();
