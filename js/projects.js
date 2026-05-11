// =========================================
// VINICIUS BUGARIN — PROJECT SYSTEM FINAL
// ULTRA SEO + PERFORMANCE + SCALABLE
// =========================================

const PROJECTS_CONFIG = {

  FEATURED_FIRST: true,

  TRACK_CLICKS: true,

  LAZY_LOAD_IMAGES: true,

  ENABLE_ANIMATIONS: true,

  ENABLE_SEARCH: true,

  ENABLE_FILTERS: true,

  ENABLE_SORTING: true

};

// =========================================
// PROJECT DATA
// =========================================

const projects = [

  {
    id: 1,

    title: "Calculadora IRPF España",

    description:
      "Herramienta fiscal optimizada para calcular IRPF automáticamente y captar tráfico SEO cualificado.",

    tech: [
      "JavaScript",
      "HTML",
      "CSS",
      "SEO"
    ],

    category: "herramienta",

    image:
      "../images/projects/irpf.jpg",

    fallbackImage:
      "../images/projects/fallback.webp",

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
      "../images/projects/autonomos.jpg",

    fallbackImage:
      "../images/projects/fallback.webp",

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
      "../images/projects/lexoria.jpg",

    fallbackImage:
      "../images/projects/fallback.webp",

    link:
      "https://viniciusbugarin.github.io/lexoria-abogados/",

    featured: true,

    status: "Online",

    year: "2026",

    keywords: [
      "abogados",
      "seo local",
      "landing abogados",
      "web legal"
    ]
  },

  {
    id: 4,

    title: "Iron Forge Gym",

    description:
      "Landing moderna para gimnasio enfocada en captación de clientes y branding premium.",

    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "SEO"
    ],

    category: "web",

    image:
      "../images/projects/ironforge.jpg",

    fallbackImage:
      "../images/projects/fallback.webp",

    link:
      "https://viniciusbugarin.github.io/iron-forge-gym/",

    featured: false,

    status: "Online",

    year: "2026",

    keywords: [
      "gym",
      "fitness",
      "landing gimnasio",
      "seo"
    ]
  },

  {
    id: 5,

    title: "La Plaza Gourmet",

    description:
      "Página web profesional para restaurante optimizada para reservas y SEO local.",

    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "SEO Local"
    ],

    category: "web",

    image:
      "../images/projects/laplaza.jpg",

    fallbackImage:
      "../images/projects/fallback.webp",

    link:
      "https://viniciusbugarin.github.io/La-Plaza-Gourmet/",

    featured: false,

    status: "Online",

    year: "2026",

    keywords: [
      "restaurante",
      "seo local",
      "gourmet",
      "food"
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

  if (PROJECTS_CONFIG.ENABLE_SORTING) {
    initSorting();
  }

  initReveal();

});

// =========================================
// RENDER PROJECTS
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

      <div class="empty-projects card">

        <h3>
          No hay proyectos encontrados
        </h3>

        <p>
          Prueba otra categoría o búsqueda.
        </p>

      </div>

    `;

    return;

  }

  const fragment =
    document.createDocumentFragment();

  filtered.forEach(project => {

    fragment.appendChild(
      createProjectCard(project)
    );

  });

  container.appendChild(fragment);

  initReveal();

}

// =========================================
// CREATE PROJECT CARD
// =========================================

function createProjectCard(project) {

  const card =
    document.createElement("article");

  card.className =
    "project-card card reveal";

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
        decoding="async"
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

  // IMAGE FALLBACK
  const image =
    card.querySelector(".project-image");

  image.addEventListener("error", () => {

    image.src =
      project.fallbackImage;

  });

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

  // FUTURE:
  // Google Analytics
  // Plausible
  // Meta Pixel

  if (typeof gtag === "function") {

    gtag("event", "project_click", {

      project_name:
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
// SORTING
// =========================================

function initSorting() {

  const select =
    document.getElementById("projectSort");

  if (!select) return;

  select.addEventListener("change", () => {

    const value =
      select.value;

    if (value === "newest") {

      projects.sort(
        (a, b) =>
          Number(b.year) -
          Number(a.year)
      );

    }

    if (value === "featured") {

      projects.sort(
        (a, b) =>
          Number(b.featured) -
          Number(a.featured)
      );

    }

    renderProjects();

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

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );

}

// =========================================
// FUTURE CMS READY
// =========================================

// async function loadProjectsFromAPI() {
//
//   const response =
//     await fetch("/api/projects");
//
//   const data =
//     await response.json();
//
//   projects.push(...data);
//
//   renderProjects();
//
// }