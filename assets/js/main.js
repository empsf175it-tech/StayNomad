/* ==========================================================================
   StayNomad — Core Application, Micro-Interactions & Home Experience (main.js)
   ========================================================================== */

(function (window, document) {
  'use strict';

  const THEME_KEY = 'staynomad_theme';
  const WISHLIST_KEY = 'staynomad_wishlist';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* 1. Theme Initialization & Toggle */
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) { /* ignore */ }
  }

  // Apply immediately before paint if possible
  const initialTheme = getSavedTheme() || 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);

  function initThemeToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(
          next === 'dark'
            ? 'Night-cabin mode enabled — warm hearth & forest dusk.'
            : 'Golden-hour daylight palette restored.',
          'info'
        );
      });
    });
  }

  /* 2. Toast Notifications */
  function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    const iconSvg = type === 'success'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15 9l7 3-7 3-3 7-3-7-7-3 7-3 3-7z"/></svg>';

    toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${iconSvg}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 260);
    }, 3400);
  }

  /* 3. Wishlist Manager (localStorage) */
  function getWishlist() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : ['stay-01', 'stay-03'];
    } catch (e) {
      return [];
    }
  }

  function isWishlisted(stayId) {
    return getWishlist().includes(stayId);
  }

  function toggleWishlist(stayId, buttonEl) {
    const list = getWishlist();
    const idx = list.indexOf(stayId);
    let added = false;
    if (idx === -1) {
      list.push(stayId);
      added = true;
    } else {
      list.splice(idx, 1);
    }
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }

    const stay = window.StayNomadData
      ? window.StayNomadData.STAYS.find(s => s.id === stayId)
      : null;
    const title = stay ? stay.title : 'Stay';

    // Sync all matching buttons on page
    document.querySelectorAll(`[data-wishlist-id="${stayId}"]`).forEach(btn => {
      btn.classList.toggle('is-saved', added);
      btn.setAttribute('aria-pressed', String(added));
      btn.setAttribute('aria-label', added ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`);
    });

    if (buttonEl) {
      buttonEl.classList.remove('is-popping');
      void buttonEl.offsetWidth;
      buttonEl.classList.add('is-popping');
    }

    showToast(
      added ? `Saved "${title}" to your Wishlist.` : `Removed "${title}" from Wishlist.`,
      added ? 'success' : 'info'
    );

    window.dispatchEvent(new CustomEvent('staynomad:wishlist-changed', { detail: { stayId, added } }));
    return added;
  }

  function bindWishlistDelegation() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-wishlist-id]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(btn.getAttribute('data-wishlist-id'), btn);
    });
  }

  /* 4. Reusable Stay Card Renderer */
  function renderStayCard(stay, staggerIndex) {
    const saved = isWishlisted(stay.id);
    const openNights = window.StayNomadData
      ? window.StayNomadData.getRemainingNightsThisMonth(stay)
      : 5;
    const showScarcity = openNights > 0 && openNights <= 5;
    const scarcityHtml = showScarcity
      ? `<span class="scarcity-badge"><span class="scarcity-dot"></span>Only ${openNights} ${openNights === 1 ? 'night' : 'nights'} left</span>`
      : (stay.instantBook ? `<span class="scarcity-badge">Instant Book</span>` : '');

    return `
      <article class="stay-card" data-tilt data-reveal style="--stagger:${(staggerIndex || 0) % 6}">
        <div class="stay-card-media">
          <picture>
            <source srcset="${stay.cover}" type="image/webp">
            <img src="${stay.coverFallback}" alt="${stay.coverAlt}" width="800" height="600" loading="lazy" decoding="async">
          </picture>
          <div class="stay-card-badges" data-tilt-layer="2">
            <span class="category-pill-overlay">${stay.categoryLabel}</span>
            ${scarcityHtml}
          </div>
          <button type="button" class="wishlist-btn ${saved ? 'is-saved' : ''}" data-wishlist-id="${stay.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove ' + stay.title + ' from wishlist' : 'Save ' + stay.title + ' to wishlist'}">
            <span class="heart-ripple" aria-hidden="true"></span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <div class="stay-card-price-tag" data-tilt-layer="3">
            <strong>$${stay.pricePerNight}</strong> <span>/ night</span>
          </div>
        </div>
        <div class="stay-card-body" data-tilt-layer="1">
          <div class="stay-card-meta-row">
            <span class="stay-rating" aria-label="Rated ${stay.rating} out of 5 from ${stay.reviewCount} reviews">
              <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${stay.rating.toFixed(2)} (${stay.reviewCount})
            </span>
            <span>·</span>
            <span>${stay.elevation}</span>
          </div>
          <h3 class="stay-card-title">
            <a href="stay.html?id=${stay.id}">${stay.title}</a>
          </h3>
          <p class="stay-card-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${stay.location}</span>
          </p>
          <div class="stay-season-chips">
            <span class="season-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>
              ${stay.weather.temp} · ${stay.weather.label}
            </span>
            <span class="season-chip">Best: ${stay.bestSeason}</span>
          </div>
          <div class="stay-card-specs">
            <span>Up to ${stay.maxGuests} guests</span>
            <span>·</span>
            <span>${stay.bedrooms} ${stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
            <span>·</span>
            <span>${stay.beds} ${stay.beds === 1 ? 'bed' : 'beds'}</span>
          </div>
        </div>
      </article>
    `;
  }

  /* 5. Category SVG Icons (Self-Drawing Strokes, Chimney Smoke & Tent Flap) */
  function getCategoryIconSVG(slug) {
    switch (slug) {
      case 'cabins':
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="smoke-path" d="M21 8c0-2 2-2 2-4s-2-2-2-3"/>
          <path class="draw-stroke" d="M4 26L16 8l12 18H4z"/>
          <path class="draw-stroke" d="M13 26v-7h6v7"/>
          <path d="M20 14v-4h3v6"/>
        </svg>`;
      case 'treehouses':
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="draw-stroke" d="M9 18l7-8 7 8H9z"/>
          <rect class="draw-stroke" x="11" y="18" width="10" height="6"/>
          <path d="M16 24v6M12 30l4-4 4 4M7 13a6 6 0 0 1 18 0"/>
        </svg>`;
      case 'domes':
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="draw-stroke" d="M5 25a11 11 0 0 1 22 0H5z"/>
          <path class="draw-stroke" d="M10 25l6-9 6 9M5 25h22"/>
          <circle class="smoke-path" cx="24" cy="7" r="1.3"/>
        </svg>`;
      case 'tiny-homes':
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="draw-stroke" d="M6 15l10-7 10 7v10H6V15z"/>
          <rect x="11" y="17" width="5" height="5"/>
          <circle cx="11" cy="27" r="2"/>
          <circle cx="21" cy="27" r="2"/>
        </svg>`;
      case 'floating':
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="draw-stroke" d="M7 19l9-8 9 8H7z"/>
          <path d="M5 23h22l-2 3H7l-2-3z"/>
          <path class="smoke-path" d="M4 29c3-1.5 6 1.5 9 0s6 1.5 9 0 4-1.5 6 0"/>
        </svg>`;
      default: // desert tent with opening flap
        return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="draw-stroke" d="M4 26L16 7l12 19H4z"/>
          <path class="tent-flap" d="M16 14l-5 12h5V14z" fill="currentColor" fill-opacity="0.25"/>
          <circle class="smoke-path" cx="24" cy="8" r="2"/>
        </svg>`;
    }
  }

  /* 6. Scroll-Linked Trail Progress Bar + Tiny Tent Marker & Header State */
  function initScrollTrailAndHeader() {
    const header = document.querySelector('.site-header');
    const trailFill = document.getElementById('scroll-trail-fill');
    const trailTent = document.getElementById('scroll-trail-tent');

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      if (trailFill) trailFill.style.width = `${pct.toFixed(2)}%`;
      if (trailTent) trailTent.style.left = `${Math.max(1.5, Math.min(98.5, pct)).toFixed(2)}%`;
      if (header) header.classList.toggle('is-scrolled', scrollTop > 24);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 6b. Scroll Up / Back to Top Button */
  function initScrollUpButton() {
    let btn = document.getElementById('scroll-up-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'scroll-up-btn';
      btn.className = 'scroll-up-btn';
      btn.setAttribute('aria-label', 'Scroll back to top');
      btn.setAttribute('title', 'Back to top');
      btn.setAttribute('aria-hidden', 'true');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
      document.body.appendChild(btn);
    }

    function toggleVisibility() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const shouldShow = scrollTop > 320;
      btn.classList.toggle('is-visible', shouldShow);
      btn.setAttribute('aria-hidden', String(!shouldShow));
    }

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  /* 7. Mobile Fullscreen Navigation */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!toggle || !overlay) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      overlay.classList.toggle('is-open', open);
      overlay.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!expanded);
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* 8. Custom Cursor Ring & Magnetic Buttons */
  function initCursorAndMagnetics() {
    if (reducedMotion.matches || !window.matchMedia('(pointer: fine)').matches) return;

    let ring = document.querySelector('.cursor-ring');
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'cursor-ring';
      ring.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ring);
    }

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('pointermove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const interactive = e.target.closest('a, button, [data-tilt], .gallery-tile, input, select');
      ring.classList.toggle('is-expanded', !!interactive);
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      const offset = ring.classList.contains('is-expanded') ? 31 : 17;
      ring.style.transform = `translate3d(${(ringX - offset).toFixed(1)}px, ${(ringY - offset).toFixed(1)}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic micro-pull on buttons marked with [data-magnetic]
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* 9. Scroll-Reveal Stagger & Number Counters */
  function observeReveals(root) {
    const scope = root || document;
    const targets = scope.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!targets.length) return;

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(el => io.observe(el));
  }

  function initCounters(root) {
    const scope = root || document;
    const counters = scope.querySelectorAll('[data-counter]:not([data-counted="1"])');
    if (!counters.length) return;

    function animateCounter(el) {
      el.dataset.counted = '1';
      const target = parseFloat(el.getAttribute('data-counter')) || 0;
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      if (reducedMotion.matches) {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        const formatted = decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString();
        el.textContent = `${prefix}${formatted}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => io.observe(c));
  }

  /* 10. "Surprise Me" Random Available Stay Flight */
  function initSurpriseMe() {
    document.querySelectorAll('[data-surprise-me]').forEach(btn => {
      btn.addEventListener('click', function () {
        if (!window.StayNomadData || !window.StayNomadData.STAYS.length) return;
        const stays = window.StayNomadData.STAYS;
        const chosen = stays[Math.floor(Math.random() * stays.length)];
        const range = window.StayNomadData.getNextAvailableRange(chosen, 2);

        let curtain = document.getElementById('page-curtain');
        if (!curtain) {
          curtain = document.createElement('div');
          curtain.id = 'page-curtain';
          curtain.className = 'page-curtain';
          curtain.innerHTML = `<div class="page-curtain-inner"><p class="page-curtain-coords"></p><p class="page-curtain-title"></p></div>`;
          document.body.appendChild(curtain);
        }

        curtain.querySelector('.page-curtain-coords').textContent =
          `${chosen.coordinates.lat.toFixed(2)}° N · ${chosen.coordinates.lng.toFixed(2)}° E — COMPASS LOCKED`;
        curtain.querySelector('.page-curtain-title').textContent =
          `Flying to ${chosen.title}…`;

        curtain.classList.add('is-active');
        setTimeout(() => {
          window.location.href = `stay.html?id=${chosen.id}&checkin=${range.checkIn}&checkout=${range.checkOut}`;
        }, reducedMotion.matches ? 80 : 680);
      });
    });
  }

  /* 11. Lightweight Hero Embers / Fireflies Canvas */
  function initHeroEmbersCanvas() {
    const canvas = document.getElementById('hero-embers-canvas');
    if (!canvas || reducedMotion.matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let visible = true;

    function resize() {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 720;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.1 + Math.random() * 2.3,
      vy: 0.25 + Math.random() * 0.55,
      drift: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.6,
      warm: Math.random() > 0.45
    }));

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
      });
      io.observe(canvas);
    }

    function draw() {
      if (visible) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y -= p.vy;
          p.drift += 0.015;
          p.x += Math.sin(p.drift) * 0.35;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.8);
          if (p.warm) {
            grad.addColorStop(0, `rgba(242, 178, 92, ${p.alpha})`);
            grad.addColorStop(1, 'rgba(226, 115, 58, 0)');
          } else {
            grad.addColorStop(0, `rgba(226, 115, 58, ${p.alpha})`);
            grad.addColorStop(1, 'rgba(226, 115, 58, 0)');
          }
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* 12. Home Page Dynamic Content Renderers */
  function initHomePage() {
    if (!window.StayNomadData) return;

    // Default dates in Hero Search Bar (tomorrow + 3 nights)
    const heroIn = document.getElementById('hero-checkin');
    const heroOut = document.getElementById('hero-checkout');
    if (heroIn && heroOut) {
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 4);
      const out = new Date();
      out.setDate(out.getDate() + 7);
      heroIn.min = window.StayNomadData.formatDateISO(new Date());
      heroIn.value = window.StayNomadData.formatDateISO(tmr);
      heroOut.min = heroIn.value;
      heroOut.value = window.StayNomadData.formatDateISO(out);

      heroIn.addEventListener('change', () => {
        heroOut.min = heroIn.value;
        if (heroOut.value <= heroIn.value) {
          const d = new Date(heroIn.value + 'T00:00:00');
          d.setDate(d.getDate() + 2);
          heroOut.value = window.StayNomadData.formatDateISO(d);
        }
      });
    }

    // Categories Grid
    const catGrid = document.getElementById('home-categories-grid');
    if (catGrid) {
      catGrid.innerHTML = window.StayNomadData.CATEGORIES.map((cat, idx) => `
        <a href="stays.html?type=${cat.slug}" class="category-card" data-tilt data-reveal style="--stagger:${idx}">
          <div class="category-card-bg">
            <picture>
              <source srcset="${cat.image}" type="image/webp">
              <img src="${cat.fallback}" alt="${cat.alt}" width="600" height="750" loading="lazy" decoding="async">
            </picture>
          </div>
          <div class="category-icon-ring" data-tilt-layer="3">
            ${getCategoryIconSVG(cat.slug)}
          </div>
          <h3 data-tilt-layer="2">${cat.name}</h3>
          <span data-tilt-layer="1">${cat.subtitle}</span>
        </a>
      `).join('');
    }

    // Featured Stays Grid (6 stays)
    const featuredGrid = document.getElementById('home-featured-grid');
    if (featuredGrid) {
      const featured = window.StayNomadData.STAYS.filter(s => s.featured);
      featuredGrid.innerHTML = featured.map((s, idx) => renderStayCard(s, idx)).join('');
    }

    // Destinations Mosaic
    const mosaicGrid = document.getElementById('home-destinations-mosaic');
    if (mosaicGrid) {
      mosaicGrid.innerHTML = window.StayNomadData.DESTINATIONS.map((dest, idx) => `
        <a href="stays.html?region=${encodeURIComponent(dest.region)}" class="dest-card" data-tilt data-reveal style="--stagger:${idx}">
          <picture>
            <source srcset="${dest.image}" type="image/webp">
            <img src="${dest.fallback}" alt="${dest.alt}" width="900" height="650" loading="lazy" decoding="async">
          </picture>
          <div class="destination-card-content" data-tilt-layer="2">
            <span class="dest-waypoint">${dest.waypoint} · ${dest.staysCount}</span>
            <h3>${dest.region}</h3>
            <p style="font-size:var(--text-xs);color:var(--clay);">${dest.subtitle}</p>
          </div>
        </a>
      `).join('');
    }

    // Guest Stories Grid
    const storiesGrid = document.getElementById('home-stories-grid');
    if (storiesGrid) {
      const starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      storiesGrid.innerHTML = window.StayNomadData.GUEST_STORIES.map((st, idx) => `
        <article class="testimonial-card" data-tilt data-reveal style="--stagger:${idx}">
          <div class="testimonial-photo">
            <picture>
              <source srcset="${st.image}" type="image/webp">
              <img src="${st.fallback}" alt="${st.alt}" width="720" height="450" loading="lazy" decoding="async">
            </picture>
          </div>
          <div class="testimonial-body" data-tilt-layer="2">
            <div class="testimonial-stars" aria-label="5 out of 5 stars">${starSvg.repeat(5)}</div>
            <blockquote class="testimonial-quote">“${st.quote}”</blockquote>
            <div class="testimonial-author">${st.guest} · <span>${st.stayTitle}</span></div>
          </div>
        </article>
      `).join('');
    }

    // Newsletter Form
    const newsForm = document.getElementById('newsletter-form');
    if (newsForm) {
      newsForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = newsForm.querySelector('input[type="email"]');
        const val = (input.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          input.classList.add('is-invalid');
          showToast('Please enter a valid email address for field dispatches.', 'info');
          return;
        }
        input.classList.remove('is-invalid');
        input.value = '';
        showToast('Subscribed! Expect golden-hour cabin dispatches once a moon.', 'success');
      });
    }

    if (window.StayNomadTilt) window.StayNomadTilt.init(document);
    observeReveals(document);
  }

  /* 13. Contact Form Validation & Accessible FAQ Accordion */
  function initContactAndFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // Close others smoothly
        faqItems.forEach(other => {
          other.classList.remove('is-open');
          const ob = other.querySelector('.faq-trigger');
          const op = other.querySelector('.faq-panel');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.maxHeight = '0px';
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const topic = document.getElementById('contact-topic');
        const message = document.getElementById('contact-message');

        let ok = true;
        function check(el, errId, cond, msg) {
          const err = document.getElementById(errId);
          if (!cond) {
            el.classList.add('is-invalid');
            if (err) err.textContent = msg;
            ok = false;
          } else {
            el.classList.remove('is-invalid');
            if (err) err.textContent = '';
          }
        }

        check(name, 'contact-name-error', name.value.trim().length >= 2, 'Please enter your name.');
        check(email, 'contact-email-error', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()), 'Please enter a valid email address.');
        check(topic, 'contact-topic-error', topic.value.trim().length > 0, 'Please choose an inquiry topic.');
        check(message, 'contact-message-error', message.value.trim().length >= 15, 'Please share at least 15 characters so our cabin concierge can assist.');

        if (!ok) {
          showToast('Please review the highlighted fields.', 'info');
          return;
        }

        const successBanner = document.getElementById('contact-success-banner');
        if (successBanner) {
          successBanner.hidden = false;
        }
        contactForm.reset();
        showToast('Message dispatched to our Wilderness Concierge! Reply within 2 hours.', 'success');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggles();
    initScrollTrailAndHeader();
    initScrollUpButton();
    initMobileMenu();
    bindWishlistDelegation();
    initSurpriseMe();
    initHeroEmbersCanvas();
    initHomePage();
    initContactAndFAQ();
    observeReveals(document);
    initCounters(document);
    initCursorAndMagnetics();
  });

  window.StayNomadApp = {
    showToast,
    getWishlist,
    isWishlisted,
    toggleWishlist,
    renderStayCard,
    observeReveals,
    initCounters
  };
})(window, document);

