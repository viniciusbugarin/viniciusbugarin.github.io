// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_ultra",
  AUTO_OPEN_DELAY: 5000
};

// ==========================
// STATE GLOBAL
// ==========================
let state = {
  isOpen: false,
  step: "start",
  lead: {
    need: null,
    budget: 0,
    urgency: null,
    contact: null,
    score: 0
  }
};

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
  }

  function closeChat() {
    state.isOpen = false;
    el.container.classList.remove("active");
    el.toggle.textContent = "💬";
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
  // SCORING
  // ==========================
  function scoreLead() {
    let score = 0;
    if (state.lead.budget >= 1500) score += 3;
    if (state.lead.need === "web") score += 2;
    if (state.lead.urgency === "urgente") score += 2;
    if (state.lead.contact) score += 3;

    state.lead.score = score;
  }

  // ==========================
  // FLOW
  // ==========================
  function startFlow() {
    addMessage("👋 Te ayudo a conseguir clientes con webs y automatización.");

    showOptions([
      { label: "Quiero clientes", action: () => stepNeed("web") },
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
    if (state.lead.score >= 6) {
      addMessage("🔥 Esto encaja muy bien.\n\n👉 Déjame tu email o WhatsApp y te explico cómo lo haría.");
    } else {
      addMessage("👉 Cuéntame tu email y te doy una propuesta clara.");
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

      addMessage("🔥 Perfecto. Te contacto en breve.");

      sendLeadToAPI();
    }
  }

  // ==========================
  // SEND LEAD REAL
  // ==========================
  async function sendLeadToAPI() {
    try {
      await fetch(CHAT_CONFIG.API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: "Nuevo lead",
          lead: state.lead
        })
      });
    } catch (e) {
      console.log("Error enviando lead");
    }
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
        body: JSON.stringify({ message: text })
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
  // INIT
  // ==========================
  startFlow();
}