document.addEventListener("DOMContentLoaded", () => {

  const navbar = `
    <nav class="navbar" id="navbar">
      <div class="nav-container">

        <!-- LOGO -->
        <div class="logo">
          <a href="/" aria-label="Inicio">
            <img src="/images/VB.png" alt="Vinicius Bugarin Logo">
          </a>
        </div>

        <!-- HAMBURGUESA -->
        <div class="menu-toggle" id="menu-toggle" aria-label="Abrir menú">
          ☰
        </div>

        <!-- LINKS -->
        <ul class="nav-links" id="nav-links">
          <li><a href="/" data-link>Inicio</a></li>
          <li><a href="/desarrollador-web-barcelona.html" data-link>Barcelona</a></li>
          <li><a href="/desarrollador-web-freelance.html" data-link>Freelance</a></li>
          <li><a href="#contact" class="cta">Contacto</a></li>
        </ul>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;

  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const navbarEl = document.getElementById("navbar");

  // ==========================
  // 📱 TOGGLE MOBILE
  // ==========================
  toggle.addEventListener("click", () => {
    links.classList.toggle("active");
  });

  // 🔒 CERRAR MENÚ AL HACER CLICK
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("active");
    });
  });

  // ==========================
  // 🎯 SCROLL NAVBAR
  // ==========================
  window.addEventListener("scroll", () => {
    navbarEl.classList.toggle("scrolled", window.scrollY > 50);
  });

  // ==========================
  // 🔥 LINK ACTIVO PRO
  // ==========================
  const currentPath = window.location.pathname.replace("/", "") || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {

    const href = link.getAttribute("href").replace("/", "");

    if (href === currentPath || 
        (currentPath === "index.html" && href === "")) {
      link.classList.add("active-link");
    }
  });

  // ==========================
  // 🚀 SCROLL SUAVE
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // ==========================
  // ⚡ PREFETCH LINKS (SEO + SPEED)
  // ==========================
  document.querySelectorAll("a[data-link]").forEach(link => {
    link.addEventListener("mouseover", () => {
      const href = link.getAttribute("href");

      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = href;

      document.head.appendChild(prefetch);
    });
  });

});