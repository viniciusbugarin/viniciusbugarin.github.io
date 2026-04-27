// ==========================
// CONFIG
// ==========================
const PAGE_CONFIG = {
  JSON_PATH: "data/pages.json",
  DEFAULT_SLUG: "index",
  SITE_NAME: "Vinicius Bugarin",
  ENABLE_CACHE: true
};

// ==========================
// INIT
// ==========================
(async function initPage() {
  const slug = getSlug();

  try {
    const data = await loadPages();
    const page = data.find(p => p.slug === slug);

    if (!page) return render404();

    applySEO(page);
    renderContent(page);
    enhanceUX();

    console.log("✅ Página cargada:", slug);

  } catch (error) {
    console.error("❌ Error:", error);
    renderError();
  }
})();

// ==========================
// GET SLUG (ROBUSTO)
// ==========================
function getSlug() {
  let slug = window.location.pathname.split("/").pop();
  slug = slug.replace(".html", "");

  return slug || PAGE_CONFIG.DEFAULT_SLUG;
}

// ==========================
// LOAD JSON (CON CACHE)
// ==========================
async function loadPages() {

  if (PAGE_CONFIG.ENABLE_CACHE) {
    const cached = sessionStorage.getItem("pages_cache");
    if (cached) return JSON.parse(cached);
  }

  const res = await fetch(PAGE_CONFIG.JSON_PATH);

  if (!res.ok) throw new Error("Error cargando JSON");

  const data = await res.json();

  if (PAGE_CONFIG.ENABLE_CACHE) {
    sessionStorage.setItem("pages_cache", JSON.stringify(data));
  }

  return data;
}

// ==========================
// SEO ULTRA PRO
// ==========================
function applySEO(page) {

  // TITLE
  document.title = `${page.title} | ${PAGE_CONFIG.SITE_NAME}`;

  // META
  setMeta("description", page.description);
  setMeta("keywords", page.keywords?.join(", "));

  // CANONICAL
  setCanonical(window.location.href);

  // OPEN GRAPH
  setMetaProperty("og:title", page.title);
  setMetaProperty("og:description", page.description);
  setMetaProperty("og:url", window.location.href);

  // TWITTER
  setMetaProperty("twitter:title", page.title);
  setMetaProperty("twitter:description", page.description);

  // 🔥 SCHEMA DINÁMICO
  injectSchema(page);
}

// ==========================
// SCHEMA SEO (IMPORTANTE)
// ==========================
function injectSchema(page) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.description,
    "url": window.location.href
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}

// ==========================
// RENDER CONTENT
// ==========================
function renderContent(page) {
  setText("h1", page.h1);
  setHTML("content", page.content);
  setText("cta", page.cta);
}

// ==========================
// UX MEJORAS
// ==========================
function enhanceUX() {
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Lazy images (si las hay)
  document.querySelectorAll("img").forEach(img => {
    img.loading = "lazy";
  });
}

// ==========================
// 404 SEO
// ==========================
function render404() {
  document.title = `Página no encontrada | ${PAGE_CONFIG.SITE_NAME}`;

  document.body.innerHTML = `
    <section class="section">
      <h1>404 - Página no encontrada</h1>
      <p>Esta página no existe o ha sido eliminada.</p>
      <a href="/" class="btn primary">Volver al inicio</a>
    </section>
  `;
}

// ==========================
// ERROR GENERAL
// ==========================
function renderError() {
  document.body.innerHTML = `
    <section class="section">
      <h1>Error al cargar la página</h1>
      <p>Inténtalo de nuevo más tarde.</p>
    </section>
  `;
}

// ==========================
// HELPERS PRO
// ==========================
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html) el.innerHTML = html;
}

function setMeta(name, content) {
  if (!content) return;

  let meta = document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  if (!content) return;

  let meta = document.querySelector(`meta[property="${property}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector("link[rel='canonical']");

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}