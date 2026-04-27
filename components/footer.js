document.addEventListener("DOMContentLoaded", () => {

  const year = new Date().getFullYear();

  const footer = `
    <footer class="footer" role="contentinfo">
      <div class="footer-container">

        <!-- BRAND -->
        <div class="footer-brand">
          <h3>Vinicius Bugarin</h3>
          <p>
            Desarrollo herramientas digitales, automatizaciones y páginas web
            diseñadas para generar resultados reales.
          </p>
        </div>

        <!-- NAVEGACIÓN -->
        <div class="footer-links">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/pages/desarrollador-web-barcelona.html">Barcelona</a></li>
            <li><a href="/pages/desarrollador-web-freelance.html">Freelance</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </div>

        <!-- SEO PAGES (🔥 CLAVE PARA POSICIONAR) -->
        <div class="footer-links">
          <h4>Servicios</h4>
          <ul>
            <li><a href="/pages/desarrollador-web-seo.html">Desarrollo web SEO</a></li>
            <li><a href="/pages/automatizacion-empresas.html">Automatización empresas</a></li>
            <li><a href="/pages/calculadoras-online.html">Calculadoras online</a></li>
          </ul>
        </div>

        <!-- CONTACTO -->
        <div class="footer-contact">
          <h4>Contacto</h4>
          <p>Email: contacto@viniciusbugarin.com</p>
          <p>Barcelona, España</p>

          <a href="#contact" class="btn primary small">
            Solicitar proyecto
          </a>
        </div>

      </div>

      <!-- BOTTOM -->
      <div class="footer-bottom">
        <p>© ${year} Vinicius Bugarin · Todos los derechos reservados</p>

        <div class="footer-mini-links">
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/robots.txt">Robots</a>
        </div>
      </div>
    </footer>
  `;

  const container = document.getElementById("footer");

  if (container) {
    container.innerHTML = footer;
  }

});