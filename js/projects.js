// =========================================
// VINICIUS BUGARIN — PROJECT SYSTEM FINAL
// ESCALABLE + SEO + PERFORMANCE + UX
// =========================================

const PROJECTS_CONFIG = {

  FEATURED_FIRST: true,

  TRACK_CLICKS: true,

  LAZY_LOAD_IMAGES: true,

  ENABLE_ANIMATIONS: true,

  ENABLE_SEARCH: true,

  ENABLE_FILTERS: true

};

// =========================================
// DATA
// FUTURO: API / CMS / JSON
// =========================================

const projects = [

  {
    id: 1,

    title: "Calculadora IRPF España",

    description:
      "Herramienta fiscal optimizada para calcular IRPF automáticamente y generar tráfico SEO.",

    tech: [
      "JavaScript",
      "HTML",
      "CSS",
      "SEO"
    ],

    category: "herramienta",

    image:
      "images/projects/irpf.jpg",

    link:
      "https://viniciusbugarin.github.io/tax-calculator-spain/",

    featured: true,

    status: "Online",

    year: "2026",

    keywords: [
      "calculadora irpf",
      "impuestos españa",
      "herramienta fiscal",
      "seo"
    ]
  },

  {
    id: 2,

    title: "Calculadora Autónomos España",

    description:
      "Sistema diseñado para calcular cuota, impuestos y beneficio real para autónomos.",

    tech: [
      "JavaScript",
      "HTML",
      "CSS"
    ],

    category: "herramienta",

    image:
      "images/projects/autonomos.jpg",

    link:
      "https://viniciusbugarin.github.io/autonomos-calculator/",

    featured: true,

    status: "Online",

    year: "2026",

    keywords: [
      "autónomos",
      "calculadora autónomos",
      "cuota autónomos",
      "freelance"
    ]
  },

  {
    id: 3,

    title: "Lexoria Abogados",

    description:
      "Landing profesional para despacho jurídico optimizada para conversión y SEO local.",

    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "SEO Local"
    ],

    category: "web",

    image:
      "images/projects/lexoria.jpg",

    link:
      "https://viniciusbugarin.github.io/lexoria-abogados",

    featured: true,

    status: "Online",

    year: "2026",

    keywords: [
      "abogados",
      "seo local",
      "landing abogados",
      "web legal"
    ]
  }

];

// =========================================
// DOM READY
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  renderProjects();

  if (PROJECTS_CONFIG.ENABLE_FILTERS) {
    initFilters();
  }

  if (PROJECTS_CONFIG.ENABLE_SEARCH) {
    initSearch();
  }

  initReveal();

});

// =========================================
// RENDER
// =========================================

function renderProjects(filter = "all") {

  const container =
    document.querySelector(".projects-grid");

  if (!container) return;

  container.innerHTML = "";

  let filtered = [...projects];

  // FEATURED FIRST
  if (PROJECTS_CONFIG.FEATURED_FIRST) {

    filtered.sort(
      (a, b) =>
        Number(b.featured) -
        Number(a.featured)
    );

  }

  // FILTER
  if (filter !== "all") {

    filtered =
      filtered.filter(
        project =>
          project.category === filter
      );

  }

  // EMPTY STATE
  if (!filtered.length) {

    container.innerHTML = `
      <div class="empty-projects">
        <h3>No hay proyectos encontrados</h3>
        <p>Prueba otra búsqueda o categoría.</p>
      </div>
    `;

    return;
  }

  // PERFORMANCE
  const fragment =
    document.createDocumentFragment();

  filtered.forEach(project => {

    fragment.appendChild(
      createProjectCard(project)
    );

  });

  container.appendChild(fragment);

}

// =========================================
// CREATE CARD
// =========================================

function createProjectCard(project) {

  const card =
    document.createElement("article");

  card.className =
    `
      project-card
      card
      reveal
      hover-lift
    `;

  // SEO DATASET
  card.dataset.category =
    project.category;

  card.dataset.keywords =
    project.keywords.join(",");

  card.dataset.projectId =
    project.id;

  card.innerHTML = `

    <div class="project-image-wrapper">

      <img
        src="${project.image}"
        alt="${project.title}"
        class="project-image"
        loading="lazy"
      >

      <div class="project-overlay"></div>

      <div class="project-badges">

        ${
          project.featured
          ? `<span class="project-badge featured">★ Destacado</span>`
          : ""
        }

        <span class="project-badge status">
          ${project.status}
        </span>

      </div>

    </div>

    <div class="project-content">

      <div class="project-meta">

        <span class="project-category">
          ${capitalize(project.category)}
        </span>

        <span class="project-year">
          ${project.year}
        </span>

      </div>

      <h3 class="project-title">
        ${project.title}
      </h3>

      <p class="project-description">
        ${project.description}
      </p>

      <div class="project-tech">

        ${project.tech.map(tech => `

          <span class="tech-badge">
            ${tech}
          </span>

        `).join("")}

      </div>

      <div class="project-actions">

        <a
          href="${project.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn primary project-link"
          data-id="${project.id}"
          aria-label="Abrir ${project.title}"
        >
          Ver proyecto →
        </a>

      </div>

    </div>

  `;

  // TRACKING
  if (PROJECTS_CONFIG.TRACK_CLICKS) {

    const link =
      card.querySelector(".project-link");

    if (link) {

      link.addEventListener(
        "click",
        () => trackProjectClick(project)
      );

    }

  }

  return card;

}

// =========================================
// TRACKING
// =========================================

function trackProjectClick(project) {

  console.log(
    `[PROJECT CLICK] ${project.title}`
  );

  // FUTURO:
  // Google Analytics
  // Plausible
  // Hotjar
  // Meta Pixel

  if (typeof trackEvent === "function") {

    trackEvent("project_click", {

      project_id:
        project.id,

      project_title:
        project.title,

      project_category:
        project.category

    });

  }

}

// =========================================
// FILTERS
// =========================================

function initFilters() {

  const buttons =
    document.querySelectorAll("[data-filter]");

  if (!buttons.length) return;

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const filter =
        button.dataset.filter;

      buttons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      renderProjects(filter);

    });

  });

}

// =========================================
// SEARCH
// =========================================

function initSearch() {

  const input =
    document.getElementById("projectSearch");

  if (!input) return;

  input.addEventListener("input", () => {

    const term =
      input.value
        .trim()
        .toLowerCase();

    document
      .querySelectorAll(".project-card")
      .forEach(card => {

        const keywords =
          card.dataset.keywords
            .toLowerCase();

        const title =
          card.querySelector("h3")
            .textContent
            .toLowerCase();

        const visible =
          keywords.includes(term) ||
          title.includes(term);

        card.style.display =
          visible
            ? "flex"
            : "none";

      });

  });

}

// =========================================
// REVEAL ANIMATIONS
// =========================================

function initReveal() {

  if (!PROJECTS_CONFIG.ENABLE_ANIMATIONS) {
    return;
  }

  const reveals =
    document.querySelectorAll(".reveal");

  const observer =
    new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

          observer.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.12
    });

  reveals.forEach(el => {
    observer.observe(el);
  });

}

// =========================================
// HELPERS
// =========================================

function capitalize(text) {

  return text.charAt(0).toUpperCase() +
         text.slice(1);

}

// =========================================
// FUTURE CMS READY
// =========================================

// async function loadProjectsFromAPI() {
//
//   const response = await fetch("/api/projects");
//
//   const data = await response.json();
//
//   projects.push(...data);
//
//   renderProjects();
//
// }
