// =========================================
// VINICIUS BUGARIN — CORE SYSTEM FINAL
// ULTRA PRO VERSION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    scrollOffset: 90,

    revealThreshold: 0.14,

    revealDelay: 100,

    navbarScroll: 60,

    enableTracking: true,

    enableLazyLoad: true,

    enablePageTransitions: true,

    enableScrollProgress: true,

    enableBackToTop: true

  };

  // =========================================
  // STATE
  // =========================================

  const STATE = {

    ticking: false,

    loaded: false

  };

  // =========================================
  // INIT
  // =========================================

  initRevealAnimations();

  initSmoothScroll();

  initNavbarEffects();

  initLazyLoad();

  initTracking();

  initForms();

  initScrollProgress();

  initBackToTop();

  initExternalLinks();

  initPageLoaded();

  // =========================================
  // REVEAL ANIMATIONS
  // =========================================

  function initRevealAnimations() {

    const revealItems =
      document.querySelectorAll(`

        .reveal,
        .card,
        .project-card,
        .value-card,
        .stat-card,
        .about-item,
        .hero-card,
        .section-head

      `);

    // fallback
    if (
      !("IntersectionObserver" in window)
    ) {

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

              if (
                !entry.isIntersecting
              ) return;

              setTimeout(() => {

                entry.target.classList.add(
                  "active"
                );

              }, index * CONFIG.revealDelay);

              obs.unobserve(
                entry.target
              );

            }
          );

        },

        {
          threshold:
            CONFIG.revealThreshold
        }

      );

    revealItems.forEach(el => {
      observer.observe(el);
    });

  }

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  function initSmoothScroll() {

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(anchor => {

        anchor.addEventListener(
          "click",
          function(e) {

            const target =
              document.querySelector(
                this.getAttribute(
                  "href"
                )
              );

            if (!target) return;

            e.preventDefault();

            const top =

              target
                .getBoundingClientRect()
                .top +

              window.scrollY -

              CONFIG.scrollOffset;

            window.scrollTo({

              top,

              behavior: "smooth"

            });

            trackEvent(
              "scroll_to_section",
              {
                section:
                  this.getAttribute(
                    "href"
                  )
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
      document.querySelector(
        ".navbar"
      );

    if (!navbar) return;

    window.addEventListener(
      "scroll",
      () => {

        if (!STATE.ticking) {

          requestAnimationFrame(
            () => {

              navbar.classList.toggle(
                "scrolled",
                window.scrollY >
                CONFIG.navbarScroll
              );

              STATE.ticking =
                false;

            }
          );

          STATE.ticking = true;

        }

      },

      { passive: true }

    );

  }

  // =========================================
  // LAZY LOAD IMAGES
  // =========================================

  function initLazyLoad() {

    if (
      !CONFIG.enableLazyLoad
    ) return;

    const images =
      document.querySelectorAll(
        "img[data-src]"
      );

    if (
      !("IntersectionObserver" in window)
    ) {

      images.forEach(img => {

        img.src =
          img.dataset.src;

      });

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

            img.src =
              img.dataset.src;

            img.removeAttribute(
              "data-src"
            );

            img.classList.add(
              "loaded"
            );

            obs.unobserve(img);

          });

        },

        {
          rootMargin:
            "100px"
        }

      );

    images.forEach(img => {
      observer.observe(img);
    });

  }

  // =========================================
  // FORM SYSTEM
  // =========================================

  function initForms() {

    const forms =
      document.querySelectorAll(
        "form"
      );

    if (!forms.length) return;

    forms.forEach(form => {

      form.addEventListener(
        "submit",
        () => {

          trackEvent(
            "form_submit",
            {
              form:
                form.className
            }
          );

        }
      );

      // UX INPUTS
      form
        .querySelectorAll(
          "input, textarea, select"
        )
        .forEach(field => {

          field.addEventListener(
            "focus",
            () => {

              field.parentElement?.classList.add(
                "focused"
              );

            }
          );

          field.addEventListener(
            "blur",
            () => {

              field.parentElement?.classList.remove(
                "focused"
              );

            }
          );

        });

    });

  }

  // =========================================
  // TRACKING SYSTEM
  // =========================================

  function initTracking() {

    if (
      !CONFIG.enableTracking
    ) return;

    // BUTTONS
    document
      .querySelectorAll(".btn")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            trackEvent(
              "button_click",
              {
                text:
                  btn.textContent
                    .trim()
              }
            );

          }
        );

      });

    // PROJECTS
    document.addEventListener(
      "click",
      e => {

        const project =
          e.target.closest(
            ".project-link"
          );

        if (!project) return;

        trackEvent(
          "project_click",
          {
            href:
              project.href
          }
        );

      }
    );

  }

  // =========================================
  // TRACK EVENT
  // =========================================

  window.trackEvent =
    function(
      eventName,
      data = {}
    ) {

      console.log(
        "TRACK:",
        eventName,
        data
      );

      // Google Analytics
      if (
        typeof gtag ===
        "function"
      ) {

        gtag(
          "event",
          eventName,
          data
        );

      }

      // Meta Pixel
      if (
        typeof fbq ===
        "function"
      ) {

        fbq(
          "trackCustom",
          eventName,
          data
        );

      }

    };

  // =========================================
  // SCROLL PROGRESS BAR
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

    window.addEventListener(
      "scroll",
      throttle(() => {

        const scrollTop =
          window.scrollY;

        const height =

          document.documentElement
            .scrollHeight -

          window.innerHeight;

        const percent =
          (scrollTop / height) *
          100;

        progress.style.width =
          `${percent}%`;

      }, 10),

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

    button.innerHTML = "↑";

    document.body.appendChild(
      button
    );

    button.addEventListener(
      "click",
      () => {

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );

    window.addEventListener(
      "scroll",
      throttle(() => {

        button.classList.toggle(
          "visible",
          window.scrollY > 500
        );

      }, 50),

      { passive: true }

    );

  }

  // =========================================
  // EXTERNAL LINKS
  // =========================================

  function initExternalLinks() {

    document
      .querySelectorAll(
        'a[target="_blank"]'
      )
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
  // THROTTLE
  // =========================================

  function throttle(
    fn,
    wait = 100
  ) {

    let lastTime = 0;

    return function(...args) {

      const now =
        Date.now();

      if (
        now - lastTime >= wait
      ) {

        lastTime = now;

        fn.apply(
          this,
          args
        );

      }

    };

  }

});