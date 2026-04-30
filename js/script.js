// ==========================
// GLOBAL CONFIG (ULTRA PRO)
// ==========================
const CONFIG = {
  SCROLL_OFFSET: 80,
  OBSERVER_THRESHOLD: 0.12,
  SCROLL_THROTTLE: 100
};

// ==========================
// APP STATE
// ==========================
const STATE = {
  ticking: false
};

// ==========================
// INIT APP
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initSmoothScroll();
  initNavbarEffect();
  initLazyLoad();
  initGlobalTracking();
});

// ==========================
// REVEAL ANIMATIONS (OPTIMIZADO)
// ==========================
function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    fallbackReveal(elements);
    window.addEventListener("scroll", throttle(() => fallbackReveal(elements), 150));
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

      trackEvent("scroll_to_section", {
        target: this.getAttribute("href")
      });
    });
  });
}

// ==========================
// NAVBAR SCROLL EFFECT (PERFORMANCE)
// ==========================
function initNavbarEffect() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (!STATE.ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
        STATE.ticking = false;
      });

      STATE.ticking = true;
    }
  }, { passive: true });
}

// ==========================
// LAZY LOAD IMAGES (PRO)
// ==========================
function initLazyLoad() {
  const images = document.querySelectorAll("img[data-src]");

  if (!("IntersectionObserver" in window)) {
    images.forEach(img => img.src = img.dataset.src);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        obs.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

// ==========================
// TRACKING SYSTEM (REAL READY)
// ==========================
function trackEvent(name, data = {}) {

  console.log("EVENT:", name, data);

  // Google Analytics (ejemplo)
  if (typeof gtag === "function") {
    gtag("event", name, data);
  }

  // Meta Pixel (ejemplo)
  if (typeof fbq === "function") {
    fbq("trackCustom", name, data);
  }
}

// ==========================
// GLOBAL TRACKING (CONVERSIÓN)
// ==========================
function initGlobalTracking() {

  // clicks en botones
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
      trackEvent("button_click", {
        text: btn.textContent.trim()
      });
    });
  });

  // formulario
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      trackEvent("form_submit");
    });
  }

  // proyectos
  document.addEventListener("click", (e) => {
    if (e.target.closest(".project-link")) {
      trackEvent("project_click");
    }
  });

}

// ==========================
// UTILS
// ==========================
function throttle(fn, wait) {
  let time = Date.now();

  return function () {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}

// ==========================
// PERFORMANCE BOOST
// ==========================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});