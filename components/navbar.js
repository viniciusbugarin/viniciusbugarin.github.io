document.addEventListener("DOMContentLoaded", () => {
  const navbar = `
    <nav class="navbar">
      <div class="nav-container">

        <div class="logo">
          <a href="index.html">
            <img src="images/VB.png" alt="VB">
          </a>
        </div>

        <ul class="nav-links">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="desarrollador-web-barcelona.html">Barcelona</a></li>
          <li><a href="desarrollador-web-freelance.html">Freelance</a></li>
          <li><a href="#contact" class="cta">Contacto</a></li>
        </ul>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;
});
