/* ==========================================================================
   Lumen — main.js
   Reveals au scroll, jauge animée, toggle tarifs, accordéon FAQ, nav mobile.
   Vanilla JS, aucune dépendance. prefers-reduced-motion respecté partout.
   ========================================================================== */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1. Nav mobile (burger accessible)
     ---------------------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');

  if (burger && navMenu) {
    const closeMenu = () => {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      navMenu.classList.remove('is-open');
    };

    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Fermer le menu');
        navMenu.classList.add('is-open');
      }
    });

    // Fermer au clic sur un lien, à Échap, ou en repassant en desktop
    navMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        burger.focus();
      }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) closeMenu();
    });
  }

  /* ----------------------------------------------------------------------
     2. Reveals au scroll (IntersectionObserver + stagger 60 ms)
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  // Stagger : au sein d'un groupe [data-reveal-group], délai = index * 60 ms
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 60}ms`);
    });
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------------------
     3. Jauge du hero (rAF + easing) et barres de sous-scores
     ---------------------------------------------------------------------- */
  const GAUGE_TARGET = 68;
  const GAUGE_CIRC = 326.73; // 2 * PI * r (r = 52)
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeValue = document.getElementById('gauge-value');
  const mockup = document.getElementById('mockup');

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const setGauge = (score) => {
    if (gaugeArc) {
      gaugeArc.style.strokeDashoffset = String(GAUGE_CIRC * (1 - score / 100));
    }
    if (gaugeValue) {
      gaugeValue.textContent = String(Math.round(score));
    }
  };

  const animateGauge = () => {
    const duration = 1500;
    let start = null;

    const frame = (now) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setGauge(GAUGE_TARGET * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const animateBarNumbers = (root) => {
    root.querySelectorAll('.bar-num[data-target]').forEach((num) => {
      const target = parseInt(num.dataset.target, 10) || 0;
      const duration = 1200;
      let start = null;

      const frame = (now) => {
        if (start === null) start = now;
        const progress = Math.min((now - start) / duration, 1);
        num.textContent = String(Math.round(target * easeOutCubic(progress)));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  };

  // Remplissage des barres (mockup hero + carte bento) : width en % via --w
  const fillBars = (root, instant) => {
    root.querySelectorAll('.bar-fill[data-width]').forEach((bar) => {
      bar.style.setProperty('--w', bar.dataset.width);
      if (instant) bar.style.transition = 'none';
      bar.classList.add('is-filled');
    });
  };

  const runMockupAnimation = (instant) => {
    if (!mockup) return;
    if (instant) {
      setGauge(GAUGE_TARGET);
      mockup.querySelectorAll('.bar-num[data-target]').forEach((num) => {
        num.textContent = num.dataset.target;
      });
      fillBars(mockup, true);
    } else {
      animateGauge();
      animateBarNumbers(mockup);
      fillBars(mockup, false);
    }
  };

  if (mockup) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      runMockupAnimation(true);
    } else {
      const mockupObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runMockupAnimation(false);
            obs.disconnect();
          }
        });
      }, { threshold: 0.35 });
      mockupObserver.observe(mockup);
    }
  }

  // Barres décoratives hors mockup (bento « Score de maturité »)
  const bentoBars = document.querySelectorAll('.bento-score-demo');
  bentoBars.forEach((zone) => {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      fillBars(zone, true);
    } else {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fillBars(zone, false);
            o.disconnect();
          }
        });
      }, { threshold: 0.4 });
      obs.observe(zone);
    }
  });

  /* ----------------------------------------------------------------------
     4. Toggle tarifs mensuel / annuel (−20 %)
     ---------------------------------------------------------------------- */
  const billingToggle = document.getElementById('billing-toggle');

  if (billingToggle) {
    const applyBilling = (annual) => {
      billingToggle.setAttribute('aria-checked', String(annual));
      const mode = annual ? 'annual' : 'monthly';
      document.querySelectorAll('#tarifs [data-monthly]').forEach((el) => {
        el.textContent = el.dataset[mode];
      });
    };

    billingToggle.addEventListener('click', () => {
      applyBilling(billingToggle.getAttribute('aria-checked') !== 'true');
    });
  }

  /* ----------------------------------------------------------------------
     5. Accordéon FAQ accessible (aria-expanded + animation fluide)
     ---------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    const open = () => {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
      if (reducedMotion) {
        item.classList.add('is-open');
      } else {
        // Reflow pour que la transition 0fr -> 1fr parte bien de l'état fermé
        void answer.offsetHeight;
        item.classList.add('is-open');
      }
    };

    const close = () => {
      btn.setAttribute('aria-expanded', 'false');
      item.classList.remove('is-open');
      if (reducedMotion) {
        answer.hidden = true;
      } else {
        answer.addEventListener('transitionend', function onEnd(e) {
          if (e.target === answer && !item.classList.contains('is-open')) {
            answer.hidden = true;
          }
          answer.removeEventListener('transitionend', onEnd);
        });
      }
    };

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) close(); else open();
    });
  });
})();
