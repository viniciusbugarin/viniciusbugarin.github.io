// PROYECTOS
const container = document.getElementById("projects-container");

projects.forEach(p => {
  container.innerHTML += `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p><strong>${p.tech}</strong></p>
      <a href="${p.link}" target="_blank" class="button">Ver proyecto</a>
    </div>
  `;
});


// FORMULARIO (FORM SPREE)
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/mlgpbzre", {
      method: "POST",
      body: data,
      headers: { 'Accept': 'application/json' }
    });
        status.innerHTML = "⏳ Enviando...";
    if (response.ok) {
      status.innerHTML = "✅ Mensaje enviado";
      form.reset();
    } else {
      status.innerHTML = "❌ Error";
    }

  } catch {
    status.innerHTML = "⚠️ Error conexión";
  }
});

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    card.style.background = `
      radial-gradient(circle at 
      ${e.clientX - rect.left}px 
      ${e.clientY - rect.top}px,
      rgba(59,130,246,0.15),
      #1e293b
      )
    `;
  });
});
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  nav.style.background = window.scrollY > 50 
    ? "rgba(15,23,42,0.95)" 
    : "transparent";
});
