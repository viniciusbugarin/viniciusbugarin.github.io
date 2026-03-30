document.addEventListener("DOMContentLoaded", () => {
  const navbar = `
    <nav class="navbar">
      <div class="nav-container">

        <div class="logo">
          <a href="index.html">
            <img src="images/VB.png" alt="Vinicius Bugarin" width="50">
          </a>
        </div>
          <a class="nav-links" href="index.html">Inicio</a>
          <a class="nav-links" href="desarrollador-web-barcelona.html">Barcelona</a>
          <a class="nav-links" href="desarrollador-web-freelance.html">Freelance</a>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;
});
