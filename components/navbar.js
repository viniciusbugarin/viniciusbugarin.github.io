// =========================================
// VINICIUS BUGARIN — NAVBAR SYSTEM v4
// PREMIUM • ACCESSIBLE • OPTIMIZED
// =========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    mobileBreakpoint: 768,

    navbarScrollOffset: 24,

    navbarHideOffset: 120,

    enablePrefetch: true,

    enableScrollSpy: true,

    enableSmartActive: true

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
          aria-label="Inicio"
        >

          <img
            src="/images/VB.png"
            alt="Vinicius Bugarin Logo"
            width="42"
            height="42"
            loading="eager"
            decoding="async"
          >

          <span class="logo-text">
            Vinicius Bugarin
          </span>

        </a>

        <!-- MOBILE BUTTON -->
        <button
          class="menu-toggle"
          id="menu-toggle"
          type="button"
          aria-label="Abrir menú"
          aria-expanded="false"
          aria-controls="nav-links"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

        <!-- OVERLAY -->
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
    navLinks.querySelectorAll("a");

  // =========================================
  // STATE
  // =========================================

  let isMenuOpen = false;

  let lastScrollY =
    window.scrollY;

  let ticking = false;

  // =========================================
  // MENU
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

  // =========================================
  // EVENTS
  // =========================================

  menuToggle?.addEventListener(
    "click",
    toggleMenu
  );

  overlay?.addEventListener(
    "click",
    closeMenu
  );

  // ESC CLOSE

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        isMenuOpen
      ) {

        closeMenu();

      }

    }
  );

  // CLOSE MOBILE MENU ON LINK

  navAnchors.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        if (
          window.innerWidth <=
          CONFIG.mobileBreakpoint
        ) {

          closeMenu();

        }

      }
    );

  });

  // RESET MENU ON DESKTOP

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
  // ACTIVE LINK
  // =========================================

  function setActiveLink() {

    if (
      !CONFIG.enableSmartActive
    ) {
      return;
    }

    const currentPath =
      window.location.pathname
        .replace(/\/$/, "");

    navAnchors.forEach(link => {

      const linkPath =
        new URL(
          link.href,
          window.location.origin
        )
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

  setActiveLink();

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  document
    .querySelectorAll("[data-scroll]")
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        event => {

          const href =
            anchor.getAttribute("href");

          if (
            !href ||
            !href.startsWith("#")
          ) {
            return;
          }

          const target =
            document.querySelector(href);

          if (!target) {
            return;
          }

          event.preventDefault();

          const navbarHeight =
            navbar.offsetHeight;

          const top =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            navbarHeight -
            12;

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

    // SCROLLED STYLE

    navbar.classList.toggle(
      "scrolled",
      currentScroll >
        CONFIG.navbarScrollOffset
    );

    // HIDE NAVBAR

    if (

      currentScroll >
        lastScrollY &&

      currentScroll >
        CONFIG.navbarHideOffset &&

      !isMenuOpen

    ) {

      navbar.classList.add("hide");

    } else {

      navbar.classList.remove("hide");

    }

    lastScrollY =
      currentScroll;

    ticking = false;

  }

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) return;

      ticking = true;

      requestAnimationFrame(
        updateNavbar
      );

    },
    {
      passive: true
    }
  );

  // =========================================
  // PREFETCH PAGES
  // =========================================

  if (CONFIG.enablePrefetch) {

    const prefetched =
      new Set();

    document
      .querySelectorAll("a[data-link]")
      .forEach(link => {

        const prefetchPage = () => {

          const href =
            link.href;

          if (
            prefetched.has(href) ||
            href.includes("#")
          ) {
            return;
          }

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

        };

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
              !entry.isIntersecting
            ) {
              return;
            }

            const id =
              entry.target.id;

            navAnchors.forEach(link => {

              const href =
                link.getAttribute(
                  "href"
                );

              if (
                !href?.startsWith("#")
              ) {
                return;
              }

              link.classList.toggle(
                "active-link",
                href === `#${id}`
              );

            });

          });

        },

        {

          rootMargin:
            "-40% 0px -40% 0px",

          threshold: 0.1

        }

      );

    sections.forEach(section => {

      observer.observe(section);

    });

  }

  // =========================================
  // INITIAL STATE
  // =========================================

  updateNavbar();

  // =========================================
  // DEBUG
  // =========================================

  console.log(
    "%cVB Navbar Loaded",
    `
    color:#60a5fa;
    font-weight:bold;
    `
  );

});