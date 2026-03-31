document.addEventListener("DOMContentLoaded", () => {
  const navbar = `
    <nav class="navbar" id="navbar">
      <div class="nav-container">

        <div class="logo">
          <a href="index.html">
            <img src="images/VB.png" alt="VB">
          </a>
        </div>

        <div class="menu-toggle" id="menu-toggle">
          ☰
        </div>

        <ul class="nav-links" id="nav-links">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="desarrollador-web-barcelona.html">Barcelona</a></li>
          <li><a href="desarrollador-web-freelance.html">Freelance</a></li>
          <li><a href="#contact" class="cta">Contacto</a></li>
        </ul>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;

  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const navbarEl = document.getElementById("navbar");

  // Toggle menú móvil
  toggle.addEventListener("click", () => {
    links.classList.toggle("active");
  });

  // Navbar scroll efecto
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbarEl.classList.add("scrolled");
    } else {
      navbarEl.classList.remove("scrolled");
    }
  });

  // Link activo automático
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active-link");
    }
  });
});
