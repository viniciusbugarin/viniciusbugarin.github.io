const API_URL = "https://viniciusbugarin-github-io.vercel.app/api/chat";

// ==========================
// ELEMENTOS
// ==========================
const toggle = document.getElementById("chatToggle");
const container = document.getElementById("chatContainer");
const messages = document.getElementById("chatMessages");
const input = document.getElementById("chatInput");

// ==========================
// ESTADO
// ==========================
let isOpen = false;

// ==========================
// TOGGLE CHAT PRO
// ==========================
toggle?.addEventListener("click", () => {
  isOpen = !isOpen;
  container.classList.toggle("hidden");

  if (isOpen) {
    input?.focus();
  }
});

// ==========================
// GUARDADO LOCAL (UX PRO)
// ==========================
function saveChat() {
  localStorage.setItem("vb_chat_history", messages.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem("vb_chat_history");
  if (saved) messages.innerHTML = saved;
}

// ==========================
// MENSAJES UI PRO
// ==========================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;

  div.innerHTML = `
    <div class="bubble">
      ${text}
      <span class="time">${getTime()}</span>
    </div>
  `;

  messages.appendChild(div);
  scrollBottom();
  return div;
}

// ==========================
// TYPING INDICATOR PRO
// ==========================
function addTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";

  div.innerHTML = `
    <div class="bubble">
      <span></span><span></span><span></span>
    </div>
  `;

  messages.appendChild(div);
  scrollBottom();
  return div;
}

// ==========================
// ENVIAR MENSAJE (ULTRA PRO)
// ==========================
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = addTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) throw new Error("Error servidor");

    const data = await res.json();

    typing.remove();

    addMessage(
      data.reply || "No he podido responder correctamente.",
      "bot"
    );

  } catch (err) {
    typing.remove();

    addMessage(
      "⚠️ Error de conexión. Inténtalo de nuevo.",
      "bot"
    );

    console.error(err);
  }

  saveChat();
}

// ==========================
// QUICK RESPONSES (CONVERSIÓN)
// ==========================
function addQuickOptions() {
  const wrapper = document.createElement("div");
  wrapper.className = "quick-options";

  const options = [
    "Quiero una web",
    "Necesito automatizar un proceso",
    "Precio de una página web",
    "Ver proyectos"
  ];

  wrapper.innerHTML = options
    .map(opt => `<button>${opt}</button>`)
    .join("");

  wrapper.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.innerText;
      sendMessage();
    });
  });

  messages.appendChild(wrapper);
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
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ==========================
// TIEMPO MENSAJE
// ==========================
function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ==========================
// TRACKING (🔥 NEGOCIO REAL)
// ==========================
function trackEvent(event) {
  console.log("📊 Evento:", event);

  // Aquí puedes conectar con analytics
  // ejemplo: window.gtag(...)
}

// ==========================
// INIT
// ==========================
window.addEventListener("load", () => {
  loadChat();

  if (!messages.innerHTML) {
    addMessage(
      "Hola 👋 Soy el asistente de Vinicius.\n¿Quieres crear una web o automatizar algo?",
      "bot"
    );

    addQuickOptions();
  }

  input?.focus();

  trackEvent("chat_loaded");
});