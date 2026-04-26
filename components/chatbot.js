const API_URL = "https://viniciusbugarin-github-io.vercel.app/api/chat";

// ELEMENTOS
const toggle = document.getElementById("chatToggle");
const container = document.getElementById("chatContainer");
const messages = document.getElementById("chatMessages");
const input = document.getElementById("chatInput");

// ==========================
// TOGGLE CHAT
// ==========================
toggle?.addEventListener("click", () => {
  container.classList.toggle("hidden");
});

// ==========================
// ENVIAR MENSAJE
// ==========================
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = addMessage("Escribiendo...", "bot");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typing.remove();

    addMessage(data.reply || "Error en respuesta", "bot");

  } catch (err) {
    typing.remove();
    addMessage("Error de conexión", "bot");
  }

  scrollBottom();
}

// ==========================
// MENSAJES UI PRO
// ==========================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;

  div.innerHTML = `<div class="bubble">${text}</div>`;

  messages.appendChild(div);
  return div;
}

// ==========================
// SCROLL AUTO
// ==========================
function scrollBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// ==========================
// ENTER PARA ENVIAR
// ==========================
input?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ==========================
// MENSAJE INICIAL PRO
// ==========================
window.addEventListener("load", () => {
  addMessage("Hola 👋 puedo ayudarte a crear una web o resolver dudas sobre tus proyectos.", "bot");
});