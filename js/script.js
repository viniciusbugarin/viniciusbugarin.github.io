// =========================================
// VINICIUS BUGARIN — CORE SYSTEM
// ULTRA PERFORMANCE + SEO + UX VERSION
// FINAL OPTIMIZED ARCHITECTURE
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

    ticking: false,

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

  function log(...args) {

    if (CONFIG.debug) {

      console.log(
        "[VB CORE]",
        ...args
      );

    }

  }

  function safeTrack(event, data = {}) {

    if (!CONFIG.enableTracking)
      return;

    log("TRACK:", event, data);

    // Google Analytics
    if (typeof window.gtag === "function") {

      window.gtag(
        "event",
        event,
        data
      );

    }

    // Meta Pixel
    if (typeof window.fbq === "function") {

      window.fbq(
        "trackCustom",
        event,
        data
      );

    }

  }

  // =========================================
  // THROTTLE
  // =========================================

  function throttle(fn, wait = 100) {

    let last = 0;

    return (...args) => {

      const now = Date.now();

      if (now - last >= wait) {

        last = now;

        fn(...args);

      }

    };

  }

  // =========================================
  // DEBOUNCE
  // =========================================

  function debounce(fn, delay = 200) {

    let timeout;

    return (...args) => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        fn(...args);

      }, delay);

    };

  }

  // =========================================
  // REVEAL ANIMATIONS
  // =========================================

  function initRevealAnimations() {

    if (!CONFIG.enableReveal)
      return;

    const revealItems = $$(`

      .reveal,
      .card,
      .project-card,
      .value-card,
      .stat-card,
      .about-item,
      .hero-card,
      .section-head

    `);

    if (!revealItems.length)
      return;

    // Fallback
    if (!("IntersectionObserver" in window)) {

      revealItems.forEach(el => {

        el.classList.add("active");

      });

      return;

    }

    const observer =
      new IntersectionObserver(

        (entries, obs) => {

          entries.forEach(
            (entry, index) => {

              if (!entry.isIntersecting)
                return;

              setTimeout(() => {

                requestAnimationFrame(() => {

                  entry.target.classList.add(
                    "active"
                  );

                });

              }, index * CONFIG.revealDelay);

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

    revealItems.forEach(el => {

      observer.observe(el);

    });

    STATE.observers.push(observer);

  }

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  function initSmoothScroll() {

    if (!CONFIG.enableSmoothScroll)
      return;

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
            ) return;

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
                section: href
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

        // Hide on scroll down
        if (
          current > lastScroll &&
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

      }, 10);

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

    if (!CONFIG.enableLazyLoad)
      return;

    const images =
      $$("img[data-src]");

    if (!images.length)
      return;

    // Fallback
    if (
      !("IntersectionObserver" in window)
    ) {

      images.forEach(loadImage);

      return;

    }

    const observer =
      new IntersectionObserver(

        (entries, obs) => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) return;

            const img =
              entry.target;

            loadImage(img);

            obs.unobserve(img);

          });

        },

        {
          rootMargin:
            "200px"
        }

      );

    images.forEach(img => {

      observer.observe(img);

    });

    STATE.observers.push(observer);

  }

  function loadImage(img) {

    if (!img.dataset.src)
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

    };

    img.removeAttribute(
      "data-src"
    );

  }

  // =========================================
  // FORMS
  // =========================================

  function initForms() {

    const forms = $$("form");

    if (!forms.length)
      return;

    forms.forEach(form => {

      form.addEventListener(
        "submit",
        () => {

          safeTrack(
            "form_submit",
            {
              form:
                form.className ||
                "unknown"
            }
          );

        }
      );

      form
        .querySelectorAll(`
          input,
          textarea,
          select
        `)
        .forEach(field => {

          field.addEventListener(
            "focus",
            () => {

              field
                .parentElement
                ?.classList.add(
                  "focused"
                );

            }
          );

          field.addEventListener(
            "blur",
            () => {

              field
                .parentElement
                ?.classList.remove(
                  "focused"
                );

            }
          );

        });

    });

  }

  // =========================================
  // TRACKING
  // =========================================

  function initTracking() {

    if (!CONFIG.enableTracking)
      return;

    document.addEventListener(
      "click",
      e => {

        const button =
          e.target.closest(".btn");

        if (button) {

          safeTrack(
            "button_click",
            {
              text:
                button.textContent
                  .trim()
            }
          );

        }

        const project =
          e.target.closest(
            ".project-link"
          );

        if (project) {

          safeTrack(
            "project_click",
            {
              href:
                project.href
            }
          );

        }

      }
    );

  }

  // =========================================
  // SCROLL PROGRESS
  // =========================================

  function initScrollProgress() {

    if (
      !CONFIG.enableScrollProgress
    ) return;

    const progress =
      document.createElement(
        "div"
      );

    progress.className =
      "scroll-progress";

    document.body.appendChild(
      progress
    );

    const updateProgress =
      throttle(() => {

        const scrollTop =
          window.scrollY;

        const height =

          document.documentElement
            .scrollHeight -

          window.innerHeight;

        const percent =

          height > 0

            ? (scrollTop / height) * 100

            : 0;

        progress.style.width =
          `${percent}%`;

      },

      CONFIG
        .scrollProgressThrottle
    );

    window.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

  }

  // =========================================
  // BACK TO TOP
  // =========================================

  function initBackToTop() {

    if (
      !CONFIG.enableBackToTop
    ) return;

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "back-to-top";

    button.setAttribute(
      "aria-label",
      "Volver arriba"
    );

    button.innerHTML = `
      ↑
    `;

    document.body.appendChild(
      button
    );

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

    const toggleButton =
      throttle(() => {

        button.classList.toggle(
          "visible",
          window.scrollY >
          CONFIG.backToTopOffset
        );

      }, 50);

    window.addEventListener(
      "scroll",
      toggleButton,
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
  // PAGE LOADED
  // =========================================

  function initPageLoaded() {

    window.addEventListener(
      "load",
      () => {

        STATE.loaded = true;

        document.body.classList.add(
          "loaded"
        );

      }
    );

  }

  // =========================================
  // GLOBAL ERROR HANDLING
  // =========================================

  function initGlobalErrorHandling() {

    window.addEventListener(
      "error",
      e => {

        console.error(
          "[GLOBAL ERROR]",
          e.message
        );

      }
    );

    window.addEventListener(
      "unhandledrejection",
      e => {

        console.error(
          "[PROMISE ERROR]",
          e.reason
        );

      }
    );

  }

  // =========================================
  // PERFORMANCE
  // =========================================

  function initPerformanceOptimizations() {

    // Passive touch
    document.addEventListener(
      "touchstart",
      () => {},
      { passive: true }
    );

    // Font loaded
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
  // ACCESSIBILITY
  // =========================================

  function initAccessibility() {

    // Keyboard navigation
    document.addEventListener(
      "keyup",
      e => {

        if (e.key === "Tab") {

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
  // INIT APP
  // =========================================

  function init() {

    initRevealAnimations();

    initSmoothScroll();

    initNavbarEffects();

    initLazyLoad();

    initForms();

    initTracking();

    initScrollProgress();

    initBackToTop();

    initExternalLinks();

    initPageLoaded();

    initGlobalErrorHandling();

    initPerformanceOptimizations();

    initAccessibility();

    log("CORE INITIALIZED");

  }

  // =========================================
  // START
  // =========================================

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();