// ==========================
// CONFIG PRO
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_v3",
  TIMEOUT: 10000
};

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", initChatbot);

function initChatbot() {

  // evitar duplicados
  if (document.getElementById("chatbot-widget")) return;

  // ==========================
  // HTML PRO (CON QUICK ACTIONS)
  // ==========================
  const html = `
    <div id="chatbot-widget">

      <div id="chatContainer" class="hidden">

        <div id="chatHeader">
          <span>Asistente experto</span>
          <button id="chatClose">✕</button>
        </div>

        <div id="chatMessages"></div>

        <!-- QUICK ACTIONS -->
        <div id="quickActions" class="quick-actions"></div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Cuéntame tu proyecto..." />
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
    send: document.getElementById("sendBtn"),
    quick: document.getElementById("quickActions")
  };

  let isOpen = false;

  // ==========================
  // TOGGLE
  // ==========================
  el.toggle.onclick = () => {
    isOpen = true;
    el.container.classList.remove("hidden");
    el.toggle.style.display = "none";
    focusInput();
  };

  el.close.onclick = () => {
    isOpen = false;
    el.container.classList.add("hidden");
    el.toggle.style.display = "block";
  };

  // ==========================
  // QUICK ACTIONS (CLAVE VENTAS)
  // ==========================
  function renderQuickActions(options = []) {
    el.quick.innerHTML = "";

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quick-btn";
      btn.textContent = opt;
      btn.onclick = () => sendMessage(opt);
      el.quick.appendChild(btn);
    });
  }

  // ==========================
  // MENSAJE
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
    scrollBottom();
    return div;
  }

  // ==========================
  // TYPING
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
    scrollBottom();
    return div;
  }

  // ==========================
  // SEND (ULTRA PRO)
  // ==========================
  async function sendMessage(customText = null) {

    const text = customText || el.input.value.trim();
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

      const data = await res.json();
      typing.remove();

      await simulateTyping(data.reply);

      // 🔥 lógica vendedor
      handleSalesFlow(text);

    } catch {
      typing.remove();
      addMessage("⚠️ Error de conexión.", "bot");
    }

    saveChat();
  }

  // ==========================
  // SALES FLOW (🔥 CLAVE)
  // ==========================
  function handleSalesFlow(text) {
    const t = text.toLowerCase();

    if (t.includes("precio") || t.includes("cuánto")) {
      renderQuickActions([
        "Web básica",
        "Tienda online",
        "Automatización"
      ]);
    }

    else if (t.includes("web")) {
      renderQuickActions([
        "Landing page",
        "Web empresa",
        "Aplicación web"
      ]);
    }

    else if (t.includes("automat")) {
      renderQuickActions([
        "Automatizar clientes",
        "Automatizar tareas",
        "Integrar sistemas"
      ]);
    }

    else {
      renderQuickActions([
        "Quiero una web",
        "Necesito automatizar",
        "Ver precios"
      ]);
    }
  }

  // ==========================
  // TYPING REALISTA
  // ==========================
  async function simulateTyping(text) {
    const div = addMessage("", "bot");
    const bubble = div.querySelector(".bubble");

    for (let i = 0; i < text.length; i++) {
      bubble.innerHTML =
        text.substring(0, i + 1) +
        `<span class="time">${getTime()}</span>`;
      await delay(10 + Math.random() * 20);
    }
  }

  const delay = ms => new Promise(r => setTimeout(r, ms));

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
  function scrollBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  function focusInput() {
    setTimeout(() => el.input.focus(), 200);
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // ==========================
  // EVENTS
  // ==========================
  el.send.onclick = () => sendMessage();

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
    addMessage(
      "Hola 👋 ¿Quieres una web o automatizar tu negocio?",
      "bot"
    );

    renderQuickActions([
      "Quiero una web",
      "Necesito automatizar",
      "Ver precios"
    ]);
  }
}