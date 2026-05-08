document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // NAVBAR TEMPLATE
  // ==========================

  const navbarTemplate = `
    <nav class="navbar" id="navbar" role="navigation" aria-label="Menú principal">

      <div class="nav-container">

        <!-- LOGO -->
        <div class="logo">
          <a href="/" aria-label="Inicio">
            <img
              src="/images/VB.png"
              alt="Vinicius Bugarin Logo"
              width="40"
              height="40"
              loading="eager"
              decoding="async"
            >
          </a>
        </div>

        <!-- MOBILE BUTTON -->
        <button
          class="menu-toggle"
          id="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded="false"
          aria-controls="nav-links"
        >
          ☰
        </button>

        <!-- OVERLAY -->
        <div class="nav-overlay" id="nav-overlay"></div>

        <!-- LINKS -->
        <ul
          class="nav-links"
          id="nav-links"
          role="menubar"
        >
          <li role="none">
            <a href="/" data-link role="menuitem">
              Inicio
            </a>
          </li>

          <li role="none">
            <a
              href="/pages/desarrollador-web-barcelona.html"
              data-link
              role="menuitem"
            >
              Barcelona
            </a>
          </li>

          <li role="none">
            <a
              href="/pages/desarrollador-web-freelance.html"
              data-link
              role="menuitem"
            >
              Freelance
            </a>
          </li>

          <li role="none">
            <a
              href="#contact"
              class="cta"
              role="menuitem"
            >
              Contacto
            </a>
          </li>

        </ul>

      </div>

    </nav>
  `;

  const navbarRoot = document.getElementById("navbar");

  if (!navbarRoot) return;

  navbarRoot.innerHTML = navbarTemplate;

  // ==========================
  // ELEMENTS
  // ==========================

  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");

  let isMenuOpen = false;
  let lastScroll = 0;
  let ticking = false;

  // ==========================
  // MENU
  // ==========================

  function openMenu() {

    isMenuOpen = true;

    links.classList.add("active");
    overlay.classList.add("active");

    toggle.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      links.querySelector("a")?.focus();
    });

  }

  function closeMenu() {

    isMenuOpen = false;

    links.classList.remove("active");
    overlay.classList.remove("active");

    toggle.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";

  }

  function toggleMenu() {

    isMenuOpen
      ? closeMenu()
      : openMenu();

  }

  toggle.addEventListener("click", toggleMenu);

  overlay.addEventListener("click", closeMenu);

  // ==========================
  // CLOSE MENU ON LINK
  // ==========================

  links.addEventListener("click", (e) => {

    if (e.target.tagName === "A") {
      closeMenu();
    }

  });

  // ==========================
  // ESC CLOSE
  // ==========================

  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
    }

  });

  // ==========================
  // RESPONSIVE RESET
  // ==========================

  window.addEventListener("resize", () => {

    if (window.innerWidth > 768 && isMenuOpen) {
      closeMenu();
    }

  });

  // ==========================
  // ACTIVE LINK
  // ==========================

  const currentPath =
    window.location.pathname.replace(/\/$/, "");

  document.querySelectorAll(".nav-links a").forEach(link => {

    const linkPath =
      new URL(link.href).pathname.replace(/\/$/, "");

    if (currentPath === linkPath) {

      link.classList.add("active-link");

      link.setAttribute("aria-current", "page");

    }

  });

  // ==========================
  // SMOOTH SCROLL
  // ==========================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e) {

      const target =
        document.querySelector(this.getAttribute("href"));

      if (!target) return;

      e.preventDefault();

      const offset =
        navbar.offsetHeight;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: "smooth"
      });

    });

  });

  // ==========================
  // NAVBAR SCROLL EFFECT
  // ==========================

  function updateNavbar() {

    const currentScroll = window.scrollY;

    navbar.classList.toggle(
      "scrolled",
      currentScroll > 40
    );

    // hide/show
    if (
      currentScroll > lastScroll &&
      currentScroll > 120
    ) {

      navbar.classList.add("hide");

    } else {

      navbar.classList.remove("hide");

    }

    lastScroll = currentScroll;

    ticking = false;
  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      requestAnimationFrame(updateNavbar);

      ticking = true;

    }

  }, { passive: true });

  // ==========================
  // PREFETCH INTELIGENTE
  // ==========================

  const prefetched = new Set();

  document.querySelectorAll("a[data-link]").forEach(link => {

    function prefetchPage() {

      const href = link.href;

      if (
        prefetched.has(href) ||
        href.includes("#")
      ) return;

      const prefetch =
        document.createElement("link");

      prefetch.rel = "prefetch";
      prefetch.href = href;
      prefetch.as = "document";

      document.head.appendChild(prefetch);

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

  // ==========================
  // AUTO SHADOW INIT
  // ==========================

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  }

});