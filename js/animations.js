// =========================================
// VINICIUS BUGARIN — ANIMATIONS SYSTEM
// OPTIMIZED + STABLE + NO DUPLICATES
// PRODUCTION READY VERSION
// =========================================

(() => {

  "use strict";

  // =========================================
  // DOM READY
  // =========================================

  document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // CONFIG
    // =========================================

    const CONFIG = {

      revealThreshold: 0.12,

      staggerDelay: 100,

      enableParallax: true,

      enableCounters: true,

      enableMagnetic: true,

      enableCardGlow: true,

      reduceMotion:
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches

    };

    // =========================================
    // HELPERS
    // =========================================

    const $ = selector =>
      document.querySelector(selector);

    const $$ = selector =>
      [...document.querySelectorAll(selector)];

    // =========================================
    // PAGE LOADED
    // =========================================

    requestAnimationFrame(() => {

      document.body.classList.add("loaded");

      const loader =
        $(".page-loader");

      if (loader) {

        loader.classList.add("hidden");

        setTimeout(() => {

          loader.remove();

        }, 600);

      }

    });

    // =========================================
    // REDUCED MOTION
    // =========================================

    if (CONFIG.reduceMotion) {

      $$(
        `
        .reveal,
        .card,
        .project-card,
        .value-card,
        .hero-card,
        .stat-card,
        .section-heading
        `
      ).forEach(el => {

        el.classList.add("active");

      });

      return;
    }

    // =========================================
    // REVEAL ANIMATIONS
    // =========================================

    function initRevealAnimations() {

      const revealElements = $$(
        `
        .reveal,
        .card,
        .project-card,
        .value-card,
        .hero-card,
        .stat-card,
        .section-heading
        `
      );

      if (!revealElements.length) {
        return;
      }

      if (!("IntersectionObserver" in window)) {

        revealElements.forEach(el => {

          el.classList.add("active");

        });

        return;
      }

      const observer =
        new IntersectionObserver(

          (entries, obs) => {

            entries.forEach(
              (entry, index) => {

                if (!entry.isIntersecting) {
                  return;
                }

                const el =
                  entry.target;

                const delay =
                  Number(
                    el.dataset.delay
                  ) ||
                  index *
                    CONFIG.staggerDelay;

                setTimeout(() => {

                  requestAnimationFrame(() => {

                    el.classList.add(
                      "active"
                    );

                  });

                }, delay);

                obs.unobserve(el);

              }
            );

          },

          {
            threshold:
              CONFIG.revealThreshold,

            rootMargin:
              "0px 0px -60px 0px"
          }

        );

      revealElements.forEach(el => {

        observer.observe(el);

      });

    }

    // =========================================
    // HERO PARALLAX
    // =========================================

    function initParallax() {

      if (!CONFIG.enableParallax) {
        return;
      }

      const hero =
        $(".hero");

      if (!hero) {
        return;
      }

      let ticking =
        false;

      window.addEventListener(
        "scroll",
        () => {

          if (ticking) {
            return;
          }

          ticking = true;

          requestAnimationFrame(() => {

            const scrollY =
              window.scrollY;

            hero.style.setProperty(
              "--parallax-offset",
              `${scrollY * 0.12}px`
            );

            ticking = false;

          });

        },
        { passive: true }
      );

    }

    // =========================================
    // COUNTERS
    // =========================================

    function initCounters() {

      if (!CONFIG.enableCounters) {
        return;
      }

      const counters =
        $$("[data-counter]");

      if (!counters.length) {
        return;
      }

      const observer =
        new IntersectionObserver(

          entries => {

            entries.forEach(
              entry => {

                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                const el =
                  entry.target;

                const target =
                  parseInt(
                    el.dataset.counter
                  );

                if (
                  Number.isNaN(
                    target
                  )
                ) {
                  return;
                }

                let start =
                  null;

                const duration =
                  1400;

                function updateCounter(
                  timestamp
                ) {

                  if (!start) {
                    start =
                      timestamp;
                  }

                  const progress =
                    Math.min(
                      (
                        timestamp -
                        start
                      ) / duration,
                      1
                    );

                  const value =
                    Math.floor(
                      progress *
                        target
                    );

                  el.textContent =
                    value.toLocaleString();

                  if (
                    progress < 1
                  ) {

                    requestAnimationFrame(
                      updateCounter
                    );

                  } else {

                    el.textContent =
                      target.toLocaleString();

                  }

                }

                requestAnimationFrame(
                  updateCounter
                );

                observer.unobserve(
                  el
                );

              }
            );

          },

          {
            threshold: 0.45
          }

        );

      counters.forEach(counter => {

        observer.observe(
          counter
        );

      });

    }

    // =========================================
    // MAGNETIC BUTTONS
    // =========================================

    function initMagneticButtons() {

      if (
        !CONFIG.enableMagnetic ||
        window.innerWidth < 768
      ) {
        return;
      }

      $$(".magnetic").forEach(button => {

        let frame =
          null;

        button.addEventListener(
          "mousemove",
          e => {

            const rect =
              button.getBoundingClientRect();

            const x =
              e.clientX -
              rect.left -
              rect.width / 2;

            const y =
              e.clientY -
              rect.top -
              rect.height / 2;

            if (frame) {

              cancelAnimationFrame(
                frame
              );

            }

            frame =
              requestAnimationFrame(
                () => {

                  button.style.transform =
                    `
                    translate3d(
                      ${x * 0.08}px,
                      ${y * 0.08}px,
                      0
                    )
                    `;

                }
              );

          }
        );

        button.addEventListener(
          "mouseleave",
          () => {

            button.style.transform =
              "translate3d(0,0,0)";

          }
        );

      });

    }

    // =========================================
    // CARD GLOW
    // =========================================

    function initCardGlow() {

      if (!CONFIG.enableCardGlow) {
        return;
      }

      $$(
        `
        .card,
        .project-card,
        .value-card,
        .hero-card
        `
      ).forEach(card => {

        let frame =
          null;

        card.addEventListener(
          "mousemove",
          e => {

            const rect =
              card.getBoundingClientRect();

            const x =
              e.clientX -
              rect.left;

            const y =
              e.clientY -
              rect.top;

            if (frame) {

              cancelAnimationFrame(
                frame
              );

            }

            frame =
              requestAnimationFrame(
                () => {

                  card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                  );

                  card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                  );

                }
              );

          }
        );

      });

    }

    // =========================================
    // SMOOTH SCROLL
    // =========================================

    function initSmoothScroll() {

      $$('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener(
          "click",
          e => {

            const href =
              anchor.getAttribute(
                "href"
              );

            if (
              !href ||
              href === "#"
            ) {
              return;
            }

            const target =
              $(href);

            if (!target) {
              return;
            }

            e.preventDefault();

            window.scrollTo({

              top:
                target.offsetTop - 80,

              behavior:
                "smooth"

            });

          }
        );

      });

    }

    // =========================================
    // INIT
    // =========================================

    initRevealAnimations();

    initParallax();

    initCounters();

    initMagneticButtons();

    initCardGlow();

    initSmoothScroll();

    // =========================================
    // DEBUG
    // =========================================

    console.log(
      "%cVB Animations Loaded",
      `
      color:#38bdf8;
      font-weight:bold;
      font-size:14px;
      `
    );

  });

})();