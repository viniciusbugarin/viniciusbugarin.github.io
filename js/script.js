// ==========================
// CONFIG
// ==========================
const CONFIG = {
  API_URL: "https://viniciusbugarin-github-io.vercel.app/api/chat",
  SCROLL_OFFSET: 80,
  STORAGE_KEY: "chat_history_v1"
};

// ==========================
// INIT APP
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initChat();
});

// ==========================
// SCROLL ANIMATIONS (OPTIMIZADO)
// ==========================
function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // fallback simple
    window.addEventListener("scroll", () => revealFallback(elements));
    revealFallback(elements);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  elements.forEach(el => observer.observe(el));
}

function revealFallback(elements) {
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - CONFIG.SCROLL_OFFSET) {
      el.classList.add("active");
    }
  });
}

// ==========================
// CHAT SYSTEM (ULTRA PRO)
// ==========================
let elements = {};

function initChat() {
  elements = {
    toggle: document.getElementById("toggleChat"),
    box: document.getElementById("chatBox"),
    messages: document.getElementById("messages"),
    input: document.getElementById("input")
  };

  if (!elements.toggle || !elements.box) return;

  // Toggle chat
  elements.toggle.addEventListener("click", toggleChat);

  // Load history
  loadChat();

  // Enter key
  elements.input?.addEventListener("keydown", handleEnter);

  // Auto focus UX
  elements.input?.focus();
}

function toggleChat() {
  elements.box.classList.toggle("hidden");

  if (!elements.box.classList.contains("hidden")) {
    elements.input?.focus();
  }
}

// ==========================
// SEND MESSAGE (ROBUSTO)
// ==========================
async function send() {
  const message = elements.input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  elements.input.value = "";

  const typing = addTyping();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // ⏱ timeout 10s

    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();

    removeTyping(typing);

    if (!data.reply) {
      addMessage("No he podido responder correctamente.", "bot");
      return;
    }

    // Simular typing natural
    await simulateTyping(data.reply);

  } catch (error) {
    removeTyping(typing);

    if (error.name === "AbortError") {
      addMessage("⏱ El servidor tardó demasiado. Intenta de nuevo.", "bot");
    } else {
      addMessage("⚠️ Error de conexión.", "bot");
    }

    console.error("Chat error:", error);
  }

  scrollToBottom();
  saveChat();
}

// ==========================
// TYPING REALISTA (UX TOP)
// ==========================
async function simulateTyping(text) {
  const div = createMessageContainer("bot");
  const bubble = div.querySelector(".bubble");

  let i = 0;

  while (i < text.length) {
    bubble.textContent += text.charAt(i);
    i++;

    await delay(10 + Math.random() * 20); // velocidad natural
  }

  return div;
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ==========================
// UI MESSAGES
// ==========================
function addMessage(text, type) {
  const div = createMessageContainer(type);
  div.querySelector(".bubble").textContent = text;
  elements.messages.appendChild(div);
  return div;
}

function createMessageContainer(type) {
  const div = document.createElement("div");
  div.classList.add("message", type);

  div.innerHTML = `<span class="bubble"></span>`;

  elements.messages.appendChild(div);
  scrollToBottom();

  return div;
}

// ==========================
// TYPING INDICATOR
// ==========================
function addTyping() {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.id = "typing";

  div.innerHTML = `
    <span class="bubble typing">
      <span></span><span></span><span></span>
    </span>
  `;

  elements.messages.appendChild(div);
  scrollToBottom();

  return div;
}

function removeTyping(el) {
  el?.remove();
}

// ==========================
// STORAGE (PERSISTENCIA)
// ==========================
function saveChat() {
  if (!elements.messages) return;
  localStorage.setItem(CONFIG.STORAGE_KEY, elements.messages.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (saved && elements.messages) {
    elements.messages.innerHTML = saved;
    scrollToBottom();
  }
}

// ==========================
// UX HELPERS
// ==========================
function scrollToBottom() {
  if (!elements.messages) return;
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function handleEnter(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}

// ==========================
// QUICK ACTIONS
// ==========================
function quick(text) {
  elements.input.value = text;
  send();
}

// ==========================
// TRACKING (PREPARADO)
// ==========================
function trackEvent(name, data = {}) {
  console.log("EVENT:", name, data);

  // Aquí podrás conectar:
  // Google Analytics
  // Meta Pixel
  // etc.
}