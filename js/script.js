// =========================================
// VINICIUS BUGARIN — CORE SYSTEM
// STABLE + PERFORMANCE + SEO + UX v3
// FIXED LOADER + SAFE OBSERVERS
// =========================================

(() => {

  "use strict";

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    scrollOffset: 90,

    revealThreshold: 0.12,

    revealDelay: 80,

    navbarScroll: 60,

    backToTopOffset: 500,

    scrollProgressThrottle: 10,

    loaderTimeout: 3500,

    enableTracking: true,

    enableLazyLoad: true,

    enableReveal: true,

    enableScrollProgress: true,

    enableBackToTop: true,

    enableSmoothScroll: true,

    debug: false

  };

  // =========================================
  // STATE
  // =========================================

  const STATE = {

    loaded: false,

    observers: []

  };

  // =========================================
  // HELPERS
  // =========================================

  const $ = selector =>
    document.querySelector(selector);

  const $$ = selector =>
    [...document.querySelectorAll(selector)];

  const log = (...args) => {

    if (CONFIG.debug) {

      console.log(
        "[VB CORE]",
        ...args
      );

    }

  };

  // =========================================
  // TRACKING
  // =========================================

  function safeTrack(
    event,
    data = {}
  ) {

    if (!CONFIG.enableTracking)
      return;

    try {

      if (
        typeof window.gtag ===
        "function"
      ) {

        window.gtag(
          "event",
          event,
          data
        );

      }

      if (
        typeof window.fbq ===
        "function"
      ) {

        window.fbq(
          "trackCustom",
          event,
          data
        );

      }

    } catch (error) {

      console.error(
        "[TRACK ERROR]",
        error
      );

    }

  }

  // =========================================
  // THROTTLE
  // =========================================

  function throttle(
    fn,
    wait = 100
  ) {

    let last = 0;

    return (...args) => {

      const now =
        Date.now();

      if (
        now - last >= wait
      ) {

        last = now;

        fn(...args);

      }

    };

  }

  // =========================================
  // PAGE LOADER FIX
  // =========================================

  function removeLoader() {

    const loader =
      $(".page-loader");

    document.body.classList.add(
      "loaded"
    );

    document.body.style.overflow =
      "auto";

    if (!loader)
      return;

    loader.classList.add(
      "hide"
    );

    setTimeout(() => {

      loader.remove();

    }, 500);

  }

  function initLoader() {

    // Window loaded
    window.addEventListener(
      "load",
      () => {

        STATE.loaded = true;

        removeLoader();

      }
    );

    // Emergency fallback
    setTimeout(() => {

      if (!STATE.loaded) {

        log(
          "Emergency loader fallback"
        );

        removeLoader();

      }

    }, CONFIG.loaderTimeout);

  }

  // =========================================
  // REVEAL ANIMATIONS
  // =========================================

  function initRevealAnimations() {

    if (!CONFIG.enableReveal)
      return;

    const elements = $$(`

      .reveal,
      .card,
      .project-card,
      .value-card,
      .stat-card,
      .about-item,
      .hero-card,
      .section-heading

    `);

    if (!elements.length)
      return;

    // Fallback
    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {

      elements.forEach(el => {

        el.classList.add(
          "active"
        );

      });

      return;

    }

    const observer =
      new IntersectionObserver(

        (
          entries,
          obs
        ) => {

          entries.forEach(
            (
              entry,
              index
            ) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              setTimeout(() => {

                entry.target.classList.add(
                  "active"
                );

              }, index *
                CONFIG.revealDelay);

              obs.unobserve(
                entry.target
              );

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

    elements.forEach(el => {

      observer.observe(el);

    });

    STATE.observers.push(
      observer
    );

  }

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  function initSmoothScroll() {

    if (
      !CONFIG.enableSmoothScroll
    ) {
      return;
    }

    $$('a[href^="#"]')
      .forEach(anchor => {

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

            if (!target)
              return;

            e.preventDefault();

            const top =

              target
                .getBoundingClientRect()
                .top +

              window.scrollY -

              CONFIG.scrollOffset;

            window.scrollTo({

              top,

              behavior:
                "smooth"

            });

            safeTrack(
              "scroll_to_section",
              {
                section:
                  href
              }
            );

          }
        );

      });

  }

  // =========================================
  // NAVBAR EFFECTS
  // =========================================

  function initNavbarEffects() {

    const navbar =
      $(".navbar");

    if (!navbar)
      return;

    let lastScroll = 0;

    const handleScroll =
      throttle(() => {

        const current =
          window.scrollY;

        navbar.classList.toggle(
          "scrolled",
          current >
          CONFIG.navbarScroll
        );

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

        lastScroll = current;

      }, 16);

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

  }

  // =========================================
  // LAZY LOAD
  // =========================================

  function initLazyLoad() {

    if (
      !CONFIG.enableLazyLoad
    ) {
      return;
    }

    const images =
      $$("img[data-src]");

    if (!images.length)
      return;

    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {

      images.forEach(loadImage);

      return;

    }

    const observer =
      new IntersectionObserver(

        (
          entries,
          obs
        ) => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              loadImage(
                entry.target
              );

              obs.unobserve(
                entry.target
              );

            }
          );

        },

        {
          rootMargin:
            "200px"
        }

      );

    images.forEach(img => {

      observer.observe(img);

    });

    STATE.observers.push(
      observer
    );

  }

  function loadImage(img) {

    if (!img?.dataset?.src)
      return;

    img.src =
      img.dataset.src;

    img.onload = () => {

      img.classList.add(
        "loaded"
      );

    };

    img.onerror = () => {

      img.classList.add(
        "image-error"
      );

      console.warn(
        "Image failed:",
        img.src
      );

    };

    img.removeAttribute(
      "data-src"
    );

  }

  // =========================================
  // FORMS
  // =========================================

  function initForms() {

    $$("form")
      .forEach(form => {

        form.addEventListener(
          "submit",
          () => {

            safeTrack(
              "form_submit",
              {
                form:
                  form.className
              }
            );

          }
        );

      });

  }

  // =========================================
  // SCROLL PROGRESS
  // =========================================

  function initScrollProgress() {

    if (
      !CONFIG.enableScrollProgress
    ) {
      return;
    }

    const progress =
      document.createElement(
        "div"
      );

    progress.className =
      "scroll-progress";

    document.body.appendChild(
      progress
    );

    const update =
      throttle(() => {

        const scrollTop =
          window.scrollY;

        const height =

          document.documentElement
            .scrollHeight -

          window.innerHeight;

        const percent =

          height > 0

            ? (scrollTop /
                height) *
              100

            : 0;

        progress.style.width =
          `${percent}%`;

      },

      CONFIG
        .scrollProgressThrottle
    );

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

  }

  // =========================================
  // BACK TO TOP
  // =========================================

  function initBackToTop() {

    if (
      !CONFIG.enableBackToTop
    ) {
      return;
    }

    const existing =
      $(".back-to-top");

    const button =

      existing ||

      document.createElement(
        "button"
      );

    if (!existing) {

      button.className =
        "back-to-top";

      button.innerHTML =
        "↑";

      button.setAttribute(
        "aria-label",
        "Volver arriba"
      );

      document.body.appendChild(
        button
      );

    }

    button.addEventListener(
      "click",
      () => {

        window.scrollTo({

          top: 0,

          behavior:
            "smooth"

        });

      }
    );

    const toggle =
      throttle(() => {

        button.classList.toggle(
          "visible",
          window.scrollY >
          CONFIG.backToTopOffset
        );

      }, 50);

    window.addEventListener(
      "scroll",
      toggle,
      { passive: true }
    );

  }

  // =========================================
  // EXTERNAL LINKS
  // =========================================

  function initExternalLinks() {

    $$('a[target="_blank"]')
      .forEach(link => {

        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      });

  }

  // =========================================
  // ACCESSIBILITY
  // =========================================

  function initAccessibility() {

    document.addEventListener(
      "keyup",
      e => {

        if (
          e.key === "Tab"
        ) {

          document.body.classList.add(
            "using-keyboard"
          );

        }

      }
    );

    document.addEventListener(
      "mousedown",
      () => {

        document.body.classList.remove(
          "using-keyboard"
        );

      }
    );

  }

  // =========================================
  // ERROR HANDLING
  // =========================================

  function initErrorHandling() {

    window.addEventListener(
      "error",
      e => {

        console.error(
          "[VB ERROR]",
          e.message
        );

      }
    );

    window.addEventListener(
      "unhandledrejection",
      e => {

        console.error(
          "[VB PROMISE ERROR]",
          e.reason
        );

      }
    );

  }

  // =========================================
  // PERFORMANCE
  // =========================================

  function initPerformance() {

    document.addEventListener(
      "touchstart",
      () => {},
      { passive: true }
    );

    if (document.fonts) {

      document.fonts.ready
        .then(() => {

          document.body.classList.add(
            "fonts-loaded"
          );

        });

    }

  }

  // =========================================
  // INIT
  // =========================================

  function init() {

    log(
      "Initializing core..."
    );

    initLoader();

    initRevealAnimations();

    initSmoothScroll();

    initNavbarEffects();

    initLazyLoad();

    initForms();

    initScrollProgress();

    initBackToTop();

    initExternalLinks();

    initAccessibility();

    initErrorHandling();

    initPerformance();

    log(
      "Core initialized"
    );

  }

  // =========================================
  // START
  // =========================================

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();