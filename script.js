/* ==========================================================================
   Póg Magazine — minimal behaviour layer
   1. Sticky nav gains a solid background once the page scrolls
   2. Scroll-triggered reveal animations (skipped if reduced motion)
   3. Back-to-top button on article pages
   4. Subtle pointer-tilt on the feature cards (desktop, fine pointers only)
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Sticky nav state --- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var setNavState = function () {
      if (window.scrollY > 40) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });
  }

  /* --- 2. Reveal on scroll --- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* --- 3. Back-to-top button --- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var toggleBackToTop = function () {
      if (window.scrollY > 800) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* --- 4. Pointer tilt on feature cards --- */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !prefersReducedMotion) {
    var tiltCards = document.querySelectorAll('.js-tilt');
    tiltCards.forEach(function (card) {
      var bounds;
      card.addEventListener('pointerenter', function () {
        bounds = card.getBoundingClientRect();
      });
      card.addEventListener('pointermove', function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width;   /* 0 - 1 */
        var py = (e.clientY - bounds.top) / bounds.height;   /* 0 - 1 */
        var rotY = (px - 0.5) * 8;   /* left/right tilt */
        var rotX = (0.5 - py) * 8;   /* up/down tilt */
        card.style.setProperty('--tilt-x', rotX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', rotY.toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
})();
