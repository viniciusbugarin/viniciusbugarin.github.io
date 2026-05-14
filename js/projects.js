// =========================================
// VINICIUS BUGARIN — PROJECT SYSTEM v4
// PREMIUM PORTFOLIO ENGINE
// ULTRA PERFORMANCE + SEO + SCALABLE
// =========================================

(() => {

  "use strict";

  // =========================================
  // CONFIG
  // =========================================

  const CONFIG = {

    ENABLE_TRACKING: true,

    ENABLE_ANIMATIONS: true,

    ENABLE_SEARCH: true,

    ENABLE_FILTERS: true,

    ENABLE_SORTING: true,

    ENABLE_LOCAL_STORAGE: true,

    ENABLE_IMAGE_FALLBACK: true,

    ENABLE_URL_HASH: true,

    REVEAL_THRESHOLD: 0.12,

    DEBUG: false

  };

  // =========================================
  // LOGGER
  // =========================================

  const log = (...args) => {

    if (CONFIG.DEBUG) {

      console.log(
        "[VB PROJECTS]",
        ...args
      );

    }

  };

  // =========================================
  // HELPERS
  // =========================================

  const $ = selector =>
    document.querySelector(selector);

  const $$ = selector =>
    [...document.querySelectorAll(selector)];

  const sanitizeHTML = (text = "") => {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  };

  const normalizeText = (text = "") => {

    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  };

  const capitalize = (text = "") => {

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1)
    );

  };

  const debounce = (
    callback,
    delay = 300
  ) => {

    let timeout;

    return (...args) => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        callback(...args);

      }, delay);

    };

  };

  // =========================================
  // STORAGE
  // =========================================

  const storage = {

    save(key, value) {

      if (
        !CONFIG.ENABLE_LOCAL_STORAGE
      ) return;

      try {

        localStorage.setItem(
          key,
          JSON.stringify(value)
        );

      } catch (error) {

        log("Storage save error", error);

      }

    },

    get(key, fallback = null) {

      if (
        !CONFIG.ENABLE_LOCAL_STORAGE
      ) return fallback;

      try {

        const item =
          localStorage.getItem(key);

        return item
          ? JSON.parse(item)
          : fallback;

      } catch (error) {

        log("Storage get error", error);

        return fallback;

      }

    }

  };

  // =========================================
  // PROJECT DATA
  // =========================================

  const projects = [

    {
      id: 1,

      title:
        "Calculadora IRPF España",

      slug:
        "calculadora-irpf-espana",

      description:
        "Herramienta fiscal optimizada para calcular IRPF automáticamente y captar tráfico SEO cualificado.",

      tech: [
        "JavaScript",
        "HTML",
        "CSS",
        "SEO"
      ],

      category:
        "herramienta",

      image:
        "./images/projects/irpf.webp",

      fallbackImage:
        "./images/projects/fallback.webp",

      link:
        "https://viniciusbugarin.github.io/tax-calculator-spain/",

      featured: true,

      status:
        "Online",

      year:
        2026,

      keywords: [
        "calculadora irpf",
        "seo",
        "fiscal"
      ]
    },

    {
      id: 2,

      title:
        "Calculadora Autónomos España",

      slug:
        "calculadora-autonomos-espana",

      description:
        "Sistema diseñado para calcular cuota, impuestos y beneficio real para autónomos.",

      tech: [
        "JavaScript",
        "HTML",
        "CSS"
      ],

      category:
        "herramienta",

      image:
        "./images/projects/autonomos.webp",

      fallbackImage:
        "./images/projects/fallback.webp",

      link:
        "https://viniciusbugarin.github.io/autonomos-calculator/",

      featured: true,

      status:
        "Online",

      year:
        2026,

      keywords: [
        "autonomos",
        "freelance",
        "calculadora"
      ]
    },

    {
      id: 3,

      title:
        "Lexoria Abogados",

      slug:
        "lexoria-abogados",

      description:
        "Landing profesional para despacho jurídico optimizada para conversión y SEO local.",

      tech: [
        "HTML",
        "CSS",
        "JavaScript",
        "SEO Local"
      ],

      category:
        "web",

      image:
        "./images/projects/lexoria.webp",

      fallbackImage:
        "./images/projects/fallback.webp",

      link:
        "https://viniciusbugarin.github.io/lexoria-abogados/",

      featured: true,

      status:
        "Online",

      year:
        2026,

      keywords: [
        "abogados",
        "landing",
        "seo local"
      ]
    },

    {
      id: 4,

      title:
        "Iron Forge Gym",

      slug:
        "iron-forge-gym",

      description:
        "Landing moderna para gimnasio enfocada en captación de clientes y branding premium.",

      tech: [
        "HTML",
        "CSS",
        "JavaScript"
      ],

      category:
        "web",

      image:
        "./images/projects/ironforge.webp",

      fallbackImage:
        "./images/projects/fallback.webp",

      link:
        "https://viniciusbugarin.github.io/iron-forge-gym/",

      featured: false,

      status:
        "Online",

      year:
        2026,

      keywords: [
        "gym",
        "fitness",
        "branding"
      ]
    },

    {
      id: 5,

      title:
        "La Plaza Gourmet",

      slug:
        "la-plaza-gourmet",

      description:
        "Página web profesional para restaurante optimizada para reservas y SEO local.",

      tech: [
        "HTML",
        "CSS",
        "JavaScript",
        "SEO Local"
      ],

      category:
        "web",

      image:
        "./images/projects/laplaza.webp",

      fallbackImage:
        "./images/projects/fallback.webp",

      link:
        "https://viniciusbugarin.github.io/La-Plaza-Gourmet/",

      featured: false,

      status:
        "Online",

      year:
        2026,

      keywords: [
        "restaurante",
        "gourmet",
        "food"
      ]
    }

  ];

  // =========================================
  // STATE
  // =========================================

  const STATE = {

    filter:
      storage.get(
        "vb-filter",
        "all"
      ),

    search:
      storage.get(
        "vb-search",
        ""
      ),

    sort:
      storage.get(
        "vb-sort",
        "featured"
      )

  };

  // =========================================
  // FILTER + SORT
  // =========================================

  function getFilteredProjects() {

    let filtered =
      [...projects];

    // FILTER

    if (STATE.filter !== "all") {

      filtered = filtered.filter(
        project =>
          project.category ===
          STATE.filter
      );

    }

    // SEARCH

    if (STATE.search) {

      const term =
        normalizeText(
          STATE.search
        );

      filtered = filtered.filter(
        project => {

          const content =
            normalizeText(`

              ${project.title}
              ${project.description}
              ${project.tech.join(" ")}
              ${project.keywords.join(" ")}

            `);

          return content.includes(term);

        }
      );

    }

    // SORT

    switch (STATE.sort) {

      case "alphabetical":

        filtered.sort((a, b) =>
          a.title.localeCompare(
            b.title
          )
        );

        break;

      case "newest":

        filtered.sort(
          (a, b) =>
            b.year - a.year
        );

        break;

      default:

        filtered.sort(
          (a, b) =>
            Number(b.featured) -
            Number(a.featured)
        );

    }

    return filtered;

  }

  // =========================================
  // RENDER
  // =========================================

  function renderProjects() {

    const container =
      $(".projects-grid");

    if (!container) {

      log(
        "Projects grid not found"
      );

      return;

    }

    const filtered =
      getFilteredProjects();

    // EMPTY STATE

    if (!filtered.length) {

      container.innerHTML = `

        <div class="empty-projects">

          <h3>
            No se encontraron proyectos
          </h3>

          <p>
            Prueba otra búsqueda.
          </p>

        </div>

      `;

      return;

    }

    container.innerHTML =
      filtered
        .map(createProjectCard)
        .join("");

    initImageFallbacks();

    initRevealAnimations();

    initTracking();

  }

  // =========================================
  // CARD TEMPLATE
  // =========================================

  function createProjectCard(project) {

    return `

      <article
        class="project-card reveal"
        data-category="${sanitizeHTML(project.category)}"
      >

        <div class="project-image-wrapper">

          <img
            class="project-image"
            src="${sanitizeHTML(project.image)}"
            alt="${sanitizeHTML(project.title)}"
            loading="lazy"
            decoding="async"
            width="1200"
            height="700"
          >

          <div class="project-overlay"></div>

          <div class="project-badges">

            ${
              project.featured
                ? `
                  <span class="project-badge featured">
                    ★ Destacado
                  </span>
                `
                : ""
            }

            <span class="project-badge live">
              ${sanitizeHTML(project.status)}
            </span>

          </div>

        </div>

        <div class="project-content">

          <div class="project-meta">

            <span class="project-category">
              ${capitalize(project.category)}
            </span>

            <span class="project-year">
              ${sanitizeHTML(project.year)}
            </span>

          </div>

          <h3 class="project-title">
            ${sanitizeHTML(project.title)}
          </h3>

          <p class="project-description">
            ${sanitizeHTML(project.description)}
          </p>

          <div class="project-tech">

            ${project.tech.map(tech => `

              <span class="tech-badge">
                ${sanitizeHTML(tech)}
              </span>

            `).join("")}

          </div>

          <div class="project-actions">

            <a
              href="${sanitizeHTML(project.link)}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn primary project-link"
              data-project="${sanitizeHTML(project.title)}"
            >
              Ver proyecto →
            </a>

          </div>

        </div>

      </article>

    `;

  }

  // =========================================
  // IMAGE FALLBACK
  // =========================================

  function initImageFallbacks() {

    if (
      !CONFIG.ENABLE_IMAGE_FALLBACK
    ) return;

    $$(".project-image")
      .forEach(image => {

        image.addEventListener(
          "error",
          () => {

            image.src =
              "./images/projects/fallback.webp";

            image.classList.add(
              "image-error"
            );

          },
          { once: true }
        );

      });

  }

  // =========================================
  // FILTERS
  // =========================================

  function initFilters() {

    if (
      !CONFIG.ENABLE_FILTERS
    ) return;

    const buttons =
      $$("[data-filter]");

    if (!buttons.length) return;

    buttons.forEach(button => {

      const filter =
        button.dataset.filter;

      if (
        filter === STATE.filter
      ) {

        button.classList.add(
          "active"
        );

      }

      button.addEventListener(
        "click",
        () => {

          STATE.filter = filter;

          storage.save(
            "vb-filter",
            filter
          );

          buttons.forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });

          button.classList.add(
            "active"
          );

          renderProjects();

        }
      );

    });

  }

  // =========================================
  // SEARCH
  // =========================================

  function initSearch() {

    if (
      !CONFIG.ENABLE_SEARCH
    ) return;

    const input =
      $("#projectSearch");

    if (!input) return;

    input.value = STATE.search;

    input.addEventListener(
      "input",

      debounce(event => {

        STATE.search =
          event.target.value.trim();

        storage.save(
          "vb-search",
          STATE.search
        );

        renderProjects();

      }, 250)
    );

  }

  // =========================================
  // SORTING
  // =========================================

  function initSorting() {

    if (
      !CONFIG.ENABLE_SORTING
    ) return;

    const select =
      $("#projectSort");

    if (!select) return;

    select.value = STATE.sort;

    select.addEventListener(
      "change",
      event => {

        STATE.sort =
          event.target.value;

        storage.save(
          "vb-sort",
          STATE.sort
        );

        renderProjects();

      }
    );

  }

  // =========================================
  // REVEAL
  // =========================================

  function initRevealAnimations() {

    if (
      !CONFIG.ENABLE_ANIMATIONS
    ) return;

    const elements =
      $$(".reveal");

    if (
      !("IntersectionObserver" in window)
    ) {

      elements.forEach(el => {

        el.classList.add(
          "active"
        );

      });

      return;

    }

    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) return;

              entry.target.classList.add(
                "active"
              );

              observer.unobserve(
                entry.target
              );

            }
          );

        },

        {
          threshold:
            CONFIG.REVEAL_THRESHOLD,

          rootMargin:
            "0px 0px -60px 0px"
        }

      );

    elements.forEach(el => {

      observer.observe(el);

    });

  }

  // =========================================
  // TRACKING
  // =========================================

  function initTracking() {

    if (
      !CONFIG.ENABLE_TRACKING
    ) return;

    $$(".project-link")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            const project =
              link.dataset.project;

            log(
              "Project click:",
              project
            );

            if (
              typeof window.gtag ===
              "function"
            ) {

              window.gtag(
                "event",
                "project_click",
                {
                  project_name:
                    project
                }
              );

            }

          }
        );

      });

  }

  // =========================================
  // URL HASH
  // =========================================

  function initHashFilter() {

    if (
      !CONFIG.ENABLE_URL_HASH
    ) return;

    const hash =
      window.location.hash
        .replace("#", "");

    if (!hash) return;

    const exists =
      projects.some(
        project =>
          project.category === hash
      );

    if (exists) {

      STATE.filter = hash;

    }

  }

  // =========================================
  // INIT
  // =========================================

  function init() {

    initHashFilter();

    initFilters();

    initSearch();

    initSorting();

    renderProjects();

    log("Projects initialized");

  }

  // =========================================
  // START
  // =========================================

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();