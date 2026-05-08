/* =========================================
   VINICIUS BUGARIN — AI CHAT SYSTEM
   ULTRA PRO FINAL VERSION
========================================= */

/* =========================================
   CONFIG
========================================= */

const CHAT_CONFIG = {

  webhook:
    "https://hook.eu1.make.com/XXXXXXXX",

  storageKey:
    "vb_ultra_chat_v4",

  autoOpenDelay:
    5000,

  inactivityDelay:
    45000,

  typingDelay:
    1200,

  debug:
    true
};

/* =========================================
   STATE
========================================= */

const state =
  JSON.parse(
    localStorage.getItem(CHAT_CONFIG.storageKey)
  ) || {

    isOpen: false,

    leadSent: false,

    lastInteraction: Date.now(),

    sessionId:
      crypto.randomUUID(),

    messages: [],

    lead: {

      need: null,
      budget: null,
      urgency: null,
      contact: null,
      score: 0
    }
};

function saveState() {

  localStorage.setItem(
    CHAT_CONFIG.storageKey,
    JSON.stringify(state)
  );
}

/* =========================================
   ELEMENTS
========================================= */

const el = {

  chatbot:
    document.getElementById("vb-chatbot"),

  container:
    document.getElementById("chatContainer"),

  toggle:
    document.getElementById("chatToggle"),

  close:
    document.getElementById("chatClose"),

  messages:
    document.getElementById("chatMessages"),

  options:
    document.getElementById("chatOptions"),

  input:
    document.getElementById("chatInput"),

  send:
    document.getElementById("sendBtn")
};

/* =========================================
   HELPERS
========================================= */

function log(...msg) {

  if (CHAT_CONFIG.debug) {
    console.log("[VB CHAT]", ...msg);
  }
}

function scrollBottom() {

  requestAnimationFrame(() => {

    el.messages.scrollTop =
      el.messages.scrollHeight;

  });
}

function sanitize(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* =========================================
   TRACKING
========================================= */

function track(event, data = {}) {

  log("TRACK:", event, data);

  if (window.gtag) {

    gtag("event", event, data);

  }
}

/* =========================================
   RENDER MESSAGE
========================================= */

function renderMessage(text, type = "bot") {

  const div = document.createElement("div");

  div.className = `msg ${type}`;

  div.innerHTML = `
    <div class="bubble">
      ${text}
    </div>
  `;

  el.messages.appendChild(div);

  scrollBottom();
}

function addMessage(text, type = "bot") {

  state.messages.push({ text, type });

  renderMessage(text, type);

  state.lastInteraction = Date.now();

  saveState();
}

/* =========================================
   BOT TYPING
========================================= */

function botTyping(callback) {

  const typing = document.createElement("div");

  typing.className = "msg bot typing";

  typing.innerHTML = `
    <div class="bubble">
      Escribiendo...
    </div>
  `;

  el.messages.appendChild(typing);

  scrollBottom();

  setTimeout(() => {

    typing.remove();

    callback();

  }, CHAT_CONFIG.typingDelay);
}

/* =========================================
   CHAT OPEN/CLOSE
========================================= */

function openChat() {

  state.isOpen = true;

  el.container.classList.add("active");

  el.toggle.classList.add("active");

  document.body.classList.add("chat-open");

  saveState();

  track("chat_open");

  setTimeout(() => {

    el.input.focus();

  }, 250);
}

function closeChat() {

  state.isOpen = false;

  el.container.classList.remove("active");

  el.toggle.classList.remove("active");

  document.body.classList.remove("chat-open");

  saveState();

  track("chat_close");
}

function toggleChat() {

  state.isOpen
    ? closeChat()
    : openChat();
}

/* =========================================
   OPTIONS
========================================= */

function showOptions(options = []) {

  el.options.innerHTML = "";

  options.forEach(option => {

    const btn =
      document.createElement("button");

    btn.innerText = option.label;

    btn.onclick = () => {

      addMessage(
        sanitize(option.label),
        "user"
      );

      el.options.innerHTML = "";

      option.action();
    };

    el.options.appendChild(btn);
  });
}

/* =========================================
   LEAD SCORE
========================================= */

function scoreLead() {

  let score = 0;

  if (state.lead.need === "automation")
    score += 5;

  if (state.lead.need === "web")
    score += 3;

  if (state.lead.budget >= 1500)
    score += 4;

  if (state.lead.urgency === "urgent")
    score += 3;

  if (state.lead.contact)
    score += 5;

  state.lead.score = score;
}

/* =========================================
   FLOW
========================================= */

function startFlow() {

  if (state.messages.length > 0)
    return;

  botTyping(() => {

    addMessage(`
      👋 Hola.

      Te ayudo a:
      <br><br>

      • conseguir más clientes
      <br>
      • automatizar procesos
      <br>
      • mejorar tu web
      <br>
      • posicionarte en Google
    `);

    showOptions([

      {
        label: "Quiero más clientes",
        action: () => stepNeed("web")
      },

      {
        label: "Automatizar negocio",
        action: () => stepNeed("automation")
      },

      {
        label: "Mejorar SEO",
        action: () => stepNeed("seo")
      }
    ]);
  });
}

function stepNeed(type) {

  state.lead.need = type;

  botTyping(() => {

    addMessage(`
      💰 ¿Qué presupuesto tienes?
    `);

    showOptions([

      {
        label: "< 500€",
        action: () => stepBudget(500)
      },

      {
        label: "500€ - 1500€",
        action: () => stepBudget(1500)
      },

      {
        label: "+1500€",
        action: () => stepBudget(3000)
      }
    ]);
  });
}

function stepBudget(value) {

  state.lead.budget = value;

  botTyping(() => {

    addMessage(`
      ⏳ ¿Cuándo quieres empezar?
    `);

    showOptions([

      {
        label: "Urgente",
        action: () => stepUrgency("urgent")
      },

      {
        label: "Este mes",
        action: () => stepUrgency("medium")
      },

      {
        label: "Sin prisa",
        action: () => stepUrgency("low")
      }
    ]);
  });
}

function stepUrgency(level) {

  state.lead.urgency = level;

  scoreLead();

  askContact();
}

function askContact() {

  botTyping(() => {

    addMessage(`
      🔥 Perfecto.

      Déjame tu email o WhatsApp
      y te responderé personalmente.
    `);
  });
}

/* =========================================
   CONTACT DETECTION
========================================= */

function extractContact(text) {

  const email =
    text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);

  const phone =
    text.match(/\b\d{9,15}\b/);

  return email?.[0] ||
         phone?.[0] ||
         null;
}

/* =========================================
   SEND LEAD
========================================= */

async function sendLead() {

  if (state.leadSent)
    return;

  const payload = {

    sessionId:
      state.sessionId,

    createdAt:
      new Date().toISOString(),

    lead:
      state.lead,

    messages:
      state.messages
  };

  try {

    await fetch(
      CHAT_CONFIG.webhook,
      {

        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body:
          JSON.stringify(payload)
      }
    );

    state.leadSent = true;

    saveState();

    track("lead_sent");

    log("Lead enviado");

  } catch (error) {

    console.error(error);

    track("lead_error");
  }
}

/* =========================================
   USER INPUT
========================================= */

async function handleMessage() {

  const text =
    el.input.value.trim();

  if (!text)
    return;

  addMessage(
    sanitize(text),
    "user"
  );

  el.input.value = "";

  const contact =
    extractContact(text);

  if (
    contact &&
    !state.leadSent
  ) {

    state.lead.contact =
      contact;

    scoreLead();

    botTyping(async () => {

      addMessage(`
        🚀 Perfecto.

        He recibido tu contacto.

        Te responderé lo antes posible.
      `);

      await sendLead();
    });

    return;
  }

  botTyping(() => {

    addMessage(`
      👍 Entendido.

      Cuéntame un poco más.
    `);

  });
}

/* =========================================
   EVENTS
========================================= */

el.toggle.addEventListener(
  "click",
  toggleChat
);

el.close.addEventListener(
  "click",
  closeChat
);

el.send.addEventListener(
  "click",
  handleMessage
);

el.input.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

      handleMessage();
    }
  }
);

/* =========================================
   ESC CLOSE
========================================= */

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape" &&
      state.isOpen
    ) {

      closeChat();
    }
  }
);

/* =========================================
   AUTO OPEN
========================================= */

setTimeout(() => {

  if (
    !state.isOpen &&
    state.messages.length === 0
  ) {

    openChat();

    startFlow();
  }

}, CHAT_CONFIG.autoOpenDelay);

/* =========================================
   INACTIVITY REMINDER
========================================= */

setInterval(() => {

  const inactiveTime =
    Date.now() -
    state.lastInteraction;

  if (
    state.isOpen &&
    inactiveTime >
    CHAT_CONFIG.inactivityDelay
  ) {

    botTyping(() => {

      addMessage(`
        👋 ¿Sigues ahí?

        Puedo ayudarte a mejorar
        tu web o automatizar tareas.
      `);

    });

    state.lastInteraction =
      Date.now();

    saveState();
  }

}, 15000);

/* =========================================
   RESTORE CHAT
========================================= */

if (state.isOpen) {

  openChat();
}

if (state.messages.length > 0) {

  state.messages.forEach(msg => {

    renderMessage(
      msg.text,
      msg.type
    );

  });

  scrollBottom();
}