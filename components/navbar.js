document.addEventListener("DOMContentLoaded", () => {

  const navbar = `
    <nav class="navbar" id="navbar" role="navigation" aria-label="Menú principal">
      <div class="nav-container">

        <!-- LOGO -->
        <div class="logo">
          <a href="/" aria-label="Inicio">
            <img src="/images/VB.png" alt="Vinicius Bugarin Logo" loading="eager">
          </a>
        </div>

        <!-- HAMBURGUESA -->
        <button 
          class="menu-toggle" 
          id="menu-toggle" 
          aria-label="Abrir menú"
          aria-expanded="false"
        >
          ☰
        </button>

        <!-- OVERLAY MOBILE -->
        <div class="nav-overlay" id="nav-overlay"></div>

        <!-- LINKS -->
        <ul class="nav-links" id="nav-links">
          <li><a href="/" data-link>Inicio</a></li>
          <li><a href="/pages/desarrollador-web-barcelona.html" data-link>Barcelona</a></li>
          <li><a href="/pages/desarrollador-web-freelance.html" data-link>Freelance</a></li>
          <li><a href="#contact" class="cta">Contacto</a></li>
        </ul>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;

  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");
  const navbarEl = document.getElementById("navbar");

  // ==========================
  // 📱 MENU MOBILE PRO
  // ==========================
  function openMenu() {
    links.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    links.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    links.classList.contains("active") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  // 🔒 cerrar al hacer click en link
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // ==========================
  // 🎯 NAVBAR SCROLL EFFECT (OPTIMIZADO)
  // ==========================
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    // efecto background
    navbarEl.classList.toggle("scrolled", currentScroll > 50);

    // hide / show navbar (UX PRO)
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbarEl.classList.add("hide");
    } else {
      navbarEl.classList.remove("hide");
    }

    lastScroll = currentScroll;
  });

  // ==========================
  // 🔥 LINK ACTIVO ULTRA PRO
  // ==========================
  const currentPath = window.location.pathname.replace(/\/$/, "");

  document.querySelectorAll(".nav-links a").forEach(link => {
    const linkPath = link.pathname.replace(/\/$/, "");

    if (currentPath === linkPath) {
      link.classList.add("active-link");
      link.setAttribute("aria-current", "page");
    }
  });

  // ==========================
  // 🚀 SCROLL SUAVE (CON OFFSET NAV)
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        e.preventDefault();

        const offset = navbarEl.offsetHeight;

        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: "smooth"
        });
      }
    });
  });

  // ==========================
  // ⚡ PREFETCH INTELIGENTE (UNA SOLA VEZ)
  // ==========================
  const prefetched = new Set();

  document.querySelectorAll("a[data-link]").forEach(link => {
    link.addEventListener("mouseenter", () => {
      const href = link.href;

      if (!prefetched.has(href)) {
        const prefetch = document.createElement("link");
        prefetch.rel = "prefetch";
        prefetch.href = href;

        document.head.appendChild(prefetch);
        prefetched.add(href);
      }
    });
  });

  // ==========================
  // ⌨️ ACCESIBILIDAD (ESC PARA CERRAR)
  // ==========================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

});