const API_URL = "https://viniciusbugarin-github-io.vercel.app/api/chat";

document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // 🔥 INYECTAR HTML (COMO NAVBAR)
  // ==========================
  const chatbotHTML = `
    <div id="vb-chatbot">

      <button id="chatToggle">💬</button>

      <div id="chatContainer" class="hidden">

        <div id="chatMessages"></div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Escribe aquí..." />
          <button id="sendBtn">➤</button>
        </div>

      </div>

    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  // ==========================
  // ELEMENTOS
  // ==========================
  const toggle = document.getElementById("chatToggle");
  const container = document.getElementById("chatContainer");
  const messages = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  let isOpen = false;

  // ==========================
  // TOGGLE
  // ==========================
  toggle.addEventListener("click", () => {
    isOpen = !isOpen;
    container.classList.toggle("hidden");

    if (isOpen) {
      setTimeout(() => input.focus(), 200);
    }
  });

  // ==========================
  // LOCAL STORAGE
  // ==========================
  function saveChat() {
    localStorage.setItem("vb_chat_history", messages.innerHTML);
  }

  function loadChat() {
    const saved = localStorage.getItem("vb_chat_history");
    if (saved) messages.innerHTML = saved;
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

    messages.appendChild(div);
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

    messages.appendChild(div);
    scrollBottom();
    return div;
  }

  // ==========================
  // SEND
  // ==========================
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const typing = addTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("Error servidor");

      const data = await res.json();

      typing.remove();

      addMessage(
        data.reply || "No he podido responder correctamente.",
        "bot"
      );

    } catch (err) {
      typing.remove();

      addMessage("⚠️ Error de conexión.", "bot");
      console.error(err);
    }

    saveChat();
  }

  // ==========================
  // QUICK OPTIONS (CONVERSIÓN)
  // ==========================
  function addQuickOptions() {
    const wrapper = document.createElement("div");
    wrapper.className = "quick-options";

    const options = [
      "Quiero una web",
      "Precio página web",
      "Necesito automatización",
      "Ver proyectos"
    ];

    wrapper.innerHTML = options
      .map(opt => `<button>${opt}</button>`)
      .join("");

    wrapper.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        input.value = btn.innerText;
        sendMessage();
      });
    });

    messages.appendChild(wrapper);
  }

  // ==========================
  // SCROLL
  // ==========================
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ==========================
  // TIME
  // ==========================
  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ==========================
  // EVENTS
  // ==========================
  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ==========================
  // INIT
  // ==========================
  loadChat();

  if (!messages.innerHTML) {
    addMessage(
      "Hola 👋 Soy el asistente de Vinicius.\n¿Quieres crear una web o automatizar algo?",
      "bot"
    );
    addQuickOptions();
  }

});