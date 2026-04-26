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
// 🔥 RENDER AUTOMÁTICO
// ==========================
function renderProjects() {
  const container = document.querySelector(".projects-grid");

  if (!container) return;

  container.innerHTML = "";

  projects.forEach(project => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="project-image" style="background-image:url('${project.image}')"></div>

      <h3>${project.title}</h3>

      <p>${project.description}</p>

      <div class="tech">
        ${project.tech.map(t => `<span>${t}</span>`).join("")}
      </div>

      <a href="${project.link}" target="_blank" class="btn primary">
        Ver proyecto
      </a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderProjects);