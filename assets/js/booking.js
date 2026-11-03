/* ==========================================================================
   StayNomad — Stay Detail Gallery, Availability Calendar & 3-Step Booking (booking.js)
   ========================================================================== */

(function (window, document) {
  'use strict';

  const BOOKINGS_KEY = 'staynomad_bookings';

  function getAmenityIconSVG(name) {
    switch (name) {
      case 'Hot tub':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle class="amenity-bubble" cx="10" cy="7" r="1.4"/>
          <circle class="amenity-bubble" cx="15" cy="5.5" r="1.6"/>
          <circle class="amenity-bubble" cx="19" cy="8" r="1.2"/>
          <path d="M4 14h20v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5z"/>
          <path d="M2 14h24"/>
        </svg>`;
      case 'Fireplace':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="amenity-flame" d="M14 5c2.5 3.5 5 6.2 5 10a5 5 0 0 1-10 0c0-2.6 1.5-5 3-6.8.4 1.8 1.5 2.5 2 2.5 0-2 .2-3.8 0-5.7z" fill="currentColor" fill-opacity="0.22"/>
          <path d="M6 24h16M8 21l12 3M20 21L8 24"/>
        </svg>`;
      case 'Wi-Fi':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 11a15 15 0 0 1 20 0"/><path d="M7.5 15a10 10 0 0 1 13 0"/><path d="M11 19a5 5 0 0 1 6 0"/><circle cx="14" cy="22.5" r="1.2" fill="currentColor"/>
        </svg>`;
      case 'Pet-friendly':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="10" r="2"/><circle cx="14" cy="8" r="2"/><circle cx="19" cy="10" r="2"/><circle cx="21" cy="15" r="1.8"/>
          <path d="M14 14c-3.5 0-6 2.6-6 5.4 0 1.8 1.4 2.8 3.2 2.8 1.2 0 1.9-.4 2.8-.4s1.6.4 2.8.4c1.8 0 3.2-1 3.2-2.8 0-2.8-2.5-5.4-6-5.4z"/>
        </svg>`;
      case 'Lake view':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 16l6-7 5 5 4-4 7 6"/><path d="M3 20c3-1.5 6 1.5 9 0s6 1.5 9 0 3-1 4 0"/><path d="M3 24c3-1.5 6 1.5 9 0s6 1.5 9 0"/>
        </svg>`;
      case 'Off-grid':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="14" cy="14" r="4"/><path d="M14 3v3M14 22v3M5 14h3M20 14h3M7.5 7.5l2 2M18.5 18.5l2 2M20.5 7.5l-2 2M9.5 18.5l-2 2"/>
        </svg>`;
      case 'Sauna':
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path class="amenity-bubble" d="M9 6c0 2 2 2 2 4s-2 2-2 4"/><path class="amenity-bubble" d="M14 5c0 2 2 2 2 4s-2 2-2 4"/><path class="amenity-bubble" d="M19 6c0 2 2 2 2 4s-2 2-2 4"/>
          <rect x="4" y="17" width="20" height="6" rx="2"/>
        </svg>`;
      default: // EV charger
        return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="6" y="5" width="12" height="18" rx="2"/><path d="M18 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 4 0v-6l-2-2"/><path d="M13 10l-2.5 4h3.5L11.5 18"/>
        </svg>`;
    }
  }

  function calculatePricing(stay, checkInStr, checkOutStr) {
    if (!stay || !checkInStr || !checkOutStr) return null;
    const start = new Date(checkInStr + 'T00:00:00');
    const end = new Date(checkOutStr + 'T00:00:00');
    const diffMs = end - start;
    const nights = Math.round(diffMs / 86400000);
    if (nights < 1) return null;

    let accommodation = 0;
    let hasBlockedConflict = false;

    for (let i = 0; i < nights; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = window.StayNomadData.formatDateISO(d);
      if (window.StayNomadData.isDateBooked(stay, ds)) {
        hasBlockedConflict = true;
      }
      accommodation += window.StayNomadData.getNightlyRate(stay, ds);
    }

    const cleaning = stay.cleaningFee;
    const serviceFee = Math.round(accommodation * stay.serviceFeeRate);
    const taxes = Math.round((accommodation + cleaning + serviceFee) * stay.taxRate);
    const total = accommodation + cleaning + serviceFee + taxes;
    const avgNightly = Math.round(accommodation / nights);

    return {
      nights,
      avgNightly,
      accommodation,
      cleaning,
      serviceFee,
      taxes,
      total,
      hasBlockedConflict
    };
  }

  /* ==========================================================================
     1. STAY DETAIL PAGE (stay.html)
     ========================================================================== */
  function initStayDetailPage() {
    const detailRoot = document.getElementById('stay-detail-root');
    if (!detailRoot || !window.StayNomadData) return;

    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('id');
    const stays = window.StayNomadData.STAYS;

    let stay = null;
    let isMissingFallback = false;

    if (!rawId) {
      stay = stays[0];
    } else {
      stay = stays.find(s => s.id === rawId || s.slug === rawId);
      if (!stay) {
        isMissingFallback = true;
      }
    }

    const notFoundSection = document.getElementById('stay-not-found');
    const mainContent = document.getElementById('stay-valid-content');

    if (isMissingFallback) {
      document.body.classList.remove('has-mobile-book-bar');
      if (mainContent) mainContent.hidden = true;
      if (notFoundSection) {
        notFoundSection.hidden = false;
        const recGrid = document.getElementById('not-found-recommendations');
        if (recGrid && window.StayNomadApp) {
          recGrid.innerHTML = stays.slice(0, 3).map((s, i) => window.StayNomadApp.renderStayCard(s, i)).join('');
          if (window.StayNomadTilt) window.StayNomadTilt.init(recGrid);
          window.StayNomadApp.observeReveals(recGrid);
        }
      }
      const mobileBar = document.getElementById('mobile-book-bar');
      if (mobileBar) mobileBar.style.display = 'none';
      return;
    }

    document.body.classList.add('has-mobile-book-bar');

    // Update SEO Title, Meta Description & LodgingBusiness JSON-LD dynamically
    document.title = `${stay.title} in ${stay.location} — StayNomad`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${stay.title} (${stay.location}): ${stay.tagline} From $${stay.pricePerNight}/night on StayNomad.`);
    }

    const ldScript = document.getElementById('stay-jsonld');
    if (ldScript) {
      ldScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: stay.title,
        description: stay.tagline,
        image: stay.cover,
        priceRange: `$${stay.pricePerNight} / night`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: stay.location,
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: stay.coordinates.lat,
          longitude: stay.coordinates.lng
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: stay.rating,
          reviewCount: stay.reviewCount
        }
      });
    }

    // All 5 photos for gallery + lightbox
    const photos = [
      { src: stay.cover, fallback: stay.coverFallback, alt: stay.coverAlt, caption: `${stay.title} — ${stay.location}` },
      ...stay.gallery
    ];

    // Header Info
    document.getElementById('stay-category-eyebrow').textContent = `${stay.categoryLabel} · ${stay.elevation}`;
    document.getElementById('stay-title').textContent = stay.title;
    document.getElementById('stay-tagline').textContent = stay.tagline;
    document.getElementById('stay-meta-strip').innerHTML = `
      <span class="stay-rating">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ${stay.rating.toFixed(2)} (${stay.reviewCount} guest reviews)
      </span>
      <span>·</span>
      <span>${stay.location}</span>
      <span>·</span>
      <span class="season-chip">${stay.weather.temp} · ${stay.weather.label}</span>
      <span class="season-chip">Best Season: ${stay.bestSeason}</span>
    `;

    // Wishlist button in header
    const saveHeaderBtn = document.getElementById('stay-wishlist-btn');
    if (saveHeaderBtn && window.StayNomadApp) {
      const syncSaveLabel = () => {
        const saved = window.StayNomadApp.isWishlisted(stay.id);
        saveHeaderBtn.innerHTML = saved
          ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>Saved to Wishlist</span>`
          : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>Save Hideaway</span>`;
      };
      syncSaveLabel();
      saveHeaderBtn.addEventListener('click', () => {
        window.StayNomadApp.toggleWishlist(stay.id);
        syncSaveLabel();
      });
      window.addEventListener('staynomad:wishlist-changed', syncSaveLabel);
    }

    // Gallery Mosaic
    const mosaicEl = document.getElementById('stay-gallery-mosaic');
    mosaicEl.innerHTML = photos.map((p, idx) => `
      <div class="gallery-tile" role="button" tabindex="0" data-photo-idx="${idx}" aria-label="Open photo ${idx + 1} of ${photos.length}: ${p.caption}">
        <picture>
          <source srcset="${p.src}" type="image/webp">
          <img src="${p.fallback}" alt="${p.alt}" width="${idx === 0 ? 1000 : 600}" height="${idx === 0 ? 750 : 450}" ${idx === 0 ? 'decoding="async"' : 'loading="lazy" decoding="async"'}>
        </picture>
        ${idx === photos.length - 1 ? `<span class="btn btn-secondary btn-sm gallery-open-btn">View all 5 photos</span>` : ''}
      </div>
    `).join('');

    // Lightbox with Keyboard & Touch Swipe
    const lightbox = document.getElementById('stay-lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCounter = document.getElementById('lightbox-counter');
    const lbCaption = document.getElementById('lightbox-caption');
    let activePhotoIdx = 0;

    function openLightbox(idx) {
      activePhotoIdx = (idx + photos.length) % photos.length;
      const item = photos[activePhotoIdx];
      lbImg.src = item.src;
      lbImg.onerror = function () { lbImg.src = item.fallback; };
      lbImg.alt = item.alt;
      lbCounter.textContent = `${activePhotoIdx + 1} / ${photos.length}`;
      lbCaption.textContent = item.caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    mosaicEl.querySelectorAll('.gallery-tile').forEach(tile => {
      const idx = parseInt(tile.getAttribute('data-photo-idx'), 10);
      tile.addEventListener('click', () => openLightbox(idx));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => openLightbox(activePhotoIdx - 1));
    document.getElementById('lightbox-next').addEventListener('click', () => openLightbox(activePhotoIdx + 1));

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(activePhotoIdx - 1);
      if (e.key === 'ArrowRight') openLightbox(activePhotoIdx + 1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 45) {
        openLightbox(dx < 0 ? activePhotoIdx + 1 : activePhotoIdx - 1);
      }
    }, { passive: true });

    // Specs & Description
    document.getElementById('stay-quick-specs').innerHTML = `
      <span>Up to <strong>${stay.maxGuests}</strong> guests</span> ·
      <span><strong>${stay.bedrooms}</strong> ${stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span> ·
      <span><strong>${stay.beds}</strong> ${stay.beds === 1 ? 'bed' : 'beds'}</span> ·
      <span><strong>${stay.baths}</strong> ${stay.baths === 1 ? 'bath' : 'baths'}</span> ·
      <span>${stay.instantBook ? 'Instant Book Available' : 'Host-Curated Confirmation'}</span>
    `;

    document.getElementById('stay-description').innerHTML =
      stay.description.map(p => `<p style="margin-bottom:1.1rem;color:var(--text-secondary);">${p}</p>`).join('');

    // Host Card (Centered + 3D Tilt + Custom Botanical Crest SVG)
    const hostInitials = stay.host.name.split(' ').map(w => w[0]).slice(0, 2).join('');
    document.getElementById('stay-host-card').innerHTML = `
      <div class="team-crest" data-tilt-layer="3" aria-hidden="true">
        <span style="font-family:var(--font-display);font-size:1.45rem;font-weight:600;">${hostInitials}</span>
      </div>
      <div data-tilt-layer="2">
        <span class="badge-glow" style="margin-bottom:0.45rem;">${stay.host.badge}</span>
        <h3>Hosted by ${stay.host.name}</h3>
        <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:0.2rem;">Steward since ${stay.host.since} · ${stay.host.responseRate} response rate (${stay.host.responseTime})</p>
      </div>
      <p style="max-width:48ch;color:var(--text-secondary);font-size:var(--text-sm);" data-tilt-layer="1">${stay.host.bio}</p>
    `;

    // Amenity Grid (Centered + 3D Tilt + Hospitality Animations)
    document.getElementById('stay-amenities-grid').innerHTML = stay.amenities.map((am, idx) => `
      <div class="amenity-card" data-tilt data-reveal style="--stagger:${idx}">
        <div class="amenity-icon" data-tilt-layer="3">${getAmenityIconSVG(am)}</div>
        <h4 style="font-size:var(--text-base);" data-tilt-layer="2">${am}</h4>
        <span style="font-size:var(--text-xs);color:var(--text-muted);" data-tilt-layer="1">Included with stay</span>
      </div>
    `).join('');

    // Good to Know & House Rules
    document.getElementById('stay-good-to-know').innerHTML = stay.goodToKnow.map(item => `
      <li style="display:flex;align-items:flex-start;gap:0.65rem;margin-bottom:0.75rem;color:var(--text-secondary);">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--ember)" stroke-width="2.2" style="flex-shrink:0;margin-top:3px;"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${item}</span>
      </li>
    `).join('');

    document.getElementById('stay-house-rules').innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.1rem;font-size:var(--text-sm);">
        <div><strong>Check-in:</strong> ${stay.houseRules.checkIn}</div>
        <div><strong>Check-out:</strong> ${stay.houseRules.checkOut}</div>
      </div>
      <ul>
        ${stay.houseRules.items.map(r => `<li style="margin-bottom:0.55rem;color:var(--text-secondary);font-size:var(--text-sm);">• ${r}</li>`).join('')}
      </ul>
    `;

    // Reviews
    const starSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="var(--amber)" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    document.getElementById('stay-reviews-grid').innerHTML = stay.reviews.map((rev, idx) => `
      <article class="value-card" data-tilt data-reveal style="--stagger:${idx}">
        <div class="testimonial-stars" data-tilt-layer="3">${starSvg.repeat(5)}</div>
        <p style="font-family:var(--font-display);font-style:italic;font-size:1.02rem;" data-tilt-layer="2">“${rev.comment}”</p>
        <div style="font-size:var(--text-xs);color:var(--text-secondary);font-weight:700;margin-top:auto;" data-tilt-layer="1">
          ${rev.guest} · ${rev.trip} (${rev.date})
        </div>
      </article>
    `).join('');

    // Similar Stays (3 other stays)
    const similar = stays.filter(s => s.id !== stay.id).sort((a, b) => {
      const sameCatA = a.category === stay.category ? 1 : 0;
      const sameCatB = b.category === stay.category ? 1 : 0;
      return sameCatB - sameCatA;
    }).slice(0, 3);
    document.getElementById('stay-similar-grid').innerHTML = similar.map((s, idx) => window.StayNomadApp.renderStayCard(s, idx)).join('');

    /* Availability Calendar + Sticky Booking Price Calculator */
    const defaultRange = window.StayNomadData.getNextAvailableRange(stay, 2);
    let selectedIn = params.get('checkin') || defaultRange.checkIn;
    let selectedOut = params.get('checkout') || defaultRange.checkOut;

    const inInput = document.getElementById('book-checkin');
    const outInput = document.getElementById('book-checkout');
    const guestSelect = document.getElementById('book-guests');
    const breakdownBox = document.getElementById('book-price-breakdown');
    const reserveBtn = document.getElementById('book-reserve-btn');
    const scarcityBanner = document.getElementById('book-scarcity-notice');

    // Populate guests dropdown up to stay.maxGuests
    guestSelect.innerHTML = Array.from({ length: stay.maxGuests }, (_, i) =>
      `<option value="${i + 1}" ${i === 1 ? 'selected' : ''}>${i + 1} ${i === 0 ? 'Guest' : 'Guests'}</option>`
    ).join('');

    document.getElementById('book-base-price').innerHTML = `<strong style="font-family:var(--font-display);font-size:1.65rem;color:var(--ember);">$${stay.pricePerNight}</strong> <span style="color:var(--text-secondary);font-size:var(--text-sm);">/ night</span>`;
    document.getElementById('mobile-bar-price').innerHTML = `<strong style="color:var(--amber);font-family:var(--font-display);font-size:1.25rem;">$${stay.pricePerNight}</strong> <span style="font-size:var(--text-xs);color:var(--clay);">/ night</span>`;

    const openThisMonth = window.StayNomadData.getRemainingNightsThisMonth(stay);
    if (scarcityBanner) {
      scarcityBanner.innerHTML = `<span class="scarcity-dot"></span><span>Only <strong>${openThisMonth}</strong> ${openThisMonth === 1 ? 'night' : 'nights'} left this month on the calendar</span>`;
    }

    const today = new Date();
    let calYear = today.getFullYear();
    let calMonth = today.getMonth();

    const calDaysEl = document.getElementById('calendar-days');
    const calMonthLabel = document.getElementById('calendar-month-label');
    const calPrevBtn = document.getElementById('calendar-prev');
    const calNextBtn = document.getElementById('calendar-next');

    function renderCalendar() {
      const firstDay = new Date(calYear, calMonth, 1);
      const startDow = firstDay.getDay();
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      calMonthLabel.textContent = `${monthNames[calMonth]} ${calYear}`;

      const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
      calPrevBtn.disabled = isCurrentMonth;

      let cells = '';
      for (let e = 0; e < startDow; e++) {
        cells += `<div class="cal-day is-empty" aria-hidden="true"></div>`;
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(calYear, calMonth, d);
        const ds = window.StayNomadData.formatDateISO(dateObj);
        const booked = window.StayNomadData.isDateBooked(stay, ds);
        const rate = window.StayNomadData.getNightlyRate(stay, ds);
        const isSelected = ds === selectedIn || ds === selectedOut;
        const inRange = selectedIn && selectedOut && ds > selectedIn && ds < selectedOut;

        cells += `
          <button type="button"
            class="cal-day ${booked ? 'is-booked' : ''} ${isSelected ? 'is-selected' : ''} ${inRange ? 'is-in-range' : ''}"
            data-cal-date="${ds}"
            ${booked ? 'disabled' : ''}
            aria-label="${ds}, ${booked ? 'Booked' : 'Available at $' + rate + ' per night'}">
            <span class="cal-day-num">${d}</span>
            <span class="cal-day-price">${booked ? 'Booked' : '$' + rate}</span>
          </button>
        `;
      }

      calDaysEl.innerHTML = cells;
    }

    calDaysEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-cal-date]');
      if (!btn || btn.disabled) return;
      const clicked = btn.getAttribute('data-cal-date');

      if (!selectedIn || (selectedIn && selectedOut) || clicked <= selectedIn) {
        selectedIn = clicked;
        selectedOut = '';
      } else {
        selectedOut = clicked;
      }
      syncInputsAndPricing();
      renderCalendar();
    });

    calPrevBtn.addEventListener('click', () => {
      calMonth--;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      }
      renderCalendar();
    });

    calNextBtn.addEventListener('click', () => {
      calMonth++;
      if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      renderCalendar();
    });

    function syncInputsAndPricing() {
      inInput.min = window.StayNomadData.formatDateISO(today);
      inInput.value = selectedIn || '';
      outInput.min = selectedIn || inInput.min;
      outInput.value = selectedOut || '';

      if (!selectedIn || !selectedOut) {
        breakdownBox.innerHTML = `<p style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;">Select your check-out date on the calendar to calculate total stay cost.</p>`;
        reserveBtn.disabled = true;
        return;
      }

      const calc = calculatePricing(stay, selectedIn, selectedOut);
      if (!calc || calc.hasBlockedConflict) {
        breakdownBox.innerHTML = `<p style="font-size:var(--text-xs);color:var(--ember);font-weight:700;text-align:center;">Selected range spans an unavailable night. Please pick open dates on the calendar.</p>`;
        reserveBtn.disabled = true;
        return;
      }

      reserveBtn.disabled = false;
      breakdownBox.innerHTML = `
        <div class="price-row">
          <span>$${calc.avgNightly} avg × ${calc.nights} ${calc.nights === 1 ? 'night' : 'nights'}</span>
          <span>$${calc.accommodation}</span>
        </div>
        <div class="price-row">
          <span>Cabin preparation & linen fee</span>
          <span>$${calc.cleaning}</span>
        </div>
        <div class="price-row">
          <span>StayNomad stewardship fee (12%)</span>
          <span>$${calc.serviceFee}</span>
        </div>
        <div class="price-row">
          <span>Conservation & occupancy taxes (8%)</span>
          <span>$${calc.taxes}</span>
        </div>
        <div class="price-row total">
          <span>Total before taxes & fees included</span>
          <span>$${calc.total}</span>
        </div>
      `;
    }

    inInput.addEventListener('change', () => {
      selectedIn = inInput.value;
      if (selectedOut && selectedOut <= selectedIn) {
        const nextD = new Date(selectedIn + 'T00:00:00');
        nextD.setDate(nextD.getDate() + 2);
        selectedOut = window.StayNomadData.formatDateISO(nextD);
      }
      syncInputsAndPricing();
      renderCalendar();
    });

    outInput.addEventListener('change', () => {
      selectedOut = outInput.value;
      syncInputsAndPricing();
      renderCalendar();
    });

    function proceedToCheckout() {
      if (!selectedIn || !selectedOut) {
        window.StayNomadApp.showToast('Please select check-in and check-out dates.', 'info');
        return;
      }
      const calc = calculatePricing(stay, selectedIn, selectedOut);
      if (!calc || calc.hasBlockedConflict) {
        window.StayNomadApp.showToast('Selected dates overlap a booked night. Please choose available dates.', 'info');
        return;
      }
      const guests = guestSelect.value || '2';
      window.location.href = `booking.html?stay=${stay.id}&checkin=${selectedIn}&checkout=${selectedOut}&guests=${guests}`;
    }

    reserveBtn.addEventListener('click', proceedToCheckout);
    const mobileBookBtn = document.getElementById('mobile-book-scroll-btn');
    if (mobileBookBtn) {
      mobileBookBtn.addEventListener('click', () => {
        document.getElementById('booking-card-anchor').scrollIntoView({ behavior: 'smooth' });
      });
    }

    syncInputsAndPricing();
    renderCalendar();
    if (window.StayNomadTilt) window.StayNomadTilt.init(detailRoot);
    if (window.StayNomadApp) window.StayNomadApp.observeReveals(detailRoot);
  }

  /* ==========================================================================
     2. BOOKING CHECKOUT PAGE (booking.html)
     ========================================================================== */
  function initBookingCheckoutPage() {
    const checkoutRoot = document.getElementById('booking-checkout-root');
    if (!checkoutRoot || !window.StayNomadData) return;

    const params = new URLSearchParams(window.location.search);
    const stayId = params.get('stay') || 'stay-01';
    const stay = window.StayNomadData.STAYS.find(s => s.id === stayId) || window.StayNomadData.STAYS[0];
    const defaultRange = window.StayNomadData.getNextAvailableRange(stay, 2);

    let checkIn = params.get('checkin') || defaultRange.checkIn;
    let checkOut = params.get('checkout') || defaultRange.checkOut;
    let guests = Math.min(stay.maxGuests, Math.max(1, parseInt(params.get('guests') || '2', 10)));

    const stepIn = document.getElementById('checkout-checkin');
    const stepOut = document.getElementById('checkout-checkout');
    const stepGuests = document.getElementById('checkout-guests');

    stepGuests.innerHTML = Array.from({ length: stay.maxGuests }, (_, i) =>
      `<option value="${i + 1}" ${i + 1 === guests ? 'selected' : ''}>${i + 1} ${i === 0 ? 'Guest' : 'Guests'}</option>`
    ).join('');

    stepIn.min = window.StayNomadData.formatDateISO(new Date());
    stepIn.value = checkIn;
    stepOut.min = checkIn;
    stepOut.value = checkOut;

    // Pre-fill guest details if signed in
    const currentUser = window.StayNomadAuth ? window.StayNomadAuth.getCurrentUser() : null;
    if (currentUser) {
      const gName = document.getElementById('guest-fullname');
      const gEmail = document.getElementById('guest-email');
      const gPhone = document.getElementById('guest-phone');
      if (gName && !gName.value) gName.value = currentUser.name || '';
      if (gEmail && !gEmail.value) gEmail.value = currentUser.email || '';
      if (gPhone && !gPhone.value) gPhone.value = currentUser.phone || '';
    }

    function updateSummarySidebar() {
      checkIn = stepIn.value;
      checkOut = stepOut.value;
      guests = parseInt(stepGuests.value, 10) || 1;

      const calc = calculatePricing(stay, checkIn, checkOut);
      const summaryEl = document.getElementById('checkout-stay-summary');

      summaryEl.innerHTML = `
        <div style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:16/10;margin-bottom:1.1rem;">
          <picture>
            <source srcset="${stay.cover}" type="image/webp">
            <img src="${stay.coverFallback}" alt="${stay.coverAlt}" width="640" height="400" loading="lazy">
          </picture>
        </div>
        <span class="eyebrow" style="margin-bottom:0.35rem;">${stay.categoryLabel}</span>
        <h3 style="font-size:1.35rem;">${stay.title}</h3>
        <p style="font-size:var(--text-xs);color:var(--text-secondary);margin-top:0.2rem;">${stay.location}</p>
        <div class="price-breakdown">
          <div class="price-row"><span>Dates</span><strong>${checkIn} → ${checkOut}</strong></div>
          <div class="price-row"><span>Guests</span><strong>${guests} ${guests === 1 ? 'guest' : 'guests'}</strong></div>
          ${calc ? `
            <div class="price-row"><span>$${calc.avgNightly} × ${calc.nights} nights</span><span>$${calc.accommodation}</span></div>
            <div class="price-row"><span>Cabin preparation</span><span>$${calc.cleaning}</span></div>
            <div class="price-row"><span>Stewardship fee</span><span>$${calc.serviceFee}</span></div>
            <div class="price-row"><span>Conservation tax</span><span>$${calc.taxes}</span></div>
            <div class="price-row total"><span>Total Due</span><span>$${calc.total}</span></div>
          ` : `<p style="color:var(--ember);font-size:var(--text-xs);">Please choose valid check-in and check-out dates.</p>`}
        </div>
      `;
      return calc;
    }

    stepIn.addEventListener('change', () => {
      if (stepOut.value <= stepIn.value) {
        const nd = new Date(stepIn.value + 'T00:00:00');
        nd.setDate(nd.getDate() + 2);
        stepOut.value = window.StayNomadData.formatDateISO(nd);
      }
      updateSummarySidebar();
    });
    stepOut.addEventListener('change', updateSummarySidebar);
    stepGuests.addEventListener('change', updateSummarySidebar);

    updateSummarySidebar();

    // Stepper Navigation
    const panels = [
      document.getElementById('step-panel-1'),
      document.getElementById('step-panel-2'),
      document.getElementById('step-panel-3'),
      document.getElementById('step-panel-4')
    ];
    const indicators = [
      document.getElementById('step-ind-1'),
      document.getElementById('step-ind-2'),
      document.getElementById('step-ind-3')
    ];

    function goToStep(stepNum) {
      panels.forEach((p, idx) => {
        if (p) p.classList.toggle('is-active', idx === stepNum - 1);
      });
      indicators.forEach((ind, idx) => {
        if (!ind) return;
        ind.classList.toggle('is-active', idx === stepNum - 1);
        ind.classList.toggle('is-done', idx < stepNum - 1 || stepNum === 4);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 1 -> Step 2
    document.getElementById('to-step-2-btn').addEventListener('click', () => {
      const calc = updateSummarySidebar();
      const errEl = document.getElementById('step-1-error');
      if (!calc || calc.nights < 1) {
        errEl.textContent = 'Check-out date must be at least 1 night after check-in.';
        return;
      }
      if (calc.hasBlockedConflict) {
        errEl.textContent = 'One or more selected dates are already booked. Please adjust your dates.';
        return;
      }
      errEl.textContent = '';
      goToStep(2);
    });

    document.getElementById('back-to-step-1').addEventListener('click', () => goToStep(1));
    document.getElementById('back-to-step-2').addEventListener('click', () => goToStep(2));

    // Step 2 -> Step 3 (Guest Validation)
    document.getElementById('to-step-3-btn').addEventListener('click', () => {
      const gName = document.getElementById('guest-fullname');
      const gEmail = document.getElementById('guest-email');
      const gPhone = document.getElementById('guest-phone');

      let valid = true;
      const setErr = (el, id, msg) => {
        el.classList.toggle('is-invalid', !!msg);
        document.getElementById(id).textContent = msg;
        if (msg) valid = false;
      };

      setErr(gName, 'guest-fullname-error', gName.value.trim().length < 2 ? 'Please enter the primary guest full name.' : '');
      setErr(gEmail, 'guest-email-error', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gEmail.value.trim()) ? 'Please enter a valid email for your trail itinerary.' : '');
      setErr(gPhone, 'guest-phone-error', gPhone.value.replace(/\D/g, '').length < 8 ? 'Please enter a valid contact phone number.' : '');

      if (!valid) {
        window.StayNomadApp.showToast('Please complete required guest details.', 'info');
        return;
      }
      goToStep(3);
    });

    // Card formatting helpers
    const cardNumberInput = document.getElementById('pay-card-number');
    const cardExpiryInput = document.getElementById('pay-card-expiry');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', () => {
        const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
        cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      });
    }
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', () => {
        const digits = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
        cardExpiryInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      });
    }

    // Step 3 -> Step 4 (Mock Payment Validation & Save to localStorage)
    document.getElementById('booking-payment-form').addEventListener('submit', e => {
      e.preventDefault();
      const holder = document.getElementById('pay-card-name');
      const num = document.getElementById('pay-card-number');
      const exp = document.getElementById('pay-card-expiry');
      const cvc = document.getElementById('pay-card-cvc');
      const agree = document.getElementById('pay-agree');

      let valid = true;
      const setErr = (el, id, msg) => {
        el.classList.toggle('is-invalid', !!msg);
        document.getElementById(id).textContent = msg;
        if (msg) valid = false;
      };

      setErr(holder, 'pay-card-name-error', holder.value.trim().length < 2 ? 'Enter the name on card.' : '');
      setErr(num, 'pay-card-number-error', num.value.replace(/\D/g, '').length < 16 ? 'Enter a 16-digit card number (demo).' : '');
      setErr(exp, 'pay-card-expiry-error', !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp.value.trim()) ? 'Use MM/YY format.' : '');
      setErr(cvc, 'pay-card-cvc-error', !/^\d{3,4}$/.test(cvc.value.trim()) ? 'Enter 3 or 4 digit security code.' : '');

      const agreeErr = document.getElementById('pay-agree-error');
      if (!agree.checked) {
        agreeErr.textContent = 'Please accept the wilderness house rules & cancellation policy.';
        valid = false;
      } else {
        agreeErr.textContent = '';
      }

      if (!valid) {
        window.StayNomadApp.showToast('Please verify payment details.', 'info');
        return;
      }

      const calc = updateSummarySidebar();
      const bookingId = 'SN-' + Math.floor(100000 + Math.random() * 900000);
      const guestName = document.getElementById('guest-fullname').value.trim();
      const guestEmail = document.getElementById('guest-email').value.trim();

      const record = {
        bookingId,
        stayId: stay.id,
        stayTitle: stay.title,
        stayLocation: stay.location,
        checkIn,
        checkOut,
        nights: calc ? calc.nights : 2,
        guests,
        totalPrice: calc ? calc.total : stay.pricePerNight * 2,
        guestName,
        guestEmail,
        status: 'Upcoming',
        createdAt: new Date().toISOString()
      };

      try {
        const raw = localStorage.getItem(BOOKINGS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(record);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
      } catch (err) { /* ignore */ }

      document.getElementById('confirmed-booking-id').textContent = bookingId;
      document.getElementById('confirmed-details-copy').innerHTML = `
        <strong>${stay.title}</strong> (${stay.location}) is reserved for <strong>${guestName}</strong> from
        <strong>${checkIn}</strong> to <strong>${checkOut}</strong> (${record.nights} ${record.nights === 1 ? 'night' : 'nights'}, ${guests} ${guests === 1 ? 'guest' : 'guests'}).
        Total charged (demo): <strong>$${record.totalPrice}</strong>. GPS trailhead coordinates have been sent to <strong>${guestEmail}</strong>.
      `;

      goToStep(4);
      window.StayNomadApp.showToast(`Booking ${bookingId} confirmed! Pack your boots.`, 'success');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initStayDetailPage();
    initBookingCheckoutPage();
  });
})(window, document);

