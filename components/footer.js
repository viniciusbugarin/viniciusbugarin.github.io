document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // CONFIG
  // ==========================

  const CONFIG = {
    brand: "Vinicius Bugarin",
    email: "viniciusbugarin@gmail.com",
    location: "Barcelona, España",
    whatsapp: "34662352675"
  };

  // ==========================
  // YEAR
  // ==========================

  const currentYear = new Date().getFullYear();

  // ==========================
  // FOOTER TEMPLATE
  // ==========================

  const footerTemplate = `
    <footer
      class="footer"
      role="contentinfo"
      aria-label="Footer principal"
    >

      <div class="footer-container">

        <!-- BRAND -->
        <section class="footer-brand">

          <h3>${CONFIG.brand}</h3>

          <p>
            Desarrollo páginas web modernas, automatizaciones
            inteligentes y herramientas digitales optimizadas
            para generar resultados reales.
          </p>

          <div class="footer-badges">

            <span>⚡ SEO Optimizado</span>
            <span>🚀 Automatización</span>
            <span>💻 Desarrollo Web</span>

          </div>

        </section>

        <!-- NAVIGATION -->
        <nav
          class="footer-links"
          aria-label="Navegación principal"
        >

          <h4>Enlaces</h4>

          <ul>

            <li>
              <a href="/">
                Inicio
              </a>
            </li>

            <li>
              <a href="/pages/desarrollador-web-barcelona.html">
                Barcelona
              </a>
            </li>

            <li>
              <a href="/pages/desarrollador-web-freelance.html">
                Freelance
              </a>
            </li>

            <li>
              <a href="#projects">
                Proyectos
              </a>
            </li>

            <li>
              <a href="#contact">
                Contacto
              </a>
            </li>

          </ul>

        </nav>

        <!-- SEO SERVICES -->
        <nav
          class="footer-links"
          aria-label="Servicios"
        >

          <h4>Servicios</h4>

          <ul>

            <li>
              <a href="/pages/desarrollador-web-seo.html">
                Desarrollo Web SEO
              </a>
            </li>

            <li>
              <a href="/pages/automatizacion-empresas.html">
                Automatización Empresas
              </a>
            </li>

            <li>
              <a href="/pages/calculadoras-online.html">
                Calculadoras Online
              </a>
            </li>

            <li>
              <a href="/pages/desarrollo-web-barcelona.html">
                Webs para Negocios
              </a>
            </li>

          </ul>

        </nav>

        <!-- CONTACT -->
        <section
          class="footer-contact"
          aria-label="Información de contacto"
        >

          <h4>Contacto</h4>

          <p>
            📩 ${CONFIG.email}
          </p>

          <p>
            📍 ${CONFIG.location}
          </p>

          <div class="footer-actions">

            <a
              href="#contact"
              class="btn primary small"
            >
              Solicitar proyecto
            </a>

            <a
              href="https://wa.me/${CONFIG.whatsapp}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn secondary small"
            >
              WhatsApp
            </a>

          </div>

        </section>

      </div>

      <!-- FOOTER BOTTOM -->

      <div class="footer-bottom">

        <p>
          © ${currentYear} ${CONFIG.brand}
          · Todos los derechos reservados
        </p>

        <div class="footer-mini-links">

          <a href="/sitemap.xml">
            Sitemap
          </a>

          <a href="/robots.txt">
            Robots
          </a>

          <a href="/privacy-policy.html">
            Privacidad
          </a>

        </div>

      </div>

    </footer>
  `;

  // ==========================
  // RENDER
  // ==========================

  const footerRoot =
    document.getElementById("footer");

  if (!footerRoot) return;

  footerRoot.innerHTML = footerTemplate;

  // ==========================
  // SMOOTH SCROLL
  // ==========================

  document
    .querySelectorAll('footer a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", (e) => {

        const target =
          document.querySelector(
            link.getAttribute("href")
          );

        if (!target) return;

        e.preventDefault();

        const navbar =
          document.querySelector(".navbar");

        const offset =
          navbar ? navbar.offsetHeight : 0;

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
  // PREFETCH INTERNAL LINKS
  // ==========================

  const prefetched = new Set();

  document
    .querySelectorAll('footer a[href^="/"]')
    .forEach(link => {

      function prefetch() {

        const href = link.href;

        if (prefetched.has(href)) return;

        const preload =
          document.createElement("link");

        preload.rel = "prefetch";
        preload.href = href;
        preload.as = "document";

        document.head.appendChild(preload);

        prefetched.add(href);

      }

      link.addEventListener(
        "mouseenter",
        prefetch,
        { once: true }
      );

      link.addEventListener(
        "touchstart",
        prefetch,
        { once: true }
      );

    });

});