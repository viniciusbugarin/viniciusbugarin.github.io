function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 50) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
