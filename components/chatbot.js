// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_ultra",
  AUTO_OPEN_DELAY: 5000
};

// ==========================
// LOCALE + €
// ==========================
const USER_LOCALE = navigator.language || "es-ES";

function formatPrice(amount) {
  return new Intl.NumberFormat(USER_LOCALE, {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

// ==========================
// LEAD SYSTEM (🔥 CLAVE)
// ==========================
let lead = {
  need: null,
  budget: 0,
  urgency: null,
  contact: null,
  score: 0
};

function scoreLead() {
  let score = 0;

  if (lead.budget >= 1500) score += 3;
  if (lead.need === "web") score += 2;
  if (lead.urgency === "urgente") score += 2;
  if (lead.contact) score += 3;

  lead.score = score;
  console.log("LEAD SCORE:", score);
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
          <div class="chat-user">
            <span class="avatar">VB</span>
            <div>
              <strong>Vinicius</strong>
              <span class="status">Online</span>
            </div>
          </div>
          <button id="chatClose">✕</button>
        </div>

        <div id="chatMessages"></div>
        <div id="chatOptions" class="chat-options"></div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Escribe tu mensaje..." />
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

  let isOpen = false;

  function openChat() {
    isOpen = true;
    el.container.classList.add("active");
    el.toggle.textContent = "✕";
    document.body.style.overflow = "hidden";
    focusInput();
  }

  function closeChat() {
    isOpen = false;
    el.container.classList.remove("active");
    el.toggle.textContent = "💬";
    document.body.style.overflow = "";
  }

  el.toggle.onclick = () => isOpen ? closeChat() : openChat();
  el.close.onclick = closeChat;

  // ==========================
  // MENSAJES
  // ==========================
  function addMessage(text, type = "bot") {
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
  // FLOW PRO (VENTAS 🔥)
// ==========================
function startFlow() {
  addMessage("👋 Soy Vinicius.\n\nTe ayudo a conseguir clientes con webs y automatización.");

  showOptions([
    { label: "Quiero más clientes", action: () => stepNeed("web") },
    { label: "Automatizar negocio", action: () => stepNeed("automation") },
    { label: "Mejorar SEO", action: () => stepNeed("seo") }
  ]);
}

function stepNeed(type) {
  lead.need = type;

  addMessage("¿Qué presupuesto tienes?");

  showOptions([
    { label: `Menos de ${formatPrice(500)}`, action: () => stepBudget(500) },
    { label: `${formatPrice(500)} - ${formatPrice(1500)}`, action: () => stepBudget(1500) },
    { label: `Más de ${formatPrice(1500)}`, action: () => stepBudget(2000) }
  ]);
}

function stepBudget(amount) {
  lead.budget = amount;

  addMessage("¿Para cuándo lo necesitas?");

  showOptions([
    { label: "Urgente", action: () => stepUrgency("urgente") },
    { label: "Este mes", action: () => stepUrgency("media") },
    { label: "Sin prisa", action: () => stepUrgency("baja") }
  ]);
}

function stepUrgency(u) {
  lead.urgency = u;

  scoreLead();
  closeSale();
}

function closeSale() {

  if (lead.score >= 6) {
    addMessage(
      "🔥 Esto tiene muy buena pinta.\n\n👉 Déjame tu email o WhatsApp y te explico cómo lo haría paso a paso."
    );
  } else {
    addMessage(
      "👌 Cuéntame tu caso y te doy una solución clara."
    );
  }
}

  // ==========================
  // LEADS
  // ==========================
  function handleLead(text) {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /[0-9]{9}/;

    if (emailRegex.test(text) || phoneRegex.test(text)) {

      lead.contact = text;
      scoreLead();

      addMessage("🔥 Perfecto. Te contacto en breve.");

      console.log("LEAD REAL:", lead);

      // 👉 aquí conectas webhook si quieres
    }
  }

  // ==========================
  // SEND
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
      addMessage(data.reply || "No he podido responder.");

    } catch {
      addMessage("⚠️ Error de conexión.");
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
    if (!localStorage.getItem("vb_seen")) {
      openChat();
      addMessage("👋 ¿Estás buscando una web o automatizar algo?");
      localStorage.setItem("vb_seen", "true");
    }
  }, CHAT_CONFIG.AUTO_OPEN_DELAY);

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
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
  }

  // ==========================
  // INIT
  // ==========================
  startFlow();
}