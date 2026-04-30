// ==========================
// CONFIG
// ==========================
const CHAT_CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  STORAGE_KEY: "vb_chat_ultra",
  TIMEOUT: 10000,
  AUTO_OPEN_DELAY: 5000
};

// ==========================
// INIT SAFE
// ==========================
if (!window.__VB_CHAT_INIT__) {
  window.__VB_CHAT_INIT__ = true;
  document.addEventListener("DOMContentLoaded", initChatbot);
}

function initChatbot() {

  // ==========================
  // INJECT HTML
  // ==========================
  if (document.getElementById("vb-chatbot")) return;

  document.body.insertAdjacentHTML("beforeend", `
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
  `);

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

  let isOpen = false;

  // ==========================
  // TOGGLE FIX REAL
  // ==========================
  function openChat() {
    isOpen = true;
    el.container.classList.remove("hidden");
    el.toggle.textContent = "✕";
    document.body.style.overflow = "hidden";
    focusInput();
  }

  function closeChat() {
    isOpen = false;
    el.container.classList.add("hidden");
    el.toggle.textContent = "💬";
    document.body.style.overflow = "";
  }

  el.toggle.onclick = () => isOpen ? closeChat() : openChat();
  el.close.onclick = closeChat;

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
    saveChat();
  }

  // ==========================
  // DETECT EMAIL (🔥 NEGOCIO)
  // ==========================
  function detectEmail(text) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(text);
  }

  function handleLead(text) {
    if (detectEmail(text)) {
      addMessage("🔥 Perfecto. Te contacto en breve.", "bot");

      console.log("LEAD CAPTURADO:", text);

      // Aquí puedes enviar a:
      // webhook / email / CRM
    }
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
  // FLOW CONVERSIÓN
  // ==========================
  function startFlow() {
    addMessage("Hola 👋 Soy Vinicius.\n\n¿Quieres conseguir más clientes o automatizar tu negocio?");

    showOptions([
      { label: "Quiero clientes", action: stepWeb },
      { label: "Automatizar procesos", action: stepAutomation },
      { label: "Mejorar SEO", action: stepSEO }
    ]);
  }

  function stepWeb() {
    addMessage("Perfecto. ¿Qué necesitas?");
    showOptions([
      { label: "Web para negocio", action: askBudget },
      { label: "Landing page", action: askBudget }
    ]);
  }

  function stepAutomation() {
    addMessage("Genial. ¿Qué quieres automatizar?");
    showOptions([
      { label: "Procesos", action: askBudget },
      { label: "Clientes", action: askBudget }
    ]);
  }

  function stepSEO() {
    addMessage("Perfecto. ¿Qué quieres mejorar?");
    showOptions([
      { label: "Google", action: askBudget },
      { label: "Clientes", action: askBudget }
    ]);
  }

  function askBudget() {
    addMessage("¿Qué presupuesto tienes?");
    showOptions([
      { label: "< 500€", action: finalCTA },
      { label: "500€ - 1500€", action: finalCTA },
      { label: "+1500€", action: finalCTA }
    ]);
  }

  function finalCTA() {
    addMessage("👉 Déjame tu email y te digo exactamente cómo lo haría.");
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
  // AUTO OPEN (VENTAS)
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
  loadChat();

  if (!el.messages.innerHTML) {
    startFlow();
  }
}