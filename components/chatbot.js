// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_pro",
  TIMEOUT: 10000
};

// ==========================
// STATE (CLAVE PRO)
// ==========================
let chatState = {
  step: "start",
  data: {}
};

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", initChatbot);

function initChatbot() {

  // ==========================
  // HTML (FLOAT REAL)
  // ==========================
  const html = `
    <div id="vb-chatbot">

      <div id="chatContainer" class="hidden">

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
    options: document.getElementById("chatOptions")
  };

  // ==========================
  // TOGGLE
  // ==========================
  let isOpen = false;

el.toggle.addEventListener("click", toggleChat);
el.close.addEventListener("click", toggleChat);

function toggleChat() {
  isOpen = !isOpen;

  if (isOpen) {
    openChat();
  } else {
    closeChat();
  }
}

function openChat() {
  el.container.classList.add("active");
  el.toggle.textContent = "✕";
  document.body.style.overflow = "hidden";
}

function closeChat() {
  el.container.classList.remove("active");
  el.toggle.textContent = "💬";
  document.body.style.overflow = "";
}
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
  // OPCIONES (VENTAS 🔥)
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
  // FLUJO CONVERSACIONAL
  // ==========================
  function startFlow() {
    addMessage("Hola 👋 Soy Vinicius.\n\n¿En qué puedo ayudarte?");
    
    showOptions([
      { label: "Crear una web", action: () => stepWeb() },
      { label: "Automatizar procesos", action: () => stepAutomation() },
      { label: "Mejorar SEO", action: () => stepSEO() }
    ]);
  }

  function stepWeb() {
    chatState.step = "web";

    addMessage("Perfecto. ¿Qué tipo de web necesitas?");

    showOptions([
      { label: "Web para negocio", action: () => askBudget() },
      { label: "Landing page", action: () => askBudget() },
      { label: "Aplicación web", action: () => askBudget() }
    ]);
  }

  function stepAutomation() {
    chatState.step = "automation";

    addMessage("Genial. La automatización puede ahorrarte mucho tiempo.\n\n¿Qué quieres automatizar?");

    showOptions([
      { label: "Procesos internos", action: () => askBudget() },
      { label: "Captación de clientes", action: () => askBudget() },
      { label: "Otro", action: () => askBudget() }
    ]);
  }

  function stepSEO() {
    chatState.step = "seo";

    addMessage("Perfecto. ¿Qué buscas mejorar?");

    showOptions([
      { label: "Posicionamiento en Google", action: () => askBudget() },
      { label: "Más clientes", action: () => askBudget() }
    ]);
  }

  function askBudget() {
    chatState.step = "budget";

    addMessage("Para orientarte mejor, ¿qué presupuesto tienes en mente?");

    showOptions([
      { label: "Menos de 500€", action: () => finalCTA() },
      { label: "500€ - 1500€", action: () => finalCTA() },
      { label: "+1500€", action: () => finalCTA() }
    ]);
  }

  function finalCTA() {
    chatState.step = "end";

    addMessage("Perfecto 👌\n\nPuedo ayudarte a crear una solución adaptada a lo que necesitas.\n\n👉 Cuéntame tu proyecto y te digo exactamente cómo lo haría.");

    trackEvent("chat_lead");
  }

  // ==========================
  // SEND (IA OPCIONAL)
  // ==========================
  async function sendMessage() {
    const text = el.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    el.input.value = "";

    trackEvent("chat_message");

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

  function trackEvent(name) {
    console.log("EVENT:", name);
  }

  // ==========================
  // EVENTS
  // ==========================
  el.send.onclick = sendMessage;

  el.input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ==========================
  // INIT FLOW
  // ==========================
  startFlow();
}