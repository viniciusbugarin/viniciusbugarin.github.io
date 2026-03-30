document.addEventListener("DOMContentLoaded", () => {
  const navbar = `
    <nav class="navbar">
      <div class="nav-container">

        <div class="logo">
          <a href="/index.html"><img src="../../images/VB.png" alt="Vinicius Bugarin" width="75" height="75" ></a>
        </div>

        <ul class="nav-links">
          <li><a href="/index.html">Inicio</a></li>
          <li><a href="/desarrollador-web-barcelona.html
">Desarrollador Web Barcelona</a></li>
          <li><a href="/desarrollador-web-freelance.html">Desarrollador Web Freelance</a></li>
        </ul>

      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbar;
});
