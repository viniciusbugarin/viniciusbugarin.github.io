(async function () {

  const slug = window.location.pathname.split("/").pop().replace(".html", "") || "index";

  try {
    const res = await fetch("data/pages.json");

    if (!res.ok) throw new Error("Error cargando JSON");

    const data = await res.json();

    const page = data.find(p => p.slug === slug);

    // 🚨 SI NO EXISTE → 404 SEO
    if (!page) {
      document.title = "Página no encontrada | Vinicius Bugarin";

      document.body.innerHTML = `
        <section class="section">
          <h1>Página no encontrada</h1>
          <p>Esta página no existe o ha sido eliminada.</p>
          <a href="/" class="btn primary">Volver al inicio</a>
        </section>
      `;
      return;
    }

    // ==========================
    // 🔥 SEO DINÁMICO REAL
    // ==========================

    document.title = page.title;

    setMeta("description", page.description);
    setMeta("keywords", page.keywords?.join(", "));

    setMetaProperty("og:title", page.title);
    setMetaProperty("og:description", page.description);
    setMetaProperty("og:url", window.location.href);

    // ==========================
    // 🔥 CONTENIDO DINÁMICO
    // ==========================

    setText("h1", page.h1);
    setHTML("content", page.content);
    setText("cta", page.cta);

    // ==========================
    // 🔥 SCROLL TOP AUTOMÁTICO
    // ==========================
    window.scrollTo(0, 0);

    console.log("✅ Página cargada:", slug);

  } catch (error) {

    console.error("❌ Error:", error);

    document.body.innerHTML = `
      <section class="section">
        <h1>Error al cargar la página</h1>
        <p>Inténtalo de nuevo más tarde.</p>
      </section>
    `;
  }

})();


// ==========================
// 🔧 HELPERS PRO
// ==========================

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.innerText = text;
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