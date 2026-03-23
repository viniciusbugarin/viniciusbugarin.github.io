// PROYECTOS
const container = document.getElementById("projects-container");
const projectsFragment = document.createDocumentFragment(); // Usar un DocumentFragment para optimizar la inserción

projects.forEach(p => {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("card");
  projectDiv.innerHTML = `
    <h3>${p.title}</h3>
    <p>${p.description}</p>
    <p><strong>${p.tech}</strong></p>
    <a href="${p.link}" target="_blank" class="button">Ver proyecto</a>
  `;
  projectsFragment.appendChild(projectDiv);
});

// Insertar todos los elementos del fragmento de una vez
if (container) {
  container.appendChild(projectsFragment);
}


// FORMULARIO (FORM SPREE)
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && status) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = new FormData(form);
    status.innerHTML = "⏳ Enviando..."; // Mostrar estado antes de la petición

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
        // Manejar errores específicos de la respuesta HTTP si es posible
        const errorData = await response.json().catch(() => ({})); // Intentar obtener JSON, fallback a objeto vacío
        console.error("Error en la respuesta del servidor:", response.status, errorData);
        status.innerHTML = `❌ Error (${response.status})`;
      }

    } catch (error) {
      // Capturar errores de red o de la petición en sí
      console.error("Error de conexión o petición:", error);
      status.innerHTML = "⚠️ Error de conexión";
    }
  });
}


// ANIMACIÓN DE SCROLL PARA ELEMENTOS CON CLASE "reveal"
const reveals = document.querySelectorAll(".reveal");

const scrollHandler = () => {
  reveals.forEach(el => {
    // Comprobar si el elemento está en la vista (con un margen de 100px)
    if (el.getBoundingClientRect().top < window.innerHeight - 100 && !el.classList.contains("active")) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", scrollHandler);
// Ejecutar una vez al cargar para elementos que ya están visibles
window.addEventListener("load", scrollHandler);


// EFECTO HOVER EN TARJETAS DE PROYECTO
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    // Calcular la posición del ratón relativa a la tarjeta
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    card.style.background = `
      radial-gradient(circle at 
      ${mouseX}px 
      ${mouseY}px,
      rgba(59,130,246,0.15),
      #1e293b
      )
    `;
  });

  // Opcional: Limpiar el fondo al salir del hover para evitar que se quede pegado
  card.addEventListener("mouseleave", () => {
    card.style.background = ""; // Restablecer al valor por defecto o CSS
  });
});


// OCULTAR LOADER AL CARGAR LA PÁGINA
const loader = document.getElementById("loader");
if (loader) {
  window.addEventListener("load", () => {
    loader.style.display = "none";
  });
}


// CAMBIO DE FONDO DE LA BARRA DE NAVEGACIÓN AL HACER SCROLL
const nav = document.querySelector(".navbar");
if (nav) {
  const navScrollHandler = () => {
    nav.style.background = window.scrollY > 50 
      ? "rgba(15,23,42,0.95)" 
      : "transparent";
  };
  window.addEventListener("scroll", navScrollHandler);
  // Ejecutar una vez al cargar para establecer el estado inicial
  window.addEventListener("load", navScrollHandler);
}

