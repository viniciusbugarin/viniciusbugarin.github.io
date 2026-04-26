const projects = [
  {
    title: "Calculadora IRPF España",
    description: "Calcula impuestos en segundos con lógica automatizada basada en normativa real.",
    tech: ["JavaScript", "HTML", "CSS"],
    link: "https://viniciusbugarin.github.io/tax-calculator-spain/",
    image: "images/projects/irpf.jpg",
    category: "Finanzas"
  },
  {
    title: "Calculadora Autónomos",
    description: "Simula cuota, impuestos y beneficio real para autónomos.",
    tech: ["JavaScript", "HTML", "CSS"],
    link: "https://viniciusbugarin.github.io/autonomos-calculator/",
    image: "images/projects/autonomos.jpg",
    category: "Finanzas"
  }
];

// Render dinámico PRO
const container = document.querySelector(".projects-grid");

if (container) {
  container.innerHTML = projects.map(p => `
    <div class="card project-card">
      
      <div class="project-image">
        <img src="${p.image}" alt="${p.title}">
      </div>

      <div class="project-content">
        <h3>${p.title}</h3>
        <p>${p.description}</p>

        <div class="project-tech">
          ${p.tech.map(t => `<span>${t}</span>`).join("")}
        </div>

        <a href="${p.link}" target="_blank" class="btn primary">
          Ver proyecto
        </a>
      </div>

    </div>
  `).join("");
}