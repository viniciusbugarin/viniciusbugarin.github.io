// ==========================
// CONFIG (ESCALABLE)
// ==========================
const PROJECTS_CONFIG = {
  FEATURED_FIRST: true,
  TRACK_CLICKS: true,
  LAZY_LOAD_IMAGES: true
};

// ==========================
// DATA (FUTURO: API / CMS)
// ==========================
const projects = [
  {
    id: 1,
    title: "Calculadora IRPF España",
    description: "Herramienta que calcula el IRPF automáticamente según normativa actual.",
    tech: ["JavaScript", "HTML", "CSS"],
    category: "herramienta",
    image: "images/projects/irpf.jpg",
    link: "https://viniciusbugarin.github.io/tax-calculator-spain/",
    featured: true,
    keywords: ["calculadora irpf", "impuestos españa", "herramienta fiscal"]
  },
  {
    id: 2,
    title: "Calculadora Autónomos España",
    description: "Simula cuota, impuestos y beneficio real para autónomos.",
    tech: ["JavaScript", "HTML", "CSS"],
    category: "herramienta",
    image: "images/projects/autonomos.jpg",
    link: "https://viniciusbugarin.github.io/autonomos-calculator/",
    featured: true,
    keywords: ["autónomos españa", "cuota autónomos", "calculadora autónomos"]
  }
];

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initFilters();
  initSearch();
});

// ==========================
// RENDER PROYECTOS (OPTIMIZADO)
// ==========================
function renderProjects(filter = "all") {
  const container = document.querySelector(".projects-grid");
  if (!container) return;

  container.innerHTML = "";

  let filtered = [...projects];

  // Orden featured
  if (PROJECTS_CONFIG.FEATURED_FIRST) {
    filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  // Filtro
  if (filter !== "all") {
    filtered = filtered.filter(p => p.category === filter);
  }

  // Fragment = rendimiento
  const fragment = document.createDocumentFragment();

  filtered.forEach(project => {
    fragment.appendChild(createProjectCard(project));
  });

  container.appendChild(fragment);
}

// ==========================
// CARD ULTRA PRO (SEO + UX)
// ==========================
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card reveal hover-lift";

  // SEO interno
  card.dataset.keywords = project.keywords.join(",");
  card.dataset.category = project.category;

  card.innerHTML = `
    <div class="project-image">
      <img 
        src="${project.image}" 
        alt="${project.title}" 
        loading="lazy"
      />
    </div>

    <div class="project-content">

      <h3>${project.title}</h3>

      <p>${project.description}</p>

      <div class="tech">
        ${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join("")}
      </div>

      <div class="project-actions">
        <a href="${project.link}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="btn primary project-link"
           data-id="${project.id}">
           Ver proyecto →
        </a>
      </div>

    </div>
  `;

  // Tracking PRO
  if (PROJECTS_CONFIG.TRACK_CLICKS) {
    const link = card.querySelector(".project-link");
    link.addEventListener("click", () => trackProjectClick(project));
  }

  return card;
}

// ==========================
// TRACKING (LISTO PARA GA)
// ==========================
function trackProjectClick(project) {
  console.log("CLICK:", project.title);

  if (typeof trackEvent === "function") {
    trackEvent("project_click", {
      id: project.id,
      title: project.title,
      category: project.category
    });
  }
}

// ==========================
// FILTROS (UX PRO)
// ==========================
function initFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      renderProjects(filter);
    });
  });
}

// ==========================
// BÚSQUEDA (SEO + UX)
// ==========================
function initSearch() {
  const input = document.getElementById("projectSearch");
  if (!input) return;

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {
      const keywords = card.dataset.keywords.toLowerCase();

      card.style.display = keywords.includes(term) ? "block" : "none";
    });
  });
}