/* =========================================
   VINICIUS BUGARIN — AI CHAT SYSTEM v6
   OPTIMIZED + SAFE + CONVERSION FOCUSED
========================================= */

/* =========================================
   CONFIG
========================================= */

const CHAT_CONFIG = {
  webhook:
    "https://hook.eu1.make.com/XXXXXXXX",

  storageKey:
    "vb_ultra_chat_v6",

  autoOpenDelay:
    6000,

  inactivityDelay:
    45000,

  typingDelay:
    900,

  maxMessages:
    60,

  debug:
    false
};

/* =========================================
   DEFAULT STATE
========================================= */

const defaultState = {
  isOpen: false,

  leadSent: false,

  lastInteraction:
    Date.now(),

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

let state =
  structuredClone(defaultState);

/* =========================================
   STORAGE
========================================= */

function loadState() {

  try {

    const saved =
      localStorage.getItem(
        CHAT_CONFIG.storageKey
      );

    if (!saved) {
      return;
    }

    const parsed =
      JSON.parse(saved);

    state = {
      ...defaultState,
      ...parsed
    };

  } catch (error) {

    console.error(
      "[VB CHAT] Storage error:",
      error
    );

    state =
      structuredClone(
        defaultState
      );
  }
}

function saveState() {

  try {

    const trimmedMessages =
      state.messages.slice(
        -CHAT_CONFIG.maxMessages
      );

    localStorage.setItem(
      CHAT_CONFIG.storageKey,
      JSON.stringify({
        ...state,
        messages:
          trimmedMessages
      })
    );

  } catch (error) {

    console.error(
      "[VB CHAT] Save error:",
      error
    );
  }
}

loadState();

/* =========================================
   ELEMENTS
========================================= */

const el = {
  chatbot:
    document.getElementById(
      "vb-chatbot"
    ),

  container:
    document.getElementById(
      "chatContainer"
    ),

  toggle:
    document.getElementById(
      "chatToggle"
    ),

  close:
    document.getElementById(
      "chatClose"
    ),

  messages:
    document.getElementById(
      "chatMessages"
    ),

  options:
    document.getElementById(
      "chatOptions"
    ),

  input:
    document.getElementById(
      "chatInput"
    ),

  send:
    document.getElementById(
      "sendBtn"
    )
};

/* =========================================
   VALIDATION
========================================= */

const chatbotReady =
  Object.values(el).every(Boolean);

if (!chatbotReady) {

  console.warn(
    "[VB CHAT] Missing HTML elements."
  );

} else {

  initChatbot();
}

/* =========================================
   INIT
========================================= */

function initChatbot() {

  log("Initialized");

  bindEvents();

  restoreChat();

  autoOpen();

  inactivitySystem();

  startFlow();
}

/* =========================================
   HELPERS
========================================= */

function log(...msg) {

  if (CHAT_CONFIG.debug) {

    console.log(
      "[VB CHAT]",
      ...msg
    );
  }
}

function sanitize(text = "") {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

function scrollBottom() {

  requestAnimationFrame(() => {

    el.messages.scrollTop =
      el.messages.scrollHeight;

  });
}

function updateInteraction() {

  state.lastInteraction =
    Date.now();

  saveState();
}

function track(
  event,
  data = {}
) {

  log("TRACK:", event, data);

  if (
    typeof window.gtag ===
    "function"
  ) {

    window.gtag(
      "event",
      event,
      data
    );
  }
}

/* =========================================
   RENDER
========================================= */

function renderMessage(
  text,
  type = "bot"
) {

  const wrapper =
    document.createElement("div");

  wrapper.className =
    `msg ${type}`;

  wrapper.innerHTML = `
    <div class="bubble">
      ${text}
    </div>
  `;

  el.messages.appendChild(
    wrapper
  );

  scrollBottom();
}

function addMessage(
  text,
  type = "bot"
) {

  const safeText =
    type === "user"
      ? sanitize(text)
      : text;

  state.messages.push({
    text: safeText,
    type
  });

  renderMessage(
    safeText,
    type
  );

  updateInteraction();
}

/* =========================================
   TYPING
========================================= */

function botTyping(callback) {

  const typing =
    document.createElement("div");

  typing.className =
    "msg bot typing";

  typing.innerHTML = `
    <div class="bubble typing-bubble">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  el.messages.appendChild(
    typing
  );

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

  el.container.classList.add(
    "active"
  );

  el.toggle.classList.add(
    "active"
  );

  document.body.classList.add(
    "chat-open"
  );

  saveState();

  track("chat_open");

  setTimeout(() => {

    el.input.focus();

  }, 300);
}

function closeChat() {

  state.isOpen = false;

  el.container.classList.remove(
    "active"
  );

  el.toggle.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "chat-open"
  );

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

function showOptions(
  options = []
) {

  el.options.innerHTML = "";

  options.forEach(option => {

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "chat-option-btn";

    button.textContent =
      option.label;

    button.addEventListener(
      "click",
      () => {

        addMessage(
          option.label,
          "user"
        );

        el.options.innerHTML =
          "";

        option.action();
      }
    );

    el.options.appendChild(
      button
    );
  });
}

/* =========================================
   LEAD SCORE
========================================= */

function scoreLead() {

  let score = 0;

  switch (
    state.lead.need
  ) {

    case "automation":
      score += 5;
      break;

    case "web":
      score += 4;
      break;

    case "seo":
      score += 4;
      break;
  }

  if (
    state.lead.budget >=
    1500
  ) {
    score += 4;
  }

  if (
    state.lead.urgency ===
    "urgent"
  ) {
    score += 3;
  }

  if (
    state.lead.contact
  ) {
    score += 5;
  }

  state.lead.score =
    score;

  saveState();
}

/* =========================================
   FLOW
========================================= */

function startFlow() {

  if (
    state.messages.length > 0
  ) {
    return;
  }

  botTyping(() => {

    addMessage(`
      👋 Hola.

      Soy el asistente virtual de Vinicius.

      Puedo ayudarte con:

      <br><br>

      • Desarrollo web moderno
      <br>
      • SEO técnico
      <br>
      • Automatización
      <br>
      • Optimización de negocio
    `);

    showOptions([
      {
        label:
          "🚀 Quiero más clientes",

        action: () =>
          stepNeed("web")
      },

      {
        label:
          "🤖 Automatizar negocio",

        action: () =>
          stepNeed(
            "automation"
          )
      },

      {
        label:
          "📈 Mejorar SEO",

        action: () =>
          stepNeed("seo")
      }
    ]);
  });
}

function stepNeed(type) {

  state.lead.need =
    type;

  saveState();

  botTyping(() => {

    addMessage(`
      💰 ¿Qué presupuesto aproximado tienes?
    `);

    showOptions([
      {
        label:
          "Menos de 500€",

        action: () =>
          stepBudget(500)
      },

      {
        label:
          "500€ - 1500€",

        action: () =>
          stepBudget(1500)
      },

      {
        label:
          "Más de 1500€",

        action: () =>
          stepBudget(3000)
      }
    ]);
  });
}

function stepBudget(value) {

  state.lead.budget =
    value;

  saveState();

  botTyping(() => {

    addMessage(`
      ⏳ ¿Cuándo quieres empezar?
    `);

    showOptions([
      {
        label:
          "🔥 Lo antes posible",

        action: () =>
          stepUrgency(
            "urgent"
          )
      },

      {
        label:
          "📅 Este mes",

        action: () =>
          stepUrgency(
            "medium"
          )
      },

      {
        label:
          "👌 Sin prisa",

        action: () =>
          stepUrgency("low")
      }
    ]);
  });
}

function stepUrgency(level) {

  state.lead.urgency =
    level;

  scoreLead();

  askContact();
}

function askContact() {

  botTyping(() => {

    addMessage(`
      🚀 Perfecto.

      Déjame tu email o WhatsApp
      y Vinicius te responderá personalmente.
    `);
  });
}

/* =========================================
   CONTACT DETECTION
========================================= */

function extractContact(text) {

  const email =
    text.match(
      /[^\s@]+@[^\s@]+\.[^\s@]+/
    );

  const phone =
    text.match(
      /\+?\d[\d\s-]{7,15}/
    );

  return (
    email?.[0] ||
    phone?.[0] ||
    null
  );
}

/* =========================================
   SEND LEAD
========================================= */

async function sendLead() {

  if (
    state.leadSent
  ) {
    return;
  }

  const payload = {
    sessionId:
      state.sessionId,

    createdAt:
      new Date()
        .toISOString(),

    url:
      window.location.href,

    userAgent:
      navigator.userAgent,

    lead:
      state.lead,

    messages:
      state.messages
  };

  try {

    const response =
      await fetch(
        CHAT_CONFIG.webhook,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              payload
            )
        }
      );

    if (!response.ok) {

      throw new Error(
        "Webhook error"
      );
    }

    state.leadSent =
      true;

    saveState();

    track(
      "lead_sent",
      {
        score:
          state.lead.score
      }
    );

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

  if (!text) {
    return;
  }

  addMessage(
    text,
    "user"
  );

  el.input.value =
    "";

  const contact =
    extractContact(text);

  if (
    contact &&
    !state.leadSent
  ) {

    state.lead.contact =
      contact;

    scoreLead();

    botTyping(
      async () => {

        addMessage(`
          ✅ Perfecto.

          He recibido tu contacto.

          Te responderemos lo antes posible.
        `);

        await sendLead();
      }
    );

    return;
  }

  botTyping(() => {

    addMessage(`
      👍 Entendido.

      Cuéntame un poco más sobre tu proyecto.
    `);

  });
}

/* =========================================
   EVENTS
========================================= */

function bindEvents() {

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
    e => {

      if (
        e.key === "Enter"
      ) {

        e.preventDefault();

        handleMessage();
      }
    }
  );

  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key ===
          "Escape" &&
        state.isOpen
      ) {

        closeChat();
      }
    }
  );
}

/* =========================================
   AUTO OPEN
========================================= */

function autoOpen() {

  setTimeout(() => {

    if (
      !state.isOpen &&
      state.messages.length ===
        0
    ) {

      openChat();
    }

  }, CHAT_CONFIG.autoOpenDelay);
}

/* =========================================
   INACTIVITY
========================================= */

function inactivitySystem() {

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

          Puedo ayudarte a mejorar tu web,
          automatizar procesos o captar más clientes.
        `);

      });

      updateInteraction();
    }

  }, 15000);
}

/* =========================================
   RESTORE
========================================= */

function restoreChat() {

  if (
    state.messages.length > 0
  ) {

    state.messages.forEach(
      message => {

        renderMessage(
          message.text,
          message.type
        );
      }
    );

    scrollBottom();
  }

  if (state.isOpen) {

    openChat();
  }
}