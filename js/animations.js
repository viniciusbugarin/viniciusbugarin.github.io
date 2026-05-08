// =========================================
// VINICIUS BUGARIN — ANIMATIONS SYSTEM
// FINAL PRODUCTION VERSION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // PAGE LOADED
  // =========================================

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    revealThreshold: 0.12,

    staggerDelay: 80,

    enableParallax: true,

    enableCounters: true,

    enableMagnetic: true,

    reduceMotion:
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

  };

  // =========================================
  // EXIT IF REDUCED MOTION
  // =========================================

  if (CONFIG.reduceMotion) {

    document
      .querySelectorAll(`
        .reveal,
        .card,
        .project-card,
        .value-card,
        .section-heading
      `)
      .forEach(el => {
        el.classList.add("active");
      });

    return;
  }

  // =========================================
  // REVEAL ELEMENTS
  // =========================================

  const revealElements = document.querySelectorAll(`
    .reveal,
    .card,
    .project-card,
    .value-card,
    .section-heading
  `);

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry, index) => {

      if (!entry.isIntersecting) return;

      const el = entry.target;

      setTimeout(() => {

        requestAnimationFrame(() => {
          el.classList.add("active");
        });

      }, index * CONFIG.staggerDelay);

      revealObserver.unobserve(el);

    });

  }, {
    threshold: CONFIG.revealThreshold
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // =========================================
  // PARALLAX HERO
  // =========================================

  if (CONFIG.enableParallax) {

    const heroGlow = document.querySelector(".hero::before");
    const hero = document.querySelector(".hero");

    let ticking = false;

    window.addEventListener("scroll", () => {

      if (!hero || ticking) return;

      ticking = true;

      requestAnimationFrame(() => {

        const scrollY = window.scrollY;

        hero.style.setProperty(
          "--parallax-offset",
          `${scrollY * 0.12}px`
        );

        ticking = false;

      });

    }, { passive: true });

  }

  // =========================================
  // COUNTERS
  // =========================================

  if (CONFIG.enableCounters) {

    const counters =
      document.querySelectorAll("[data-counter]");

    const counterObserver =
      new IntersectionObserver((entries) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const el = entry.target;

          const target =
            parseInt(el.dataset.counter);

          const duration = 1400;

          let start = null;

          function animateCounter(timestamp) {

            if (!start) start = timestamp;

            const progress =
              Math.min((timestamp - start) / duration, 1);

            const value =
              Math.floor(progress * target);

            el.textContent =
              value.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              el.textContent =
                target.toLocaleString();
            }

          }

          requestAnimationFrame(animateCounter);

          counterObserver.unobserve(el);

        });

      }, {
        threshold: 0.45
      });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });

  }

  // =========================================
  // MAGNETIC BUTTONS
  // =========================================

  if (CONFIG.enableMagnetic) {

    document.querySelectorAll(".btn").forEach(button => {

      let frame = null;

      button.addEventListener("mousemove", (e) => {

        if (window.innerWidth <= 768) return;

        const rect =
          button.getBoundingClientRect();

        const x =
          e.clientX - rect.left - rect.width / 2;

        const y =
          e.clientY - rect.top - rect.height / 2;

        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {

          button.style.transform =
            `translate3d(${x * 0.08}px, ${y * 0.08}px, 0)`;

        });

      });

      button.addEventListener("mouseleave", () => {

        button.style.transform =
          "translate3d(0,0,0)";

      });

    });

  }

  // =========================================
  // CARD GLOW FOLLOW
  // =========================================

  document.querySelectorAll(`
    .card,
    .project-card,
    .value-card
  `).forEach(card => {

    let frame = null;

    card.addEventListener("mousemove", (e) => {

      const rect =
        card.getBoundingClientRect();

      const x =
        e.clientX - rect.left;

      const y =
        e.clientY - rect.top;

      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

      });

    });

  });

  // =========================================
  // NAVBAR SCROLL EFFECT
  // =========================================

  const navbar =
    document.querySelector(".navbar");

  if (navbar) {

    let lastScroll = 0;

    let ticking = false;

    window.addEventListener("scroll", () => {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {

        const current =
          window.scrollY;

        navbar.classList.toggle(
          "scrolled",
          current > 40
        );

        if (
          current > lastScroll &&
          current > 140
        ) {

          navbar.classList.add("hide");

        } else {

          navbar.classList.remove("hide");

        }

        lastScroll = current;

        ticking = false;

      });

    }, { passive: true });

  }

});