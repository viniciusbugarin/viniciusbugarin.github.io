// ==========================
// CONFIG GLOBAL
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_v2",
  TIMEOUT: 10000
};

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", initChatbot);

function initChatbot() {

  // ==========================
  // INJECT HTML (SIEMPRE FLOAT)
  // ==========================
  const html = `
    <div id="chatbot-widget">

      <div id="chatContainer" class="hidden">

        <div id="chatHeader">
          <span>Asistente</span>
          <button id="chatClose">✕</button>
        </div>

        <div id="chatMessages"></div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Escribe tu mensaje..." />
          <button id="sendBtn">➤</button>
        </div>

      </div>

      <button id="chatToggle">💬</button>

    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  // ==========================
  // ELEMENTOS
  // ==========================
  const el = {
    toggle: document.getElementById("chatToggle"),
    close: document.getElementById("chatClose"),
    container: document.getElementById("chatContainer"),
    messages: document.getElementById("chatMessages"),
    input: document.getElementById("chatInput"),
    send: document.getElementById("sendBtn")
  };

  // ==========================
  // ESTADO
  // ==========================
  let isOpen = false;

  // ==========================
  // TOGGLE CHAT (UX PRO)
  // ==========================
  el.toggle.addEventListener("click", () => {
    isOpen = true;
    el.container.classList.remove("hidden");
    el.toggle.style.display = "none";
    focusInput(el.input);
  });

  el.close.addEventListener("click", () => {
    isOpen = false;
    el.container.classList.add("hidden");
    el.toggle.style.display = "block";
  });

  // ==========================
  // SEND MESSAGE
  // ==========================
  async function sendMessage() {
    const text = el.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    el.input.value = "";

    const typing = addTyping();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CHAT_CONFIG.TIMEOUT);

      const res = await fetch(CHAT_CONFIG.API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Error servidor");

      const data = await res.json();

      removeTyping(typing);

      await simulateTyping(data.reply || "No he podido responder.");

    } catch (err) {

      removeTyping(typing);

      if (err.name === "AbortError") {
        addMessage("⏱ El servidor tardó demasiado.", "bot");
      } else {
        addMessage("⚠️ Error de conexión.", "bot");
      }

      console.error(err);
    }

    saveChat();
  }

  // ==========================
  // MENSAJES
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

    el.messages.appendChild(div);
    scrollBottom(el.messages);
    return div;
  }

  // ==========================
  // TYPING INDICATOR
  // ==========================
  function addTyping() {
    const div = document.createElement("div");
    div.className = "msg bot typing";

    div.innerHTML = `
      <div class="bubble">
        <span></span><span></span><span></span>
      </div>
    `;

    el.messages.appendChild(div);
    scrollBottom(el.messages);
    return div;
  }

  function removeTyping(elm) {
    elm?.remove();
  }

  // ==========================
  // TYPING REALISTA (UX 🔥)
  // ==========================
  async function simulateTyping(text) {
    const div = addMessage("", "bot");
    const bubble = div.querySelector(".bubble");

    for (let i = 0; i < text.length; i++) {
      bubble.innerHTML = text.substring(0, i + 1) + `<span class="time">${getTime()}</span>`;
      await delay(10 + Math.random() * 25);
    }
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // ==========================
  // STORAGE
  // ==========================
  function saveChat() {
    localStorage.setItem(CHAT_CONFIG.STORAGE_KEY, el.messages.innerHTML);
  }

  function loadChat() {
    const saved = localStorage.getItem(CHAT_CONFIG.STORAGE_KEY);
    if (saved) el.messages.innerHTML = saved;
  }

  // ==========================
  // HELPERS
  // ==========================
  function scrollBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  function focusInput(input) {
    setTimeout(() => input.focus(), 200);
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
  }

  // ==========================
  // EVENTS
  // ==========================
  el.send.addEventListener("click", sendMessage);

  el.input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ==========================
  // INIT
  // ==========================
  loadChat();

  if (!el.messages.innerHTML) {
    addMessage("Hola 👋 ¿Quieres una web o automatizar tu negocio?", "bot");
  }

}