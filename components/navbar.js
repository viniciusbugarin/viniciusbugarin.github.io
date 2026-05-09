// =========================================
// VINICIUS BUGARIN — NAVBAR SYSTEM FINAL
// ULTRA PRO VERSION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    mobileBreakpoint: 768,

    navbarScrollOffset: 40,

    navbarHideOffset: 120,

    enablePrefetch: true,

    enableSmartActive: true,

    enableScrollSpy: true

  };

  // =========================================
  // NAVBAR TEMPLATE
  // =========================================

  const navbarTemplate = `

    <nav
      class="navbar"
      id="main-navbar"
      role="navigation"
      aria-label="Menú principal"
    >

      <div class="nav-container">

        <!-- LOGO -->
        <a
          href="/"
          class="logo"
          aria-label="Inicio Vinicius Bugarin"
        >

          <img
            src="/images/VB.png"
            alt="Logo Vinicius Bugarin"
            width="42"
            height="42"
            loading="eager"
            decoding="async"
          >

          <span class="logo-text">
            Vinicius Bugarin
          </span>

        </a>

        <!-- MOBILE TOGGLE -->
        <button
          class="menu-toggle"
          id="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded="false"
          aria-controls="nav-links"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

        <!-- MOBILE OVERLAY -->
        <div
          class="nav-overlay"
          id="nav-overlay"
        ></div>

        <!-- LINKS -->
        <ul
          class="nav-links"
          id="nav-links"
          role="menubar"
        >

          <li role="none">

            <a
              href="/"
              role="menuitem"
              data-link
            >
              Inicio
            </a>

          </li>

          <li role="none">

            <a
              href="#projects"
              role="menuitem"
              data-scroll
            >
              Proyectos
            </a>

          </li>

          <li role="none">

            <a
              href="#contact"
              role="menuitem"
              data-scroll
            >
              Contacto
            </a>

          </li>

          <li role="none">

            <a
              href="/pages/desarrollador-web-barcelona.html"
              role="menuitem"
              data-link
            >
              Barcelona
            </a>

          </li>

          <li role="none">

            <a
              href="/pages/desarrollador-web-freelance.html"
              role="menuitem"
              data-link
            >
              Freelance
            </a>

          </li>

          <li role="none">

            <a
              href="#contact"
              class="cta"
              role="menuitem"
              data-scroll
            >
              🚀 Trabajemos juntos
            </a>

          </li>

        </ul>

      </div>

    </nav>

  `;

  // =========================================
  // INJECT NAVBAR
  // =========================================

  const navbarRoot =
    document.getElementById("navbar");

  if (!navbarRoot) return;

  navbarRoot.innerHTML =
    navbarTemplate;

  // =========================================
  // ELEMENTS
  // =========================================

  const navbar =
    document.getElementById("main-navbar");

  const menuToggle =
    document.getElementById("menu-toggle");

  const navLinks =
    document.getElementById("nav-links");

  const overlay =
    document.getElementById("nav-overlay");

  const navAnchors =
    document.querySelectorAll(".nav-links a");

  // =========================================
  // STATE
  // =========================================

  let isMenuOpen = false;

  let lastScroll = 0;

  let ticking = false;

  // =========================================
  // MENU SYSTEM
  // =========================================

  function openMenu() {

    isMenuOpen = true;

    navLinks.classList.add("active");

    overlay.classList.add("active");

    menuToggle.classList.add("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add(
      "menu-open"
    );

    requestAnimationFrame(() => {

      navLinks.querySelector("a")
        ?.focus();

    });

  }

  function closeMenu() {

    isMenuOpen = false;

    navLinks.classList.remove("active");

    overlay.classList.remove("active");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-open"
    );

  }

  function toggleMenu() {

    isMenuOpen
      ? closeMenu()
      : openMenu();

  }

  menuToggle?.addEventListener(
    "click",
    toggleMenu
  );

  overlay?.addEventListener(
    "click",
    closeMenu
  );

  // =========================================
  // CLOSE ON LINK CLICK
  // =========================================

  navAnchors.forEach(link => {

    link.addEventListener("click", () => {

      if (
        window.innerWidth <=
        CONFIG.mobileBreakpoint
      ) {

        closeMenu();

      }

    });

  });

  // =========================================
  // ESC CLOSE
  // =========================================

  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        isMenuOpen
      ) {

        closeMenu();

      }

    }
  );

  // =========================================
  // RESPONSIVE RESET
  // =========================================

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >
        CONFIG.mobileBreakpoint &&
        isMenuOpen
      ) {

        closeMenu();

      }

    }
  );

  // =========================================
  // ACTIVE LINK SYSTEM
  // =========================================

  function setActiveLink() {

    const currentPath =
      window.location.pathname
        .replace(/\/$/, "");

    navAnchors.forEach(link => {

      const linkPath =
        new URL(link.href)
          .pathname
          .replace(/\/$/, "");

      if (
        currentPath === linkPath
      ) {

        link.classList.add(
          "active-link"
        );

        link.setAttribute(
          "aria-current",
          "page"
        );

      }

    });

  }

  if (CONFIG.enableSmartActive) {
    setActiveLink();
  }

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  document
    .querySelectorAll("[data-scroll]")
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        e => {

          const href =
            anchor.getAttribute("href");

          if (
            !href.startsWith("#")
          ) return;

          const target =
            document.querySelector(href);

          if (!target) return;

          e.preventDefault();

          const offset =
            navbar.offsetHeight;

          const top =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            offset;

          window.scrollTo({

            top,

            behavior: "smooth"

          });

        }
      );

    });

  // =========================================
  // SCROLL EFFECTS
  // =========================================

  function updateNavbar() {

    const currentScroll =
      window.scrollY;

    // SCROLLED STATE
    navbar.classList.toggle(
      "scrolled",
      currentScroll >
      CONFIG.navbarScrollOffset
    );

    // HIDE ON DOWN
    if (

      currentScroll >
      lastScroll &&

      currentScroll >
      CONFIG.navbarHideOffset

    ) {

      navbar.classList.add("hide");

    } else {

      navbar.classList.remove("hide");

    }

    lastScroll =
      currentScroll;

    ticking = false;

  }

  window.addEventListener(
    "scroll",
    () => {

      if (!ticking) {

        requestAnimationFrame(
          updateNavbar
        );

        ticking = true;

      }

    },
    { passive: true }
  );

  // =========================================
  // PREFETCH
  // =========================================

  if (CONFIG.enablePrefetch) {

    const prefetched =
      new Set();

    document
      .querySelectorAll("a[data-link]")
      .forEach(link => {

        function prefetchPage() {

          const href =
            link.href;

          if (

            prefetched.has(href) ||

            href.includes("#")

          ) return;

          const prefetch =
            document.createElement(
              "link"
            );

          prefetch.rel =
            "prefetch";

          prefetch.href =
            href;

          prefetch.as =
            "document";

          document.head.appendChild(
            prefetch
          );

          prefetched.add(href);

        }

        link.addEventListener(
          "mouseenter",
          prefetchPage,
          { once: true }
        );

        link.addEventListener(
          "touchstart",
          prefetchPage,
          { once: true }
        );

      });

  }

  // =========================================
  // SCROLL SPY
  // =========================================

  if (CONFIG.enableScrollSpy) {

    const sections =
      document.querySelectorAll(
        "section[id]"
      );

    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              const id =
                entry.target.id;

              navAnchors.forEach(
                link => {

                  link.classList.remove(
                    "active-link"
                  );

                  if (
                    link.getAttribute(
                      "href"
                    ) === `#${id}`
                  ) {

                    link.classList.add(
                      "active-link"
                    );

                  }

                }
              );

            }

          });

        },

        {
          threshold: 0.5
        }

      );

    sections.forEach(section => {
      observer.observe(section);
    });

  }

  // =========================================
  // INITIAL STATE
  // =========================================

  if (
    window.scrollY >
    CONFIG.navbarScrollOffset
  ) {

    navbar.classList.add(
      "scrolled"
    );

  }

});