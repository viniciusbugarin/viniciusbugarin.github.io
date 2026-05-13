// =========================================
// VINICIUS BUGARIN — PROJECT SYSTEM
// ULTRA PERFORMANCE + SEO + SCALABLE v3
// =========================================

"use strict";

/* =========================================
   CONFIG
========================================= */

const PROJECTS_CONFIG = {

  FEATURED_FIRST: true,

  TRACK_CLICKS: true,

  ENABLE_ANIMATIONS: true,

  ENABLE_SEARCH: true,

  ENABLE_FILTERS: true,

  ENABLE_SORTING: true,

  ENABLE_LOCAL_STORAGE: true,

  ENABLE_IMAGE_FALLBACK: true,

  DEBUG: false

};

/* =========================================
   SAFE LOGGER
   FIX:
   Identifier 'log' has already been declared
========================================= */

const projectsLog = (...msg) => {

  if (PROJECTS_CONFIG.DEBUG) {

    console.log(
      "[PROJECTS]",
      ...msg
    );

  }

};

/* =========================================
   HELPERS
========================================= */

const sanitizeHTML = (text = "") => {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

};

const capitalize = (text = "") => {

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );

};

const normalizeText = (text = "") => {

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

};

const savePreference = (key, value) => {

  if (!PROJECTS_CONFIG.ENABLE_LOCAL_STORAGE) {
    return;
  }

  try {

    localStorage.setItem(
      key,
      value
    );

  } catch (error) {

    projectsLog(
      "Storage error:",
      error
    );

  }

};

const getPreference = (key) => {

  if (!PROJECTS_CONFIG.ENABLE_LOCAL_STORAGE) {
    return null;
  }

  try {

    return localStorage.getItem(key);

  } catch (error) {

    projectsLog(
      "Get storage error:",
      error
    );

    return null;
  }

};

/* =========================================
   PROJECT DATA
========================================= */

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
      "2026",

    keywords: [
      "calculadora irpf",
      "impuestos españa",
      "herramienta fiscal",
      "seo"
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
      "2026",

    keywords: [
      "autónomos",
      "calculadora autónomos",
      "cuota autónomos",
      "freelance"
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
      "2026",

    keywords: [
      "abogados",
      "seo local",
      "landing abogados",
      "web legal"
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
      "JavaScript",
      "SEO"
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
      "2026",

    keywords: [
      "gym",
      "fitness",
      "landing gimnasio",
      "seo"
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
      "2026",

    keywords: [
      "restaurante",
      "seo local",
      "gourmet",
      "food"
    ]
  }

];

/* =========================================
   STATE
========================================= */

const PROJECT_STATE = {

  currentFilter:
    "all",

  currentSearch:
    "",

  currentSort:
    "featured"

};

/* =========================================
   DOM READY
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    restorePreferences();

    renderProjects();

    initFilters();

    initSearch();

    initSorting();

    initReveal();

  }
);

/* =========================================
   RENDER PROJECTS
========================================= */

function renderProjects() {

  const container =
    document.querySelector(
      ".projects-grid"
    );

  if (!container) {

    projectsLog(
      "No existe .projects-grid"
    );

    return;

  }

  container.innerHTML = "";

  let filtered =
    [...projects];

  /* FILTER */

  if (
    PROJECT_STATE.currentFilter !==
    "all"
  ) {

    filtered = filtered.filter(
      project =>
        project.category ===
        PROJECT_STATE.currentFilter
    );

  }

  /* SEARCH */

  if (
    PROJECT_STATE.currentSearch
  ) {

    const term =
      normalizeText(
        PROJECT_STATE.currentSearch
      );

    filtered = filtered.filter(
      project => {

        const searchable =
          normalizeText(`
            ${project.title}
            ${project.description}
            ${project.tech.join(" ")}
            ${project.keywords.join(" ")}
          `);

        return searchable.includes(
          term
        );

      }
    );

  }

  /* SORT */

  switch (
    PROJECT_STATE.currentSort
  ) {

    case "newest":

      filtered.sort(
        (a, b) =>
          Number(b.year) -
          Number(a.year)
      );

      break;

    case "alphabetical":

      filtered.sort(
        (a, b) =>
          a.title.localeCompare(
            b.title
          )
      );

      break;

    default:

      filtered.sort(
        (a, b) =>
          Number(b.featured) -
          Number(a.featured)
      );

  }

  /* EMPTY STATE */

  if (!filtered.length) {

    container.innerHTML = `

      <div class="empty-projects">

        <h3>
          No se encontraron proyectos
        </h3>

        <p>
          Prueba otra búsqueda o filtro.
        </p>

      </div>

    `;

    return;

  }

  /* RENDER */

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

/* =========================================
   CREATE PROJECT CARD
========================================= */

function createProjectCard(project) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "project-card reveal";

  card.dataset.category =
    project.category;

  card.innerHTML = `

    <div class="project-image-wrapper">

      <img
        src="${sanitizeHTML(project.image)}"
        alt="${sanitizeHTML(project.title)}"
        class="project-image"
        loading="lazy"
        decoding="async"
        width="800"
        height="500"
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
          data-id="${project.id}"
          aria-label="Abrir ${sanitizeHTML(project.title)}"
        >
          Ver proyecto →
        </a>

      </div>

    </div>

  `;

  /* IMAGE FALLBACK */

  const image =
    card.querySelector(
      ".project-image"
    );

  if (
    image &&
    PROJECTS_CONFIG.ENABLE_IMAGE_FALLBACK
  ) {

    image.addEventListener(
      "error",
      () => {

        image.src =
          project.fallbackImage;

      }
    );

  }

  /* TRACKING */

  const link =
    card.querySelector(
      ".project-link"
    );

  if (
    link &&
    PROJECTS_CONFIG.TRACK_CLICKS
  ) {

    link.addEventListener(
      "click",
      () =>
        trackProjectClick(project)
    );

  }

  return card;

}

/* =========================================
   TRACKING
========================================= */

function trackProjectClick(project) {

  projectsLog(
    "CLICK:",
    project.title
  );

  if (
    typeof gtag ===
    "function"
  ) {

    gtag(
      "event",
      "project_click",
      {
        project_name:
          project.title,

        project_category:
          project.category
      }
    );

  }

}

/* =========================================
   FILTERS
========================================= */

function initFilters() {

  const buttons =
    document.querySelectorAll(
      "[data-filter]"
    );

  if (!buttons.length) {
    return;
  }

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        PROJECT_STATE.currentFilter =
          button.dataset.filter;

        savePreference(
          "vb_project_filter",
          PROJECT_STATE.currentFilter
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

/* =========================================
   SEARCH
========================================= */

function initSearch() {

  const input =
    document.getElementById(
      "projectSearch"
    );

  if (!input) {
    return;
  }

  input.value =
    PROJECT_STATE.currentSearch;

  input.addEventListener(
    "input",
    debounce(() => {

      PROJECT_STATE.currentSearch =
        input.value.trim();

      savePreference(
        "vb_project_search",
        PROJECT_STATE.currentSearch
      );

      renderProjects();

    }, 250)
  );

}

/* =========================================
   SORTING
========================================= */

function initSorting() {

  const select =
    document.getElementById(
      "projectSort"
    );

  if (!select) {
    return;
  }

  select.value =
    PROJECT_STATE.currentSort;

  select.addEventListener(
    "change",
    () => {

      PROJECT_STATE.currentSort =
        select.value;

      savePreference(
        "vb_project_sort",
        PROJECT_STATE.currentSort
      );

      renderProjects();

    }
  );

}

/* =========================================
   REVEAL ANIMATION
========================================= */

function initReveal() {

  if (
    !PROJECTS_CONFIG.ENABLE_ANIMATIONS
  ) {
    return;
  }

  const elements =
    document.querySelectorAll(
      ".reveal"
    );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "active"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  elements.forEach(element => {

    observer.observe(element);

  });

}

/* =========================================
   RESTORE PREFERENCES
========================================= */

function restorePreferences() {

  PROJECT_STATE.currentFilter =
    getPreference(
      "vb_project_filter"
    ) || "all";

  PROJECT_STATE.currentSearch =
    getPreference(
      "vb_project_search"
    ) || "";

  PROJECT_STATE.currentSort =
    getPreference(
      "vb_project_sort"
    ) || "featured";

}

/* =========================================
   DEBOUNCE
========================================= */

function debounce(
  callback,
  delay = 300
) {

  let timeout;

  return (...args) => {

    clearTimeout(timeout);

    timeout = setTimeout(
      () => callback(...args),
      delay
    );

  };

}