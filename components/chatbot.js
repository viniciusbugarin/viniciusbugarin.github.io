// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_ultra_v2",
  AUTO_OPEN_DELAY: 4000
};

// ==========================
// STATE GLOBAL (PERSISTENTE)
// ==========================
let state = JSON.parse(localStorage.getItem(CHAT_CONFIG.STORAGE_KEY)) || {
  isOpen: false,
  step: "start",
  retries: 0,
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
// INIT SAFE
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
  // TOGGLE
  // ==========================
  function openChat() {
    state.isOpen = true;
    el.container.classList.add("active");
    el.toggle.textContent = "✕";
    saveState();
  }

  function closeChat() {
    state.isOpen = false;
    el.container.classList.remove("active");
    el.toggle.textContent = "💬";
    saveState();
  }

  el.toggle.onclick = () => state.isOpen ? closeChat() : openChat();
  el.close.onclick = closeChat;

  // ==========================
  // MENSAJES
  // ==========================
  function addMessage(text, type = "bot") {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    el.messages.appendChild(div);
    scrollBottom();
  }

  // ==========================
  // OPCIONES
  // ==========================
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
  // SCORING PRO
  // ==========================
  function scoreLead() {
    let score = 0;

    if (state.lead.budget >= 1500) score += 3;
    if (state.lead.need === "web") score += 2;
    if (state.lead.need === "automation") score += 3;
    if (state.lead.urgency === "urgente") score += 3;
    if (state.lead.contact) score += 5;

    state.lead.score = score;
    saveState();
  }

  // ==========================
  // FLOW VENTAS
  // ==========================
  function startFlow() {

    if (state.step !== "start") return;

    addMessage("👋 Te ayudo a conseguir clientes con webs y automatización.");

    showOptions([
      { label: "Quiero más clientes", action: () => stepNeed("web") },
      { label: "Automatizar negocio", action: () => stepNeed("automation") },
      { label: "Mejorar SEO", action: () => stepNeed("seo") }
    ]);
  }

  function stepNeed(type) {
    state.lead.need = type;
    state.step = "budget";
    saveState();

    addMessage("¿Qué presupuesto tienes?");

    showOptions([
      { label: "< 500€", action: () => stepBudget(500) },
      { label: "500€ - 1500€", action: () => stepBudget(1500) },
      { label: "+1500€", action: () => stepBudget(2000) }
    ]);
  }

  function stepBudget(budget) {
    state.lead.budget = budget;
    state.step = "urgency";
    saveState();

    addMessage("¿Para cuándo lo necesitas?");

    showOptions([
      { label: "Urgente", action: () => stepUrgency("urgente") },
      { label: "Este mes", action: () => stepUrgency("media") },
      { label: "Sin prisa", action: () => stepUrgency("baja") }
    ]);
  }

  function stepUrgency(u) {
    state.lead.urgency = u;
    state.step = "contact";
    scoreLead();

    askContact();
  }

  function askContact() {

    if (state.lead.score >= 7) {
      addMessage("🔥 Esto encaja perfecto.\n\n👉 Déjame tu WhatsApp o email y lo vemos hoy mismo.");
    } else {
      addMessage("👉 Déjame tu email y te doy una propuesta clara.");
    }
  }

  // ==========================
  // DETECT CONTACT
  // ==========================
  function extractContact(text) {
    const email = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const phone = text.match(/\b\d{9}\b/);

    return email?.[0] || phone?.[0] || null;
  }

  function handleLead(text) {
    const contact = extractContact(text);

    if (contact) {
      state.lead.contact = contact;
      scoreLead();

      addMessage("🔥 Perfecto. Te contacto ahora mismo.");

      sendLeadToAPI();
      saveState();
    } else {
      retryClose();
    }
  }

  // ==========================
  // REINTENTO CIERRE (🔥 CLAVE)
  // ==========================
  function retryClose() {

    if (state.step !== "contact") return;

    state.retries++;

    if (state.retries === 1) {
      addMessage("👉 Solo necesito tu email para enviarte la propuesta.");
    }

    if (state.retries === 2) {
      addMessage("🚀 Te digo exactamente qué haría en tu caso, sin compromiso.");
    }

    if (state.retries >= 3) {
      addMessage("👉 Último paso: déjame tu contacto y lo vemos.");
    }

    saveState();
  }

  // ==========================
  // SEND LEAD (CRM)
  // ==========================
  async function sendLeadToAPI() {
    try {
      await fetch(CHAT_CONFIG.API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: "lead",
          lead: state.lead
        })
      });
    } catch {}
  }

  // ==========================
  // SEND MESSAGE
  // ==========================
  async function sendMessage() {
    const text = el.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    el.input.value = "";

    handleLead(text);

    try {
      const res = await fetch(CHAT_CONFIG.API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text, lead: state.lead })
      });

      const data = await res.json();
      addMessage(data.reply);

    } catch {
      addMessage("⚠️ Error conexión");
    }
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
      openChat();
      addMessage("👋 ¿Quieres conseguir más clientes o automatizar tu negocio?");
    }
  }, CHAT_CONFIG.AUTO_OPEN_DELAY);

  // ==========================
  // HELPERS
  // ==========================
  function scrollBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  // ==========================
  // INIT
  // ==========================
  startFlow();
}