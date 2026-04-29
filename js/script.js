// ==========================
// GLOBAL CONFIG (PRO)
// ==========================
const CONFIG = {
  SCROLL_OFFSET: 80,
  OBSERVER_THRESHOLD: 0.12
};

// ==========================
// INIT APP
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initSmoothScroll();
  initNavbarEffect();
});

// ==========================
// REVEAL ANIMATIONS (PRO)
// ==========================
function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    fallbackReveal(elements);
    window.addEventListener("scroll", () => fallbackReveal(elements));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.OBSERVER_THRESHOLD
  });

  elements.forEach(el => observer.observe(el));
}

function fallbackReveal(elements) {
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - CONFIG.SCROLL_OFFSET) {
      el.classList.add("active");
    }
  });
}

// ==========================
// SMOOTH SCROLL (UX PRO)
// ==========================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (!target) return;

      e.preventDefault();

      const offset = target.offsetTop - CONFIG.SCROLL_OFFSET;

      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
    });
  });
}

// ==========================
// NAVBAR SCROLL EFFECT
// ==========================
function initNavbarEffect() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ==========================
// TRACKING SYSTEM (READY)
// ==========================
function trackEvent(name, data = {}) {
  console.log("EVENT:", name, data);

  // FUTURO:
  // gtag('event', name, data);
  // fbq('track', name, data);
}

// ==========================
// PERFORMANCE BOOST
// ==========================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});