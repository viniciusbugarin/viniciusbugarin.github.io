const slug = window.location.pathname.split("/").pop().replace(".html", "");

fetch("data/pages.json")
  .then(res => res.json())
  .then(data => {
    const page = data.find(p => p.slug === slug);

    if (!page) return;

    document.getElementById("title").innerText = page.title;
    document.getElementById("description").setAttribute("content", page.description);
    document.getElementById("h1").innerText = page.h1;
    document.getElementById("content").innerText = page.content;
    document.getElementById("cta").innerText = page.cta;
  });
