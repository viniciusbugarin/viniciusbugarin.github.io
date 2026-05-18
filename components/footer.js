// =========================================
// VINICIUS BUGARIN — FOOTER SYSTEM
// PREMIUM PERFORMANCE VERSION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    brand: "Vinicius Bugarin",

    email: "viniciusbugarin@gmail.com",

    location: "Barcelona, España",

    whatsapp: "34662352675",

    github: "https://github.com/viniciusbugarin",

    linkedin: "https://linkedin.com",

    enablePrefetch: true,

    enableReveal: true

  };

  // =========================================
  // YEAR
  // =========================================

  const currentYear =
    new Date().getFullYear();

  // =========================================
  // FOOTER TEMPLATE
  // =========================================

  const footerTemplate = `

    <footer
      class="footer"
      role="contentinfo"
      aria-label="Footer principal"
    >

      <div class="footer-container">

        <!-- BRAND -->
        <section
          class="footer-brand reveal"
          aria-label="Marca personal"
        >

          <a
            href="/"
            class="footer-logo"
            aria-label="Inicio"
          >

            <img
              src="/images/VB.png"
              alt="Logo Vinicius Bugarin"
              width="52"
              height="52"
              loading="lazy"
              decoding="async"
            >

            <div>

              <h3>
                ${CONFIG.brand}
              </h3>

              <span class="footer-status">
                Disponible para proyectos
              </span>

            </div>

          </a>

          <p>
            Desarrollo páginas web modernas,
            automatizaciones inteligentes y
            experiencias digitales optimizadas
            para SEO, conversión y rendimiento.
          </p>

          <div class="footer-badges">

            <span>⚡ SEO Técnico</span>

            <span>🚀 Automatización</span>

            <span>💻 Desarrollo Web</span>

            <span>📈 Conversión</span>

          </div>

        </section>

        <!-- NAVIGATION -->
        <nav
          class="footer-links reveal"
          aria-label="Navegación principal"
        >

          <h4>
            Navegación
          </h4>

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

        <!-- SERVICES -->
        <nav
          class="footer-links reveal"
          aria-label="Servicios"
        >

          <h4>
            Servicios
          </h4>

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
              <a href="/pages/desarrollo-apps.html">
                Desarrollo Apps Web
              </a>
            </li>

          </ul>

        </nav>

        <!-- CONTACT -->
        <section
          class="footer-contact reveal"
          aria-label="Información de contacto"
        >

          <h4>
            Contacto
          </h4>

          <p class="footer-contact-item">

            <span>
              📩
            </span>

            <a href="mailto:${CONFIG.email}">
              ${CONFIG.email}
            </a>

          </p>

          <p class="footer-contact-item">

            <span>
              📍
            </span>

            ${CONFIG.location}

          </p>

          <!-- SOCIAL -->
          <div
            class="social-links"
            aria-label="Redes sociales"
          >

            <a
              href="${CONFIG.github}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>

            <a
              href="${CONFIG.linkedin}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              IN
            </a>

            <a
              href="https://wa.me/${CONFIG.whatsapp}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              WA
            </a>

          </div>

          <!-- ACTIONS -->
          <div class="footer-actions">

            <a
              href="#contact"
              class="btn primary small"
            >
              Solicitar proyecto
            </a>

            <a
              href="/cv.pdf"
              class="btn secondary small"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar CV
            </a>

          </div>

        </section>

      </div>

      <!-- DIVIDER -->

      <div class="footer-divider"></div>

      <!-- FOOTER BOTTOM -->

      <div class="footer-bottom">

        <p>
          © ${currentYear}
          ${CONFIG.brand}.
          Todos los derechos reservados.
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

  // =========================================
  // RENDER
  // =========================================

  const footerRoot =
    document.getElementById("footer");

  if (!footerRoot) return;

  footerRoot.innerHTML =
    footerTemplate;

  // =========================================
  // ELEMENTS
  // =========================================

  const footer =
    document.querySelector(".footer");

  const internalLinks =
    footer.querySelectorAll('a[href^="/"]');

  const scrollLinks =
    footer.querySelectorAll('a[href^="#"]');

  const revealElements =
    footer.querySelectorAll(".reveal");

  // =========================================
  // SMOOTH SCROLL
  // =========================================

  scrollLinks.forEach(link => {

    link.addEventListener("click", e => {

      const targetId =
        link.getAttribute("href");

      const target =
        document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      const navbar =
        document.querySelector(".navbar");

      const navbarHeight =
        navbar?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({

        top: targetPosition,

        behavior: "smooth"

      });

    });

  });

  // =========================================
  // PREFETCH
  // =========================================

  if (CONFIG.enablePrefetch) {

    const prefetched =
      new Set();

    internalLinks.forEach(link => {

      const prefetchPage = () => {

        const href = link.href;

        if (
          prefetched.has(href) ||
          href.includes("#")
        ) return;

        const prefetch =
          document.createElement("link");

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
  // REVEAL ANIMATION
  // =========================================

  if (
    CONFIG.enableReveal &&
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "active"
              );

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.15
        }

      );

    revealElements.forEach(element => {

      revealObserver.observe(
        element
      );

    });

  }

  // =========================================
  // ACTIVE INTERNAL LINK
  // =========================================

  const currentPath =
    window.location.pathname
      .replace(/\/$/, "");

  footer
    .querySelectorAll('a[href^="/"]')
    .forEach(link => {

      const linkPath =
        new URL(link.href)
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

  // =========================================
  // ACCESSIBILITY
  // =========================================

  footer
    .querySelectorAll("a")
    .forEach(link => {

      if (
        link.hostname !==
        window.location.hostname
      ) {

        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      }

    });

});