/* ==========================================================================
   StayNomad — Custom 3D Card Tilt Engine (tilt.js)
   Max ±10° X/Y rotation, perspective: 1000px, dynamic glare, translateZ depth,
   gyroscope support on touch where permitted + tap lift fallback,
   and strict prefers-reduced-motion respect.
   ========================================================================== */

(function (window, document) {
  'use strict';

  const MAX_TILT = 10; // ±10 degrees max
  const PERSPECTIVE = 1000;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

  let gyroAttached = false;
  let activeTouchCards = [];

  function ensureGlare(card) {
    let glare = card.querySelector(':scope > .tilt-glare');
    if (!glare) {
      glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }
    return glare;
  }

  function bindCard(card) {
    if (!card || card.dataset.tiltBound === '1') return;
    card.dataset.tiltBound = '1';

    if (reducedMotionQuery.matches) return;

    const glare = ensureGlare(card);

    if (!coarsePointerQuery.matches) {
      let rafId = null;

      card.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch' || reducedMotionQuery.matches) return;
        card.classList.add('is-tilting');
      });

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' || reducedMotionQuery.matches) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        const clampedX = Math.max(0, Math.min(1, relX));
        const clampedY = Math.max(0, Math.min(1, relY));

        const rotateY = (clampedX - 0.5) * 2 * MAX_TILT;
        const rotateX = (0.5 - clampedY) * 2 * MAX_TILT;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          const glareX = (clampedX * 100).toFixed(1);
          const glareY = (clampedY * 100).toFixed(1);
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(242, 178, 92, 0.26) 0%, rgba(244, 236, 221, 0.06) 44%, transparent 72%)`;
        });
      });

      card.addEventListener('pointerleave', function () {
        if (rafId) cancelAnimationFrame(rafId);
        card.classList.remove('is-tilting');
        card.style.transform = '';
        if (glare) glare.style.background = '';
      });
    } else {
      // Touch device: gentle tap lift + register for subtle gyroscope tilt if available
      activeTouchCards.push(card);

      card.addEventListener('touchstart', function () {
        if (reducedMotionQuery.matches) return;
        card.style.transform = `perspective(${PERSPECTIVE}px) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
      }, { passive: true });

      card.addEventListener('touchend', function () {
        setTimeout(function () {
          card.style.transform = '';
        }, 220);
      }, { passive: true });
    }
  }

  function attachGyroscopeIfAllowed() {
    if (gyroAttached || !coarsePointerQuery.matches || reducedMotionQuery.matches) return;
    if (typeof window.DeviceOrientationEvent === 'undefined') return;
    // Only bind passive orientation events that do not require intrusive permission prompts
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') return;

    gyroAttached = true;
    window.addEventListener('deviceorientation', function (event) {
      if (reducedMotionQuery.matches || event.gamma === null || event.beta === null) return;
      const rotY = Math.max(-6, Math.min(6, event.gamma * 0.18));
      const rotX = Math.max(-6, Math.min(6, (event.beta - 45) * 0.14));

      for (let i = 0; i < activeTouchCards.length; i++) {
        const card = activeTouchCards[i];
        const rect = card.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }
      }
    }, { passive: true });
  }

  function init(root) {
    const scope = root || document;
    const cards = scope.querySelectorAll('[data-tilt]');
    cards.forEach(bindCard);
    attachGyroscopeIfAllowed();
  }

  document.addEventListener('DOMContentLoaded', function () {
    init(document);
  });

  window.StayNomadTilt = { init };
})(window, document);

