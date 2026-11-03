/* ==========================================================================
   StayNomad — Stays Search, Multi-Facet Filter & Shareable URL Sync (stays-filter.js)
   ========================================================================== */

(function (window, document) {
  'use strict';

  function initStaysPage() {
    const grid = document.getElementById('stays-results-grid');
    if (!grid || !window.StayNomadData || !window.StayNomadApp) return;

    const allStays = window.StayNomadData.STAYS;

    // UI Controls
    const searchInput = document.getElementById('filter-search');
    const regionSelect = document.getElementById('filter-region');
    const typePills = document.querySelectorAll('[data-filter-type]');
    const maxPriceSlider = document.getElementById('filter-max-price');
    const maxPriceLabel = document.getElementById('filter-max-price-val');
    const guestsSelect = document.getElementById('filter-guests');
    const bedroomsSelect = document.getElementById('filter-bedrooms');
    const amenityBoxes = document.querySelectorAll('[data-filter-amenity]');
    const instantToggle = document.getElementById('filter-instant');
    const sortSelect = document.getElementById('filter-sort');
    const countLabel = document.getElementById('stays-result-count');
    const emptyState = document.getElementById('stays-empty-state');
    const resetBtns = document.querySelectorAll('[data-reset-filters]');
    const viewBtns = document.querySelectorAll('[data-view-mode]');
    const shareBtn = document.getElementById('share-filters-btn');

    // Mobile Drawer Controls
    const filterPanel = document.getElementById('stays-filter-panel');
    const drawerBackdrop = document.getElementById('filter-drawer-backdrop');
    const openDrawerBtn = document.getElementById('open-filter-drawer');
    const closeDrawerBtn = document.getElementById('close-filter-drawer');

    const state = {
      q: '',
      region: '',
      type: 'all',
      maxPrice: 420,
      guests: 1,
      bedrooms: 0,
      amenities: [],
      instant: false,
      sort: 'featured',
      view: 'grid'
    };

    // Hydrate from URL Query Params
    function hydrateFromURL() {
      const params = new URLSearchParams(window.location.search);
      if (params.get('q')) state.q = params.get('q').trim();
      if (params.get('where')) state.q = params.get('where').trim();
      if (params.get('region')) state.region = params.get('region').trim();
      if (params.get('type')) state.type = params.get('type').trim().toLowerCase();
      if (params.get('maxPrice')) state.maxPrice = Math.min(420, Math.max(150, parseInt(params.get('maxPrice'), 10) || 420));
      if (params.get('guests')) state.guests = Math.max(1, parseInt(params.get('guests'), 10) || 1);
      if (params.get('bedrooms')) state.bedrooms = Math.max(0, parseInt(params.get('bedrooms'), 10) || 0);
      if (params.get('amenities')) {
        state.amenities = params.get('amenities').split(',').map(s => s.trim()).filter(Boolean);
      }
      if (params.get('instant') === '1') state.instant = true;
      if (params.get('sort')) state.sort = params.get('sort');
      if (params.get('view') === 'list') state.view = 'list';

      syncControlsFromState();
    }

    function syncControlsFromState() {
      if (searchInput) searchInput.value = state.q;
      if (regionSelect) regionSelect.value = state.region;
      typePills.forEach(btn => {
        const active = btn.getAttribute('data-filter-type') === state.type;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (maxPriceSlider) maxPriceSlider.value = String(state.maxPrice);
      if (maxPriceLabel) maxPriceLabel.textContent = `$${state.maxPrice}`;
      if (guestsSelect) guestsSelect.value = String(state.guests);
      if (bedroomsSelect) bedroomsSelect.value = String(state.bedrooms);
      amenityBoxes.forEach(box => {
        box.checked = state.amenities.includes(box.getAttribute('data-filter-amenity'));
      });
      if (instantToggle) instantToggle.checked = state.instant;
      if (sortSelect) sortSelect.value = state.sort;

      grid.classList.toggle('is-list-view', state.view === 'list');
      viewBtns.forEach(btn => {
        const active = btn.getAttribute('data-view-mode') === state.view;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    function pushStateToURL() {
      const params = new URLSearchParams();
      if (state.q) params.set('q', state.q);
      if (state.region) params.set('region', state.region);
      if (state.type && state.type !== 'all') params.set('type', state.type);
      if (state.maxPrice < 420) params.set('maxPrice', String(state.maxPrice));
      if (state.guests > 1) params.set('guests', String(state.guests));
      if (state.bedrooms > 0) params.set('bedrooms', String(state.bedrooms));
      if (state.amenities.length) params.set('amenities', state.amenities.join(','));
      if (state.instant) params.set('instant', '1');
      if (state.sort !== 'featured') params.set('sort', state.sort);
      if (state.view === 'list') params.set('view', 'list');

      const qs = params.toString();
      const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    }

    function renderSkeletons(count) {
      grid.innerHTML = Array.from({ length: count || 6 }, () => `
        <div class="skeleton-card" aria-hidden="true">
          <div class="skeleton-box" style="aspect-ratio:4/3;width:100%;"></div>
          <div style="padding:1.35rem;display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
            <div class="skeleton-box" style="width:45%;height:14px;border-radius:99px;"></div>
            <div class="skeleton-box" style="width:75%;height:22px;border-radius:99px;"></div>
            <div class="skeleton-box" style="width:60%;height:14px;border-radius:99px;"></div>
          </div>
        </div>
      `).join('');
    }

    function getFilteredStays() {
      const query = state.q.toLowerCase();
      const filtered = allStays.filter(stay => {
        if (state.type !== 'all' && stay.category !== state.type) return false;
        if (state.region && stay.region !== state.region) return false;
        if (stay.pricePerNight > state.maxPrice) return false;
        if (stay.maxGuests < state.guests) return false;
        if (stay.bedrooms < state.bedrooms) return false;
        if (state.instant && !stay.instantBook) return false;
        if (state.amenities.length > 0) {
          const hasAll = state.amenities.every(a => stay.amenities.includes(a));
          if (!hasAll) return false;
        }
        if (query) {
          const hay = `${stay.title} ${stay.location} ${stay.region} ${stay.categoryLabel} ${stay.tagline}`.toLowerCase();
          if (!hay.includes(query)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        switch (state.sort) {
          case 'price-asc':
            return a.pricePerNight - b.pricePerNight;
          case 'price-desc':
            return b.pricePerNight - a.pricePerNight;
          case 'rating':
            return b.rating - a.rating || b.reviewCount - a.reviewCount;
          case 'newest':
            return b.createdAt.localeCompare(a.createdAt);
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
        }
      });

      return filtered;
    }

    let skeletonTimer = null;

    function applyFilters(withSkeleton) {
      pushStateToURL();
      const results = getFilteredStays();

      if (countLabel) {
        countLabel.innerHTML = `Showing <strong>${results.length}</strong> of ${allStays.length} wilderness stays`;
      }

      function paintResults() {
        if (results.length === 0) {
          grid.innerHTML = '';
          if (emptyState) emptyState.hidden = false;
        } else {
          if (emptyState) emptyState.hidden = true;
          grid.innerHTML = results.map((s, idx) => window.StayNomadApp.renderStayCard(s, idx)).join('');
          if (window.StayNomadTilt) window.StayNomadTilt.init(grid);
          window.StayNomadApp.observeReveals(grid);
        }
      }

      if (withSkeleton) {
        if (emptyState) emptyState.hidden = true;
        renderSkeletons(Math.max(3, Math.min(6, results.length || 3)));
        clearTimeout(skeletonTimer);
        skeletonTimer = setTimeout(paintResults, 220);
      } else {
        paintResults();
      }
    }

    // Event Listeners
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.q = searchInput.value.trim();
        applyFilters(false);
      });
    }

    if (regionSelect) {
      regionSelect.addEventListener('change', () => {
        state.region = regionSelect.value;
        applyFilters(true);
      });
    }

    typePills.forEach(btn => {
      btn.addEventListener('click', () => {
        state.type = btn.getAttribute('data-filter-type');
        syncControlsFromState();
        applyFilters(true);
      });
    });

    if (maxPriceSlider) {
      maxPriceSlider.addEventListener('input', () => {
        state.maxPrice = parseInt(maxPriceSlider.value, 10);
        if (maxPriceLabel) maxPriceLabel.textContent = `$${state.maxPrice}`;
        applyFilters(false);
      });
    }

    if (guestsSelect) {
      guestsSelect.addEventListener('change', () => {
        state.guests = parseInt(guestsSelect.value, 10) || 1;
        applyFilters(true);
      });
    }

    if (bedroomsSelect) {
      bedroomsSelect.addEventListener('change', () => {
        state.bedrooms = parseInt(bedroomsSelect.value, 10) || 0;
        applyFilters(true);
      });
    }

    amenityBoxes.forEach(box => {
      box.addEventListener('change', () => {
        state.amenities = Array.from(amenityBoxes)
          .filter(b => b.checked)
          .map(b => b.getAttribute('data-filter-amenity'));
        applyFilters(true);
      });
    });

    if (instantToggle) {
      instantToggle.addEventListener('change', () => {
        state.instant = instantToggle.checked;
        applyFilters(true);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        applyFilters(true);
      });
    }

    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.view = btn.getAttribute('data-view-mode');
        syncControlsFromState();
        pushStateToURL();
      });
    });

    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.q = '';
        state.region = '';
        state.type = 'all';
        state.maxPrice = 420;
        state.guests = 1;
        state.bedrooms = 0;
        state.amenities = [];
        state.instant = false;
        state.sort = 'featured';
        syncControlsFromState();
        applyFilters(true);
        window.StayNomadApp.showToast('All stay filters cleared.', 'info');
      });
    });

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            window.StayNomadApp.showToast('Shareable filtered URL copied to clipboard!', 'success');
          }).catch(() => {
            window.StayNomadApp.showToast('Filter link ready in your address bar.', 'info');
          });
        } else {
          window.StayNomadApp.showToast('Filter link ready in your address bar.', 'info');
        }
      });
    }

    // Mobile Filter Drawer
    function setDrawerOpen(open) {
      if (!filterPanel || !drawerBackdrop) return;
      filterPanel.classList.toggle('is-open', open);
      drawerBackdrop.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', () => setDrawerOpen(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => setDrawerOpen(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => setDrawerOpen(false));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && filterPanel && filterPanel.classList.contains('is-open')) {
        setDrawerOpen(false);
      }
    });

    hydrateFromURL();
    applyFilters(true);
  }

  document.addEventListener('DOMContentLoaded', initStaysPage);
})(window, document);

