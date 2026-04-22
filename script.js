// ==========================
// SCROLL ANIMATION
// ==========================
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

// ==========================
// CHAT UI
// ==========================
const toggleBtn = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");

if (toggleBtn && chatBox) {
  toggleBtn.onclick = () => {
    chatBox.classList.toggle("hidden");
  };
}

// ==========================
// SEND MESSAGE
// ==========================
async function send() {
  const input = document.getElementById("input");
  const message = input.value.trim();

  // ❌ Evitar mensajes vacíos
  if (!message) return;

  // 🧑 Mensaje usuario
  addMessage(message, "user");

  input.value = "";

  // 🤖 Mensaje temporal (typing)
  const typing = addMessage("Escribiendo...", "bot");

  try {
    const res = await fetch("https://viniciusbugarin-githu-git-87eea9-viniciusbugarin-9060s-projects.vercel.app/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // reemplazar "Escribiendo..."
    typing.remove();

    addMessage(data.reply, "bot");

  } catch (error) {
    typing.remove();

    addMessage("Error al conectar con el asistente. Inténtalo de nuevo.", "bot");

    console.error(error);
  }

  scrollToBottom();
}

// ==========================
// QUICK BUTTONS
// ==========================
function quick(text) {
  const input = document.getElementById("input");
  input.value = text;
  send();
}

// ==========================
// ADD MESSAGE (UI PRO)
// ==========================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add(type === "user" ? "user" : "bot");
  div.innerText = text;

  messages.appendChild(div);

  return div;
}

// ==========================
// AUTO SCROLL
// ==========================
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// ==========================
// ENTER PARA ENVIAR
// ==========================
document.getElementById("input")?.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    send();
  }
});
