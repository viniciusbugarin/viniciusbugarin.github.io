// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  MAKE_WEBHOOK: "https://hook.eu1.make.com/2yahcl1bade5wz61gt54juj0zj2bdb7x",
  API_FALLBACK: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_ultra_final",
  AUTO_OPEN_DELAY: 4000,
  INACTIVITY_DELAY: 15000,
  DEBUG: true
};

// ==========================
// STATE
// ==========================
let state = JSON.parse(localStorage.getItem(CHAT_CONFIG.STORAGE_KEY)) || {
  isOpen: false,
  retries: 0,
  leadSent: false,
  lastInteraction: Date.now(),
  sessionId: Math.random().toString(36).substring(2),
  messages: [],
  lead: {
    need: null,
    budget: 0,
    urgency: null,
    contact: null,
    score: 0
  }
};

function saveState() {
  localStorage.setItem(CHAT_CONFIG.STORAGE_KEY, JSON.stringify(state));
}

// ==========================
// INIT
// ==========================
if (!window.__VB_CHAT_INIT__) {
  window.__VB_CHAT_INIT__ = true;
  document.addEventListener("DOMContentLoaded", initChatbot);
}

function initChatbot() {

  if (document.getElementById("vb-chatbot")) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="vb-chatbot">
      <div id="chatContainer">
        <div id="chatHeader">
          <strong>Vinicius</strong>
          <button id="chatClose">✕</button>
        </div>

        <div id="chatMessages"></div>
        <div id="chatOptions"></div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Escribe aquí..." />
          <button id="sendBtn">➤</button>
        </div>
      </div>

      <button id="chatToggle">💬</button>
    </div>
  `);

  const el = {
    toggle: document.getElementById("chatToggle"),
    close: document.getElementById("chatClose"),
    container: document.getElementById("chatContainer"),
    messages: document.getElementById("chatMessages"),
    input: document.getElementById("chatInput"),
    send: document.getElementById("sendBtn"),
    options: document.getElementById("chatOptions")
  };

  // ==========================
  // UI
  // ==========================
  function renderMessage(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    el.messages.appendChild(div);
  }

  function addMessage(text, type = "bot") {
    state.messages.push({ text, type });
    renderMessage(text, type);
    scrollBottom();
    state.lastInteraction = Date.now();
    saveState();
  }

  function showOptions(options) {
    el.options.innerHTML = "";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.label;

      btn.onclick = () => {
        addMessage(opt.label, "user");
        el.options.innerHTML = "";
        opt.action();
      };

      el.options.appendChild(btn);
    });
  }

  // ==========================
  // SCORING
  // ==========================
  function scoreLead() {
    let score = 0;

    if (state.lead.budget >= 1500) score += 3;
    if (state.lead.need === "automation") score += 4;
    if (state.lead.need === "web") score += 2;
    if (state.lead.urgency === "urgente") score += 3;
    if (state.lead.contact) score += 5;

    state.lead.score = score;
  }

  // ==========================
  // FLOW
  // ==========================
  function startFlow() {
    if (state.messages.length > 0) return;

    addMessage("👋 Te ayudo a conseguir clientes con webs y automatización.");

    showOptions([
      { label: "Quiero más clientes", action: () => stepNeed("web") },
      { label: "Automatizar negocio", action: () => stepNeed("automation") },
      { label: "Mejorar SEO", action: () => stepNeed("seo") }
    ]);
  }

  function stepNeed(type) {
    state.lead.need = type;

    addMessage("¿Qué presupuesto tienes?");
    showOptions([
      { label: "< 500€", action: () => stepBudget(500) },
      { label: "500€ - 1500€", action: () => stepBudget(1500) },
      { label: "+1500€", action: () => stepBudget(2000) }
    ]);
  }

  function stepBudget(budget) {
    state.lead.budget = budget;

    addMessage("¿Para cuándo lo necesitas?");
    showOptions([
      { label: "Urgente", action: () => stepUrgency("urgente") },
      { label: "Este mes", action: () => stepUrgency("media") },
      { label: "Sin prisa", action: () => stepUrgency("baja") }
    ]);
  }

  function stepUrgency(u) {
    state.lead.urgency = u;
    scoreLead();
    askContact();
  }

  function askContact() {
    addMessage("👉 Déjame tu email o WhatsApp y te digo exactamente cómo lo haría.");
  }

  // ==========================
  // CONTACT DETECTION
  // ==========================
  function extractContact(text) {
    const email = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const phone = text.match(/\b\d{9}\b/);
    return email?.[0] || phone?.[0] || null;
  }

  // ==========================
  // SEND LEAD (🔥 MAKE)
  // ==========================
  async function sendLead() {

    if (state.leadSent) return;

    const payload = {
      sessionId: state.sessionId,
      timestamp: new Date().toISOString(),
      ...state.lead
    };

    if (CHAT_CONFIG.DEBUG) {
      console.log("🚀 ENVIANDO LEAD:", payload);
    }

    try {
      // 🔥 ENVÍO DIRECTO A MAKE
      await fetch(CHAT_CONFIG.MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      state.leadSent = true;

    } catch (err) {
      console.error("Error Make:", err);

      // fallback API
      try {
        await fetch(CHAT_CONFIG.API_FALLBACK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch {}
    }

    saveState();
  }

  // ==========================
  // HANDLE INPUT
  // ==========================
  async function sendMessage() {
    const text = el.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    el.input.value = "";

    const contact = extractContact(text);

    if (contact && !state.leadSent) {
      state.lead.contact = contact;
      scoreLead();

      addMessage("🔥 Perfecto. Te contacto ahora mismo.");
      await sendLead();
      return;
    }

    addMessage("👍 Entendido. Sigue...");
  }

  el.send.onclick = sendMessage;

  el.input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ==========================
  // AUTO OPEN
  // ==========================
  setTimeout(() => {
    if (!state.isOpen) {
      el.container.classList.add("active");
      addMessage("👋 ¿Quieres más clientes o automatizar tu negocio?");
    }
  }, CHAT_CONFIG.AUTO_OPEN_DELAY);

  function scrollBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  startFlow();
}