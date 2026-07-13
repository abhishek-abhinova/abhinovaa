/* ============================================================
   ABHINOVA — SHARED UI ENGINE
   Currency · Navigation · Animations · Page renderers
   ============================================================ */
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ============ 1. CURRENCY ENGINE ============ */
// Versioned storage key so older saved preferences don't override the USD default.
const CUR_STORAGE_KEY = 'abhinova-cur-v2';
let CUR = localStorage.getItem(CUR_STORAGE_KEY) || 'USD';
if (!CURRENCIES[CUR]) CUR = 'USD';

function fmtPrice(usd, code = CUR) {
  const c = CURRENCIES[code];
  let v = usd * c.rate;
  v = v >= 10000 ? Math.round(v / 100) * 100 : Math.round(v);
  return c.symbol + v.toLocaleString(c.locale);
}

function applyCurrency(code) {
  if (!CURRENCIES[code]) return;
  CUR = code;
  localStorage.setItem(CUR_STORAGE_KEY, code);
  $$('#curLabel').forEach(el => el.textContent = code);
  $$('[data-usd]').forEach(el => {
    el.textContent = fmtPrice(+el.dataset.usd);
  });
  $$('#curMenu li').forEach(li => li.setAttribute('aria-selected', li.dataset.val === code));
  $$('.mobile-cur-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.val === code);
  });
}

function buildCurrencyMenu() {
  const menu = $('#curMenu');
  if (!menu) return;
  menu.innerHTML = Object.entries(CURRENCIES).map(([code, c]) =>
    `<li role="option" data-val="${code}"><span class="cur-sym">${c.symbol.trim()}</span>${c.label}</li>`
  ).join('');

  // Build currency switcher for mobile navigation
  const mnav = $('#mobileNav');
  if (mnav) {
    let mobileCur = $('.mobile-currency', mnav);
    if (!mobileCur) {
      mobileCur = document.createElement('div');
      mobileCur.className = 'mobile-currency';
      mobileCur.innerHTML = `
        <span class="mobile-cur-title">Select Currency</span>
        <div class="mobile-cur-grid">
          ${Object.entries(CURRENCIES).map(([code, c]) => `
            <button class="mobile-cur-btn${code === CUR ? ' is-active' : ''}" data-val="${code}" aria-label="Switch currency to ${code}">
              <span class="symbol">${c.symbol.trim()}</span>
              <span class="code">${code}</span>
            </button>
          `).join('')}
        </div>
      `;
      // Insert before the "Start a project" CTA button inside mobile nav
      const cta = $('.btn', mnav);
      if (cta) {
        mnav.insertBefore(mobileCur, cta);
      } else {
        mnav.appendChild(mobileCur);
      }

      $$('.mobile-cur-btn', mobileCur).forEach(btn => {
        btn.addEventListener('click', () => {
          applyCurrency(btn.dataset.val);
          toast(`Prices now shown in ${btn.dataset.val}`);
        });
      });
    }
  }

  $$('li', menu).forEach(li => li.addEventListener('click', () => {
    applyCurrency(li.dataset.val);
    li.closest('.switch').classList.remove('is-open');
    toast(`Prices now shown in ${li.dataset.val}`);
  }));
}

/* geo auto-detect (disabled: website defaults to USD) */
/*
(function detectGeo() {
  if (localStorage.getItem('abhinova-cur')) return;
  try {
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) })
      .then(r => r.json())
      .then(d => {
        const map = { IN: 'INR', US: 'USD', GB: 'GBP', CN: 'CNY', JP: 'JPY', AE: 'AED', BR: 'BRL', CA: 'CAD',
          DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', PT: 'EUR', SE: 'EUR', AT: 'EUR', BE: 'EUR', IE: 'EUR', FI: 'EUR' };
        const code = map[d.country_code];
        if (code) applyCurrency(code);
      }).catch(() => {});
  } catch (e) {}
})();
*/

/* ============ 2. HEADER / NAV ============ */
function initNav() {
  // Restructure announcement bar for marquee
  const annBar = $('.ann-bar');
  if (annBar) {
    const dot = $('.ann-dot', annBar);
    const textSpan = annBar.querySelector('span:not(.ann-dot)');
    const ctaLink = $('.ann-cta', annBar);
    if (textSpan && ctaLink) {
      const textContent = textSpan.textContent;
      const ctaHref = ctaLink.getAttribute('href');
      const ctaText = ctaLink.textContent;
      
      annBar.innerHTML = '';
      if (dot) annBar.appendChild(dot);
      
      const track = document.createElement('div');
      track.className = 'ann-marquee-track';
      const waLogo = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:4px; margin-bottom:2px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
      track.innerHTML = `
        <div class="ann-marquee-content">
          <span>${textContent}</span>
          <a href="${ctaHref}" target="_blank" rel="noopener" class="ann-cta">${waLogo}${ctaText}</a>
        </div>
        <div class="ann-marquee-content" aria-hidden="true">
          <span>${textContent}</span>
          <a href="${ctaHref}" target="_blank" rel="noopener" class="ann-cta">${waLogo}${ctaText}</a>
        </div>
      `;
      annBar.appendChild(track);
    }
  }

  // dropdown switches
  $$('.switch').forEach(sw => {
    const btn = $('.switch-btn', sw);
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      $$('.switch').forEach(s => { if (s !== sw) s.classList.remove('is-open'); });
      sw.classList.toggle('is-open');
    });
  });
  document.addEventListener('click', () => $$('.switch').forEach(s => s.classList.remove('is-open')));

  // hamburger & mobile nav overlay
  const ham = $('#hamburger'), mnav = $('#mobileNav');
  if (ham && mnav) {
    // Inject mobile nav backdrop overlay dynamically
    let overlay = $('#mobileNavOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobileNavOverlay';
      overlay.className = 'mobile-nav-overlay';
      document.body.appendChild(overlay);
    }

    const toggleMenu = (forceState) => {
      const open = typeof forceState === 'boolean' ? forceState : mnav.classList.toggle('is-open');
      if (typeof forceState === 'boolean') {
        mnav.classList.toggle('is-open', open);
      }
      ham.classList.toggle('is-open', open);
      ham.setAttribute('aria-expanded', open);
      overlay.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.classList.toggle('mobile-nav-open', open);
    };

    ham.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));

    // New close button inside the nav panel
    const closeBtn = $('#mobileNavClose');
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

    $$('a', mnav).forEach(a => a.addEventListener('click', () => {
      toggleMenu(false);
    }));
  }

  // active link highlight
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('is-active');
  });

  // scroll progress
  const bar = $('#scrollProgress');
  if (bar) window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  // hide header on scroll down (Disabled: show header always on scroll as requested)
  const header = $('#siteHeader');
  if (header) {
    header.style.transform = 'translateY(0)';
  }
}

/* ============ 3. ANIMATIONS ============ */
function initReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-l, .reveal-r, .reveal-zoom').forEach(el => io.observe(el));
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1600;
      (function tick(now) {
        const t = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suf;
        if (t < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .5 });
  $$('[data-count]').forEach(el => io.observe(el));
}

function initParticles() {
  const cv = $('#particles');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [];
  const N = innerWidth < 700 ? 26 : 54;
  function resize() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
  }
  resize();
  addEventListener('resize', resize, { passive: true });
  for (let i = 0; i < N; i++) pts.push({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
    r: Math.random() * 1.6 + .4,
  });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = 'rgba(139,92,246,.5)';
      ctx.fill();
    });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
      if (d < 15000) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(139,92,246,${.14 * (1 - d / 15000)})`;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* card mouse glow */
function initCardGlow(scope = document) {
  $$('.card', scope).forEach(card => {
    if (card.dataset.glowBound) return;
    card.dataset.glowBound = '1';
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });
}

/* toast */
let toastTimer;
function toast(msg) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2800);
}

/* ============ 4. RENDERERS ============ */
const glowDiv = '<div class="card-glow"></div>';

function renderServices(el, { compact = false } = {}) {
  el.innerHTML = SERVICES.map((s, i) => `
    <article class="card svc-card reveal" style="--d:${i * .07}s">
      ${glowDiv}
      <div class="svc-ico">${s.icon}</div>
      <h3 class="svc-title">${s.title}</h3>
      <p class="svc-desc">${s.desc}</p>
      ${compact ? '' : `<ul class="svc-feats">${s.features.map(f => `<li>${f}</li>`).join('')}</ul>`}
      <div class="svc-tags">${s.tags.map(t => `<span class="svc-tag">${t}</span>`).join('')}</div>
      <div class="svc-from"><em>Starting at</em><strong data-usd="${s.from}">${fmtPrice(s.from)}</strong></div>
    </article>`).join('');
  initCardGlow(el);
}

function projectCard(p, i) {
  const soon = p.result === 'Coming Soon';
  const idx = PROJECTS.indexOf(p);
  return `
  <article class="card work-card reveal" style="--d:${(i % 6) * .06}s" data-idx="${idx}">
    ${glowDiv}
    <div class="work-thumb">
      <img src="${p.img}" alt="${p.name} — ${p.tag} project by Abhinova" loading="lazy"
        onerror="this.style.background='linear-gradient(135deg,${p.grad[0]}33,${p.grad[1]}22)';this.removeAttribute('src')"/>
      <span class="work-tag">${p.tag}</span>
      <span class="work-country">${p.country}</span>
      <span class="work-result" ${soon ? 'style="background:rgba(251,191,36,.14);border-color:rgba(251,191,36,.4);color:#fcd34d"' : ''}>${soon ? '🚀 Coming Soon' : p.result}</span>
    </div>
    <div class="work-body">
      <h3 class="work-name">${p.name}</h3>
      <div class="work-meta">${p.meta}</div>
      <p class="work-desc">${p.desc}</p>
      <div class="work-stack">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="work-actions">
        ${p.demo && !soon ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Visit site ↗</a>` : ''}
        <button class="btn btn-ghost" data-modal="${idx}">Case study</button>
      </div>
    </div>
  </article>`;
}

function renderProjects(el, { limit = 0, filter = 'all' } = {}) {
  let list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter);
  if (limit) list = list.slice(0, limit);
  el.innerHTML = list.map((p, i) => projectCard(p, i)).join('');
  const count = $('#workCount');
  if (count) count.textContent = `SHOWING ${list.length} OF ${PROJECTS.length} PROJECTS`;
  $$('.work-card', el).forEach(c => {
    c.addEventListener('click', () => openProjectModal(+c.dataset.idx));
  });
  $$('[data-modal]', el).forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    openProjectModal(+b.dataset.modal);
  }));
  initCardGlow(el);
  initReveals();
}

function openProjectModal(i) {
  const p = PROJECTS[i];
  let root = $('#modalRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modalRoot'; root.className = 'modal-root';
    document.body.appendChild(root);
    root.addEventListener('click', e => { if (e.target === root) closeProjectModal(); });
  }
  root.innerHTML = `
  <article class="modal" role="dialog" aria-modal="true" aria-label="${p.name} case study">
    <div class="modal-hero">
      <img src="${p.img}" alt="${p.name}" onerror="this.style.background='linear-gradient(135deg,${p.grad[0]}33,${p.grad[1]}22)';this.removeAttribute('src')"/>
      <button class="modal-close" aria-label="Close">✕</button>
    </div>
    <div class="modal-body">
      <span class="modal-tag">${p.tag} · ${p.country}</span>
      <h3>${p.name}</h3>
      <p class="modal-meta">${p.meta}</p>
      <div class="modal-stack">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
      <ul class="modal-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <div class="modal-cols">
        <div><h4>Challenge</h4><p>${p.challenge}</p></div>
        <div><h4>Solution</h4><p>${p.solution}</p></div>
      </div>
      <div class="modal-results">${p.stats.map(s => `<div class="mr-stat"><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div>
      <blockquote class="modal-quote">"${p.quote}"<cite>— ${p.who}</cite></blockquote>
      <div class="modal-actions">
        ${p.demo ? `<a class="btn btn-primary" target="_blank" rel="noopener" href="${p.demo}">Live site ↗</a>` : ''}
        <a class="btn btn-ghost" href="contact.html">Request similar build</a>
        <a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/${CONTACT.whatsapp}?text=Hi%20Abhinova%2C%20I%20saw%20the%20${encodeURIComponent(p.name)}%20case%20study%20and%20would%20like%20a%20consultation.">WhatsApp us</a>
      </div>
    </div>
  </article>`;
  root.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  $('.modal-close', root).addEventListener('click', closeProjectModal);
}
function closeProjectModal() {
  const root = $('#modalRoot');
  if (!root) return;
  root.classList.remove('is-open');
  root.innerHTML = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });

function initProjectFilters(gridEl) {
  const wrap = $('#workFilters');
  if (!wrap) return;
  wrap.innerHTML = PROJECT_FILTERS.map(([val, label], i) =>
    `<button class="chip${i === 0 ? ' is-on' : ''}" data-cat="${val}" role="tab" aria-selected="${i === 0}">${label}</button>`).join('');
  $$('.chip', wrap).forEach(chip => chip.addEventListener('click', () => {
    $$('.chip', wrap).forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('is-on'); chip.setAttribute('aria-selected', 'true');
    renderProjects(gridEl, { filter: chip.dataset.cat });
  }));
}

function renderPricing(el) {
  el.innerHTML = PRICING.map((t, i) => `
    <article class="card price-card reveal${t.featured ? ' is-feat' : ''}" style="--d:${i * .1}s">
      ${glowDiv}
      ${t.featured ? '<span class="feat-flag">Most chosen</span>' : ''}
      <header>
        <span class="tier-tag">${t.tier}</span>
        <h3 class="tier-name">${t.tier} Package</h3>
        <p class="tier-desc">${t.desc}</p>
      </header>
      <div class="tier-price"><span class="tp-cur" data-usd="${t.price}">${fmtPrice(t.price)}</span><span class="tp-per">one-time</span></div>
      <ul class="tier-feats">${t.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <a href="contact.html" class="btn ${t.featured ? 'btn-primary' : 'btn-ghost'} btn-block">${t.featured ? 'Start project →' : 'Get started →'}</a>
    </article>`).join('');
  initCardGlow(el);
}

function renderTeam(el) {
  el.innerHTML = TEAM.map((m, i) => `
    <article class="card team-card reveal" style="--d:${(i % 3) * .08}s">
      ${glowDiv}
      <div class="team-avatar-wrap">
        <div class="team-avatar-ring"></div>
        <div class="team-avatar" style="background:linear-gradient(135deg,${m.grad[0]},${m.grad[1]})">
          ${m.img ? `<img src="${m.img}" alt="${m.name} — ${m.role} at Abhinova" loading="lazy" onerror="this.remove()"/>` : m.initials}
        </div>
        <span class="team-online"></span>
      </div>
      <h3 class="team-name">${m.name}</h3>
      <div class="team-role">${m.role}</div>
      ${m.loc ? `<div class="team-loc">📍 ${m.loc}</div>` : ''}
      <p class="team-bio">${m.bio}</p>
      <div class="team-skills">${m.skills.slice(0, 6).map(s => `<span>${s}</span>`).join('')}</div>
    </article>`).join('');
  initCardGlow(el);
}

function renderTestimonials(el, limit = 0) {
  let list = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
  el.innerHTML = list.map((t, i) => `
    <article class="card tmn-card reveal" style="--d:${(i % 3) * .08}s">
      ${glowDiv}
      <div class="tmn-stars">★★★★★</div>
      <p class="tmn-quote">"${t.quote}"</p>
      <div class="tmn-foot">
        <div class="tmn-avatar" style="background:linear-gradient(135deg,${t.grad[0]},${t.grad[1]})">${t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        <div><div class="tmn-name">${t.name}</div><div class="tmn-role">${t.role}</div></div>
      </div>
    </article>`).join('');
  initCardGlow(el);
}

function blogCard(b, i) {
  return `
  <article class="card blog-card reveal" style="--d:${(i % 3) * .07}s">
    ${glowDiv}
    <div class="blog-thumb">
      <img src="${b.img}" alt="${b.title}" loading="lazy"/>
      <span class="blog-cat">${b.catLabel}</span>
    </div>
    <div class="blog-body">
      <h3 class="blog-title">${b.title}</h3>
      <p class="blog-snip">${b.snip}</p>
      <div class="blog-meta"><span>${b.date}</span><span>·</span><span>${b.read}</span></div>
      <span class="blog-more">Read article →</span>
    </div>
  </article>`;
}

function renderBlogs(el, { limit = 0, filter = 'all' } = {}) {
  let list = filter === 'all' ? BLOGS : BLOGS.filter(b => b.cat === filter);
  if (limit) list = list.slice(0, limit);
  el.innerHTML = list.map((b, i) => blogCard(b, i)).join('');
  initCardGlow(el);
  initReveals();
}

function initBlogFilters(gridEl) {
  const wrap = $('#blogFilters');
  if (!wrap) return;
  wrap.innerHTML = BLOG_FILTERS.map(([val, label], i) =>
    `<button class="chip${i === 0 ? ' is-on' : ''}" data-cat="${val}">${label}</button>`).join('');
  $$('.chip', wrap).forEach(chip => chip.addEventListener('click', () => {
    $$('.chip', wrap).forEach(c => c.classList.remove('is-on'));
    chip.classList.add('is-on');
    renderBlogs(gridEl, { filter: chip.dataset.cat });
  }));
}

function renderWhy(el) {
  el.innerHTML = WHY.map((w, i) => `
    <article class="card why-card reveal" style="--d:${(i % 4) * .07}s">
      ${glowDiv}
      <span class="why-ico">${w.ico}</span>
      <h3 class="why-title">${w.title}</h3>
      <p class="why-desc">${w.desc}</p>
    </article>`).join('');
  initCardGlow(el);
}

/* ============ 5. CONTACT FORM (static — sends via WhatsApp / email) ============ */
function initContactForm() {
  const form = $('#leadForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    if (!d.name || !d.email) { toast('Please fill in your name and email.'); return; }
    const lines = [
      `Hello Abhinova! New project inquiry:`,
      `— Name: ${d.name}`,
      `— Email: ${d.email}`,
      d.company ? `— Company: ${d.company}` : '',
      d.budget ? `— Budget: ${d.budget}` : '',
      d.type ? `— Project type: ${d.type}` : '',
      d.timeline ? `— Timeline: ${d.timeline}` : '',
      d.message ? `— Brief: ${d.message}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    toast('Opening WhatsApp with your brief — press send there ✨');
    form.reset();
  });
}

/* ============ 6. BOOT ============ */
document.addEventListener('DOMContentLoaded', () => {
  buildCurrencyMenu();
  applyCurrency(CUR);
  initNav();
  initParticles();
  initContactForm();

  // auto-render any tagged containers
  const r = {
    services: el => renderServices(el),
    'services-compact': el => renderServices(el, { compact: true }),
    pricing: el => renderPricing(el),
    projects: el => { renderProjects(el); initProjectFilters(el); },
    'projects-featured': el => renderProjects(el, { limit: 6 }),
    team: el => renderTeam(el),
    testimonials: el => renderTestimonials(el),
    'testimonials-3': el => renderTestimonials(el, 3),
    blogs: el => { renderBlogs(el); initBlogFilters(el); },
    'blogs-3': el => renderBlogs(el, { limit: 3 }),
    why: el => renderWhy(el),
  };
  $$('[data-render]').forEach(el => {
    const fn = r[el.dataset.render];
    if (fn) fn(el);
  });

  initReveals();
  initCounters();
  initCardGlow();

  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
});
