// ==========================
// CONFIG
// ==========================
const PROJECTS_CONFIG = {
  FEATURED_FIRST: true,
  TRACK_CLICKS: true
};

// ==========================
// DATA (ESCALABLE)
// ==========================
const projects = [
  {
    id: 1,
    title: "Calculadora IRPF España",
    description: "Herramienta que calcula el IRPF automáticamente según la normativa actual en España.",
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
    description: "Simula cuota, impuestos y beneficio real para autónomos en España.",
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
});

// ==========================
// RENDER PROYECTOS (ULTRA)
// ==========================
function renderProjects(filter = "all") {
  const container = document.querySelector(".projects-grid");
  if (!container) return;

  container.innerHTML = "";

  let filtered = [...projects];

  // 🔥 Orden featured primero
  if (PROJECTS_CONFIG.FEATURED_FIRST) {
    filtered.sort((a, b) => b.featured - a.featured);
  }

  // 🔥 filtro por categoría
  if (filter !== "all") {
    filtered = filtered.filter(p => p.category === filter);
  }

  filtered.forEach(project => {
    const card = createProjectCard(project);
    container.appendChild(card);
  });
}

// ==========================
// CREAR CARD PRO (UX + SEO)
// ==========================
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card reveal";

  // 🔥 SEO interno (microdatos básicos)
  card.setAttribute("data-keywords", project.keywords.join(","));

  card.innerHTML = `
    <div class="project-image" 
         style="background-image:url('${project.image}')"
         role="img"
         aria-label="${project.title}">
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

  // 🔥 tracking clicks (nivel negocio)
  if (PROJECTS_CONFIG.TRACK_CLICKS) {
    card.querySelector(".project-link").addEventListener("click", () => {
      trackProjectClick(project);
    });
  }

  return card;
}

// ==========================
// TRACKING (PREPARADO PARA GA)
// ==========================
function trackProjectClick(project) {
  console.log("CLICK PROYECTO:", project.title);

  // preparado para analytics
  if (typeof trackEvent === "function") {
    trackEvent("project_click", {
      title: project.title,
      category: project.category
    });
  }
}

// ==========================
// FILTROS DINÁMICOS (ESCALABLE)
// ==========================
function initFilters() {
  const buttons = document.querySelectorAll("[data-filter]");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // UI activa
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

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const keywords = card.dataset.keywords.toLowerCase();

      if (keywords.includes(term)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}