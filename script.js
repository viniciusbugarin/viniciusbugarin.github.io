/* =============================================
   PORTFOLIO — script.js
   Author: Vinicius Bugarin
   =============================================

   TABLE OF CONTENTS
   -----------------
   1. Project data     ← EDIT YOUR PROJECTS HERE
   2. Render projects
   3. Navbar scroll effect
   4. Hamburger menu
   5. Active nav link on scroll
   6. Scroll-reveal animation
   7. Contact form handling
   8. Footer year
   ============================================= */


/* ==============================================
   1. PROJECT DATA
   -----------------------------------------------
   Add / edit / remove project objects below.
   Each object has:
     title       — project name
     description — short description
     tech        — array of technology strings
     link        — URL (use "#" if not deployed yet)
     emoji       — icon shown on the card banner
     color       — CSS gradient for the banner
   ============================================== */
const projects = [
  {
    title: "Calculadora de Impuestos España",
    description:
      "Aplicación que calcula automáticamente cuánto pagar a Hacienda subiendo la nómina. Incluye IRPF, cuotas a la Seguridad Social y tramos actualizados.",
    tech: ["JavaScript", "HTML", "CSS"],
    link: "https://viniciusbugarin.github.io/tax-calculator-spain/",
    emoji: "🧮",
    color: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
  },
  {
    title: "Portfolio Personal",
    description:
      "Sitio web portfolio profesional para mostrar proyectos y habilidades técnicas. Diseño moderno, responsive y optimizado para SEO.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "#",
    emoji: "🌐",
    color: "linear-gradient(135deg, #1e293b 0%, #4c1d95 100%)",
  },
  {
    title: "Gestor de Tareas",
    description:
      "Aplicación CRUD para gestionar tareas diarias con almacenamiento en localStorage. Sin dependencias externas.",
    tech: ["JavaScript", "HTML", "CSS"],
    link: "#",
    emoji: "✅",
    color: "linear-gradient(135deg, #1e293b 0%, #065f46 100%)",
  },
  /* ── Add more projects below ──
  {
    title: "Nombre del Proyecto",
    description: "Descripción breve del proyecto.",
    tech: ["PHP", "MySQL"],
    link: "https://tu-proyecto.com",
    emoji: "🚀",
    color: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)",
  },
  */
];


/* ==============================================
   2. RENDER PROJECTS
   Injects project cards into #projectsGrid
   ============================================== */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card fade-up">

        <!-- Colored banner with emoji icon -->
        <div class="project-banner" style="background: ${project.color}">
          <span>${project.emoji}</span>
        </div>

        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>

          <!-- Technology badges -->
          <div class="project-tech">
            ${project.tech.map((t) => `<span>${t}</span>`).join("")}
          </div>

          <!-- Link to live project -->
          <a
            href="${project.link}"
            target="_blank"
            rel="noopener noreferrer"
            class="project-link"
          >
            Ver proyecto →
          </a>
        </div>

      </article>
    `
    )
    .join("");

  // Trigger scroll observer for newly created cards
  observeFadeElements();
}


/* ==============================================
   3. NAVBAR SCROLL EFFECT
   Adds .scrolled class after user scrolls 50px
   ============================================== */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Run once on load
}


/* ==============================================
   4. HAMBURGER MENU
   Toggles .open on both the button and the link list
   ============================================== */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    hamburger.setAttribute(
      "aria-label",
      navLinks.classList.contains("open") ? "Cerrar menú" : "Abrir menú"
    );
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}


/* ==============================================
   5. ACTIVE NAV LINK ON SCROLL
   Highlights the link whose section is in view
   ============================================== */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links    = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px", // activates when section is ~middle of screen
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}


/* ==============================================
   6. SCROLL-REVEAL ANIMATION
   Elements with class .fade-up animate in when visible
   ============================================== */
function observeFadeElements() {
  const targets = document.querySelectorAll(".fade-up:not(.visible)");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // animate only once
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}


/* ==============================================
   7. CONTACT FORM
   -----------------------------------------------
   Currently shows a success message in the browser.
   To send real emails, replace the submit handler with:
     - A Formspree action URL (free tier available), OR
     - Your own backend endpoint using fetch()
   ============================================== */
function initContactForm() {
  const form     = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic client-side validation
    if (!email || !message) {
      showFeedback("Por favor, rellena todos los campos.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback("El email no tiene un formato válido.", "error");
      return;
    }

    /* ── To connect to Formspree: ──────────────────────────────────
       1. Sign up at https://formspree.io and create a form.
       2. Replace the URL below with your form endpoint.
       3. Uncomment the fetch block and remove the fake success.
       ─────────────────────────────────────────────────────────── */

    // fetch("https://formspree.io/f/YOUR_FORM_ID", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, message }),
    // })
    //   .then((res) => {
    //     if (res.ok) {
    //       showFeedback("¡Mensaje enviado! Te responderé pronto. 🎉", "success");
    //       form.reset();
    //     } else {
    //       showFeedback("Algo salió mal. Inténtalo de nuevo.", "error");
    //     }
    //   })
    //   .catch(() => showFeedback("Error de red. Inténtalo de nuevo.", "error"));

    // Fake success (remove once connected to a backend)
    showFeedback("¡Mensaje recibido! Te responderé pronto. 🎉", "success");
    form.reset();
  });

  /** Display a feedback message below the form */
  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className   = `form-feedback ${type}`;
    // Clear after 5 seconds
    setTimeout(() => {
      feedback.textContent = "";
      feedback.className   = "form-feedback";
    }, 5000);
  }

  /** Simple email format check */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ==============================================
   8. FOOTER YEAR
   Automatically keeps the copyright year current
   ============================================== */
function setFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}


/* ==============================================
   INIT — runs when the DOM is ready
   ============================================== */
document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();
  renderProjects();
  initNavbarScroll();
  initHamburger();
  initActiveNav();
  observeFadeElements();
  initContactForm();
});
