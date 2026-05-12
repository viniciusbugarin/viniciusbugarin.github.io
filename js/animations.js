// =========================================
// VINICIUS BUGARIN — ANIMATIONS SYSTEM
// STABLE + OPTIMIZED PRODUCTION VERSION
// =========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =========================================
    // PAGE LOADED
    // =========================================

    requestAnimationFrame(() => {

      document.body.classList.add(
        "loaded"
      );

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

      enableCardGlow: true,

      navbarScroll: true,

      reduceMotion:
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
    };

    // =========================================
    // SAFE QUERY
    // =========================================

    const $ = (selector) =>
      document.querySelector(selector);

    const $$ = (selector) =>
      document.querySelectorAll(selector);

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
        .section-heading
        `
      ).forEach(el => {

        el.classList.add("active");

      });

      return;
    }

    // =========================================
    // REVEAL ANIMATION
    // =========================================

    const revealElements = $$(
      `
      .reveal,
      .card,
      .project-card,
      .value-card,
      .section-heading
      `
    );

    if (revealElements.length > 0) {

      const revealObserver =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry, index) => {

                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                const el =
                  entry.target;

                const delay =
                  parseInt(
                    el.dataset.delay
                  ) ||
                  index *
                    CONFIG.staggerDelay;

                setTimeout(() => {

                  requestAnimationFrame(
                    () => {

                      el.classList.add(
                        "active"
                      );

                    }
                  );

                }, delay);

                revealObserver.unobserve(
                  el
                );
              }
            );

          },
          {
            threshold:
              CONFIG.revealThreshold
          }
        );

      revealElements.forEach(el => {

        revealObserver.observe(el);

      });
    }

    // =========================================
    // HERO PARALLAX
    // =========================================

    if (CONFIG.enableParallax) {

      const hero =
        $(".hero");

      if (hero) {

        let ticking = false;

        window.addEventListener(
          "scroll",
          () => {

            if (ticking) {
              return;
            }

            ticking = true;

            requestAnimationFrame(
              () => {

                const scrollY =
                  window.scrollY;

                hero.style.setProperty(
                  "--parallax-offset",
                  `${scrollY * 0.12}px`
                );

                ticking = false;

              }
            );

          },
          {
            passive: true
          }
        );
      }
    }

    // =========================================
    // COUNTERS
    // =========================================

    if (CONFIG.enableCounters) {

      const counters =
        $$("[data-counter]");

      if (counters.length > 0) {

        const counterObserver =
          new IntersectionObserver(
            (entries) => {

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
                    isNaN(target)
                  ) {
                    return;
                  }

                  const duration =
                    1400;

                  let start =
                    null;

                  function animateCounter(
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
                        animateCounter
                      );

                    } else {

                      el.textContent =
                        target.toLocaleString();
                    }
                  }

                  requestAnimationFrame(
                    animateCounter
                  );

                  counterObserver.unobserve(
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

          counterObserver.observe(
            counter
          );

        });
      }
    }

    // =========================================
    // MAGNETIC BUTTONS
    // =========================================

    if (
      CONFIG.enableMagnetic &&
      window.innerWidth > 768
    ) {

      $$(".btn").forEach(button => {

        let frame =
          null;

        button.addEventListener(
          "mousemove",
          (e) => {

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
    // CARD GLOW FOLLOW
    // =========================================

    if (CONFIG.enableCardGlow) {

      $$(
        `
        .card,
        .project-card,
        .value-card
        `
      ).forEach(card => {

        let frame =
          null;

        card.addEventListener(
          "mousemove",
          (e) => {

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
    // NAVBAR EFFECT
    // =========================================

    if (CONFIG.navbarScroll) {

      const navbar =
        $(".navbar");

      if (navbar) {

        let lastScroll = 0;

        let ticking = false;

        window.addEventListener(
          "scroll",
          () => {

            if (ticking) {
              return;
            }

            ticking = true;

            requestAnimationFrame(
              () => {

                const current =
                  window.scrollY;

                // Blur background

                navbar.classList.toggle(
                  "scrolled",
                  current > 40
                );

                // Hide on scroll down

                if (
                  current >
                    lastScroll &&
                  current > 140
                ) {

                  navbar.classList.add(
                    "hide"
                  );

                } else {

                  navbar.classList.remove(
                    "hide"
                  );
                }

                lastScroll =
                  current;

                ticking = false;

              }
            );

          },
          {
            passive: true
          }
        );
      }
    }

    // =========================================
    // SMOOTH SCROLL
    // =========================================

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(anchor => {

        anchor.addEventListener(
          "click",
          function (e) {

            const target =
              document.querySelector(
                this.getAttribute(
                  "href"
                )
              );

            if (!target) {
              return;
            }

            e.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }
        );

      });

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

  }
);