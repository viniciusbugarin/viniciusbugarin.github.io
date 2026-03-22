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
